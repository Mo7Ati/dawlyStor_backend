<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreCategoryResource;
use App\Models\StoreCategory;
use Illuminate\Http\Request;

class StoreCategoryController extends Controller
{
    public function index()
    {
        $categories = StoreCategory::all();

        return successResponse(
            $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            })->toArray(),
            __('messages.store_categories_fetched_successfully'),
        );
    }
}
