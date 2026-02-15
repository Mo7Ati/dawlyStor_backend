<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\TransactionsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct(
        protected TransactionsService $transactionsService,
    ) {
    }

    /**
     * POST /api/stripe/webhook
     *
     * Handle incoming Stripe webhook events for checkout sessions.
     */
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('checkout.webhook_secret');

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

        // Log every webhook event
        Log::info('Stripe webhook received', [
            'event_id' => $event->id ?? null,
            'event_type' => $event->type,
            'object_id' => $event->data->object->id ?? null,
        ]);

        // 2. Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $this->handleSessionCompleted($event->data->object);
                break;

            case 'checkout.session.expired':
                $this->handleSessionExpired($event->data->object);
                break;

            default:
                Log::info('Stripe webhook unhandled event type', ['event_type' => $event->type]);
                break;
        }

        return response()->json(['status' => 'ok'], 200);
    }

    /**
     * Handle checkout.session.completed -- mark all related orders as paid.
     */
    protected function handleSessionCompleted(object $session): void
    {
        Log::info('Stripe webhook: checkout.session.completed received', [
            'session_id' => $session->id ?? null,
            'customer' => $session->customer ?? null,
            'amount_total' => $session->amount_total ?? null,
        ]);

        $stripeSessionId = $session->id;

        $orders = Order::where('stripe_session_id', $stripeSessionId)->get();

        if ($orders->isEmpty()) {
            Log::warning("Stripe webhook: No orders found for session {$stripeSessionId}");
            return;
        }

        Log::info('Stripe webhook: orders found for session', [
            'session_id' => $stripeSessionId,
            'order_ids' => $orders->pluck('id')->all(),
        ]);

        /** @var Order $order */
        foreach ($orders as $order) {
            // Idempotency: only process if currently unpaid
            if ($order->payment_status === PaymentStatusEnum::PAID->value) {
                Log::info("Stripe webhook: Order #{$order->id} already marked as paid. Skipping.");
                continue;
            }

            Log::info('Stripe webhook: processing order before payment handling', [
                'order_id' => $order->id,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total' => $order->total,
                'store_id' => $order->store_id,
            ]);

            // Mark order as preparing and let TransactionsService handle wallet deposits + payment_status
            $order->update([
                'status' => OrderStatusEnum::PREPARING->value,
            ]);

            try {
                $this->transactionsService->handleOrderPaid($order);
            } catch (\Throwable $e) {
                Log::error('Stripe webhook: handleOrderPaid failed', [
                    'order_id' => $order->id,
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                // Do not rethrow to avoid Stripe retry storm; just log.
                continue;
            }

            Log::info("Stripe webhook: Order #{$order->id} marked as paid and wallets updated.");
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
