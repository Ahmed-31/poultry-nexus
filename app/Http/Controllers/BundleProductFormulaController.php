<?php

namespace App\Http\Controllers;

use App\Models\BundleProductFormula;
use App\Models\ProductBundle;
use App\Services\Bundles\FormulaMapper;
use Illuminate\Http\Request;

class BundleProductFormulaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bundle_id'    => 'required|exists:product_bundles,id',
            'product_id'   => 'required|exists:products,id',
            'formula_ar'   => 'required|string'
        ]);
        $bundle = ProductBundle::with('parameters')->findOrFail($validated['bundle_id']);
        try {
            $mappedFormula = FormulaMapper::mapArabicToTechnical($validated['formula_ar'], $bundle->parameters);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
        $formula = BundleProductFormula::create([
            'bundle_id'            => $validated['bundle_id'],
            'product_id'           => $validated['product_id'],
            'formula'              => $mappedFormula,
            'formula_translations' => [
                'ar' => $validated['formula_ar'],
                'en' => $mappedFormula,
            ]
        ]);
        return response()->json(['message' => 'Formula created successfully.', 'formula' => $formula]);
    }
}
