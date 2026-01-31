<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Models\StoreCategory;


class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::with('category')
            ->category(request()->get('category'))
            ->search(request()->get('search'))
            ->paginate(9);

        return successResponse(
            StoreResource::collection($stores),
            __('messages.stores_fetched_successfully'),
            extra: [
                'total' => $stores->total(),
                'page' => $stores->currentPage(),
                'per_page' => $stores->perPage(),
                'has_more' => $stores->hasMorePages(),
            ]
        );
    }

    public function show($id)
    {
        $store = Store::with('category', 'categories', 'products')->findOrFail($id);

        return successResponse(
            StoreResource::make($store),
            __('messages.store_fetched_successfully'),
        );
    }

    public function getStoreCategories()
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
