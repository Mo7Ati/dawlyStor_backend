<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\StoreCategory;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Store category configurations with related product categories
     */
    private array $storeCategoryConfig = [
        [
            'name' => ['en' => 'Restaurants & Food', 'ar' => 'مطاعم وطعام'],
            'description' => ['en' => 'Restaurants, cafes, and food delivery services', 'ar' => 'مطاعم ومقاهي وخدمات توصيل الطعام'],
            'productCategories' => [
                ['en' => 'Appetizers', 'ar' => 'مقبلات'],
                ['en' => 'Main Courses', 'ar' => 'أطباق رئيسية'],
                ['en' => 'Desserts', 'ar' => 'حلويات'],
                ['en' => 'Beverages', 'ar' => 'مشروبات'],
                ['en' => 'Salads', 'ar' => 'سلطات'],
            ],
        ],
        [
            'name' => ['en' => 'Electronics & Gadgets', 'ar' => 'إلكترونيات وأجهزة'],
            'description' => ['en' => 'Electronics, smartphones, and tech gadgets', 'ar' => 'إلكترونيات وهواتف ذكية وأجهزة تقنية'],
            'productCategories' => [
                ['en' => 'Smartphones', 'ar' => 'هواتف ذكية'],
                ['en' => 'Laptops', 'ar' => 'أجهزة محمولة'],
                ['en' => 'Accessories', 'ar' => 'إكسسوارات'],
                ['en' => 'Audio & Headphones', 'ar' => 'سماعات وصوتيات'],
                ['en' => 'Tablets', 'ar' => 'أجهزة لوحية'],
            ],
        ],
        [
            'name' => ['en' => 'Fashion & Clothing', 'ar' => 'أزياء وملابس'],
            'description' => ['en' => 'Clothing, shoes, and fashion accessories', 'ar' => 'ملابس وأحذية وإكسسوارات موضة'],
            'productCategories' => [
                ['en' => 'Men\'s Clothing', 'ar' => 'ملابس رجالية'],
                ['en' => 'Women\'s Clothing', 'ar' => 'ملابس نسائية'],
                ['en' => 'Shoes', 'ar' => 'أحذية'],
                ['en' => 'Bags & Accessories', 'ar' => 'حقائب وإكسسوارات'],
                ['en' => 'Kids Wear', 'ar' => 'ملابس أطفال'],
            ],
        ],
        [
            'name' => ['en' => 'Health & Beauty', 'ar' => 'صحة وجمال'],
            'description' => ['en' => 'Health products, cosmetics, and personal care', 'ar' => 'منتجات صحية ومستحضرات تجميل وعناية شخصية'],
            'productCategories' => [
                ['en' => 'Skincare', 'ar' => 'العناية بالبشرة'],
                ['en' => 'Makeup', 'ar' => 'مكياج'],
                ['en' => 'Hair Care', 'ar' => 'العناية بالشعر'],
                ['en' => 'Fragrances', 'ar' => 'عطور'],
                ['en' => 'Health Supplements', 'ar' => 'مكملات غذائية'],
            ],
        ],
        [
            'name' => ['en' => 'Home & Garden', 'ar' => 'منزل وحديقة'],
            'description' => ['en' => 'Home decor, furniture, and garden supplies', 'ar' => 'ديكور منزلي وأثاث ومستلزمات حدائق'],
            'productCategories' => [
                ['en' => 'Furniture', 'ar' => 'أثاث'],
                ['en' => 'Home Decor', 'ar' => 'ديكور منزلي'],
                ['en' => 'Kitchen & Dining', 'ar' => 'مطبخ وطعام'],
                ['en' => 'Garden Tools', 'ar' => 'أدوات حديقة'],
                ['en' => 'Lighting', 'ar' => 'إضاءة'],
            ],
        ],
        [
            'name' => ['en' => 'Grocery & Supermarket', 'ar' => 'بقالة وسوبرماركت'],
            'description' => ['en' => 'Daily groceries and supermarket essentials', 'ar' => 'مواد غذائية يومية ومستلزمات السوبرماركت'],
            'productCategories' => [
                ['en' => 'Fresh Produce', 'ar' => 'منتجات طازجة'],
                ['en' => 'Dairy & Eggs', 'ar' => 'ألبان وبيض'],
                ['en' => 'Snacks & Beverages', 'ar' => 'وجبات خفيفة ومشروبات'],
                ['en' => 'Pantry Staples', 'ar' => 'أساسيات المخزن'],
                ['en' => 'Frozen Foods', 'ar' => 'أطعمة مجمدة'],
            ],
        ],
    ];

    public function run(): void
    {
        $this->command->info('Creating store categories...');

        foreach ($this->storeCategoryConfig as $config) {
            // Create store category
            $storeCategory = StoreCategory::create([
                'name' => $config['name'],
                'description' => $config['description'],
            ]);

            $this->command->info("  Created store category: {$config['name']['en']}");

            // Create 2-4 stores per category
            $storeCount = rand(2, 4);
            $stores = Store::factory()->count($storeCount)->create([
                'category_id' => $storeCategory->id,
            ]);

            $this->command->info("    Created {$storeCount} stores");

            foreach ($stores as $store) {
                // Create product categories for each store
                $categories = collect($config['productCategories'])->map(function ($categoryName) use ($store) {
                    return Category::withoutEvents(function () use ($categoryName, $store) {
                        return Category::create([
                            'name' => $categoryName,
                            'description' => [
                                'en' => "Products in {$categoryName['en']} category",
                                'ar' => "منتجات في فئة {$categoryName['ar']}",
                            ],
                            'store_id' => $store->id,
                            'is_active' => true,
                        ]);
                    });
                });

                // Create 3-8 products per category
                foreach ($categories as $category) {
                    $productCount = rand(3, 8);
                    Product::factory()->count($productCount)->create([
                        'store_id' => $store->id,
                        'category_id' => $category->id,
                    ]);
                }

                // Create some products without category (uncategorized)
                $uncategorizedCount = rand(0, 3);
                if ($uncategorizedCount > 0) {
                    Product::factory()->count($uncategorizedCount)->create([
                        'store_id' => $store->id,
                        'category_id' => null,
                    ]);
                }
            }
        }

        $this->command->info('');
        $this->command->info('Seeding completed!');
        $this->command->info('  Store Categories: ' . StoreCategory::count());
        $this->command->info('  Stores: ' . Store::count());
        $this->command->info('  Categories: ' . Category::count());
        $this->command->info('  Products: ' . Product::count());
    }
}
