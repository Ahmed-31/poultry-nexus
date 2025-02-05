<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierProduct extends Model
{
    protected $fillable = [
        'supplier_id',
        'product_id',
        'price',
        'lead_time',
    ];

    /**
     * Relationship: A supplier product belongs to a supplier.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Relationship: A supplier product belongs to a product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
