<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Models\StoreCategory;
use Illuminate\Support\Facades\Log;


class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::with('category')
            ->active()
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
        $store = Store::where('is_active', true)->with([
            'category',
            'categories',
            'products' => function ($query) {
                $query->accepted()
                    ->active()
                    ->when(request('search'), fn($q) => $q->search(request('search')))
                    ->when(request('category'), fn($q) => $q->where('category_id', request('category')))
                    ->when(request()->filled('minPrice'), fn($q) => $q->where('price', '>=', (float) request('minPrice')))
                    ->when(request()->filled('maxPrice'), fn($q) => $q->where('price', '<=', (float) request('maxPrice')));
            },
        ])->findOrFail($id);

        return successResponse(
            StoreResource::make($store),
            __('messages.store_fetched_successfully'),
        );
    }
}
