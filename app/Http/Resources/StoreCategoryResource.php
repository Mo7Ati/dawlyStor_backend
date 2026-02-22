<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->getFirstMediaUrl('store-categories'),
            'created_at' => $this->created_at?->format('Y-m-d'),
            'stores_count' => $this->whenCounted('stores', fn($count) => $count),
        ];
    }

    public function serializeForForm(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->getTranslations('name'),
            'description' => $this->getTranslations('description'),
            'image' => $this->getMedia('store-categories'),
        ];
    }
}

