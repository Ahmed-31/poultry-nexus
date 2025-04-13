<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockDimension extends Model
{
    protected $table = 'stock_dimensions';
    protected $fillable = ['stock_id', 'dimension_id', 'value', 'uom_id'];
    public $timestamps = false;

    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id', 'id');
    }

    public function dimension()
    {
        return $this->belongsTo(UomDimension::class, 'dimension_id');
    }

    public function uom()
    {
        return $this->belongsTo(Uom::class, 'uom_id');
    }
}
