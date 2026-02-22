<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\AdditionRequest;
use App\Http\Resources\AdditionResource;
use App\Models\Addition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdditionController extends Controller
{
    public function index(Request $request)
    {
        $store = $request->user('store');

        $additions = Addition::query()
            ->where('store_id', $store->id)
            ->applyFilters($request)
            ->paginate($request->input('per_page', 10))
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

    public function edit(Request $request, $id)
    {
        $addition = Addition::query()
            ->where('store_id', Auth::guard('store')->id())
            ->findOrFail($id);

        return Inertia::render('store/additions/edit', [
            'addition' => AdditionResource::make($addition)->serializeForForm(),
        ]);
    }

    public function update(AdditionRequest $request, $id)
    {
        $addition = Addition::query()
            ->where('store_id', Auth::guard('store')->id())
            ->findOrFail($id);

        $addition->update($request->validated());

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('store.additions.index');
    }

    public function destroy(Request $request, $id)
    {
        $addition = Addition::query()
            ->where('store_id', Auth::guard('store')->id())
            ->findOrFail($id)
            ->delete();


        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('store.additions.index');
    }
}

