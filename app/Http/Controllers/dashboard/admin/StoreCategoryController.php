<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreCategories\StoreCategoryRequest;
use App\Http\Resources\StoreCategoryResource;
use App\Models\StoreCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = StoreCategory::query()
            ->search($request->get('tableSearch'))
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/store-categories/index', [
            'categories' => StoreCategoryResource::collection($categories),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/store-categories/create', [
            'category' => StoreCategoryResource::make(new StoreCategory())->serializeForForm(),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        StoreCategory::create($request->validated());
        return to_route('admin.store-categories.index')->with('success', __('messages.created_successfully'));
    }

    public function edit($id)
    {
        $category = StoreCategory::findOrFail($id);
        return Inertia::render('admin/store-categories/edit', [
            'category' => StoreCategoryResource::make($category)->serializeForForm(),
        ]);
    }

    public function update($id, StoreCategoryRequest $request)
    {
        $category = StoreCategory::findOrFail($id);
        $category->update($request->validated());

        return redirect()
            ->route('admin.store-categories.index')
            ->with('success', __('messages.updated_successfully'));
    }

    public function destroy($id)
    {
        StoreCategory::destroy($id);

        return redirect()
            ->route('admin.store-categories.index')
            ->with('success', __('messages.deleted_successfully'));
    }
}

