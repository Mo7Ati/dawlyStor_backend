<?php

use App\Http\Controllers\dashboard\admin\AdminController;
use App\Http\Controllers\dashboard\admin\RoleController;
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
        Route::get('/', fn() => Inertia::render('admin/dashboard'))->name('index');
        Route::resources([
            'admins' => AdminController::class,
            'roles' => RoleController::class,
        ]);
    });
