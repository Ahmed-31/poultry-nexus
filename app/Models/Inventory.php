<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        'product_id',
        'quantity_available',
        'reserved_quantity',
        'minimum_stock_level',
    ];

    // Inventory belongs to a Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
