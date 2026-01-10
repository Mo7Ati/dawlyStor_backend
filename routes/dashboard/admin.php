<?php

use App\Http\Controllers\dashboard\admin\AdminController;
use App\Http\Controllers\dashboard\admin\AdminSettingsController;
use App\Http\Controllers\dashboard\admin\DashboardController;
use App\Http\Controllers\dashboard\admin\OrderController;
use App\Http\Controllers\dashboard\admin\ProductController;
use App\Http\Controllers\dashboard\admin\RoleController;
use App\Http\Controllers\dashboard\admin\SectionController;
use App\Http\Controllers\dashboard\admin\StoreController;
use App\Http\Controllers\dashboard\admin\StoreCategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// settings routes
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth:admin'])
    ->group($settingsRoutes);


Route::middleware(['auth:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('index');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::resources([
            'admins' => AdminController::class,
            'roles' => RoleController::class,
            'stores' => StoreController::class,
            'store-categories' => StoreCategoryController::class,
            'sections' => SectionController::class,
        ]);

        Route::post('sections/reorder', [SectionController::class, 'reorder'])->name('sections.reorder');


        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/profile', [AdminSettingsController::class, 'profile'])->name('profile');
            Route::put('/profile', [AdminSettingsController::class, 'profileUpdate'])->name('profile.update');
        });
    });
