<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display the authenticated customer's wishlist.
     */
    public function index(Request $request): JsonResponse
    {
        $customer = auth('sanctum')->user();

        $products = $customer->wishlistProducts()
            ->with(['store', 'category'])
            ->active()
            ->accepted()
            ->get();

        return successResponse(
            ProductResource::collection($products),
            'Wishlist fetched successfully'
        );
    }

    /**
     * Add a product to the authenticated customer's wishlist.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $customer = auth('sanctum')->user();
        $productId = (int) $validated['product_id'];

        $customer->wishlistProducts()->syncWithoutDetaching([$productId]);

        return successResponse(
            ['success' => true],
            'Product added to wishlist'
        );
    }

    /**
     * Remove the given product from the authenticated customer's wishlist.
     */
    public function destroy(Request $request, int $product): JsonResponse
    {
        $customer = auth('sanctum')->user();

        $customer->wishlistProducts()->detach($product);

        return successResponse(
            ['success' => true],
            'Product removed from wishlist'
        );
    }

    /**
     * Sync guest wishlist items with the authenticated customer's wishlist.
     */
    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_ids' => ['required', 'array'],
            'product_ids.*' => ['integer'],
        ]);

        $customer = auth('sanctum')->user();

        $ids = collect($validated['product_ids'] ?? [])
            ->filter()
            ->unique()
            ->values();

        if ($ids->isNotEmpty()) {
            $validIds = Product::query()
                ->whereIn('id', $ids)
                ->pluck('id')
                ->all();

            if (! empty($validIds)) {
                $customer->wishlistProducts()->syncWithoutDetaching($validIds);
            }
        }

        $products = $customer->wishlistProducts()
            ->with(['store', 'category'])
            ->active()
            ->accepted()
            ->get();

        return successResponse(
            ProductResource::collection($products),
            'Wishlist synced successfully'
        );
    }
}

