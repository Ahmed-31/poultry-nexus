<?php

namespace App\Http\Controllers;

use App\Models\Uom;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class UomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uoms = Uom::all();
        return response()->json($uoms);
    }

    public function all()
    {
        $query = Uom::query();
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
        $request->validate([
            'name'     => 'required|string|unique:uoms',
            'symbol' => 'required|string',
            'group_id' => 'required|integer|exists:uom_groups,id',
            'is_base' => 'nullable|boolean',
            'conversion_factor' => 'required|numeric'
        ]);
        return Uom::create($request->all());
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
        $uom = Uom::findOrFail($id);
        $uom->update($request->all());
        return response()->json($uom);
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
