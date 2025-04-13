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
}
