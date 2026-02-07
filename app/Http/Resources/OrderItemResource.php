<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_data['name'] ?? null,
            'unit_price' => $this->unit_price,
            'quantity' => $this->quantity,
            'total_price' => $this->total_price ?? (($this->unit_price ?? 0) * ($this->quantity ?? 0)),
            'product_data' => $this->product_data,
            'options_amount' => $this->options_amount ?? 0,
            'options_data' => $this->options_data,
            'additions_amount' => $this->additions_amount ?? 0,
            'additions_data' => $this->additions_data,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
