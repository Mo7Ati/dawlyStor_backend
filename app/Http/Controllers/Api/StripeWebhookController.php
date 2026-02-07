<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    /**
     * POST /api/stripe/webhook
     *
     * Handle incoming Stripe webhook events for checkout sessions.
     */
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('cashier.webhook.secret');

        // 1. Verify the webhook signature
        try {
            Stripe::setApiKey(config('cashier.secret'));
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe webhook signature verification failed.', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\UnexpectedValueException $e) {
            Log::warning('Stripe webhook payload invalid.', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        // 2. Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $this->handleSessionCompleted($event->data->object);
                break;

            case 'checkout.session.expired':
                $this->handleSessionExpired($event->data->object);
                break;

            default:
                Log::info("Stripe webhook received unhandled event: {$event->type}");
                break;
        }

        return response()->json(['status' => 'ok'], 200);
    }

    /**
     * Handle checkout.session.completed -- mark all related orders as paid.
     */
    protected function handleSessionCompleted(object $session): void
    {
        $stripeSessionId = $session->id;

        $orders = Order::where('stripe_session_id', $stripeSessionId)->get();

        if ($orders->isEmpty()) {
            Log::warning("Stripe webhook: No orders found for session {$stripeSessionId}");
            return;
        }

        /** @var Order $order */
        foreach ($orders as $order) {
            // Idempotency: only update if currently unpaid
            if ($order->payment_status === PaymentStatusEnum::PAID->value) {
                Log::info("Stripe webhook: Order #{$order->id} already marked as paid. Skipping.");
                continue;
            }

            $order->update([
                'payment_status' => PaymentStatusEnum::PAID->value,
                'status' => OrderStatusEnum::PREPARING->value,
            ]);

            Log::info("Stripe webhook: Order #{$order->id} marked as paid.");
        }
    }

    /**
     * Handle checkout.session.expired -- mark all related orders as cancelled.
     */
    protected function handleSessionExpired(object $session): void
    {
        $stripeSessionId = $session->id;

        $orders = Order::where('stripe_session_id', $stripeSessionId)->get();

        if ($orders->isEmpty()) {
            Log::warning("Stripe webhook: No orders found for expired session {$stripeSessionId}");
            return;
        }

        /** @var Order $order */
        foreach ($orders as $order) {
            // Idempotency: don't override if already paid or already cancelled
            if (in_array($order->payment_status, [PaymentStatusEnum::PAID->value, PaymentStatusEnum::REFUNDED->value])) {
                Log::info("Stripe webhook: Order #{$order->id} has payment_status={$order->payment_status}. Skipping expiration.");
                continue;
            }

            $order->update([
                'payment_status' => PaymentStatusEnum::FAILED->value,
                'status' => OrderStatusEnum::CANCELLED->value,
                'cancelled_reason' => 'Payment session expired.',
            ]);

            Log::info("Stripe webhook: Order #{$order->id} cancelled due to session expiration.");
        }
    }
}
