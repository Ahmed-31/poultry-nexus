<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BundleProductFormula extends Model
{
    protected $fillable = ['bundle_id', 'product_id', 'formula', 'formula_translations', 'min_quantity', 'max_quantity'];
    protected $casts = [
        'formula_translations' => 'array',
    ];

    public function bundle()
    {
        return $this->belongsTo(ProductBundle::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
