<?php

namespace App\Http\Controllers;

use App\Models\UomGroup;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class UomGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uomGroups = UomGroup::all();
        return response()->json($uomGroups);
    }

    public function all()
    {
        $query = UomGroup::query();
        return DataTables::of($query)
            ->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:uom_groups,name'
        ]);
        return UomGroup::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(UomGroup::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $uomGroup = UomGroup::findOrFail($id);
        $uomGroup->update($request->all());
        return response()->json($uomGroup);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        UomGroup::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
