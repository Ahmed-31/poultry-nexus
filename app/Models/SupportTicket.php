<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    protected $fillable = [
        'customer_id',
        'customer_order_id',
        'subject',
        'message',
        'status'
    ];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function customerOrder() {
        return $this->belongsTo(CustomerOrder::class);
    }
}
