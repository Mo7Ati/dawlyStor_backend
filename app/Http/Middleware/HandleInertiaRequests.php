<?php

namespace App\Http\Middleware;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\PermissionsEnum;
use App\Http\Resources\AuthenticatableResource;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $panel = getPanel();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? AuthenticatableResource::make($request->user()) : null,
                'permissions' => $request->user('admin') ? $request->user('admin')->getAllPermissions()->pluck('name') : [],
            ],
            'panel' => $panel,
            'locales' => [
                'ar' => "العربية",
                'en' => "English"
            ],
            'currentLocale' => app()->getLocale(),
            'enums' => [
                'orderStatus' => OrderStatusEnum::toArray(),
                'paymentStatus' => PaymentStatusEnum::toArray(),
                'permissions' => PermissionsEnum::toArray(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
