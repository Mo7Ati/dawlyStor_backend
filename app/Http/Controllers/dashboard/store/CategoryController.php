<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $storeId = Auth::guard('store')->id();

        $categories = Category::query()
            ->where('store_id', $storeId)
            ->applyFilters($request->all())
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('store/categories/index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }
    public function create(Request $request)
    {
        return Inertia::render('store/categories/create', [
            'category' => CategoryResource::make(new Category())->serializeForForm(),
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $storeId = Auth::guard('store')->id();

        $validated = $request->validated();
        $validated['store_id'] = $storeId;

        $category = Category::create($validated);

        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('store.categories.index');
    }

    public function edit(Request $request, int $id)
    {
        $storeId = Auth::guard('store')->id();

        $category = Category::query()
            ->where('store_id', $storeId)
            ->findOrFail($id);

        return Inertia::render('store/categories/edit', [
            'category' => CategoryResource::make($category)->serializeForForm(),
        ]);
    }

    public function update(CategoryRequest $request, int $id)
    {
        $storeId = Auth::guard('store')->id();

        $category = Category::query()
            ->where('store_id', $storeId)
            ->findOrFail($id);

        $category->update($request->validated());

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('store.categories.index');
    }

    public function destroy(Request $request, int $id)
    {
        $storeId = Auth::guard('store')->id();

        Category::query()
            ->where('store_id', $storeId)
            ->findOrFail($id)
            ->delete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('store.categories.index');
    }
}

