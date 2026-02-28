<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ContactMessageStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => __('validation.required', ['attribute' => 'first_name']),
            'first_name.string' => __('validation.string', ['attribute' => 'first_name']),
            'first_name.max' => __('validation.max', ['attribute' => 'first_name', 'max' => 255]),

            'last_name.required' => __('validation.required', ['attribute' => 'last_name']),
            'last_name.string' => __('validation.string', ['attribute' => 'last_name']),
            'last_name.max' => __('validation.max', ['attribute' => 'last_name', 'max' => 255]),

            'email.required' => __('validation.required', ['attribute' => 'email']),
            'email.email' => __('validation.email', ['attribute' => 'email']),

            'subject.required' => __('validation.required', ['attribute' => 'subject']),
            'subject.string' => __('validation.string', ['attribute' => 'subject']),
            'subject.max' => __('validation.max', ['attribute' => 'subject', 'max' => 255]),

            'message.required' => __('validation.required', ['attribute' => 'message']),
            'message.string' => __('validation.string', ['attribute' => 'message']),
            'message.max' => __('validation.max', ['attribute' => 'message', 'max' => 10000]),
        ];
    }
}
