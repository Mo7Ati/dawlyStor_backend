<?php

namespace App\Http\Requests\Dashboard\Admins;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class AdminRequest extends FormRequest
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
    public function rules(Request $request): array
    {
        $id = $this->route('admin');

        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('admins', 'email')->ignore($id),
            ],
            'password' => [
                $id ? 'nullable' : 'required',
                'string',
                'min:8',
            ],
            'is_active' => 'required|boolean',
            'roles' => 'nullable|array',
        ];
    }

    public function messages(): array
    {

        $attributes = $this->attributes();

        return [
            'name.required' => __('validation.required', ['attribute' => $attributes['name']]),
            'name.string' => __('validation.string', ['attribute' => $attributes['name']]),
            'name.max' => __('validation.max', ['attribute' => $attributes['name'], 'max' => 255]),

            'email.required' => __('validation.required', ['attribute' => $attributes['email']]),
            'email.email' => __('validation.email', ['attribute' => $attributes['email']]),
            'email.unique' => __('validation.unique', ['attribute' => $attributes['email']]),

            'password.required' => __('validation.required', ['attribute' => $attributes['password']]),
            'password.string' => __('validation.string', ['attribute' => $attributes['password']]),
            'password.min' => __('validation.min', ['attribute' => $attributes['password'], 'min' => 8]),

            'is_active.boolean' => __('validation.boolean', ['attribute' => $attributes['is_active']]),

            'roles.array' => __('validation.array', ['attribute' => $attributes['roles']]),
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => __('validation.attributes.name'),
            'email' => __('validation.attributes.email'),
            'password' => __('validation.attributes.password'),
            'is_active' => __('validation.attributes.is_active'),
            'roles' => __('validation.attributes.roles'),
        ];
    }
}
