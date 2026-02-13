<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreRequest;
use App\Http\Resources\StoreCategoryResource;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Models\StoreCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), 'viewAny', Store::class);

        $stores = Store::query()
            ->with('category')
            ->search($request->get('tableSearch'))
            ->when($request->get('is_active') !== null, function ($query) use ($request) {
                $query->where('is_active', $request->get('is_active'));
            })
            ->when($request->get('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->get('category_id'));
            })
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/stores/index', [
            'stores' => StoreResource::collection($stores),
            'categories' => StoreCategoryResource::collection(StoreCategory::all()),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Store::class);

        return Inertia::render('admin/stores/create', [
            'store' => StoreResource::make(new Store())->serializeForForm(),
            'categories' => StoreCategoryResource::collection(StoreCategory::all()),
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->authorizeForUser($request->user('admin'), 'create', Store::class);

        $store = Store::create($request->validated());
        syncMedia($request, $store, 'store-logos');
        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('admin.stores.index');
    }

    public function edit($id)
    {
        $store = Store::findOrFail($id);
        $this->authorize('update', $store);
        return Inertia::render('admin/stores/edit', [
            'store' => StoreResource::make($store)->serializeForForm(),
            'categories' => StoreCategoryResource::collection(StoreCategory::all()),
            'logo' => $store->getFirstMediaUrl('logo'),
        ]);
    }

    public function update($id, StoreRequest $request)
    {
        $validated = $request->validated();
        $store = Store::findOrFail($id);
        $this->authorizeForUser($request->user('admin'), 'update', $store);

        syncMedia($request, $store, 'store-logos');

        $store->update($validated);

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('admin.stores.index');
    }

    public function destroy($id)
    {
        $store = Store::findOrFail($id);
        $this->authorize('delete', $store);
        $store->delete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('admin.stores.index');
    }
}

