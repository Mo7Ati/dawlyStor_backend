<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates many customers with created_at spread over the last 30 days.
     */
    public function run(): void
    {
        $count = 350;

        for ($i = 1; $i <= $count; $i++) {
            $createdAt = now()
                ->subDays(rand(0, 29))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59));

            $customer = Customer::firstOrCreate(
                ['email' => "customer_demo_{$i}@example.com"],
                [
                    'name' => "Customer Demo {$i}",
                    'phone_number' => '01' . str_pad((string) rand(10000000, 99999999), 8, '0'),
                    'password' => Hash::make('password'),
                    'is_active' => true,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]
            );

            if ($customer->wasRecentlyCreated && $customer->addresses()->count() === 0) {
                Address::create([
                    'name' => 'Default Address',
                    'customer_id' => $customer->id,
                    'location' => [
                        'address' => rand(1, 999) . ' Demo Street',
                        'city' => 'City',
                        'country' => 'Country',
                        'latitude' => 30.0 + (rand(0, 100) / 100),
                        'longitude' => 31.0 + (rand(0, 100) / 100),
                    ],
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }

        // Keep the original seed customer if not already present
        Customer::firstOrCreate(
            ['email' => 'customer@ps.com'],
            [
                'name' => 'Customer',
                'phone_number' => '0123456789',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
    }
}
