<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user('admin')->can('products.index'), 403);

        $products = Product::query()
            ->with(['store', 'category'])
            ->applyFilters($request->all())
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => ProductResource::collection($products),
        ]);
    }
}

