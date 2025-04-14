<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'source',
        'uom_id',
        'quantity',
        'total_price',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function source()
    {
        return $this->morphTo();
    }

    public function dimensionValues()
    {
        return $this->hasMany(OrderItemDimension::class, 'order_item_id');
    }

    public function uom()
    {
        return $this->belongsTo(Uom::class);
    }

    public static function boot()
    {
        parent::boot();
        static::saving(function ($orderItem) {
            $product = Product::find($orderItem->product_id);
            if ($product) {
                $orderItem->total_price = $product->price * $orderItem->quantity;
            }
        });
    }
}
