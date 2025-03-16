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
        $query = Warehouse::query();
        return DataTables::of($query)
            ->addColumn('id', fn ($warehouse) => $warehouse->id)
            ->addColumn('action', fn ($warehouse) => '')
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|unique:warehouses',
            'location' => 'nullable|string',
        ]);
        return Warehouse::create($request->all());
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
        $warehouse->update($request->all());
        return response()->json($warehouse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Warehouse::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
