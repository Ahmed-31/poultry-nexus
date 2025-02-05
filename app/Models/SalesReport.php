<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesReport extends Model
{
    protected $fillable = [
        'report_date',
        'total_sales',
        'total_orders',
        'total_revenue',
        'total_expenses',
        'net_profit'
    ];
}
