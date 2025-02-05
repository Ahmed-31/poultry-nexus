<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentStatusUpdate extends Model
{
    protected $fillable = [
        'shipment_id',
        'status',
        'remarks'
    ];

    public $timestamps = false;

    public function shipment() {
        return $this->belongsTo(Shipment::class);
    }
}
