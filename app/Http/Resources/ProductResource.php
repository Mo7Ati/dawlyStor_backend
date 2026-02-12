<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'keywords' => $this->keywords,
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'discount_percentage' => $this->discount_percentage,
            'store_id' => $this->store_id,
            'category_id' => $this->category_id,
            'is_active' => $this->is_active,
            'is_accepted' => $this->is_accepted,
            'images' => $this->getMedia('product-images')
                ->map(fn($media) => $media->getUrl())
                ->toArray(),
            'quantity' => $this->quantity,
            'rating' => ['value' => '4.8', 'count' => '100',],
            'trending' => true,
            'created_at' => $this->created_at?->format('Y-m-d'),
            'updated_at' => $this->updated_at?->format('Y-m-d'),
            'store' => $this->whenLoaded('store', fn($store) => new StoreResource($store)),
            'category' => $this->whenLoaded('category', fn($category) => new CategoryResource($category)),
            'additions' => $this->whenLoaded('additions', fn($additions) => AdditionResource::collection($additions)),
            'options' => $this->whenLoaded('options', fn($options) => OptionResource::collection($options)),
            'store_category' => $this->whenLoaded('store.category', fn($storeCategory) => new StoreCategoryResource($storeCategory)),
        ];
    }

    public function serializeForForm(): array
    {
        return [
            ...$this->toArray(request()),
            'name' => $this->getTranslations('name'),
            'description' => $this->getTranslations('description'),
            'images' => $this->getMedia('product-images'),
        ];
    }
}

