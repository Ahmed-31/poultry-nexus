<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerOrder extends Model
{
    protected $fillable = [
        'customer_id',
        'order_number',
        'order_date',
        'expected_delivery_date',
        'status'
    ];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function items() {
        return $this->hasMany(CustomerOrderItem::class);
    }
}
