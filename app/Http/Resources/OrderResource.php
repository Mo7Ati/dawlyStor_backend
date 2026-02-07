<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->toArray(),
            'payment_status' => $this->payment_status->toArray(),
            'checkout_group_id' => $this->checkout_group_id,
            'cancelled_reason' => $this->cancelled_reason,
            'customer_id' => $this->customer_id,
            'customer_data' => $this->customer_data,
            'store_id' => $this->store_id,
            'address_id' => $this->address_id,
            'address_data' => $this->address_data,
            'total' => $this->total,
            'total_items_amount' => $this->total_items_amount,
            'delivery_amount' => $this->delivery_amount,
            'tax_amount' => $this->tax_amount,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->format('Y-m-d'),
            'updated_at' => $this->updated_at?->format('Y-m-d'),
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'store' => new StoreResource($this->whenLoaded('store')),
            'address' => new AddressResource($this->whenLoaded('address')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}

