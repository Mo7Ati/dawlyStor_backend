<?php

use App\Enums\PanelsEnum;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

function getPanel()
{
    $path = request()->path();

    foreach (PanelsEnum::cases() as $panel) {
        if (Str::startsWith($path, $panel->value)) {
            return $panel->value;
        }
    }
    return null;
}
function isAdminPanel(): bool
{
    return request()->is([PanelsEnum::ADMIN->value, PanelsEnum::ADMIN->value . '/*']);
}

function successResponse($data, $message = 'Success', $status = 200, $extra = null)
{
    return response()->json([
        'success' => true,
        'message' => $message,
        'data' => $data,
        'extra' => $extra,
    ], $status);
}

function errorResponse($message = 'Error', $status = 400)
{
    return response()->json([
        'success' => false,
        'message' => $message,
    ], $status);
}

function locale()
{
    return app()->getLocale();
}

function getByLocale($array)
{
    return Arr::get($array, locale(), $array['en']);
}
