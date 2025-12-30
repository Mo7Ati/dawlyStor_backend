<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

class Product extends Model implements HasMedia
{
    use HasFactory, HasTranslations, InteractsWithMedia;

    protected $fillable = [
        'name',
        'description',
        'keywords',
        'price',
        'compare_price',
        'store_id',
        'category_id',
        'is_active',
        'is_accepted',
        'quantity',
    ];

    protected $casts = [
        'name' => 'array',
        'address' => 'array',
        'keywords' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
            if (is_null($model->store_id) && auth()->guard('store')->check()) {
                $model->store_id = auth()->guard('store')->id();
            }
        });
    }

    public array $translatable = ['name', 'description', 'keywords'];


    public function Store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function Category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id')
            ->withDefault(['name' => 'No Category']);
    }

    // public function Cart()
    // {
    //     return $this->hasMany(Cart::class, 'product_id', 'id');
    // }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_items', 'product_id', 'order_id');
    }

    public function additions()
    {
        return $this->belongsToMany(Addition::class, 'product_additions', 'product_id', 'addition_id')
            ->withPivot('price')
            ->active();
    }

    public function options()
    {
        return $this->belongsToMany(Option::class, 'product_options', 'product_id', 'option_id')
            ->withPivot('price')
            ->active();
    }

    /**
     * Scope to filter products for the current authenticated store
     * @param Builder $query
     * @return Builder
     */
    public function scopeForAuthStore(Builder $query): Builder
    {
        return $query->where('store_id', auth()->guard('store')->id());
    }

    public function scopeApplyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when(
                isset($filters['is_active']),
                fn($q) => $q->where('is_active', $filters['is_active'])
            )
            ->when(
                isset($filters['is_accepted']),
                fn($q) => $q->where('is_accepted', $filters['is_accepted'])
            )
            ->when(
                isset($filters['tableSearch']),
                fn($q) => $q->search($filters['tableSearch'])
            )
            ->when(
                isset($filters['category_id']),
                fn($q) => $q->where('category_id', $filters['category_id'])
            )
            ->orderBy($filters['sort'] ?? 'id', $filters['direction'] ?? 'desc');
    }

    public function scopeAccepted($query)
    {
        return $query->where('is_accepted', true);
    }
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'LIKE', "%{$search}%")
            ->orWhere('description', 'LIKE', "%{$search}%")
            ->orWhere('keywords', 'LIKE', "%{$search}%");
    }

    public function syncAdditions(array $additions = []): void
    {
        $this->additions()->sync(
            collect($additions)
                ->mapWithKeys(fn($item) => [
                    $item['addition_id'] => ['price' => $item['price']],
                ])
        );
    }

    public function syncOptions(array $options = []): void
    {
        $this->options()->sync(
            collect($options)
                ->mapWithKeys(fn($item) => [
                    $item['option_id'] => ['price' => $item['price']],
                ])
        );
    }

}
