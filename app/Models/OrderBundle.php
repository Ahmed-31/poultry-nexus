<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderBundle extends Model
{
    protected $fillable = ['order_id', 'product_bundle_id', 'quantity'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function bundle()
    {
        return $this->belongsTo(ProductBundle::class, 'product_bundle_id');
    }
}
