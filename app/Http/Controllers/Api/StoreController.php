<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Store;

class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::with('category')
            ->applyFilters(request())
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

    public function show($slug)
    {
        $store = Store::query()
            ->active()
            ->with([
                'category',
                'categories',
                'products' => function ($query) {
                    $query
                        ->active()
                        ->accepted()
                        ->applyFilters(request());
                },
            ])
            ->where('slug', $slug)
            ->firstOrFail();

        return successResponse(
            StoreResource::make($store),
            __('messages.store_fetched_successfully'),
        );
    }
}
