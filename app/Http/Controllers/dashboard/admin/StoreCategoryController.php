<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Enums\PermissionsEnum;
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
        abort_unless($request->user('admin')->can(PermissionsEnum::STORE_CATEGORIES_INDEX->value), 403);

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
        abort_unless(request()->user('admin')->can(PermissionsEnum::STORE_CATEGORIES_CREATE->value), 403);

        return Inertia::render('admin/store-categories/create', [
            'category' => StoreCategoryResource::make(new StoreCategory())->serializeForForm(),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        abort_unless($request->user('admin')->can(PermissionsEnum::STORE_CATEGORIES_CREATE->value), 403);

        $category = StoreCategory::create($request->validated());
        syncMedia($request, $category, 'store-categories');
        return to_route('admin.store-categories.index')->with('success', __('messages.created_successfully'));
    }

    public function edit($id)
    {
        abort_unless(request()->user('admin')->can(PermissionsEnum::STORE_CATEGORIES_UPDATE->value), 403);

        $category = StoreCategory::findOrFail($id);
        return Inertia::render('admin/store-categories/edit', [
            'category' => StoreCategoryResource::make($category)->serializeForForm(),
        ]);
    }

    public function update($id, StoreCategoryRequest $request)
    {
        abort_unless($request->user('admin')->can(PermissionsEnum::STORE_CATEGORIES_UPDATE->value), 403);

        $category = StoreCategory::findOrFail($id);
        $category->update($request->validated());

        syncMedia($request, $category, 'store-categories');

        return redirect()
            ->route('admin.store-categories.index')
            ->with('success', __('messages.updated_successfully'));
    }

    public function destroy($id)
    {
        abort_unless(request()->user('admin')->can(PermissionsEnum::STORE_CATEGORIES_DESTROY->value), 403);

        StoreCategory::destroy($id);

        return redirect()
            ->route('admin.store-categories.index')
            ->with('success', __('messages.deleted_successfully'));
    }
}

