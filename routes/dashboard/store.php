<?php

use App\Http\Controllers\dashboard\store\AdditionController;
use App\Http\Controllers\dashboard\store\CategoryController;
use App\Http\Controllers\dashboard\store\DashboardController;
use App\Http\Controllers\dashboard\store\StoreSettingsController;
use App\Http\Controllers\dashboard\store\OptionController;
use App\Http\Controllers\dashboard\store\OrderController;
use App\Http\Controllers\dashboard\store\ProductController;
use App\Http\Controllers\dashboard\store\SubscriptionController;
use Illuminate\Support\Facades\Route;

// settings routes
Route::prefix('store')
    ->name('store.')
    ->middleware(['auth:store'])
    ->group($settingsRoutes);


Route::middleware(['auth:store'])
    ->prefix('store')
    ->name('store.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('index');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

        // Subscription routes (no subscription required)
        Route::prefix('subscription')->name('subscription.')->group(function () {
            Route::get('/', [SubscriptionController::class, 'index'])->name('index');
            Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('checkout');
            Route::get('/success', [SubscriptionController::class, 'success'])->name('success');
            Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
            Route::post('/resume', [SubscriptionController::class, 'resume'])->name('resume');
            Route::post('/swap', [SubscriptionController::class, 'swap'])->name('swap');
            Route::get('/billing', [SubscriptionController::class, 'billing'])->name('billing');
        });

        // Protected routes (require subscription or trial)
        Route::resources([
            'products' => ProductController::class,
            'categories' => CategoryController::class,
            'additions' => AdditionController::class,
            'options' => OptionController::class,
        ]);
        // Route::middleware([RequireSubscription::class])->group(function () {
        // });

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/profile', [StoreSettingsController::class, 'profile'])->name('profile');
            Route::put('/profile', [StoreSettingsController::class, 'profileUpdate'])->name('profile.update');
        });
    });
