<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'status',
        'payment_status',
        'cancelled_reason',
        'customer_id',
        'customer_data',
        'cancelled_reason',
        'store_id',
        'address_id',
        'address_data',
        'total',
        'total_items_amount',
        'delivery_amount',
        'tax_amount',
        'notes',
    ];

    protected $casts = [
        'customer_data' => 'array',
        'address_data' => 'array',
        'total' => 'float',
        'total_items_amount' => 'float',
        'delivery_amount' => 'float',
        'tax_amount' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /*
     * Relationships
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items', 'order_id', 'product_id')
            ->using(orderItems::class)
            ->withPivot('quantity', 'price', 'product_name')
        ;
    }
    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($query) use ($search) {
            $query->where('id', 'LIKE', "%{$search}%")
                ->orWhere('status', 'LIKE', "%{$search}%")
                ->orWhere('payment_status', 'LIKE', "%{$search}%")
                ->orWhereHas('customer', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone_number', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('store', function ($q) use ($search) {
                    $q->where('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                });
        });
    }
}
