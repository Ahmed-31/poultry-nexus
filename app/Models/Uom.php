<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uom extends Model
{
    protected $fillable = ['name', 'symbol', 'group_id', 'is_base', 'conversion_factor'];

    public function group()
    {
        return $this->belongsTo(UomGroup::class, 'group_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_uoms');
    }

    public function dimensions()
    {
        return $this->hasMany(UomDimension::class);
    }
}
