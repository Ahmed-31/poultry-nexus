<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stock';
    protected $fillable = [
        'product_id',
        'warehouse_id',
        'quantity_in_base',
        'input_uom_id',
        'input_quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function dimensionValues()
    {
        return $this->hasMany(StockDimension::class, 'stock_id')->with(['dimension.uom']);
    }

    public function inputUom()
    {
        return $this->belongsTo(Uom::class, 'input_uom_id');
    }

    public function reservations()
    {
        return $this->hasMany(StockReservation::class, 'stock_id');
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($stockItem) {
            $defaultUom = $stockItem->product->default_uom;
        });
    }
}
