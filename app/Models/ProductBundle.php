<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductBundle extends Model
{
    protected $fillable = ['name', 'description'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_bundle_items')
            ->withPivot('uom_id', 'quantity', 'dimension_values')
            ->using(ProductBundleItem::class)
            ->withTimestamps();
    }
}
