<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductBundle extends Model
{
    protected $fillable = ['name', 'description'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_bundle_items')
            ->withPivot('uom_id')
            ->using(ProductBundleItem::class)
            ->withTimestamps();
    }

    public function parameters()
    {
        return $this->hasMany(BundleParameter::class, 'bundle_id');
    }

    public function formulas()
    {
        return $this->hasMany(BundleProductFormula::class, 'bundle_id');
    }
}
