<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'preparing', 'on_the_way', 'completed', 'cancelled', 'rejected'];
        $paymentStatuses = ['unpaid', 'paid', 'failed', 'refunded'];

        $status = $this->faker->randomElement($statuses);
        $paymentStatus = $this->faker->randomElement($paymentStatuses);

        // Calculate realistic order amounts
        $totalItemsAmount = $this->faker->randomFloat(2, 10, 500);
        $deliveryAmount = $this->faker->randomFloat(2, 0, 20);
        $taxAmount = round($totalItemsAmount * 0.1, 2); // 10% tax
        $total = round($totalItemsAmount + $deliveryAmount + $taxAmount, 2);

        // Generate customer data
        $customer = Customer::inRandomOrder()->first();
        if (!$customer) {
            $customer = Customer::create([
                'name' => $this->faker->name(),
                'email' => $this->faker->unique()->safeEmail(),
                'phone_number' => $this->faker->phoneNumber(),
                'password' => bcrypt('password'),
                'is_active' => true,
            ]);
        }
        $customerData = [
            'id' => $customer->id,
            'name' => $customer->name,
            'email' => $customer->email,
            'phone_number' => $customer->phone_number,
        ];

        // Generate address data - ensure address belongs to the customer
        $address = Address::where('customer_id', $customer->id)->inRandomOrder()->first();
        if (!$address) {
            $locationData = [
                'lat' => $this->faker->latitude(),
                'lng' => $this->faker->longitude(),
                'address' => $this->faker->streetAddress(),
                'city' => $this->faker->city(),
                'state' => $this->faker->state(),
                'zip' => $this->faker->postcode(),
                'country' => $this->faker->country(),
            ];

            $fieldsData = [
                'building_number' => $this->faker->buildingNumber(),
                'apartment' => $this->faker->boolean(30) ? $this->faker->numberBetween(1, 100) : null,
                'floor' => $this->faker->boolean(20) ? $this->faker->numberBetween(1, 20) : null,
                'landmark' => $this->faker->boolean(40) ? $this->faker->sentence(3) : null,
            ];

            $address = Address::create([
                'name' => $this->faker->name(),
                'customer_id' => $customer->id,
                'location' => $locationData,
                'fields' => $fieldsData,
            ]);
        }
        $addressData = [
            'id' => $address->id,
            'name' => $address->name,
            'location' => $address->location,
            'fields' => $address->fields ?? null,
        ];

        // Get or create a store
        $store = Store::inRandomOrder()->first() ?? Store::factory()->create();

        return [
            'status' => $status,
            'payment_status' => $paymentStatus,
            'cancelled_reason' => in_array($status, ['cancelled', 'rejected'])
                ? $this->faker->randomElement([
                    'Customer requested cancellation',
                    'Store unavailable',
                    'Payment failed',
                    'Out of stock',
                    'Delivery address invalid',
                    'Customer not available',
                ])
                : null,
            'customer_id' => $customer->id,
            'customer_data' => $customerData,
            'store_id' => $store->id,
            'address_id' => $address->id,
            'address_data' => $addressData,
            'total' => $total,
            'total_items_amount' => $totalItemsAmount,
            'delivery_amount' => $deliveryAmount,
            'tax_amount' => $taxAmount,
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
        ];
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'payment_status' => 'paid',
        ]);
    }

    /**
     * Indicate that the order is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_reason' => $this->faker->randomElement([
                'Customer requested cancellation',
                'Store unavailable',
                'Payment failed',
                'Out of stock',
            ]),
        ]);
    }

    /**
     * Indicate that the order is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'paid',
        ]);
    }
}

