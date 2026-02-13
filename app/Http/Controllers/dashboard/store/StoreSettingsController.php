<?php

namespace App\Http\Controllers\dashboard\store;


use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreRequest;
use App\Http\Resources\StoreResource;
use App\Models\StoreCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StoreSettingsController extends Controller
{
    public function profile(Request $request)
    {
        return Inertia::render('store/settings/profile', [
            'store' => StoreResource::make(Auth::guard('store')->user())->serializeForForm(),
            'storeCategories' => StoreCategory::all()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            }),
        ]);
    }

    public function profileUpdate(StoreRequest $request)
    {
        $data = $request->validated();
        $store = Auth::guard('store')->user();
        $store->update($data);

        syncMedia($request, $store, 'store-logos');

        Inertia::flash('success', __('messages.updated_successfully'));
        return redirect()->back();
    }
}
