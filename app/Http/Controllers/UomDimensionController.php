<?php

namespace App\Http\Controllers;

use App\Models\UomDimension;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

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

    public function all()
    {
        $query = UomDimension::with(['uom', 'products']);
        return DataTables::of($query)
            ->toJson();

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'uom_id' => 'required|exists:uoms,id',
        ]);

        $dimension = UomDimension::create($request->all());

        return response()->json([
            'message' => __('uom_dimensions.created_successfully'),
            'data' => $dimension,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(UomDimension::with('uom')->findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'uom_id' => 'required|exists:uoms,id',
        ]);

        $dimension = UomDimension::findOrFail($id);
        $dimension->update($request->all());

        return response()->json([
            'message' => __('uom_dimensions.updated_successfully'),
            'data' => $dimension,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        UomDimension::findOrFail($id)->delete();
        return response()->json([
            'message' => __('uom_dimensions.deleted_successfully')
        ]);
    }
}
