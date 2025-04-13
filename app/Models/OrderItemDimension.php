<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItemDimension extends Model
{
    protected $table = 'order_item_dimensions';
    protected $fillable = [
        'order_item_id',
        'dimension_id',
        'value',
    ];
    public $timestamps = false;

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function dimension()
    {
        return $this->belongsTo(UomDimension::class);
    }
}
