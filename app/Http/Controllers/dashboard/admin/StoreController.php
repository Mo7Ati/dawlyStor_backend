<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreRequest;
use App\Http\Resources\StoreCategoryResource;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Models\StoreCategory;
use App\Models\TempMedia;
use App\Traits\MediaSyncTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class StoreController extends Controller
{
    use MediaSyncTrait;
    public function index(Request $request)
    {
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
        return Inertia::render('admin/stores/create', [
            'store' => StoreResource::make(new Store())->serializeForForm(),
            'categories' => StoreCategoryResource::collection(StoreCategory::all()),
        ]);
    }

    public function store(StoreRequest $request)
    {
        $store = Store::create($request->validated());
        $this->storeMedia($request, $store, 'logo');
        return to_route('admin.stores.index')->with('success', __('messages.created_successfully'));
    }

    // public function show($id)
    // {
    //     $store = Store::with(['category', 'media'])->findOrFail($id);
    //     return Inertia::render('admin/stores/show', [
    //         'store' => new StoreResource($store),
    //         'categories' => StoreCategoryResource::collection(StoreCategory::all()),
    //     ]);
    // }

    public function edit($id)
    {
        $store = Store::findOrFail($id);
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

        $this->storeMedia($request, $store, 'logo');
        $store->update($validated);

        return redirect()
            ->route('admin.stores.index')
            ->with('success', __('messages.updated_successfully'));
    }

    public function destroy($id)
    {
        Store::destroy($id);

        return redirect()
            ->route('admin.stores.index')
            ->with('success', __('messages.deleted_successfully'));
    }
}

