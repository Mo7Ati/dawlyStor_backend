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
        $this->authorizeForUser($request->user('admin'), 'viewAny', Product::class);

        $products = Product::query()
            ->with(['store', 'category'])
            ->applyFilters($request)
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => ProductResource::collection($products),
        ]);
    }
}

