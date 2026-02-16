<?php

namespace App\Models;

use Bavix\Wallet\Interfaces\Wallet;
use Bavix\Wallet\Traits\HasWallet;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Laravel\Cashier\Billable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

class Store extends Authenticatable implements HasMedia, Wallet
{
    use HasFactory, HasTranslations, TwoFactorAuthenticatable, InteractsWithMedia, Billable, HasWallet;

    protected $fillable = [
        'name',
        'address',
        'description',
        'keywords',
        'social_media',
        'email',
        'phone',
        'password',
        'category_id',
        'delivery_time',
        'delivery_area_polygon',
        'is_active',
    ];

    protected $casts = [
        'name' => 'array',
        'address' => 'array',
        'description' => 'array',
        'keywords' => 'array',
        'social_media' => 'array',
        'delivery_area_polygon' => 'json',
    ];


    public array $translatable = ['name', 'description', 'address'];

    public function setPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($query) use ($search) {
            $query->whereAny([
                'name',
                'description',
                'address',
                'keywords',
                'social_media',
            ], 'like', "%{$search}%");
        });
    }
    public function scopeCategory($query, $category)
    {
        return $query->when($category, function ($query) use ($category) {
            $query->whereHas('category', function ($query) use ($category) {
                $query->whereLike('name', "%{$category}%")
                    ->orWhereLike('description', "%{$category}%");
            });
        });
    }
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function category()
    {
        return $this->belongsTo(StoreCategory::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function additions()
    {
        return $this->hasMany(Addition::class);
    }
    public function options()
    {
        return $this->hasMany(Option::class);
    }
    public function categories()
    {
        return $this->hasMany(Category::class);
    }

}
