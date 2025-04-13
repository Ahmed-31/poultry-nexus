<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockReservationDimension extends Model
{
    protected $table = 'reservation_dimensions';
    protected $fillable = ['reservation_id', 'dimension_id', 'value'];

    public function reservation()
    {
        return $this->belongsTo(StockReservation::class, 'reservation_id');
    }

    public function dimension()
    {
        return $this->belongsTo(UomDimension::class, 'dimension_id');
    }
}
