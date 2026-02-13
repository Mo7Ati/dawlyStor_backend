<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\AdditionRequest;
use App\Http\Resources\AdditionResource;
use App\Models\Addition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdditionController extends Controller
{
    public function index(Request $request)
    {
        $store = $request->user('store');

        $additions = Addition::query()
            ->where('store_id', $store->id)
            ->search($request->get('tableSearch'))
            ->when($request->get('is_active') !== null, function ($query) use ($request) {
                $query->where('is_active', $request->get('is_active'));
            })
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('store/additions/index', [
            'additions' => AdditionResource::collection($additions),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('store/additions/create', [
            'addition' => AdditionResource::make(new Addition())->serializeForForm(),
        ]);
    }

    public function store(AdditionRequest $request)
    {
        $store = $request->user('store');

        $validated = $request->validated();
        $validated['store_id'] = $store->id;

        Addition::create($validated);

        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('store.additions.index');
    }

    public function edit(Request $request, Addition $addition)
    {
        $store = $request->user('store');

        // Ensure the addition belongs to the store
        if ($addition->store_id !== $store->id) {
            abort(403);
        }

        return Inertia::render('store/additions/edit', [
            'addition' => AdditionResource::make($addition)->serializeForForm(),
        ]);
    }

    public function update(AdditionRequest $request, Addition $addition)
    {
        $store = $request->user('store');

        // Ensure the addition belongs to the store
        if ($addition->store_id !== $store->id) {
            abort(403);
        }

        $validated = $request->validated();
        $addition->update($validated);

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('store.additions.index');
    }

    public function destroy(Addition $addition)
    {
        $store = request()->user('store');

        // Ensure the addition belongs to the store
        if ($addition->store_id !== $store->id) {
            abort(403);
        }

        $addition->delete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('store.additions.index');
    }
}

