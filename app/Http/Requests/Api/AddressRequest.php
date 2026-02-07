<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddressRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('addresses', 'name')->ignore($this->route('address'))],
            'location' => ['required', 'array'],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Address name is required.',
            'location.required' => 'Location is required.',
            // 'location.lat.required' => 'Latitude is required.',
            // 'location.lat.between' => 'Latitude must be between -90 and 90.',
            // 'location.lng.required' => 'Longitude is required.',
            // 'location.lng.between' => 'Longitude must be between -180 and 180.',
            // 'location.address.required' => 'Address text is required.',
        ];
    }
}
