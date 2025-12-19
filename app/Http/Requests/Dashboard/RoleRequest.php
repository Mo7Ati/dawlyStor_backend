<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
        $id = $this->route('role');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->where('guard_name', 'admin')->ignore($id),
            ],
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ];
    }

    public function messages(): array
    {
        $attributes = $this->attributes();

        return [
            'name.required' => __('validation.required', ['attribute' => $attributes['name']]),
            'name.string' => __('validation.string', ['attribute' => $attributes['name']]),
            'name.max' => __('validation.max', ['attribute' => $attributes['name'], 'max' => 255]),
            'name.unique' => __('validation.unique', ['attribute' => $attributes['name']]),

            'permissions.array' => __('validation.array', ['attribute' => $attributes['permissions']]),
            'permissions.*.exists' => __('validation.exists', ['attribute' => $attributes['permissions']]),
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => __('validation.attributes.name'),
            'permissions' => __('validation.attributes.permissions'),
        ];
    }
}

