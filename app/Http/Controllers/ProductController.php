<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductBundle;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')->get();
        return response()->json($products);
    }

    public function all()
    {
        $query = Product::with('category');
        return DataTables::of($query)
            ->addColumn('id', fn($item) => $item->id)
            ->addColumn('action', fn($item) => '')
            ->toJson();
    }

    public function bundles()
    {
        $productBundles = ProductBundle::all();
        return response()->json($productBundles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'min_stock'   => 'required|integer|min:0',
            'sku'         => 'required|unique:products,sku',
            'type'        => 'required|in:raw_material,component,finished_product',
            'unit'        => 'required|string',
            'category_id' => 'nullable|exists:categories,id'
        ]);
        return response()->json(Product::create($validated), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Product::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
