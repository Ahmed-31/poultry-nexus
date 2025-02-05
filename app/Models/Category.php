<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    // A Category has many Products
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
