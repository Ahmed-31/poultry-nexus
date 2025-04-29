<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderBundleItem extends Model
{
    protected $fillable = [
        'order_bundle_id',
        'product_id',
        'dimension_values',
        'calculated_quantity'
    ];
    protected $casts = [
        'dimension_values' => 'array',
    ];
}
