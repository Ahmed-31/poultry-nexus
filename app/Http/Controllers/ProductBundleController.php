<?php

namespace App\Http\Controllers;

use App\Models\ProductBundle;
use App\Models\Uom;
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
                $q->withPivot(['uom_id', 'quantity', 'dimension_values']);
            }
        ]);
        return DataTables::of($query)
            ->addColumn('id', fn($item) => $item->id)
            ->editColumn('products', function ($bundle) use ($uoms) {
                return $bundle->products->map(function ($product) use ($uoms) {
                    $pivot = $product->pivot;
                    return [
                        'unique_key'       => $product->id . '-' . $pivot->uom_id . '-' . substr(md5(json_encode($pivot->dimension_values)), 0, 6),
                        'id'               => $product->id,
                        'name'             => $product->name,
                        'sku'              => $product->sku,
                        'price'            => $product->price,
                        'type'             => $product->type,
                        'quantity'         => $pivot->quantity,
                        'uom_id'           => $pivot->uom_id,
                        'uom_name'         => optional($uoms[$pivot->uom_id] ?? null)->name,
                        'dimension_values' => is_string($pivot->dimension_values)
                            ? json_decode($pivot->dimension_values, true)
                            : $pivot->dimension_values,
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
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.uom_id'     => 'required|exists:uoms,id',
            'items.*.quantity'   => 'required|numeric|min:1',
            'items.*.dimensions' => 'nullable|array',
        ]);
        $bundle = ProductBundle::create($request->only(['name', 'description']));
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
        $bundle->delete();
        return response()->json([
            'message' => 'Product bundle deleted successfully.',
        ]);
    }
}
