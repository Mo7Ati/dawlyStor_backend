<?php

namespace App\Console\Commands;

use App\Mail\ContactReplyMail;
use App\Models\ContactMessage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the email service';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $contactMessage = ContactMessage::firstOrCreate([
            'email' => 'mo7.dawly@gmail.com',
        ], [
            'first_name' => 'Mohamed',
            'last_name' => 'Dawly',
            'subject' => 'Test email',
            'message' => 'This is a test email',
        ]);

        Mail::to($contactMessage->email)->send(
            new ContactReplyMail($contactMessage, 'test')
        );

        $this->info('Email sent successfully');
    }
}
