<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockReservation extends Model
{
    protected $table = 'stock_reservations';
    protected $fillable = [
        'stock_id', 'uom_id', 'input_quantity', 'quantity_in_base',
        'order_id', 'status', 'revoked_reason', 'reserved_by', 'reserved_at'
    ];

    public function scopeWithAllRelations($query)
    {
        return $query->with([
            'stock',
            'stock.product',
            'stock.warehouse',
            'uom',
            'order.orderItems',
            'order.orderItems.product',
            'order.orderItems.uom',
            'order.bundles',
            'order.bundles.bundle.products',
            'dimensions.dimension.uom'
        ]);
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function uom()
    {
        return $this->belongsTo(Uom::class);
    }

    public function dimensions()
    {
        return $this->hasMany(StockReservationDimension::class, 'reservation_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
