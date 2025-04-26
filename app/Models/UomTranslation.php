<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UomTranslation extends Model
{
    protected $fillable = [
        'uom_id',
        'locale',
        'name',
    ];

    public function uom()
    {
        return $this->belongsTo(Uom::class);
    }
}
