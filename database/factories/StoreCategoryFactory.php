<?php

namespace Database\Factories;

use App\Models\StoreCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StoreCategory>
 */
class StoreCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            [
                'en' => 'Restaurants & Food',
                'ar' => 'مطاعم وطعام',
            ],
            [
                'en' => 'Electronics & Gadgets',
                'ar' => 'إلكترونيات وأجهزة',
            ],
            [
                'en' => 'Fashion & Clothing',
                'ar' => 'أزياء وملابس',
            ],
            [
                'en' => 'Home & Garden',
                'ar' => 'منزل وحديقة',
            ],
            [
                'en' => 'Health & Beauty',
                'ar' => 'صحة وجمال',
            ],
            [
                'en' => 'Sports & Outdoors',
                'ar' => 'رياضة وخارجية',
            ],
            [
                'en' => 'Books & Media',
                'ar' => 'كتب وإعلام',
            ],
            [
                'en' => 'Toys & Games',
                'ar' => 'ألعاب وألعاب',
            ],
            [
                'en' => 'Automotive',
                'ar' => 'سيارات',
            ],
            [
                'en' => 'Pet Supplies',
                'ar' => 'مستلزمات الحيوانات الأليفة',
            ],
        ];

        $category = $this->faker->randomElement($categories);

        return [
            'name' => [
                'en' => $category['en'],
                'ar' => $category['ar'],
            ],
            'description' => [
                'en' => $this->faker->paragraph(2),
                'ar' => $this->faker->paragraph(2),
            ],
        ];
    }
}

