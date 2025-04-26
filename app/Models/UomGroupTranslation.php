<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UomGroupTranslation extends Model
{
    protected $fillable = [
        'uom_group_id',
        'locale',
        'name',
    ];

    public function group()
    {
        return $this->belongsTo(UomGroup::class, 'uom_group_id');
    }
}
