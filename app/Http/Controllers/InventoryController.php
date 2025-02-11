<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Yajra\DataTables\DataTables;

class InventoryController extends Controller
{
    /**
     * Display a listing of inventory items.
     */
    public function index()
    {
        $query = Inventory::with(['warehouse', 'product']);
        return DataTables::of($query)
            ->addColumn('id', fn($item) => $item->id)
            ->addColumn('action', fn($item) => '')
            ->toJson();
    }

    /**
     * Store a newly created inventory item.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id'      => 'required|exists:products,id',
            'warehouse_id'    => 'required|exists:warehouses,id',
            'quantity'        => 'required|integer|min:0',
            'batch_number'    => 'nullable|string|max:255',
            'expiration_date' => 'nullable|date',
        ]);
        $inventoryItem = Inventory::create($request->all());
        return response()->json($inventoryItem->load('product', 'warehouse'), Response::HTTP_CREATED);
    }

    /**
     * Display the specified inventory item.
     */
    public function show(Inventory $inventory)
    {
        return response()->json($inventory->load('product', 'warehouse'), Response::HTTP_OK);
    }

    /**
     * Update the specified inventory item.
     */
    public function update(Request $request, Inventory $inventory)
    {
        $request->validate([
            'product_id'      => 'required|exists:products,id',
            'warehouse_id'    => 'required|exists:warehouses,id',
            'quantity'        => 'required|integer|min:0',
            'batch_number'    => 'nullable|string|max:255',
            'expiration_date' => 'nullable|date',
        ]);
        $inventory->update($request->all());
        return response()->json($inventory->load('product', 'warehouse'), Response::HTTP_OK);
    }

    /**
     * Remove the specified inventory item.
     */
    public function destroy(Inventory $inventory)
    {
        $inventory->delete();
        return response()->json(['message' => 'Inventory item deleted successfully'], Response::HTTP_NO_CONTENT);
    }
}
