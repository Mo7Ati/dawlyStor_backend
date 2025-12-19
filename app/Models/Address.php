<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'name',
        'customer_id',
        'location',
        'fields',
    ];

    protected $casts = [
        'location' => 'array',
        'fields' => 'array',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
