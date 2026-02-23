<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ContactMessageStoreRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * POST /api/contact
     *
     * Store a contact form submission (public, no auth).
     */
    public function store(ContactMessageStoreRequest $request): JsonResponse
    {
        $message = ContactMessage::create($request->validated());

        return successResponse(
            ['id' => $message->id],
            'Message sent successfully.',
            201,
        );
    }
}
