<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BundleParameter extends Model
{
    protected $fillable = ['bundle_id', 'name', 'label', 'type', 'translations', 'default_value', 'options'];
    protected $casts = [
        'options' => 'array',
        'translations' => 'array',
    ];

    public function bundle()
    {
        return $this->belongsTo(ProductBundle::class);
    }
}
