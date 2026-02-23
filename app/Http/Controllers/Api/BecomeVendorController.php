<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BecomeVendorRequest;
use App\Mail\StoreCredentialsMail;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class BecomeVendorController extends Controller
{
    /**
     * Create a minimal store and send credentials by email (public).
     */
    public function store(BecomeVendorRequest $request): JsonResponse
    {
        $password = Str::password(12);

        $store = Store::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $password,
            'is_active' => true,
            'profile_completed_at' => null,
        ]);

        Mail::to($store->email)->queue(new StoreCredentialsMail($store, $password));

        return successResponse(
            [],
            __('Application received. Check your email for login details.'),
            201,
        );
    }
}
