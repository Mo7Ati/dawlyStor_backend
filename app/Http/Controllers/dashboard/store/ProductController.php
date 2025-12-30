<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Addition;
use App\Models\Category;
use App\Models\Option;
use App\Models\Product;
use App\Traits\MediaSyncTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    use MediaSyncTrait;

    public function index(Request $request)
    {
        $store = $request->user('store');

        $products = Product::query()
            ->where('store_id', $store->id)
            ->with(['Store', 'Category', 'additions', 'options'])
            ->search($request->get('tableSearch'))
            ->when($request->get('is_active') !== null, function ($query) use ($request) {
                $query->where('is_active', $request->get('is_active'));
            })
            ->when($request->get('is_accepted') !== null, function ($query) use ($request) {
                $query->where('is_accepted', $request->get('is_accepted'));
            })
            ->when($request->get('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->get('category_id'));
            })
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
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
        $store = $request->user('store');

        $validated = $request->validated();
        $validated['store_id'] = $store->id;
        $validated['is_accepted'] = false; // Products need admin approval

        $product = Product::create($validated);

        // Sync additions
        if ($request->has('additions') && is_array($request->additions)) {
            $additionsData = [];
            foreach ($request->additions as $addition) {
                if (isset($addition['addition_id']) && isset($addition['price'])) {
                    $additionsData[$addition['addition_id']] = ['price' => $addition['price']];
                }
            }
            $product->additions()->sync($additionsData);
        }

        // Sync options
        if ($request->has('options') && is_array($request->options)) {
            $optionsData = [];
            foreach ($request->options as $option) {
                if (isset($option['option_id']) && isset($option['price'])) {
                    $optionsData[$option['option_id']] = ['price' => $option['price']];
                }
            }
            $product->options()->sync($optionsData);
        }

        $this->storeMedia($request, $product, 'images');

        return redirect()
            ->route('store.products.index')
            ->with('success', __('messages.created_successfully'));
    }

    public function edit(Request $request, int $id)
    {
        $store = $request->user('store');
        $product = Product::query()
            ->with([
                'additions' => function ($query) {
                    $query->where('is_active', true);
                },
                'options' => function ($query) {
                    $query->where('is_active', true);
                },
            ])
            ->where('store_id', $store->id)
            ->findOrFail($id);

        return Inertia::render('store/products/edit', [
            'product' => ProductResource::make($product)->serializeForForm(),
            ...$this->formDependencies($store),
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $store = $request->user('store');

        $validated = $request->validated();
        $product->update($validated);

        // Sync additions
        if ($request->has('additions') && is_array($request->additions)) {
            $additionsData = [];
            foreach ($request->additions as $addition) {
                if (isset($addition['addition_id']) && isset($addition['price'])) {
                    $additionsData[$addition['addition_id']] = ['price' => $addition['price']];
                }
            }
            $product->additions()->sync($additionsData);
        } else {
            $product->additions()->sync([]);
        }

        // Sync options
        if ($request->has('options') && is_array($request->options)) {
            $optionsData = [];
            foreach ($request->options as $option) {
                if (isset($option['option_id']) && isset($option['price'])) {
                    $optionsData[$option['option_id']] = ['price' => $option['price']];
                }
            }
            $product->options()->sync($optionsData);
        } else {
            $product->options()->sync([]);
        }

        if ($request->has('temp_ids') && $request->temp_ids) {
            $this->storeMedia($request, $product, 'images');
        }

        return redirect()
            ->route('store.products.index')
            ->with('success', __('messages.updated_successfully'));
    }

    public function destroy(Product $product)
    {
        $store = request()->user('store');

        $product->delete();

        return redirect()
            ->route('store.products.index')
            ->with('success', __('messages.deleted_successfully'));
    }
    private function formDependencies($store)
    {
        return [
            'categories' => Category::where('store_id', $store->id)
                ->active()
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                    ];
                }),

            'additions' => Addition::where('store_id', $store->id)
                ->active()
                ->get()
                ->map(function ($addition) {
                    return [
                        'id' => $addition->id,
                        'name' => $addition->name,
                    ];
                }),

            'options' => Option::where('store_id', $store->id)
                ->active()
                ->get()
                ->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'name' => $option->name,
                    ];
                }),
        ];
    }

}
