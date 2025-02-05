<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'description',
    ];

    /**
     * Relationship: A supplier can supply multiple products.
     */
    public function products()
    {
        return $this->hasMany(SupplierProduct::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
