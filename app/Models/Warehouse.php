<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = [
        'name',
        'location',
        'description',
    ];

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function stockMovement()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function hasStock()
    : bool
    {
        return $this->stocks()->sum('quantity_in_base') > 0;
    }
}
