<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('Your vendor account credentials') }}</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .credentials {
            background: #f5f5f5;
            padding: 1em;
            border-radius: 6px;
            margin: 1em 0;
        }

        .credentials p {
            margin: 0.5em 0;
        }

        .note {
            margin-top: 1.5em;
            padding-top: 1em;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>

<body>
    <p>{{ __('Hello') }},</p>

    <p>{{ __('Your vendor store account has been created. Use the credentials below to log in. You will be asked to complete your store profile before adding products.') }}</p>

    <div class="credentials">
        <p><strong>{{ __('Login URL') }}:</strong> <a href="{{ url('/store/login') }}">{{ url('/store/login') }}</a></p>
        <p><strong>{{ __('Email') }}:</strong> {{ $store->email }}</p>
        <p><strong>{{ __('Temporary password') }}:</strong> {{ $temporaryPassword }}</p>
    </div>

    <p>{{ __('We recommend changing your password after your first login. You can do this from the store dashboard settings or use the "Forgot password" link on the login page.') }}</p>

    <div class="note">
        <p>{{ __('Store name') }}: {{ is_array($store->name) ? ($store->name['en'] ?? reset($store->name)) : $store->name }}</p>
    </div>
</body>

</html>
