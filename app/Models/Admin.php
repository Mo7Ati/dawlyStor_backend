<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Translatable\HasTranslations;
use Laravel\Fortify\TwoFactorAuthenticatable;
class Admin extends Authenticatable implements HasMedia
{
    use HasFactory, Notifiable, HasTranslations, HasRoles, TwoFactorAuthenticatable, InteractsWithMedia;
    protected $guard = ['admin'];
    protected $guard_name = 'admin';
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

    public function scopeApplyFilters(Builder $query, array $filters)
    {
        return $query
            ->when(
                isset($filters['is_active']),
                fn($q) => $q->where('is_active', $filters['is_active'])
            )
            ->when(
                isset($filters['tableSearch']),
                fn($q) => $q->search($filters['tableSearch'])
            )
            ->orderBy($filters['sort'] ?? 'id', $filters['direction'] ?? 'desc');
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
