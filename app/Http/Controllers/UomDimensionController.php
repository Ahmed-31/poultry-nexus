<?php

namespace App\Http\Controllers;

use App\Models\UomDimension;
use Illuminate\Http\Request;

class UomDimensionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uomDimensions = UomDimension::with(['uom', 'products'])->get();
        return response()->json($uomDimensions);
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
