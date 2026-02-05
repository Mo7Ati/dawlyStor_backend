<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoreController;
use Illuminate\Support\Facades\Route;

Route::prefix('customer')
    ->group(function () {

        Route::middleware('guest:api')->group(function () {
            Route::post('login', [AuthController::class, 'login'])->name('login');
            Route::post('register', [AuthController::class, 'register'])->name('register');
            Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');
            Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
        });

        Route::middleware(['auth:api'])->group(function () {
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        });


        Route::prefix('home')->group(function () {
            Route::get('/', [HomeController::class, 'index'])->name('home.index');
        });

        Route::prefix('products')->group(function () {
            Route::get('/{id}', [ProductController::class, 'show'])->name('products.show');
        });

        Route::prefix('stores')->group(function () {
            Route::get('/', [StoreController::class, 'index'])->name('stores.index');
            Route::get('/categories', [StoreController::class, 'getStoreCategories'])->name('stores.categories');
            Route::get('/{id}', [StoreController::class, 'show'])->name('stores.show');
        });
    });
