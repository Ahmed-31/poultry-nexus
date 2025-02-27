<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StockMovement::with(['product', 'warehouse'])->get();
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
