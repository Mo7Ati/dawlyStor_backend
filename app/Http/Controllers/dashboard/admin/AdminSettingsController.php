<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\AdminProfileUpdateRequest;
use App\Http\Requests\Settings\PlatformFeesUpdateRequest;
use App\Http\Resources\AdminResource;
use App\Settings\PaymentsSettings;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingsController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function profile(Request $request): Response
    {
        return Inertia::render('admin/settings/profile', [
            'admin' => Auth::guard('admin')->user(),
            'mustVerifyEmail' => true,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function profileUpdate(AdminProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at ? $request->user()->email_verified_at = null : null;
        }

        $request->user()->save();

        return to_route('admin.settings.profile');
    }

    /**
     * Show the platform fees (commission, delivery fee, tax) settings page.
     */
    public function platformFees(PaymentsSettings $paymentsSettings): Response
    {
        return Inertia::render('admin/settings/platform-fees', [
            'settings' => [
                'platform_fee_percentage' => $paymentsSettings->platform_fee_percentage,
                'delivery_fee' => $paymentsSettings->delivery_fee,
                'tax_percentage' => $paymentsSettings->tax_percentage,
            ],
        ]);
    }

    /**
     * Update the platform fees settings.
     */
    public function platformFeesUpdate(PlatformFeesUpdateRequest $request, PaymentsSettings $paymentsSettings): RedirectResponse
    {
        $paymentsSettings->platform_fee_percentage = (float) $request->validated('platform_fee_percentage');
        $paymentsSettings->delivery_fee = (float) $request->validated('delivery_fee');
        $paymentsSettings->tax_percentage = (float) $request->validated('tax_percentage');
        $paymentsSettings->save();

        Inertia::flash('success', __('settings.platform_fees.saved'));
        return to_route('admin.settings.platform-fees');
    }
}
