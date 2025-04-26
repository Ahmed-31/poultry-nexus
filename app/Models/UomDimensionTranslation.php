<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UomDimensionTranslation extends Model
{
    protected $fillable = [
        'uom_dimension_id',
        'locale',
        'name',
    ];

    public function dimension()
    {
        return $this->belongsTo(UomDimension::class, 'uom_dimension_id');
    }
}
