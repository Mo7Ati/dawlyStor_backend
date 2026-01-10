<?php

namespace App\Models;

use App\Enums\HomePageSectionsType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Section extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'type',
        'is_active',
        'order',
        'data',
    ];

    protected $casts = [
        'type' => HomePageSectionsType::class,
        'is_active' => 'boolean',
        'order' => 'integer',
        'data' => 'array',
    ];

    protected static function booted()
    {
        static::addGlobalScope('ordered', function (Builder $builder) {
            $builder->orderBy('order');
        });
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order');
    }
}
