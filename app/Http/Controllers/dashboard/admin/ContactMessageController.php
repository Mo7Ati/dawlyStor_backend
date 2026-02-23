<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactMessageReplyRequest;
use App\Http\Resources\ContactMessageResource;
use App\Mail\ContactReplyMail;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = ContactMessage::query()
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/contact-messages/index', [
            'contactMessages' => ContactMessageResource::collection($messages),
        ]);
    }

    public function show(ContactMessage $contact_message)
    {
        if (! $contact_message->read_at) {
            $contact_message->update(['read_at' => now()]);
        }

        return Inertia::render('admin/contact-messages/show', [
            'contactMessage' => new ContactMessageResource($contact_message->fresh()),
        ]);
    }

    public function markAsRead(ContactMessage $contact_message)
    {
        $contact_message->update(['read_at' => now()]);

        return back()->with('success', __('Contact message marked as read.'));
    }

    public function reply(ContactMessageReplyRequest $request, ContactMessage $contact_message)
    {
        Mail::to($contact_message->email)->send(
            new ContactReplyMail($contact_message, $request->validated('reply_message'))
        );

        $contact_message->update(['replied_at' => now()]);

        return back()->with('success', __('Reply sent successfully.'));
    }
}
