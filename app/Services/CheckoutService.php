<?php

namespace App\Services;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\Address;
use App\Models\Customer;
use App\Models\Order;
use App\Models\orderItems;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class CheckoutService
{
    /**
     * Process checkout: validate items, create orders per store, create Stripe session.
     *
     * @param  Customer  $customer
     * @param  array     $validated  The validated request data (items, address_id, notes)
     * @return array     ['checkout_url' => string, 'order_ids' => array, 'checkout_group_id' => string]
     *
     * @throws ValidationException
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function checkout(Customer $customer, array $validated): array
    {
        $items = $validated['items'];
        $addressId = $validated['address_id'];
        $notes = $validated['notes'] ?? null;

        // 1. Load and validate all products with their options and additions
        $productIds = collect($items)->pluck('product_id')->unique()->toArray();

        $products = Product::with(['options', 'additions'])
            ->whereIn('id', $productIds)
            ->where('is_active', true)
            ->get()
            ->keyBy('id');


        $this->validateCartItems($items, $products);

        // 3. Group items by store_id
        $groupedByStore = collect($items)->groupBy('store_id');

        // 4. Generate a checkout group ID to link all orders
        $checkoutGroupId = (string) Str::uuid();

        // 5. Create orders and items inside a transaction
        $orders = DB::transaction(function () use ($groupedByStore, $customer, $addressId, $notes, $checkoutGroupId, $products) {
            $createdOrders = [];

            foreach ($groupedByStore as $storeId => $storeItems) {
                $totalItemsAmount = 0;
                $orderItemsData = [];

                foreach ($storeItems as $item) {
                    /** @var Product $product */
                    $product = $products[$item['product_id']];
                    $itemTotal = $this->calculateItemTotal($item, $product);
                    $totalItemsAmount += $itemTotal;

                    // Calculate the per-unit price (base + options + additions)
                    $unitPrice = $this->calculateUnitPrice($item, $product);

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'unit_price' => $unitPrice,
                        'quantity' => $item['quantity'],
                        'product_data' => $this->buildProductSnapshot($item, $product),
                    ];
                }

                $address = Address::findOrFail($addressId);

                // Create the order
                $order = Order::create([
                    'status' => OrderStatusEnum::PENDING->value,
                    'payment_status' => PaymentStatusEnum::UNPAID->value,
                    'customer_id' => $customer->id,
                    'customer_data' => $customer->toArray(),
                    'store_id' => $storeId,
                    'address_id' => $addressId,
                    'address_data' => $address->toArray(),
                    'total' => $totalItemsAmount,
                    'total_items_amount' => $totalItemsAmount,
                    'delivery_amount' => 0,
                    'tax_amount' => 0,
                    'notes' => $notes,
                    'checkout_group_id' => $checkoutGroupId,
                ]);

                // Create order items
                foreach ($orderItemsData as $orderItemData) {
                    $orderItemData['order_id'] = $order->id;
                    orderItems::create($orderItemData);
                }

                $createdOrders[] = $order;
            }

            return $createdOrders;
        });

        // 6. Create Stripe Checkout Session
        $stripeSession = $this->createStripeSession(
            $orders,
            $items,
            $products,
            $customer,
            $checkoutGroupId
        );

        // 7. Save stripe_session_id on all orders
        $orderIds = collect($orders)->pluck('id')->toArray();

        Order::whereIn('id', $orderIds)->update([
            'stripe_session_id' => $stripeSession->id,
        ]);

        return [
            'checkout_url' => $stripeSession->url,
            'order_ids' => $orderIds,
            'checkout_group_id' => $checkoutGroupId,
        ];
    }

    /**
     * Validate cart items against database products, options, and additions.
     *
     * @throws ValidationException
     */
    protected function validateCartItems(array $items, $products): void
    {
        $errors = [];

        foreach ($items as $index => $item) {
            $product = $products[$item['product_id']] ?? null;
            // Product must exist and be active
            if (!$product) {
                $errors["items.{$index}.product_id"] = "Product #{$item['product_id']} is not available.";
                continue;
            }

            // Product must belong to the claimed store
            if ((int) $product->store_id !== (int) $item['store_id']) {
                $errors["items.{$index}.store_id"] = "Product #{$item['product_id']} does not belong to store #{$item['store_id']}.";
            }

            // Base price must match (using float comparison with tolerance)
            if (abs((float) $product->price - (float) $item['unit_price']) > 0.01) {
                $errors["items.{$index}.unit_price"] = "Price mismatch for product #{$item['product_id']}. Expected {$product->price}, got {$item['unit_price']}.";
            }

            // Validate selected options
            if (!empty($item['selected_options'])) {
                $productOptionIds = $product->options->pluck('id')->toArray();

                foreach ($item['selected_options'] as $optIdx => $selectedOption) {
                    $optionId = $selectedOption['option_id'];

                    if (!in_array($optionId, $productOptionIds)) {
                        $errors["items.{$index}.selected_options.{$optIdx}.option_id"] =
                            "Option #{$optionId} is not available for product #{$item['product_id']}.";
                        continue;
                    }

                    // Verify option price
                    $pivotOption = $product->options->firstWhere('id', $optionId);
                    $dbPrice = (float) $pivotOption->pivot->price;

                    if (abs($dbPrice - (float) $selectedOption['price']) > 0.01) {
                        $errors["items.{$index}.selected_options.{$optIdx}.price"] =
                            "Price mismatch for option #{$optionId}. Expected {$dbPrice}, got {$selectedOption['price']}.";
                    }
                }
            }

            // Validate selected additions
            if (!empty($item['selected_additions'])) {
                $productAdditionIds = $product->additions->pluck('id')->toArray();

                foreach ($item['selected_additions'] as $addIdx => $selectedAddition) {
                    $additionId = $selectedAddition['addition_id'];

                    if (!in_array($additionId, $productAdditionIds)) {
                        $errors["items.{$index}.selected_additions.{$addIdx}.addition_id"] =
                            "Addition #{$additionId} is not available for product #{$item['product_id']}.";
                        continue;
                    }

                    // Verify addition price
                    $pivotAddition = $product->additions->firstWhere('id', $additionId);
                    $dbPrice = (float) $pivotAddition->pivot->price;

                    if (abs($dbPrice - (float) $selectedAddition['price']) > 0.01) {
                        $errors["items.{$index}.selected_additions.{$addIdx}.price"] =
                            "Price mismatch for addition #{$additionId}. Expected {$dbPrice}, got {$selectedAddition['price']}.";
                    }
                }
            }

            // Check stock quantity
            if ($product->quantity !== null && $item['quantity'] > $product->quantity) {
                $errors["items.{$index}.quantity"] =
                    "Insufficient stock for product #{$item['product_id']}. Available: {$product->quantity}, requested: {$item['quantity']}.";
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * Calculate the per-unit price for a cart item (base price + options + additions).
     */
    protected function calculateUnitPrice(array $item, Product $product): float
    {
        $unitPrice = (float) $product->price;

        if (!empty($item['selected_options'])) {
            foreach ($item['selected_options'] as $selectedOption) {
                $pivotOption = $product->options->firstWhere('id', $selectedOption['option_id']);
                $unitPrice += $pivotOption ? (float) $pivotOption->pivot->price : 0;
            }
        }

        if (!empty($item['selected_additions'])) {
            foreach ($item['selected_additions'] as $selectedAddition) {
                $pivotAddition = $product->additions->firstWhere('id', $selectedAddition['addition_id']);
                $unitPrice += $pivotAddition ? (float) $pivotAddition->pivot->price : 0;
            }
        }

        return $unitPrice;
    }

    /**
     * Calculate the total for a single cart item (base price + options + additions) * quantity.
     */
    protected function calculateItemTotal(array $item, Product $product): float
    {
        $unitPrice = (float) $product->price;

        // Add option prices
        $optionsTotal = 0;
        if (!empty($item['selected_options'])) {
            foreach ($item['selected_options'] as $selectedOption) {
                $pivotOption = $product->options->firstWhere('id', $selectedOption['option_id']);
                $optionsTotal += $pivotOption ? (float) $pivotOption->pivot->price : 0;
            }
        }

        // Add addition prices
        $additionsTotal = 0;
        if (!empty($item['selected_additions'])) {
            foreach ($item['selected_additions'] as $selectedAddition) {
                $pivotAddition = $product->additions->firstWhere('id', $selectedAddition['addition_id']);
                $additionsTotal += $pivotAddition ? (float) $pivotAddition->pivot->price : 0;
            }
        }

        return ($unitPrice + $optionsTotal + $additionsTotal) * (int) $item['quantity'];
    }

    /**
     * Build a product data snapshot for the order item (for historical record).
     */
    protected function buildProductSnapshot(array $item, Product $product): array
    {
        $snapshot = [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'store_id' => $product->store_id,
        ];

        if (!empty($item['selected_options'])) {
            $snapshot['options'] = collect($item['selected_options'])->map(function ($opt) use ($product) {
                $pivotOption = $product->options->firstWhere('id', $opt['option_id']);
                return [
                    'option_id' => $opt['option_id'],
                    'name' => $pivotOption ? $pivotOption->name : null,
                    'price' => (float) $opt['price'],
                ];
            })->toArray();
        }

        if (!empty($item['selected_additions'])) {
            $snapshot['additions'] = collect($item['selected_additions'])->map(function ($add) use ($product) {
                $pivotAddition = $product->additions->firstWhere('id', $add['addition_id']);
                return [
                    'addition_id' => $add['addition_id'],
                    'name' => $pivotAddition ? $pivotAddition->name : null,
                    'price' => (float) $add['price'],
                ];
            })->toArray();
        }

        return $snapshot;
    }

    /**
     * Create a Stripe Checkout Session for all orders.
     *
     * @throws \Stripe\Exception\ApiErrorException
     */
    protected function createStripeSession(
        array $orders,
        array $items,
        $products,
        Customer $customer,
        string $checkoutGroupId
    ): StripeSession {
        Stripe::setApiKey(config('cashier.secret'));

        $lineItems = [];

        foreach ($items as $item) {
            $product = $products[$item['product_id']];
            $unitPrice = (float) $product->price;

            // Add option prices to unit price
            if (!empty($item['selected_options'])) {
                foreach ($item['selected_options'] as $opt) {
                    $pivotOption = $product->options->firstWhere('id', $opt['option_id']);
                    $unitPrice += $pivotOption ? (float) $pivotOption->pivot->price : 0;
                }
            }

            // Add addition prices to unit price
            if (!empty($item['selected_additions'])) {
                foreach ($item['selected_additions'] as $add) {
                    $pivotAddition = $product->additions->firstWhere('id', $add['addition_id']);
                    $unitPrice += $pivotAddition ? (float) $pivotAddition->pivot->price : 0;
                }
            }

            // Build the product description with options/additions
            $description = $this->buildLineItemDescription($item, $product);

            $lineItems[] = [
                'price_data' => [
                    'currency' => config('checkout.currency', 'usd'),
                    'unit_amount' => (int) round($unitPrice * 100), // Convert to cents
                    'product_data' => [
                        'name' => is_array($product->name) ? ($product->name[app()->getLocale()] ?? $product->name['en'] ?? 'Product') : $product->name,
                        'description' => $description ?: null,
                    ],
                ],
                'quantity' => (int) $item['quantity'],
            ];
        }

        $orderIds = collect($orders)->pluck('id')->toArray();

        return StripeSession::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => $lineItems,
            'metadata' => [
                'checkout_group_id' => $checkoutGroupId,
                'customer_id' => $customer->id,
                'order_ids' => implode(',', $orderIds),
            ],
            'customer_email' => $customer->email,
            'success_url' => config('checkout.success_url'),
            'cancel_url' => config('checkout.cancel_url'),
        ]);
    }

    /**
     * Build a human-readable description for Stripe line item.
     */
    protected function buildLineItemDescription(array $item, Product $product): string
    {
        $parts = [];

        if (!empty($item['selected_options'])) {
            foreach ($item['selected_options'] as $opt) {
                $pivotOption = $product->options->firstWhere('id', $opt['option_id']);
                if ($pivotOption) {
                    $name = is_array($pivotOption->name)
                        ? ($pivotOption->name[app()->getLocale()] ?? $pivotOption->name['en'] ?? '')
                        : $pivotOption->name;
                    $parts[] = $name;
                }
            }
        }

        if (!empty($item['selected_additions'])) {
            foreach ($item['selected_additions'] as $add) {
                $pivotAddition = $product->additions->firstWhere('id', $add['addition_id']);
                if ($pivotAddition) {
                    $name = is_array($pivotAddition->name)
                        ? ($pivotAddition->name[app()->getLocale()] ?? $pivotAddition->name['en'] ?? '')
                        : $pivotAddition->name;
                    $parts[] = '+ ' . $name;
                }
            }
        }

        return implode(', ', $parts);
    }
}
