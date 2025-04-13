<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentItem extends Model
{
    protected $fillable = [
        'shipment_id',
        'product_id',
        'order_item_id',
        'stock_id',
        'quantity'
    ];

    public function shipment() {
        return $this->belongsTo(Shipment::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function orderItem() {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }

    public function stock() {
        return $this->belongsTo(Stock::class);
    }
}
