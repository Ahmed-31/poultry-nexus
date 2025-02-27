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

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function stockMovement() {
        return $this->hasMany(StockMovement::class);
    }
}
