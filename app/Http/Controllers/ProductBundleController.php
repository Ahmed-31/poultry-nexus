<?php

namespace App\Http\Controllers;

use App\Models\BundleParameter;
use App\Models\BundleProductFormula;
use App\Models\Product;
use App\Models\ProductBundle;
use App\Models\Uom;
use App\Services\Bundles\FormulaMapper;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class ProductBundleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productBundles = ProductBundle::with('products')->get();
        return response()->json($productBundles);
    }

    public function all()
    {
        $uoms = Uom::all()->keyBy('id');
        $query = ProductBundle::with([
            'products' => function ($q) {
                $q->with(['defaultUom', 'dimensions'])->withPivot(['uom_id']);
            },
            'formulas',
            'parameters',
        ]);
        return DataTables::of($query)
            ->addColumn('id', fn($item) => $item->id)
            ->editColumn('products', function ($bundle) use ($uoms) {
                return $bundle->products->map(function ($product) use ($uoms, $bundle) {
                    $pivot = $product->pivot;
                    return [
                        'unique_key' => $product->id . '-' . $pivot->uom_id,
                        'id'         => $product->id,
                        'name'       => $product->name,
                        'sku'        => $product->sku,
                        'price'      => $product->price,
                        'type'       => $product->type,
                        'uom_id'     => $pivot->uom_id,
                        'uom_name'   => optional($uoms[$pivot->uom_id] ?? null)->name,
                        'dimensions' => $product->dimensions->map(function ($dim) {
                            return [
                                'id'   => $dim->id,
                                'name' => $dim->name,
                            ];
                        })->values()->all(),
                        'formula_ar' => $bundle->formulas
                                            ->firstWhere('product_id', $product->id)?->formula_translations['ar'] ?? null,
                    ];
                })->values()->all();
            })
            ->addColumn('parameters', function ($bundle) {
                return $bundle->parameters->map(function ($param) {
                    return [
                        'id'            => $param->id,
                        'name'          => $param->name,
                        'type'          => $param->type,
                        'default_value' => $param->default_value,
                        'translations'  => $param->translations,
                    ];
                })->values()->all();
            })
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                       => 'required|string|max:255',
            'description'                => 'nullable|string',
            'parameters'                 => 'nullable|array',
            'parameters.*.name'          => 'required|string|max:255',
            'parameters.*.type'          => 'required|string|in:number,text,select',
            'parameters.*.default_value' => 'nullable|string',
            'products'                   => 'required|array|min:1',
            'products.*.product_id'      => 'required|exists:products,id',
            'products.*.formula_blocks'  => 'required|array|min:1',
        ]);
        $bundle = ProductBundle::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);
        if (!empty($validated['parameters'])) {
            foreach ($validated['parameters'] as $param) {
                BundleParameter::create([
                    'bundle_id'     => $bundle->id,
                    'name'          => $param['name'],
                    'translations'  => [
                        'ar' => $param['name'],
                        'en' => null,
                    ],
                    'type'          => $param['type'],
                    'default_value' => $param['default_value'],
                    'options'       => [],
                ]);
            }
        }
        $bundle->load('parameters');
        $productNameMap = [];
        foreach ($validated['products'] as $productData) {
            $product = Product::find($productData['product_id']);
            if ($product) {
                $productNameMap[$product->name] = 'quantity_product_' . $product->id;
            }
        }
        foreach ($validated['products'] as $product) {
            try {
                [$formula_ar, $technical_formula] = FormulaMapper::buildFromBlocks(
                    $product['formula_blocks'],
                    $bundle->parameters,
                    $productNameMap
                );
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid formula: ' . $e->getMessage()], 422);
            }
            BundleProductFormula::create([
                'bundle_id'            => $bundle->id,
                'product_id'           => $product['product_id'],
                'formula'              => $technical_formula,
                'formula_translations' => [
                    'ar' => $formula_ar,
                    'en' => $technical_formula,
                ],
            ]);
        }
        foreach ($validated['products'] as $product) {
            $productModel = Product::find($product['product_id']);
            $bundle->products()->attach($product['product_id'], [
                'uom_id' => $productModel->default_uom_id,
            ]);
        }
        return response()->json([
            'message' => 'Product Bundle created successfully.',
            'bundle'  => $bundle->load('parameters', 'formulas', 'products'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.uom_id'     => 'required|exists:uoms,id',
            'items.*.quantity'   => 'required|numeric|min:1',
            'items.*.dimensions' => 'nullable|array',
        ]);
        $bundle = ProductBundle::findOrFail($id);
        $bundle->update($request->only(['name', 'description']));
        $bundle->products()->detach();
        foreach ($validated['items'] as $item) {
            $bundle->products()->attach($item['product_id'], [
                'uom_id'           => $item['uom_id'],
                'quantity'         => $item['quantity'],
                'dimension_values' => json_encode($item['dimensions'] ?? []),
            ]);
        }
        return response()->json($bundle->load('products'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $bundle = ProductBundle::findOrFail($id);
        $bundle->products()->detach();
        $bundle->parameters()->delete();
        $bundle->formulas()->delete();
        $bundle->delete();
        return response()->json([
            'message' => 'Product bundle deleted successfully.',
        ]);
    }
}
