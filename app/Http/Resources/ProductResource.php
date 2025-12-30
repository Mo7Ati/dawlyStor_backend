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
            'store_id' => $this->store_id,
            'category_id' => $this->category_id,
            'is_active' => $this->is_active,
            'is_accepted' => $this->is_accepted,
            'quantity' => $this->quantity,
            'created_at' => $this->created_at?->format('Y-m-d'),
            'updated_at' => $this->updated_at?->format('Y-m-d'),
            'store' => StoreResource::make($this->whenLoaded('Store')),
            'category' => CategoryResource::make($this->whenLoaded('Category')),
            'additions' => AdditionResource::collection($this->whenLoaded('additions')),
            'options' => OptionResource::collection($this->whenLoaded('options')),
        ];
    }

    public function serializeForForm(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->getTranslations('name'),
            'description' => $this->getTranslations('description'),
            'keywords' => $this->keywords,
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'category_id' => $this->category_id,
            'is_active' => $this->is_active,
            'quantity' => $this->quantity,
            'images' => $this->getMedia('images'),
            'additions' => $this->additions->map(function ($addition) {
                return [
                    'addition_id' => $addition->id,
                    'price' => $addition->pivot->price ?? 0,
                ];
            })->toArray(),
            'options' => $this->options->map(function ($option) {
                return [
                    'option_id' => $option->id,
                    'price' => $option->pivot->price ?? 0,
                ];
            })->toArray(),
        ];
    }
}

