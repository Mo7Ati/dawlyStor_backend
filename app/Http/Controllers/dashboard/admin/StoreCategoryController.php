<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreCategoryRequest;
use App\Http\Resources\StoreCategoryResource;
use App\Models\StoreCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreCategoryController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), 'viewAny', StoreCategory::class);

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
        $this->authorize('create', StoreCategory::class);

        return Inertia::render('admin/store-categories/create', [
            'category' => StoreCategoryResource::make(new StoreCategory())->serializeForForm(),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $this->authorizeForUser($request->user('admin'), 'create', StoreCategory::class);

        $category = StoreCategory::create($request->validated());
        syncMedia($request, $category, 'store-categories');
        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('admin.store-categories.index');
    }

    public function edit($id)
    {
        $category = StoreCategory::findOrFail($id);
        $this->authorize('update', $category);

        return Inertia::render('admin/store-categories/edit', [
            'category' => StoreCategoryResource::make($category)->serializeForForm(),
        ]);
    }

    public function update($id, StoreCategoryRequest $request)
    {
        $category = StoreCategory::findOrFail($id);
        $this->authorizeForUser($request->user('admin'), 'update', $category);
        $category->update($request->validated());

        syncMedia($request, $category, 'store-categories');

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('admin.store-categories.index');
    }

    public function destroy($id)
    {
        $category = StoreCategory::findOrFail($id);
        $this->authorize('delete', $category);
        $category->delete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('admin.store-categories.index');
    }
}

