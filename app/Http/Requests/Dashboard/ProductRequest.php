<?php

namespace App\Http\Requests\Dashboard;

use App\Models\Product;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProductRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $store = $this->user('store');

        return [
            'name' => ['required', 'array'],
            'name.*' => ['required', 'string', 'max:255'],

            'description' => ['nullable', 'array'],
            'description.*' => ['required_with:description', 'string'],

            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['required_with:keywords', 'string'],

            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],

            'category_id' => [
                'required',
                Rule::exists('categories', 'id')->where('store_id', $store->id),
            ],

            'quantity' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],

            'additions' => ['nullable', 'array'],
            'additions.*.addition_id' => [
                'required_with:additions.*',
                Rule::exists('additions', 'id')->where('store_id', $store->id),
            ],
            'additions.*.price' => ['required_with:additions.*', 'numeric', 'min:0'],

            'options' => ['nullable', 'array'],
            'options.*.option_id' => [
                'required_with:options.*',
                Rule::exists('options', 'id')->where('store_id', $store->id),
            ],
            'options.*.price' => ['required_with:options.*', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        $attributes = $this->attributes();

        return [
            'name.required' => __('validation.required', ['attribute' => $attributes['name']]),
            'name.array' => __('validation.array', ['attribute' => $attributes['name']]),
            'name.*.required' => __('validation.required', ['attribute' => $attributes['name']]),
            'name.*.string' => __('validation.string', ['attribute' => $attributes['name']]),
            'name.*.max' => __('validation.max', ['attribute' => $attributes['name'], 'max' => 255]),

            'description.required' => __('validation.required', ['attribute' => $attributes['description']]),
            'description.array' => __('validation.array', ['attribute' => $attributes['description']]),
            'description.*.required' => __('validation.required', ['attribute' => $attributes['description']]),
            'description.*.string' => __('validation.string', ['attribute' => $attributes['description']]),

            'keywords.array' => __('validation.array', ['attribute' => $attributes['keywords']]),
            'keywords.*.string' => __('validation.string', ['attribute' => $attributes['keywords']]),

            'price.required' => __('validation.required', ['attribute' => $attributes['price']]),
            'price.numeric' => __('validation.numeric', ['attribute' => $attributes['price']]),
            'price.min' => __('validation.min', ['attribute' => $attributes['price'], 'min' => 0]),

            'compare_price.numeric' => __('validation.numeric', ['attribute' => $attributes['compare_price']]),
            'compare_price.min' => __('validation.min', ['attribute' => $attributes['compare_price'], 'min' => 0]),

            'category_id.exists' => __('validation.exists', ['attribute' => $attributes['category_id']]),

            'quantity.integer' => __('validation.integer', ['attribute' => $attributes['quantity']]),
            'quantity.min' => __('validation.min', ['attribute' => $attributes['quantity'], 'min' => 0]),

            'is_active.boolean' => __('validation.boolean', ['attribute' => $attributes['is_active']]),
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => __('validation.attributes.name'),
            'description' => __('validation.attributes.description'),
            'keywords' => __('validation.attributes.keywords'),
            'price' => __('validation.attributes.price'),
            'compare_price' => __('validation.attributes.compare_price'),
            'category_id' => __('validation.attributes.category_id'),
            'quantity' => __('validation.attributes.quantity'),
            'is_active' => __('validation.attributes.is_active'),
        ];
    }
}

