<?php

namespace App\Http\Controllers;

use App\Models\BundleParameter;
use Illuminate\Http\Request;

class BundleParameterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bundle_id'     => 'required|exists:product_bundles,id',
            'name'          => 'required|string',
            'translations'  => 'required|array',
            'type'          => 'required|string|in:number,text,select',
            'default_value' => 'nullable|string',
            'options'       => 'nullable|array',
        ]);
        $parameter = BundleParameter::create($validated);
        return response()->json(['message' => 'Parameter created successfully.', 'parameter' => $parameter]);
    }
}
