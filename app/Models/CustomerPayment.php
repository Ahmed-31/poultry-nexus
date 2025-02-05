<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPayment extends Model
{
    protected $fillable = [
        'customer_id',
        'customer_order_id',
        'amount',
        'payment_method',
        'transaction_reference',
        'payment_date',
        'status'
    ];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function customerOrder() {
        return $this->belongsTo(CustomerOrder::class);
    }
}
