<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AddressRequest;
use App\Http\Resources\AddressResource;
use Illuminate\Http\JsonResponse;

class AddressController extends Controller
{
    /**
     * GET /api/customer/addresses
     *
     * List all addresses for the authenticated customer.
     */
    public function index(): JsonResponse
    {
        $customer = auth('sanctum')->user();

        $addresses = $customer->addresses()->latest()->get();

        return successResponse(
            AddressResource::collection($addresses),
            'Addresses fetched successfully.',
        );
    }

    /**
     * POST /api/customer/addresses
     *
     * Create a new address for the authenticated customer.
     */
    public function store(AddressRequest $request): JsonResponse
    {
        $customer = auth('sanctum')->user();

        $address = $customer->addresses()->create($request->validated());

        return successResponse(
            new AddressResource($address),
            'Address created successfully.',
            201,
        );
    }

    /**
     * GET /api/customer/addresses/{id}
     *
     * Show a single address belonging to the authenticated customer.
     */
    public function show(int $id): JsonResponse
    {
        $customer = auth('sanctum')->user();

        $address = $customer->addresses()->findOrFail($id);

        return successResponse(
            new AddressResource($address),
            'Address fetched successfully.',
        );
    }

    /**
     * PUT /api/customer/addresses/{id}
     *
     * Update an existing address belonging to the authenticated customer.
     */
    public function update(AddressRequest $request, int $id): JsonResponse
    {
        $customer = auth('sanctum')->user();

        $address = $customer->addresses()->findOrFail($id);

        $address->update($request->validated());

        return successResponse(
            new AddressResource($address->fresh()),
            'Address updated successfully.',
        );
    }

    /**
     * DELETE /api/customer/addresses/{id}
     *
     * Soft-delete an address belonging to the authenticated customer.
     */
    public function destroy(int $id): JsonResponse
    {
        $customer = auth('sanctum')->user();

        $address = $customer->addresses()->findOrFail($id);

        $address->delete();

        return successResponse(
            null,
            'Address deleted successfully.',
        );
    }
}
