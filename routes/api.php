<?php

use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoreController;
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
    });
