<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
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

    public static function boot()
    {
        parent::boot();
        static::saving(function ($orderItem) {
            $product = Product::find($orderItem->product_id);
            if ($product) {
                $orderItem->total_price = $product->price * $orderItem->quantity;
            }
        });
        static::created(function ($orderItem) {
            $inventory = Inventory::where('product_id', $orderItem->product_id)->first();
            if ($inventory) {
                $inventory->reserved_quantity += $orderItem->quantity;
                $inventory->quantity -= $orderItem->quantity;
                $inventory->save();
            }
        });
        static::deleted(function ($orderItem) {
            $inventory = Inventory::where('product_id', $orderItem->product_id)->first();
            if ($inventory) {
                $inventory->reserved_quantity -= $orderItem->quantity;
                $inventory->quantity += $orderItem->quantity;
                $inventory->save();
            }
        });
    }
}
