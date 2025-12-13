<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Translatable\HasTranslations;
use Laravel\Fortify\TwoFactorAuthenticatable;
class Admin extends Authenticatable
{
    use HasFactory, Notifiable, HasTranslations, HasRoles, TwoFactorAuthenticatable;
    protected $guard = ['admin'];
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
    public function setPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($query) use ($search) {
            $query->where('name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%");
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
