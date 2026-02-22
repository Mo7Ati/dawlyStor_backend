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
        $categories = StoreCategory::withCount('stores')->get();

        return successResponse(
            StoreCategoryResource::collection($categories),
            __('messages.store_categories_fetched_successfully'),
        );
    }
}
