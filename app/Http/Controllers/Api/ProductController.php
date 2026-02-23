<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductController extends Controller
{
    public function show($store_slug, $product_slug)
    {
        $product = Product::with(['store', 'category', 'additions', 'options'])
            ->accepted()
            ->active()
            ->whereHas('store', function ($query) use ($store_slug) {
                $query->where('slug', $store_slug);
            })
            ->where('slug', $product_slug)
            ->firstOrFail();

        return successResponse(
            ProductResource::make($product),
            'Product fetched successfully'
        );
    }
}
