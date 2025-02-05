<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockItem extends Model
{
    protected $fillable = [
        'warehouse_id',
        'product_id',
        'quantity',
    ];

    /**
     * Relationship: A stock item belongs to a warehouse.
     */
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Relationship: A stock item belongs to a product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
