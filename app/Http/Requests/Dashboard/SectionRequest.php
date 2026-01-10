<?php

namespace App\Http\Requests\Dashboard;

use App\Enums\HomePageSectionsType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SectionRequest extends FormRequest
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
        $type = $this->input('type');
        $rules = [
            'type' => ['required', Rule::enum(HomePageSectionsType::class)],
            'is_active' => ['nullable', 'boolean'],
            'data' => ['required', 'array'],
        ];

        // Type-specific validation rules
        if ($type === HomePageSectionsType::HERO->value) {
            $rules['data.title'] = ['required', 'array:en,ar'];
            $rules['data.title.*'] = ['required', 'string'];

            $rules['data.sub_title'] = ['required', 'array:en,ar'];
            $rules['data.sub_title.*'] = ['required', 'string'];
        } elseif ($type === HomePageSectionsType::PRODUCTS->value) {
            $rules['data.source'] = ['required', 'string', Rule::in(['latest', 'best_seller', 'manual'])];
            $rules['data.product_ids'] = ['required_if:data.source,manual', 'array'];
            $rules['data.product_ids.*'] = ['required_with:data.product_ids', 'exists:products,id'];
        } elseif ($type === HomePageSectionsType::CATEGORIES->value) {
            $rules['data.source'] = ['required', 'string', Rule::in(['featured_only', 'manual'])];
            $rules['data.category_ids'] = ['required_if:data.source,manual', 'array'];
            $rules['data.category_ids.*'] = ['required_with:data.category_ids', 'exists:store_categories,id'];
        } elseif ($type === HomePageSectionsType::STORES->value) {
            $rules['data.source'] = ['required', 'string', Rule::in(['trendy', 'manual'])];
            $rules['data.store_ids'] = ['required_if:data.source,manual', 'array'];
            $rules['data.store_ids.*'] = ['required_with:data.store_ids', 'exists:stores,id'];
        } elseif ($type === HomePageSectionsType::FEATURES->value) {
            $rules['data.features'] = ['required', 'array'];
            // $rules['data.features.*.icon'] = ['required', 'string'];
            $rules['data.features.*.title'] = ['required', 'array:en,ar'];
            $rules['data.features.*.title.*'] = ['required', 'string'];
            $rules['data.features.*.description'] = ['required', 'array:en,ar'];
            $rules['data.features.*.description.*'] = ['required', 'string'];
        } elseif ($type === HomePageSectionsType::VENDOR_CTA->value) {
            $rules['data.vendor_cta'] = ['required', 'array'];
            $rules['data.vendor_cta.title'] = ['required', 'array:en,ar'];
            $rules['data.vendor_cta.title.*'] = ['required', 'string'];

            $rules['data.vendor_cta.description'] = ['required', 'array:en,ar'];
            $rules['data.vendor_cta.description.*'] = ['required', 'string'];
        }
        // hero, features, vendor_cta are static - no additional validation needed
        // Unknown fields will be rejected in after hook

        return $rules;
    }

    /**
     * Configure the validator instance.
     */
    // public function withValidator(Validator $validator): void
    // {
    //     $validator->after(function (Validator $validator) {
    //         $type = $this->input('type');
    //         $data = $this->input('data', []);

    //         // For static sections (hero, features, vendor_cta), reject unknown fields
    //         if (
    //             in_array($type, [
    //                 HomePageSectionsType::HERO->value,
    //                 HomePageSectionsType::FEATURES->value,
    //                 HomePageSectionsType::VENDOR_CTA->value,
    //             ])
    //         ) {
    //             // Allow any fields for static sections - they're just JSON data
    //             // No strict validation needed as per requirements
    //         }

    //         // For dynamic sections, ensure only allowed fields exist
    //         if ($type === HomePageSectionsType::PRODUCTS->value) {
    //             $allowedFields = ['source', 'limit', 'product_ids'];
    //             $unknownFields = array_diff(array_keys($data), $allowedFields);
    //             if (!empty($unknownFields)) {
    //                 foreach ($unknownFields as $field) {
    //                     $validator->errors()->add("data.{$field}", "Unknown field '{$field}' is not allowed for products section.");
    //                 }
    //             }
    //         } elseif ($type === HomePageSectionsType::CATEGORIES->value) {
    //             $allowedFields = ['source', 'limit', 'category_ids'];
    //             $unknownFields = array_diff(array_keys($data), $allowedFields);
    //             if (!empty($unknownFields)) {
    //                 foreach ($unknownFields as $field) {
    //                     $validator->errors()->add("data.{$field}", "Unknown field '{$field}' is not allowed for categories section.");
    //                 }
    //             }
    //         } elseif ($type === HomePageSectionsType::STORES->value) {
    //             $allowedFields = ['source', 'limit', 'store_ids'];
    //             $unknownFields = array_diff(array_keys($data), $allowedFields);
    //             if (!empty($unknownFields)) {
    //                 foreach ($unknownFields as $field) {
    //                     $validator->errors()->add("data.{$field}", "Unknown field '{$field}' is not allowed for stores section.");
    //                 }
    //             }
    //         }
    //     });
    // }

    public function messages(): array
    {
        $attributes = $this->attributes();

        return [
            'type.required' => __('validation.required', ['attribute' => $attributes['type']]),
            'type.enum' => __('validation.enum', ['attribute' => $attributes['type']]),
            'is_active.boolean' => __('validation.boolean', ['attribute' => $attributes['is_active']]),
            'order.integer' => __('validation.integer', ['attribute' => $attributes['order']]),
            'data.required' => __('validation.required', ['attribute' => $attributes['data']]),
            'data.array' => __('validation.array', ['attribute' => $attributes['data']]),
            'data.source.required' => __('validation.required', ['attribute' => $attributes['data.source'] ?? 'source']),
            'data.source.in' => __('validation.in', ['attribute' => $attributes['data.source'] ?? 'source']),
            'data.limit.required' => __('validation.required', ['attribute' => $attributes['data.limit'] ?? 'limit']),
            'data.limit.integer' => __('validation.integer', ['attribute' => $attributes['data.limit'] ?? 'limit']),
            'data.limit.min' => __('validation.min.numeric', ['attribute' => $attributes['data.limit'] ?? 'limit', 'min' => 1]),
            'data.product_ids.required_if' => __('validation.required_if', ['attribute' => $attributes['data.product_ids'] ?? 'product_ids']),
            'data.product_ids.array' => __('validation.array', ['attribute' => $attributes['data.product_ids'] ?? 'product_ids']),
            'data.product_ids.*.exists' => __('validation.exists', ['attribute' => $attributes['data.product_ids'] ?? 'product_ids']),
            'data.category_ids.required_if' => __('validation.required_if', ['attribute' => $attributes['data.category_ids'] ?? 'category_ids']),
            'data.category_ids.array' => __('validation.array', ['attribute' => $attributes['data.category_ids'] ?? 'category_ids']),
            'data.category_ids.*.exists' => __('validation.exists', ['attribute' => $attributes['data.category_ids'] ?? 'category_ids']),
            'data.store_ids.required_if' => __('validation.required_if', ['attribute' => $attributes['data.store_ids'] ?? 'store_ids']),
            'data.store_ids.array' => __('validation.array', ['attribute' => $attributes['data.store_ids'] ?? 'store_ids']),
            'data.store_ids.*.exists' => __('validation.exists', ['attribute' => $attributes['data.store_ids'] ?? 'store_ids']),
        ];
    }

    public function attributes(): array
    {
        return [
            'type' => __('validation.attributes.type'),
            'is_active' => __('validation.attributes.is_active'),
            'order' => __('validation.attributes.order'),
            'data' => __('validation.attributes.data'),
            'data.source' => __('validation.attributes.source'),
            'data.limit' => __('validation.attributes.limit'),
            'data.product_ids' => __('validation.attributes.product_ids'),
            'data.category_ids' => __('validation.attributes.category_ids'),
            'data.store_ids' => __('validation.attributes.store_ids'),
        ];
    }
}
