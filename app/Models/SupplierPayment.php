<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierPayment extends Model
{
    protected $fillable = [
        'supplier_id',
        'purchase_order_id',
        'amount',
        'payment_method',
        'transaction_reference',
        'payment_date',
        'status'
    ];

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseOrder() {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
