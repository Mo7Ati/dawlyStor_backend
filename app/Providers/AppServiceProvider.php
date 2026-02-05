<?php

namespace App\Providers;

use App\Models\Store;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
        Cashier::useCustomerModel(Store::class);

        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.frontend_url')
                . "/reset-password/{$token}?email={$user->email}";
        });
    }
}
