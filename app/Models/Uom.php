<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uom extends Model
{
    protected $fillable = ['name', 'symbol', 'group_id', 'is_base', 'conversion_factor'];

    public function scopeWithAllRelations($query)
    {
        return $query->with(['group', 'products', 'dimensions']);
    }

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

    public function translations()
    {
        return $this->hasMany(UomTranslation::class);
    }

    public function translatedName($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->translations
            ->firstWhere('locale', $locale)
            ?->name ?? $this->symbol;
    }
}
