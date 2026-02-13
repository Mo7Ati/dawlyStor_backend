<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\OptionRequest;
use App\Http\Resources\OptionResource;
use App\Models\Option;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OptionController extends Controller
{
    public function index(Request $request)
    {
        $store = $request->user('store');

        $options = Option::query()
            ->where('store_id', $store->id)
            ->search($request->get('tableSearch'))
            ->when($request->get('is_active') !== null, function ($query) use ($request) {
                $query->where('is_active', $request->get('is_active'));
            })
            ->orderBy($request->get('sort', 'id'), $request->get('direction', 'desc'))
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('store/options/index', [
            'options' => OptionResource::collection($options),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('store/options/create', [
            'option' => OptionResource::make(new Option())->serializeForForm(),
        ]);
    }

    public function store(OptionRequest $request)
    {
        $store = $request->user('store');

        $validated = $request->validated();
        $validated['store_id'] = $store->id;

        Option::create($validated);

        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('store.options.index');
    }

    public function edit(Request $request, Option $option)
    {
        $store = $request->user('store');

        // Ensure the option belongs to the store
        if ($option->store_id !== $store->id) {
            abort(403);
        }

        return Inertia::render('store/options/edit', [
            'option' => OptionResource::make($option)->serializeForForm(),
        ]);
    }

    public function update(OptionRequest $request, Option $option)
    {
        $store = $request->user('store');

        // Ensure the option belongs to the store
        if ($option->store_id !== $store->id) {
            abort(403);
        }

        $validated = $request->validated();
        $option->update($validated);

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('store.options.index');
    }

    public function destroy(Option $option)
    {
        $store = request()->user('store');

        // Ensure the option belongs to the store
        if ($option->store_id !== $store->id) {
            abort(403);
        }

        $option->delete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('store.options.index');
    }
}

