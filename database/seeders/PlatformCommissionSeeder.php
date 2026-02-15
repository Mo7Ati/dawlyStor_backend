<?php

namespace Database\Seeders;

use App\Enums\TransactionTypeEnum;
use App\Models\Order;
use App\Models\Platform;
use Illuminate\Database\Seeder;

class PlatformCommissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates platform commission (fee) transactions with varied amounts
     * over the last 30 days for dashboard charts.
     */
    public function run(): void
    {
        $platform = Platform::query()->first();
        if (! $platform) {
            $this->command->warn('No platform found. Run migrations and seed Platform first.');

            return;
        }

        $feeType = TransactionTypeEnum::DEPOSIT_PLATFORM_FEE_TO_PLATFORM_WALLET->value;

        // Optional: link some commissions to existing orders for realism
        $orders = Order::query()->inRandomOrder()->limit(120)->get();

        // Number of commission transactions to create (with amounts)
        $count = max(80, $orders->count() * 2);

        $amounts = [
            0.50, 0.75, 1.00, 1.25, 1.50, 2.00, 2.25, 2.50, 3.00, 3.50,
            4.00, 4.50, 5.00, 5.50, 6.00, 6.50, 7.00, 7.50, 8.00, 8.50,
            9.00, 9.50, 10.00, 11.00, 12.00, 12.50, 13.00, 14.00, 15.00,
            16.00, 18.00, 20.00, 22.00, 25.00, 28.00, 30.00, 35.00, 40.00, 45.00, 50.00,
        ];

        for ($i = 0; $i < $count; $i++) {
            $createdAt = now()
                ->subDays(rand(0, 29))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59));

            $amount = $amounts[array_rand($amounts)];

            $meta = [
                'type' => $feeType,
            ];

            $transaction = $platform->deposit($amount, $meta);

            if ($orders->isNotEmpty()) {
                $order = $orders->get($i % $orders->count());
                if ($order) {
                    $transaction->source()->associate($order);
                }
            }

            $transaction->save();

            $transaction->update([
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }

        $this->command->info("Created {$count} platform commission transactions with amounts.");
    }
}
