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

    /**
     * Relationship: A warehouse has many stock items.
     */
    public function stockItems()
    {
        return $this->hasMany(StockItem::class);
    }

    public function inventoryTransactions() {
        return $this->hasMany(InventoryTransaction::class);
    }
}
