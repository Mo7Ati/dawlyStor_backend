<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $customerId = auth('sanctum')->id();

        return [
            'items' => ['required', 'array', 'min:1'],

            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.store_id' => ['required', 'integer', 'exists:stores,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],

            'items.*.selected_options' => ['sometimes', 'array'],
            'items.*.selected_options.*.option_id' => ['required_with:items.*.selected_options', 'integer', 'exists:options,id'],
            'items.*.selected_options.*.price' => ['required_with:items.*.selected_options', 'numeric', 'min:0'],
            'items.*.selected_additions' => ['sometimes', 'array'],
            'items.*.selected_additions.*.addition_id' => ['required_with:items.*.selected_additions', 'integer', 'exists:additions,id'],
            'items.*.selected_additions.*.price' => ['required_with:items.*.selected_additions', 'numeric', 'min:0'],

            'address_id' => ['required', 'integer', "exists:addresses,id,customer_id,{$customerId}"],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'items.required' => 'Cart cannot be empty.',
            'items.min' => 'Cart must contain at least one item.',
            'items.*.product_id.exists' => 'One or more products do not exist.',
            'items.*.store_id.exists' => 'One or more stores do not exist.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'address_id.exists' => 'The selected address does not belong to your account.',
        ];
    }
}
