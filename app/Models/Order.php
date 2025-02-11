<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'user_id',
        'order_number',
        'status',
        'notes',
        'ordered_at',
    ];

    // Order belongs to a Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Order belongs to a User (who processed the order)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Order has many OrderItems (Products in the order)
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }

    public function bundles()
    {
        return $this->hasMany(OrderBundle::class, 'order_id');
    }

    public static function boot()
    {
        parent::boot();
        static::created(function ($order) {
            if (!isset($order->ordered_at)) {
                $order->ordered_at = $order->created_at;
                $order->save();
            }
        });
    }
}
