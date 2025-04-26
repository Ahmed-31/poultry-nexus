<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UomGroup extends Model
{
    protected $fillable = ['name'];

    public function uoms()
    {
        return $this->hasMany(Uom::class, 'group_id');
    }

    public function translations()
    {
        return $this->hasMany(UomGroupTranslation::class);
    }

    public function translatedName($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->translations
            ->firstWhere('locale', $locale)
            ?->name ?? $this->name;
    }
}
