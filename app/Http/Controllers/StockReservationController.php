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
    public function index()
    {
        $stockReservations = StockReservation::withAllRelations()->get();
        return response()->json($stockReservations);
    }

    public function all()
    {
        $query = StockReservation::withAllRelations();
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
    public function show(StockReservation $stockReservation)
    {
        //
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
