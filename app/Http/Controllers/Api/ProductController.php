<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductController extends Controller
{
    public function show($id)
    {
        $product = Product::with(['store', 'category', 'additions', 'options'])->findOrFail($id);

        return successResponse(
            ProductResource::make($product),
            'Product fetched successfully'
        );
    }
}
