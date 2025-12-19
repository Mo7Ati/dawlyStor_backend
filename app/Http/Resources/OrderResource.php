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
            'status' => $this->status,
            'payment_status' => $this->payment_status,
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
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'name' => $this->customer->name,
                    'email' => $this->customer->email,
                    'phone_number' => $this->customer->phone_number,
                ];
            }),
            'store' => new StoreResource($this->whenLoaded('store')),
            'address' => $this->whenLoaded('address', function () {
                return $this->address ? [
                    'id' => $this->address->id,
                    'name' => $this->address->name,
                    'location' => $this->address->location,
                ] : null;
            }),
        ];
    }
}

