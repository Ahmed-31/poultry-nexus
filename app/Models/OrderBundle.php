<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderBundle extends Model
{
    protected $fillable = ['order_id', 'product_bundle_id', 'status', 'progress', 'parameters'];
    protected $casts = [
        'parameters' => 'array'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function bundle()
    {
        return $this->belongsTo(ProductBundle::class, 'product_bundle_id');
    }

    public function items()
    {
        return $this->hasMany(OrderBundleItem::class, 'order_bundle_id');
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($orderBundle) {
            $parameters = is_array($orderBundle->parameters)
                ? $orderBundle->parameters
                : (json_decode($orderBundle->parameters, true) ?? []);
            if (isset($parameters['عدد الخطوط'], $parameters['عدد الوحدات في الخط'])) {
                $linesNumber = (int)$parameters['عدد الخطوط'];
                $unitsPerLine = (int)$parameters['عدد الوحدات في الخط'];
                $totalUnits = $linesNumber * $unitsPerLine;
                $parameters['اجمالي عدد الوحدات'] = $totalUnits;
                $orderBundle->parameters = $parameters;
            }
        });
    }
}
