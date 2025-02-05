<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    // Order Item belongs to an Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Order Item belongs to a Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public static function boot()
    {
        parent::boot();
        static::created(function ($orderItem) {
            $inventory = Inventory::where('product_id', $orderItem->product_id)->first();
            if ($inventory) {
                $inventory->reserved_quantity += $orderItem->quantity;
                $inventory->quantity_available -= $orderItem->quantity;
                $inventory->save();
            }
        });
        static::deleted(function ($orderItem) {
            $inventory = Inventory::where('product_id', $orderItem->product_id)->first();
            if ($inventory) {
                $inventory->reserved_quantity -= $orderItem->quantity;
                $inventory->quantity_available += $orderItem->quantity;
                $inventory->save();
            }
        });
    }
}
