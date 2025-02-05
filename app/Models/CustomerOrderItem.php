<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerOrderItem extends Model
{
    protected $fillable = [
        'customer_order_id',
        'product_id',
        'quantity',
        'unit_price'
    ];

    public function customerOrder() {
        return $this->belongsTo(CustomerOrder::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
