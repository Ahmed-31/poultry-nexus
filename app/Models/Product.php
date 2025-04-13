<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'min_stock',
        'sku',
        'type',
        'uom_group_id',
        'default_uom_id',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function bundles()
    {
        return $this->belongsToMany(ProductBundle::class, 'product_bundle_items')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function allowedUoms()
    {
        return $this->belongsToMany(Uom::class, 'product_uoms');
    }

    public function dimensions()
    {
        return $this->belongsToMany(UomDimension::class, 'product_dimensions', 'product_id', 'dimension_id')
            ->with('uom');
    }

    public function defaultUom()
    {
        return $this->belongsTo(Uom::class, 'default_uom_id');
    }

    public function hasStock()
    : bool
    {
        return $this->stock()->sum('quantity_in_base') > 0;
    }
}
