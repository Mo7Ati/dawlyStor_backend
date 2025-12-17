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
            'created_at' => $this->created_at?->format('Y-m-d'),
            'category' => new StoreCategoryResource($this->whenLoaded('category')),
            'logo' => $this->getFirstMediaUrl('logo'),
        ];
    }

    public function serializeForForm(): array
    {
        return [
            'name' => $this->getTranslations('name'),
            'address' => $this->getTranslations('address'),
            'description' => $this->getTranslations('description'),
            'keywords' => $this->keywords,
            'social_media' => $this->social_media,
            'email' => $this->email,
            'phone' => $this->phone,
            'category_id' => $this->category_id,
            'delivery_time' => $this->delivery_time,
            // 'delivery_area_polygon' => $this->delivery_area_polygon,
            'is_active' => $this->is_active,
        ];
    }
}

