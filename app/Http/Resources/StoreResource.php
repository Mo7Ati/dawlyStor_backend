<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'description' => $this->description,
            'keywords' => $this->keywords,
            'social_media' => $this->social_media,
            'email' => $this->email,
            'phone' => $this->phone,
            'category_id' => $this->category_id,
            'delivery_time' => $this->delivery_time,
            'delivery_area_polygon' => $this->delivery_area_polygon,
            'is_active' => $this->is_active,
            'rating' => ['value' => '4.8', 'count' => '100',],
            'created_at' => $this->created_at?->format('Y-m-d'),
            'category' => $this->whenLoaded('category', fn($category) => new StoreCategoryResource($category)),
            'image_url' => "https://media.istockphoto.com/id/912819604/vector/storefront-flat-design-e-commerce-icon.jpg?s=612x612&w=0&k=20&c=_x_QQJKHw_B9Z2HcbA2d1FH1U1JVaErOAp2ywgmmoTI=",
            'products' => $this->whenLoaded('products', fn($products) => ProductResource::collection($products)),
            'categories' => $this->whenLoaded('categories', fn($categories) => CategoryResource::collection($categories)),
        ];
    }

    public function serializeForForm(): array
    {
        return [
            ...$this->toArray(request()),
            'name' => $this->getTranslations('name'),
            'address' => $this->getTranslations('address'),
            'description' => $this->getTranslations('description'),
        ];
    }
}

