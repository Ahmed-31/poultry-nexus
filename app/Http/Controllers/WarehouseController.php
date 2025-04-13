<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $warehouses = Warehouse::all();
        return response()->json($warehouses);
    }

    public function all()
    {
        $query = Warehouse::with(['stocks', 'stockMovement']);
        return DataTables::of($query)
            ->addColumn('id', fn($warehouse) => $warehouse->id)
            ->addColumn('action', fn($warehouse) => '')
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|unique:warehouses,name',
            'location'    => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $warehouse = Warehouse::create($validated);
        return response()->json([
            'message' => 'Warehouse created successfully.',
            'data'    => $warehouse,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Warehouse::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $warehouse = Warehouse::findOrFail($id);
        $validated = $request->validate([
            'name'        => 'required|string|unique:warehouses,name,' . $warehouse->id,
            'location'    => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $warehouse->update($validated);
        return response()->json([
            'message' => 'Warehouse updated successfully.',
            'data'    => $warehouse,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $warehouse = Warehouse::findOrFail($id);
        if ($warehouse->hasStock()) {
            return response()->json([
                'message' => 'Cannot delete warehouse with existing stock.'
            ], 400);
        }
        $warehouse->delete();
        return response()->json([
            'message' => 'Warehouse deleted successfully.'
        ]);
    }
}
