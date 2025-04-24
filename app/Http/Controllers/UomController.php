<?php

namespace App\Http\Controllers;

use App\Models\Uom;
use App\Models\UomDimension;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class UomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uoms = Uom::withAllRelations()->get();
        return response()->json($uoms);
    }

    public function all()
    {
        $query = Uom::withAllRelations();
        return DataTables::of($query)
            ->addColumn('id', fn ($uom) => $uom->id)
            ->addColumn('action', fn () => '')
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'              => 'required|string|unique:uoms',
            'symbol'            => 'required|string',
            'group_id'          => 'required|integer|exists:uom_groups,id',
            'is_base'           => 'nullable|boolean',
            'conversion_factor' => 'required|numeric',
            'dimension_ids'     => 'nullable|array',
            'dimension_ids.*'   => 'exists:uom_dimensions,id',
        ]);
        $uom = Uom::create($validated);
        if ($request->filled('dimension_ids')) {
            UomDimension::whereIn('id', $request->dimension_ids)->update(['uom_id' => $uom->id]);
        }
        return response()->json($uom->load('dimensions'));
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(Uom::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'              => 'required|string|unique:uoms,name,' . $id,
            'symbol'            => 'required|string',
            'group_id'          => 'required|integer|exists:uom_groups,id',
            'is_base'           => 'nullable|boolean',
            'conversion_factor' => 'required|numeric',
            'dimension_ids'     => 'nullable|array',
            'dimension_ids.*'   => 'exists:uom_dimensions,id',
        ]);
        $uom = Uom::findOrFail($id);
        $uom->update($validated);
        UomDimension::where('uom_id', $uom->id)->update(['uom_id' => null]);
        if ($request->filled('dimension_ids')) {
            UomDimension::whereIn('id', $request->dimension_ids)->update(['uom_id' => $uom->id]);
        }
        return response()->json($uom->load('dimensions'));
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Uom::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
