<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Order;
use App\Models\Store;
use App\Models\StoreCategory;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin::factory()->count(100)->create();
        // StoreCategory::factory()->count(10)->create();
        // Store::factory()->count(100)->create();
        Order::factory()->count(100)->create();


    }
}
