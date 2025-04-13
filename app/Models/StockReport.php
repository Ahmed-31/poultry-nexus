<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockReport extends Model
{
    protected $fillable = [
        'report_date',
        'total_items',
        'low_stock_items',
        'out_of_stock_items',
        'total_stock_value'
    ];
}
