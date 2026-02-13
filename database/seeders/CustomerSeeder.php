<?php



namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        Customer::firstOrCreate([
            'email' => 'customer@ps.com',
        ], [
            'name' => 'Customer',
            'phone_number' => '0123456789',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
    }
}
