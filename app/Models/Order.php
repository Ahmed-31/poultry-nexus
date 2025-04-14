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
        'priority',
        'notes',
        'ordered_at',
    ];

    public function scopeWithAllRelations($query)
    {
        return $query->with(['orderItems.product', 'orderItems.source', 'orderItems.dimensionValues.dimension.uom', 'orderItems.uom', 'user', 'customer', 'payments', 'shipments', 'bundles.bundle']);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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
        static::creating(function ($order) {
            if (empty($order->ordered_at)) {
                $order->ordered_at = now();
            }
            if (empty($order->order_number)) {
                $order->order_number = strtoupper(uniqid('ORD-')) . '-' . now()->format('YmdHis');
            }
        });
    }
}
