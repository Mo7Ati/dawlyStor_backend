<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Checkout Success URL
    |--------------------------------------------------------------------------
    |
    | The URL Stripe redirects to after successful payment.
    | {CHECKOUT_SESSION_ID} is replaced by Stripe with the actual session ID.
    |
    */
    'success_url' => env('CHECKOUT_SUCCESS_URL', 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}'),

    /*
    |--------------------------------------------------------------------------
    | Checkout Cancel URL
    |--------------------------------------------------------------------------
    |
    | The URL Stripe redirects to when the customer cancels payment.
    |
    */
    'cancel_url' => env('CHECKOUT_CANCEL_URL', 'http://localhost:3000/checkout/cancel'),

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | The currency used for Stripe Checkout Sessions.
    | Falls back to the Cashier currency configuration.
    |
    */
    'currency' => env('CHECKOUT_CURRENCY', 'usd'),

    'webhook_secret' => env('CHECKOUT_WEBHOOK_SECRET'),
];
