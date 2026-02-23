<?php

use App\Models\Customer;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated customer can manage wishlist', function () {
    $customer = Customer::create([
        'name' => 'Test Customer',
        'email' => 'customer@example.com',
        'password' => bcrypt('password'),
        'phone_number' => '1234567890',
        'is_active' => true,
    ]);

    $store = Store::create([
        'name' => ['en' => 'Test Store'],
        'slug' => 'test-store',
        'address' => ['en' => 'Test Address'],
        'description' => ['en' => 'Test Description'],
        'keywords' => ['en' => ['test']],
        'social_media' => null,
        'email' => 'store@example.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'category_id' => null,
        'delivery_time' => 30,
        'delivery_area_polygon' => null,
        'is_active' => true,
    ]);

    $product = Product::create([
        'name' => ['en' => 'Test Product'],
        'slug' => 'test-product',
        'description' => ['en' => 'Test product description'],
        'keywords' => ['en' => ['test']],
        'store_id' => $store->id,
        'category_id' => null,
        'price' => 100,
        'compare_price' => null,
        'is_active' => true,
        'is_accepted' => true,
        'quantity' => 10,
    ]);

    $this->actingAs($customer, 'sanctum');

    // Add to wishlist
    $this->postJson('/api/customer/wishlist', [
        'product_id' => $product->id,
    ])->assertStatus(200)
        ->assertJson([
            'success' => true,
        ]);

    // Get wishlist
    $this->getJson('/api/customer/wishlist')
        ->assertOk()
        ->assertJsonFragment([
            'id' => $product->id,
        ]);

    // Sync wishlist with duplicate and non-existing IDs
    $this->postJson('/api/customer/wishlist/sync', [
        'product_ids' => [$product->id, $product->id, 99999],
    ])->assertOk()
        ->assertJsonFragment([
            'id' => $product->id,
        ]);

    // Remove from wishlist
    $this->deleteJson("/api/customer/wishlist/{$product->id}")
        ->assertOk()
        ->assertJson([
            'success' => true,
        ]);
});

