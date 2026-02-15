<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\Address;
use App\Models\Customer;
use App\Models\Order;
use App\Models\orderItems;
use App\Models\Product;
use App\Models\Store;
use App\Models\Transaction;
use App\Services\TransactionsService;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function __construct(
        protected TransactionsService $transactionsService
    ) {
    }

    public function run(): void
    {
        $customers = Customer::all();
        if ($customers->isEmpty()) {
            $this->command->warn('No customers found. Run CustomerSeeder first.');

            return;
        }

        $stores = Store::with('products')->whereHas('products')->get();
        if ($stores->isEmpty()) {
            $this->command->warn('No stores with products found. Run StoreSeeder first.');

            return;
        }

        $statuses = OrderStatusEnum::cases();
        $paymentStatuses = PaymentStatusEnum::cases();

        foreach ($customers as $customer) {
            if ($customer->addresses()->count() === 0) {
                Address::create([
                    'name' => 'Home',
                    'customer_id' => $customer->id,
                    'location' => [
                        'address' => '123 Main Street',
                        'city' => 'City',
                        'country' => 'Country',
                        'latitude' => 0,
                        'longitude' => 0,
                    ],
                ]);
            }
        }

        // Big order count, spread over last 30 days with large totals
        $orderCount = min(280, max(100, $stores->count() * 8));

        for ($i = 0; $i < $orderCount; $i++) {
            $customer = $customers->random();
            $store = $stores->random();
            $products = $store->products()->limit(10)->get();

            if ($products->isEmpty()) {
                continue;
            }

            $address = $customer->addresses()->first();
            $addressData = null;
            $addressId = null;

            if ($address) {
                $addressId = $address->id;
                $addressData = [
                    'name' => $address->name,
                    'location' => $address->location,
                ];
            }

            $customerData = [
                'name' => $customer->name,
                'email' => $customer->email,
                'phone_number' => $customer->phone_number,
            ];

            $itemsCount = random_int(1, min(6, $products->count()));
            $selectedProducts = $products->random(min($itemsCount, $products->count()));

            $totalItemsAmount = 0;
            $itemsData = [];

            // Big values: higher quantities and optional multiplier for larger orders
            $valueMultiplier = (float) (rand(15, 80) / 10); // 1.5 to 8.0

            foreach ($selectedProducts as $product) {
                $quantity = random_int(1, 5);
                $unitPrice = (float) $product->price * $valueMultiplier;
                $optionsAmount = 0;
                $additionsAmount = (float) round(rand(0, 50), 2);
                $totalPrice = ($unitPrice * $quantity) + $optionsAmount + $additionsAmount;
                $totalItemsAmount += $totalPrice;

                $productName = is_array($product->name) ? ($product->name['en'] ?? $product->name['ar'] ?? 'Product') : $product->name;

                $itemsData[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'options_amount' => $optionsAmount,
                    'additions_amount' => $additionsAmount,
                    'total_price' => $totalPrice,
                    'product_data' => [
                        'name' => $productName,
                        'id' => $product->id,
                    ],
                ];
            }

            $deliveryAmount = (float) round(rand(8, 45), 2);
            $taxAmount = (float) round($totalItemsAmount * 0.05, 2);
            $total = $totalItemsAmount + $deliveryAmount + $taxAmount;

            $status = $statuses[array_rand($statuses)];
            // Start as UNPAID; we will mark ~70% as paid via handleOrderPaid to generate transactions
            $willBePaid = rand(1, 10) <= 7;

            $orderCreatedAt = now()
                ->subDays(rand(0, 29))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59))
                ->subSeconds(rand(0, 59));

            $order = Order::create([
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'address_id' => $addressId,
                'customer_data' => $customerData,
                'address_data' => $addressData,
                'status' => $status,
                'payment_status' => PaymentStatusEnum::UNPAID,
                'total_items_amount' => round($totalItemsAmount, 2),
                'delivery_amount' => $deliveryAmount,
                'tax_amount' => $taxAmount,
                'total' => round($total, 2),
                'notes' => rand(0, 1) ? 'Please deliver in the morning.' : null,
                'created_at' => $orderCreatedAt,
                'updated_at' => $orderCreatedAt,
            ]);

            foreach ($itemsData as $item) {
                orderItems::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'product_data' => $item['product_data'],
                    'options_amount' => $item['options_amount'],
                    'options_data' => null,
                    'additions_amount' => $item['additions_amount'],
                    'additions_data' => null,
                    'total_price' => $item['total_price'],
                    'created_at' => $orderCreatedAt,
                    'updated_at' => $orderCreatedAt,
                ]);
            }

            // Create wallet transactions for ~70% of orders, then backdate them to order date
            if ($willBePaid) {
                $this->transactionsService->handleOrderPaid($order);
                Transaction::query()
                    ->where('source_type', Order::class)
                    ->where('source_id', $order->id)
                    ->update([
                        'created_at' => $orderCreatedAt,
                        'updated_at' => $orderCreatedAt,
                    ]);
            }
        }
    }
}
