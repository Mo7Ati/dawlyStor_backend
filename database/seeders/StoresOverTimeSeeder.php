<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\StoreCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StoresOverTimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates additional stores with created_at spread over the last 30 days
     * so that "stores over time" dashboard charts show variety.
     */
    public function run(): void
    {
        $category = StoreCategory::query()->first();
        if (!$category) {
            $this->command->warn('No store category found. Run StoreSeeder first.');

            return;
        }

        $count = 22;
        $storeNames = [
            ['en' => 'Quick Mart', 'ar' => 'كويك مارت'],
            ['en' => 'Daily Deals', 'ar' => 'عروض يومية'],
            ['en' => 'Fresh Corner', 'ar' => 'الزاوية الطازجة'],
            ['en' => 'Urban Shop', 'ar' => 'متجر أوربان'],
            ['en' => 'Mega Store', 'ar' => 'ميغا ستور'],
            ['en' => 'Value Plus', 'ar' => 'فاليو بلس'],
            ['en' => 'City Market', 'ar' => 'سوق المدينة'],
            ['en' => 'Prime Goods', 'ar' => 'بضائع برايم'],
            ['en' => 'Elite Shop', 'ar' => 'متجر النخبة'],
            ['en' => 'Budget Buy', 'ar' => 'شراء ميزانية'],
            ['en' => 'Local Fresh', 'ar' => 'طازج محلي'],
            ['en' => 'Express Store', 'ar' => 'متجر إكسبريس'],
            ['en' => 'Super Save', 'ar' => 'سوبر سيف'],
            ['en' => 'Best Choice', 'ar' => 'أفضل خيار'],
            ['en' => 'Direct Deal', 'ar' => 'صفقة مباشرة'],
            ['en' => 'Smart Shop', 'ar' => 'متجر سمارت'],
            ['en' => 'Peak Store', 'ar' => 'متجر بيك'],
            ['en' => 'Rapid Retail', 'ar' => 'ريتيل رابيد'],
            ['en' => 'Core Commerce', 'ar' => 'كور كومرس'],
            ['en' => 'Next Gen Store', 'ar' => 'متجر الجيل القادم'],
            ['en' => 'Alpha Shop', 'ar' => 'متجر ألفا'],
            ['en' => 'Beta Market', 'ar' => 'سوق بيتا'],
            ['en' => 'Delta Deals', 'ar' => 'عروض دلتا'],
        ];

        for ($i = 0; $i < $count; $i++) {
            $createdAt = now()
                ->subDays(rand(0, 29))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59));

            $name = $storeNames[$i % count($storeNames)];
            $slug = Str::slug($name['en']) . '_' . $i . '_' . rand(100, 999);
            $email = str_replace(' ', '', $slug) . '@demo-stores.com';

            if (Store::query()->where('email', $email)->exists()) {
                continue;
            }

            $store = Store::create([
                'name' => $name,
                'slug' => $slug,
                'address' => ['en' => 'Demo Address ' . ($i + 1), 'ar' => 'عنوان تجريبي ' . ($i + 1)],
                'description' => ['en' => 'Demo store created for chart data.', 'ar' => 'متجر تجريبي لبيانات الرسوم.'],
                'email' => $email,
                'phone' => '+1' . rand(2000000000, 2999999999),
                'password' => 'password123',
                'category_id' => $category->id,
                'delivery_time' => rand(30, 90),
                'keywords' => ['demo', 'store', 'chart'],
                'social_media' => [],
                'is_active' => true,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $cat = Category::create([
                'name' => ['en' => 'General', 'ar' => 'عام'],
                'slug' => Str::slug('General'),
                'description' => ['en' => 'General products', 'ar' => 'منتجات عامة'],
                'store_id' => $store->id,
                'is_active' => true,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $products = [
                ['name' => ['en' => 'Demo Product A', 'ar' => 'منتج تجريبي أ'], 'price' => 49.99],
                ['name' => ['en' => 'Demo Product B', 'ar' => 'منتج تجريبي ب'], 'price' => 89.99],
                ['name' => ['en' => 'Demo Product C', 'ar' => 'منتج تجريبي ج'], 'price' => 129.99],
                ['name' => ['en' => 'Demo Product D', 'ar' => 'منتج تجريبي د'], 'price' => 29.99],
                ['name' => ['en' => 'Demo Product E', 'ar' => 'منتج تجريبي ه'], 'price' => 199.99],
            ];

            foreach ($products as $p) {
                $product = new Product([
                    'name' => $p['name'],
                    'slug' => Str::slug($p['name']['en']),
                    'description' => ['en' => 'Demo product', 'ar' => 'منتج تجريبي'],
                    'price' => $p['price'],
                    'compare_price' => $p['price'] * 1.2,
                    'store_id' => $store->id,
                    'category_id' => $cat->id,
                    'keywords' => ['demo'],
                    'quantity' => 100,
                    'is_active' => true,
                    'is_accepted' => true,
                    'uuid' => (string) Str::uuid(),
                ]);
                $product->created_at = $createdAt;
                $product->updated_at = $createdAt;
                $product->save();
            }
        }
    }
}
