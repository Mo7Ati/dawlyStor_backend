<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

class StoreCategory extends Model implements HasMedia
{
    use HasTranslations, HasFactory, InteractsWithMedia;
    protected $fillable = [
        'name',
        'description',
    ];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];

    public array $translatable = ['name', 'description'];

    public function stores()
    {
        return $this->hasMany(Store::class, 'category_id', 'id');
    }

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($query) use ($search) {
            $query->whereLike('name', "%$search%")
                ->orWhereLike('description', "%$search%");
        });
    }
}
