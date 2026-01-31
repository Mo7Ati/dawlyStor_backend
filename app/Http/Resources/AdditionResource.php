<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdditionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'store_id' => $this->store_id,
            'is_active' => $this->is_active,
            'price' => $this->pivot?->price,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'store' => new StoreResource($this->whenLoaded('store')),
        ];
    }

    public function serializeForForm(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->getTranslations('name'),
            'store_id' => $this->store_id,
            'is_active' => $this->is_active ?? true,
        ];
    }

    public function serializeForProduct(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}

