<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UomDimension extends Model
{
    protected $fillable = ['name', 'uom_id'];

    public function uom()
    {
        return $this->belongsTo(Uom::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_dimensions', 'dimension_id', 'product_id');
    }

    public function translations()
    {
        return $this->hasMany(UomDimensionTranslation::class);
    }

    public function translatedName($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->translations
            ->firstWhere('locale', $locale)
            ?->name ?? $this->name;
    }
}
