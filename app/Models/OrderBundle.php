<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderBundle extends Model
{
    protected $fillable = ['order_id', 'product_bundle_id', 'height', 'belt_width', 'lines_number', 'units_per_line', 'levels', 'total_units', 'status', 'progress', 'poultry_house_count'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function bundle()
    {
        return $this->belongsTo(ProductBundle::class, 'product_bundle_id');
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($orderBundle) {
            if (!isset($orderBundle->total_units)) {
                $orderBundle->total_units = $orderBundle->lines_number * $orderBundle->units_per_line;
            }
        });
    }
}
