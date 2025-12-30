<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\ProductRequest;
use App\Http\Resources\AdditionResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\OptionResource;
use App\Http\Resources\ProductResource;
use App\Models\Addition;
use App\Models\Category;
use App\Models\Option;
use App\Models\Product;
use App\Traits\MediaSyncTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    use MediaSyncTrait;

    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['Category'])
            ->forAuthStore()
            ->applyFilters($request->all())
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('store/products/index', [
            'products' => ProductResource::collection($products),
        ]);
    }

    public function create(Request $request)
    {
        $store = Auth::guard('store')->user();

        return Inertia::render('store/products/create', [
            'product' => ProductResource::make(new Product())->serializeForForm(),
            ...$this->formDependencies($store),
        ]);
    }

    public function store(ProductRequest $request)
    {
        $store = Auth::guard('store')->user();

        DB::transaction(function () use ($request, $store) {

            $product = Product::create(
                $request->safe()->except([
                    'additions',
                    'options',
                    'images',
                ]) + [
                    'store_id' => $store->id,
                    'is_accepted' => false,
                ]
            );

            $product->syncAdditions($request->input('additions', []));
            $product->syncOptions($request->input('options', []));

            $this->syncMedia($request, $product, 'images');
        });

        return redirect()
            ->route('store.products.index')
            ->with('success', __('messages.created_successfully'));
    }


    public function edit(Request $request, int $id)
    {
        $store = Auth::guard('store')->user();

        $product = Product::query()
            ->forAuthStore()
            ->with(['additions', 'options'])
            ->findOrFail($id);

        return Inertia::render('store/products/edit', [
            'product' => ProductResource::make($product)->serializeForForm(),
            ...$this->formDependencies($store),
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        DB::transaction(function () use ($request, $product) {

            $product->update(
                $request->safe()->except([
                    'additions',
                    'options',
                    'images',
                ])
            );

            $product->syncAdditions($request->input('additions', []));
            $product->syncOptions($request->input('options', []));

            $this->syncMedia($request, $product, 'images');
        });

        return redirect()
            ->route('store.products.index')
            ->with('success', __('messages.updated_successfully'));
    }

    public function destroy(int $id)
    {
        Product::query()
            ->forAuthStore()
            ->findOrFail($id)
            ->delete();

        return redirect()
            ->route('store.products.index')
            ->with('success', __('messages.deleted_successfully'));
    }
    private function formDependencies($store)
    {
        return [
            'categories' => Category::query()
                ->where('store_id', $store->id)
                ->active()
                ->get()
                ->mapInto(CategoryResource::class),

            'additions' => Addition::query()
                ->where('store_id', $store->id)
                ->active()
                ->get()
                ->mapInto(AdditionResource::class),

            'options' => Option::query()
                ->where('store_id', $store->id)
                ->active()
                ->get()
                ->mapInto(OptionResource::class),
        ];
    }

}
