<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductBundleItem extends Pivot
{
    protected $table = 'product_bundle_items';
    protected $casts = [
        'dimension_values' => 'array',
    ];

    public function uom()
    {
        return $this->belongsTo(Uom::class);
    }
}
