<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * Get the authenticated customer's orders, grouped by checkout (one payment = one group = one order per store).
     */
    public function orders(Request $request)
    {
        $customer = auth('sanctum')->user();

        $orders = $customer->orders()
            ->with(['store', 'items.product', 'address'])
            ->orderByDesc('created_at')
            ->get();

        $groups = $orders->groupBy('checkout_group_id')->map(function ($groupOrders, $checkoutGroupId) {
            $first = $groupOrders->first();
            return [
                'checkout_group_id' => $checkoutGroupId,
                'created_at' => $groupOrders->min('created_at')?->format('Y-m-d'),
                'group_total' => round($groupOrders->sum('total'), 2),
                'payment_status' => $first?->payment_status,
                'orders_count' => $groupOrders->count(),
                'orders' => OrderResource::collection($groupOrders)->resolve(),
            ];
        })->values();

        return successResponse(
            ['groups' => $groups],
            'Customer orders retrieved successfully.',
        );
    }

    public function show()
    {
        $customer = auth('sanctum')->user();

        return successResponse(
            $customer ? CustomerResource::make($customer) : null,
            'Customer profile fetched successfully.',
        );
    }

    public function update(Request $request)
    {
        $customer = auth('sanctum')->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('customers')->ignore($customer->id)],
            'phone_number' => ['required', 'string', 'max:255', Rule::unique('customers')->ignore($customer->id)],
        ]);

        $customer->update($validated);

        return successResponse(
            new CustomerResource($customer),
            'Customer profile updated successfully.',
        );
    }
}
