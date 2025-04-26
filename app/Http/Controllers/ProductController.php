<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Uom;
use App\Services\Products\ProductExcelParser;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Yajra\DataTables\DataTables;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'allowedUoms', 'defaultUom', 'dimensions'])->get();
        return response()->json($products);
    }

    public function all()
    {
        $query = Product::with(['category', 'defaultUom', 'allowedUoms', 'defaultUom.group', 'defaultUom.dimensions', 'dimensions', 'stock', 'stockMovements']);
        return DataTables::of($query)
            ->addColumn('id', fn($item) => $item->id)
            ->addColumn('unit', fn($item) => optional($item->defaultUom)->name ?? '-')
            ->addColumn('dimensionsString', function ($item) {
                if ($item->dimensions->isEmpty()) {
                    return '-';
                }
                return $item->dimensions
                    ->map(function ($dim) {
                        return "$dim->name";
                    })
                    ->implode(' x ');
            })
            ->addColumn('action', fn($item) => '')
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'min_stock'      => 'nullable|integer|min:0',
            'sku'            => 'required|unique:products,sku',
            'type'           => 'required|in:raw_material,component,finished_product',
            'default_uom_id' => 'required|integer|exists:uoms,id',
            'category_id'    => 'required|exists:categories,id',
            'allowed_uoms'   => 'nullable|array',
            'allowed_uoms.*' => 'integer|exists:uoms,id',
            'dimensions'     => 'nullable|array',
            'dimensions.*'   => 'integer|exists:uom_dimensions,id',
        ]);
        $defaultUom = Uom::findOrFail($validated['default_uom_id']);
        $validated['uom_group_id'] = $defaultUom->group_id;
        $product = Product::create($validated);
        if ($request->has('allowed_uoms')) {
            $product->allowedUoms()->sync($request->allowed_uoms);
        }
        if ($request->has('dimensions')) {
            $product->dimensions()->sync($request->dimensions);
        }
        return response()->json($product->load(['allowedUoms', 'dimensions']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Product::with('defaultUom')->findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::with(['allowedUoms', 'dimensions', 'bundles'])->findOrFail($id);
        $requestedUoms = $request->input('allowed_uoms', []);
        $currentUoms = $product->allowedUoms->pluck('id')->toArray();
        $requestedDims = $request->input('dimensions', []);
        $currentDims = $product->dimensions->pluck('id')->toArray();
        $changingCriticalData =
            $request->input('default_uom_id') != $product->default_uom_id ||
            !empty(array_diff($requestedUoms, $currentUoms)) || !empty(array_diff($currentUoms, $requestedUoms)) ||
            !empty(array_diff($requestedDims, $currentDims)) || !empty(array_diff($currentDims, $requestedDims));
        if ($product->hasStock() && $changingCriticalData) {
            return response()->json([
                'message' => 'Cannot change unit or dimensions while stock exists.'
            ], 422);
        }
        if ($product->bundles()->exists() && $changingCriticalData) {
            return response()->json([
                'message' => 'Cannot change unit or dimensions while the product is part of a bundle.'
            ], 422);
        }
        $product->update($request->except(['allowed_uoms', 'dimensions']));
        $product->allowedUoms()->sync($requestedUoms);
        $product->dimensions()->sync($requestedDims);
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::with(['stock', 'allowedUoms', 'dimensions', 'bundles'])->findOrFail($id);
        if ($product->hasStock()) {
            return response()->json([
                'message' => 'Cannot delete product with existing stock.'
            ], 422);
        }
        if ($product->bundles()->exists()) {
            return response()->json([
                'message' => 'Cannot delete product as it is part of one or more bundles.'
            ], 422);
        }
        $product->allowedUoms()->detach();
        $product->dimensions()->detach();
        $product->stock()?->delete();
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully.']);
    }

    public function import(Request $request, ProductExcelParser $parser)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'lang' => 'nullable|string|in:en,ar',
        ]);
        if ($request->filled('lang')) {
            $parser->setLocale($request->input('lang'));
        }
        $path = $request->file('file')->store('temp');
        try {
            $products = $parser->parse(Storage::path($path));
            $lastSku = Product::where('sku', 'like', 'SKU%')
                ->orderByDesc('id')
                ->value('sku');
            $lastNumber = 0;
            if ($lastSku) {
                $lastNumber = (int)str_replace('SKU', '', $lastSku);
            }
            DB::transaction(function () use ($products, &$lastNumber) {
                foreach ($products as $data) {
                    $lastNumber++;
                    /** @var Product $product */
                    $product = Product::create(array_merge(
                        Arr::except($data, ['dimension_ids']),
                        [
                            'sku' => 'SKU' . str_pad($lastNumber, 5, '0', STR_PAD_LEFT),
                        ]
                    ));
                    $product->allowedUoms()->attach($product->default_uom_id);
                    if (!empty($data['dimension_ids'])) {
                        $product->dimensions()->attach($data['dimension_ids']);
                    }
                }
            });
            return response()->json([
                'message' => 'Products imported successfully.',
                'count'   => $products->count(),
            ]);
        } finally {
            Storage::delete($path);
        }
    }
}
