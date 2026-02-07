<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Resources\CustomerResource;
use Illuminate\Support\Facades\Route;

Route::prefix('customer')
    ->group(function () {
        Route::prefix('home')->group(function () {
            Route::get('/', [HomeController::class, 'index'])->name('home.index');
        });

        Route::prefix('products')->group(function () {
            Route::get('/{id}', [ProductController::class, 'show'])->name('products.show');
        });

        Route::middleware('auth:sanctum')->get('/me', function () {
            return successResponse(
                auth('sanctum')->check() ? new CustomerResource(auth('sanctum')->user()) : null,
            );
        });

        Route::middleware('auth:sanctum')->prefix('stores')->group(function () {
            Route::get('/categories', [StoreController::class, 'getStoreCategories'])->name('stores.categories');
            Route::get('{id}', [StoreController::class, 'show'])->name('stores.show');
            Route::get('/', [StoreController::class, 'index'])->name('stores.index');
        });

        // Addresses
        Route::middleware('auth:sanctum')->prefix('addresses')->group(function () {
            Route::get('/', [AddressController::class, 'index'])->name('customer.addresses.index');
            Route::post('/', [AddressController::class, 'store'])->name('customer.addresses.store');
            Route::get('/{id}', [AddressController::class, 'show'])->name('customer.addresses.show');
            Route::put('/{id}', [AddressController::class, 'update'])->name('customer.addresses.update');
            Route::delete('/{id}', [AddressController::class, 'destroy'])->name('customer.addresses.destroy');
        });

        // Checkout
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/checkout', [CheckoutController::class, 'store'])->name('customer.checkout');
        });
    });

/*
|--------------------------------------------------------------------------
| Stripe Webhook
|--------------------------------------------------------------------------
|
| This route handles incoming Stripe webhook events.
| It is intentionally outside any auth middleware.
|
*/
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle'])
    ->name('stripe.webhook');
