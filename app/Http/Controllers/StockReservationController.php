<?php

namespace App\Http\Controllers;

use App\Models\StockReservation;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class StockReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StockReservation::withAllRelations();
        if ($request->filled('order_id')) {
            $query->where('order_id', $request->order_id);
        }
        return response()->json($query->get());
    }

    public function all(Request $request)
    {
        $query = StockReservation::withAllRelations();
        if ($request->filled('order_id')) {
            logger('filtered');
            $query->where('order_id', $request->input('order_id'));
        }
        return DataTables::of($query)
            ->addColumn('id', fn($stockReservation) => $stockReservation->id)
            ->addColumn('actions', fn() => '')
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $reservation = StockReservation::withAllRelations()->findOrFail($id);
        return response()->json($reservation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockReservation $stockReservation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockReservation $stockReservation)
    {
        //
    }
}
