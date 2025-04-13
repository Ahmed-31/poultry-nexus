<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StockMovement::with(['product', 'warehouse'])->get();
    }

    public function all()
    {
        $query = StockMovement::with(['product', 'warehouse'])
            ->orderBy('movement_date', 'desc');
        return DataTables::of($query)
            ->addColumn('id', fn($item) => $item->id)
            ->addColumn('action', fn($item) => '')
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id'    => 'required|exists:products,id',
            'warehouse_id'  => 'required|exists:warehouses,id',
            'quantity'      => 'required|integer',
            'movement_type' => 'required|in:inbound,outbound,adjustment',
            'reason'        => 'nullable|string',
            'movement_date' => 'nullable|date',
        ]);
        return StockMovement::create($request->all());
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
