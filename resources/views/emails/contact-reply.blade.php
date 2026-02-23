<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Re: {{ $contactMessage->subject }}</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 1.5em;
        }

        .reply {
            background: #f5f5f5;
            padding: 1em;
            border-radius: 6px;
            margin-top: 1em;
            white-space: pre-wrap;
        }

        .original {
            margin-top: 1.5em;
            padding-top: 1em;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>

<body>
    <p>Hello {{ $contactMessage->first_name }},</p>

    <p>Thank you for contacting us. Here is our reply to your message:</p>

    <div class="reply">{{ $replyBody }}</div>

    <div class="original">
        <p><strong>Your original message ({{ $contactMessage->created_at->format('M j, Y') }}):</strong></p>
        <p><strong>Subject:</strong> {{ $contactMessage->subject }}</p>
        <p>{{ $contactMessage->message }}</p>
    </div>
</body>

</html>
