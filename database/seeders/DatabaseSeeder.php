<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Order;
use App\Models\Platform;
use App\Models\Product;
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
        Platform::firstOrCreate(['id' => 1], ['name' => 'Platform']);
        Admin::firstOrCreate([
            'email' => 'admin@ps.com',
        ], [
            'name' => 'Admin',
            'password' => 'password',
            'is_active' => true,
        ]);
        $this->call([
            StoreSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
