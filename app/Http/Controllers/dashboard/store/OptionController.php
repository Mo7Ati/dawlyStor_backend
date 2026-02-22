<?php

namespace App\Http\Controllers\dashboard\store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\OptionRequest;
use App\Http\Resources\OptionResource;
use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OptionController extends Controller
{
    public function index(Request $request)
    {
        $options = Option::query()
            ->where('store_id', Auth::guard('store')->id())
            ->applyFilters($request)
            ->paginate($request->input('per_page', 10))
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

        $validated = $request->validated();
        $validated['store_id'] = Auth::guard('store')->id();

        Option::create($validated);

        Inertia::flash('success', __('messages.created_successfully'));
        return to_route('store.options.index');
    }

    public function edit(Request $request, $id)
    {
        $option = Option::query()
            ->where('store_id', Auth::guard('store')->id())
            ->findOrFail($id);

        return Inertia::render('store/options/edit', [
            'option' => OptionResource::make($option)->serializeForForm(),
        ]);
    }

    public function update(OptionRequest $request, $id)
    {
        Option::query()
            ->where('store_id', Auth::guard('store')->id())
            ->findOrFail($id)
            ->update($request->validated());

        Inertia::flash('success', __('messages.updated_successfully'));
        return to_route('store.options.index');
    }

    public function destroy(Request $request, $id)
    {

        Option::query()
            ->where('store_id', Auth::guard('store')->id())
            ->findOrFail($id)
            ->delete();

        Inertia::flash('success', __('messages.deleted_successfully'));
        return to_route('store.options.index');
    }
}

