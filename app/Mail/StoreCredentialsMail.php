<?php

namespace App\Mail;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StoreCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Store $store,
        public string $temporaryPassword
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('Your vendor account credentials'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.store-credentials',
        );
    }
}
