<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CheckoutRequest;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function __construct(
        protected CheckoutService $checkoutService
    ) {
    }

    /**
     * POST /api/customer/checkout
     *
     * Create orders per store and return a Stripe Checkout URL.
     */
    public function store(CheckoutRequest $request)
    {
        /** @var \App\Models\Customer $customer */
        $customer = auth('sanctum')->user();

        try {
            $result = $this->checkoutService->checkout($customer, $request->validated());
            return successResponse([
                'checkout_url' => $result['checkout_url'],
                // 'order_ids' => $result['order_ids'],
                // 'checkout_group_id' => $result['checkout_group_id'],
            ], 'Checkout session created successfully.');

        } catch (ValidationException $e) {
            return errorResponse($e->getMessage(), 422);

        } catch (\Stripe\Exception\ApiErrorException $e) {
            report($e);
            return errorResponse('Payment service is currently unavailable. Please try again.', 503);

        } catch (\Throwable $e) {
            dd($e);
            report($e);
            return errorResponse('Something went wrong during checkout. Please try again.', 500);
        }
    }
}
