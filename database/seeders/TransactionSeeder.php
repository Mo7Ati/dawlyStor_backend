<?php

namespace Database\Seeders;

use App\Enums\TransactionTypeEnum;
use App\Models\Platform;
use App\Models\Store;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates subscription-type transactions (platform deposits) with different dates
     * during the last month and large amounts.
     */
    public function run(): void
    {
        $platform = Platform::query()->first();
        if (! $platform) {
            $this->command->warn('No platform found. Run migrations and seed Platform first.');

            return;
        }

        $stores = Store::limit(40)->get();
        if ($stores->isEmpty()) {
            $this->command->warn('No stores found. Run StoreSeeder first.');

            return;
        }

        $subscriptionType = TransactionTypeEnum::DEPOSIT_STORE_SUBSCRIPTION_TO_PLATFORM_WALLET->value;

        foreach ($stores as $store) {
            $createdAt = now()
                ->subDays(rand(0, 29))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59));

            $amount = (float) rand(500, 3500) + (rand(0, 99) / 100);

            $meta = [
                'type' => $subscriptionType,
                'subscription_id' => 'sub_seed_' . $store->id . '_' . rand(1000, 9999),
            ];

            $transaction = $platform->deposit($amount, $meta);
            $transaction->source()->associate($store);
            $transaction->save();

            $transaction->update([
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }
    }
}
