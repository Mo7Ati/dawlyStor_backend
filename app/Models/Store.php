<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

class Store extends Authenticatable implements HasMedia
{
    use HasFactory, HasTranslations, TwoFactorAuthenticatable, InteractsWithMedia;

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


    public array $translatable = ['name', 'description', 'address', 'keywords'];

    public function setPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($query) use ($search) {
            $query->where('email', 'LIKE', "%{$search}%")
                ->orWhere('phone', 'LIKE', "%{$search}%")
                ->orWhereJsonContains('name', $search);
        });
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
