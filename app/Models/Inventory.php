<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventory';
    protected $fillable = [
        'product_id',
        'warehouse_id',
        'quantity',
        'minimum_stock_level',
        'maximum_capacity',
        'reserved_quantity',
    ];

    // Inventory belongs to a Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
