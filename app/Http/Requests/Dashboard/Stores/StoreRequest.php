<?php

namespace App\Http\Requests\Dashboard\Stores;

use App\Models\Store;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class StoreRequest extends FormRequest
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
        $id = $this->route('store');
        // dd($this->all());
        return [
            'name' => ['required', 'array'],
            'name.*' => ['required', 'string', 'max:255'],
            'address' => ['required', 'array'],
            'address.*' => ['required', 'string'],
            'description' => ['nullable', 'array'],
            'description.*' => ['nullable', 'string'],
            'keywords' => 'nullable|array',
            'keywords.*' => ['nullable', 'string'],
            'social_media' => ['nullable', 'array'],
            'email' => ['required', 'email', Rule::unique('stores', 'email')->ignore($id)],
            'phone' => ['required', 'string', Rule::unique('stores', 'phone')->ignore($id)],
            'password' => [
                $id ? 'nullable' : 'required',
                'string',
                'min:8',
            ],
            'category_id' => 'nullable|exists:store_categories,id',
            'delivery_time' => 'required|integer|min:1',
            // 'delivery_area_polygon' => 'nullable|array',
            'is_active' => 'nullable|boolean',
            'temp_ids' => [
                Rule::requiredIf(function () use ($id) {
                    if ($id) {
                        $store = Store::find($id);
                        return !$store->getFirstMedia('logo');
                    }
                    return true;
                }),
                function (string $attribute, mixed $value, Closure $fail) use ($id) {
                    if ($value) {
                        $ids = explode(',', $value);
                        $media = Media::whereIn('id', $ids)->get();
                        if ($media->count() !== count($ids)) {
                            $fail(__('validation.exists', ['attribute' => $attribute]));
                        }
                    }
                },
            ],
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

            'address.required' => __('validation.required', ['attribute' => $attributes['address']]),
            'address.array' => __('validation.array', ['attribute' => $attributes['address']]),
            'address.*.required' => __('validation.required', ['attribute' => $attributes['address']]),
            'address.*.string' => __('validation.string', ['attribute' => $attributes['address']]),

            'description.array' => __('validation.array', ['attribute' => $attributes['description']]),
            'description.*.string' => __('validation.string', ['attribute' => $attributes['description']]),

            'keywords.array' => __('validation.array', ['attribute' => $attributes['keywords']]),
            'keywords.*.string' => __('validation.string', ['attribute' => $attributes['keywords']]),

            'social_media.array' => __('validation.array', ['attribute' => $attributes['social_media']]),

            'email.required' => __('validation.required', ['attribute' => $attributes['email']]),
            'email.email' => __('validation.email', ['attribute' => $attributes['email']]),
            'email.unique' => __('validation.unique', ['attribute' => $attributes['email']]),

            'phone.required' => __('validation.required', ['attribute' => $attributes['phone']]),
            'phone.string' => __('validation.string', ['attribute' => $attributes['phone']]),
            'phone.unique' => __('validation.unique', ['attribute' => $attributes['phone']]),

            'password.required' => __('validation.required', ['attribute' => $attributes['password']]),
            'password.string' => __('validation.string', ['attribute' => $attributes['password']]),
            'password.min' => __('validation.min', ['attribute' => $attributes['password'], 'min' => 8]),

            'category_id.exists' => __('validation.exists', ['attribute' => $attributes['category_id']]),

            'delivery_time.required' => __('validation.required', ['attribute' => $attributes['delivery_time']]),
            'delivery_time.integer' => __('validation.integer', ['attribute' => $attributes['delivery_time']]),
            'delivery_time.min' => __('validation.min', ['attribute' => $attributes['delivery_time'], 'min' => 1]),

            'delivery_area_polygon.array' => __('validation.array', ['attribute' => $attributes['delivery_area_polygon']]),

            'temp_ids.required' => __('validation.required', ['attribute' => $attributes['logo']]),

            'is_active.required' => __('validation.required', ['attribute' => $attributes['is_active']]),
            'is_active.boolean' => __('validation.boolean', ['attribute' => $attributes['is_active']]),
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => __('validation.attributes.name'),
            'address' => __('validation.attributes.address'),
            'description' => __('validation.attributes.description'),
            'keywords' => __('validation.attributes.keywords'),
            'social_media' => __('validation.attributes.social_media'),
            'email' => __('validation.attributes.email'),
            'phone' => __('validation.attributes.phone'),
            'password' => __('validation.attributes.password'),
            'category_id' => __('validation.attributes.category_id'),
            'delivery_time' => __('validation.attributes.delivery_time'),
            'delivery_area_polygon' => __('validation.attributes.delivery_area_polygon'),
            'is_active' => __('validation.attributes.is_active'),
            'logo' => __('validation.attributes.logo'),
        ];
    }
}

