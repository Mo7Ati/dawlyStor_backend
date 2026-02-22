<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Models\Address;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\orderItems;
use App\Models\Product;
use App\Models\Store;
use App\Models\Transaction;
use App\Services\TransactionsService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BetaMarketExtraSeeder extends Seeder
{
    public function __construct(
        protected TransactionsService $transactionsService
    ) {
    }

    /**
     * Add a lot of products and orders for the store beta-market_21_743@demo-stores.com
     */
    public function run(): void
    {
        $store = Store::query()->where('email', 'beta-market_21_743@demo-stores.com')->first()
            ?? Store::query()->where('email', 'like', 'beta-market_21_%@demo-stores.com')->first();
        if (! $store) {
            $this->command->warn('Store beta-market_21_743@demo-stores.com (or beta-market_21_*@demo-stores.com) not found. Run StoresOverTimeSeeder first.');

            return;
        }

        $category = $store->categories()->first();
        if (! $category) {
            $category = Category::create([
                'name' => ['en' => 'General', 'ar' => 'عام'],
                'slug' => Str::slug('General'),
                'description' => ['en' => 'General products', 'ar' => 'منتجات عامة'],
                'store_id' => $store->id,
                'is_active' => true,
            ]);
        }

        $customers = Customer::all();
        if ($customers->isEmpty()) {
            $this->command->warn('No customers found. Run CustomerSeeder first.');
        }

        foreach ($customers as $customer) {
            if ($customer->addresses()->count() === 0) {
                Address::create([
                    'name' => 'Home',
                    'customer_id' => $customer->id,
                    'location' => [
                        'address' => '123 Main Street',
                        'city' => 'City',
                        'country' => 'Country',
                        'latitude' => 0,
                        'longitude' => 0,
                    ],
                ]);
            }
        }

        $productTemplates = $this->getProductTemplates();
        $productsCreated = 0;

        for ($i = 0; $i < 120; $i++) {
            $template = $productTemplates[$i % count($productTemplates)];
            $createdAt = now()
                ->subDays(rand(0, 29))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59));

            Product::create([
                'uuid' => (string) Str::uuid(),
                'name' => $template['name'],
                'slug' => Str::slug($template['name']['en']),
                'description' => $template['description'],
                'price' => $template['price'],
                'compare_price' => $template['price'] * (1 + rand(5, 25) / 100),
                'store_id' => $store->id,
                'category_id' => $category->id,
                'keywords' => $template['keywords'],
                'quantity' => rand(20, 200),
                'is_active' => true,
                'is_accepted' => true,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
            $productsCreated++;
        }

        $this->command->info("Created {$productsCreated} products for Beta Market store.");

        $store->load('products');
        $products = $store->products;
        if ($products->isEmpty() || $customers->isEmpty()) {
            $this->command->warn('Skipping orders: no products or customers.');

            return;
        }

        $statuses = OrderStatusEnum::cases();
        $orderCount = 380;

        for ($i = 0; $i < $orderCount; $i++) {
            $customer = $customers->random();
            $address = $customer->addresses()->first();
            $addressId = $address?->id;
            $addressData = $address ? ['name' => $address->name, 'location' => $address->location] : null;

            $customerData = [
                'name' => $customer->name,
                'email' => $customer->email,
                'phone_number' => $customer->phone_number,
            ];

            $itemsCount = random_int(1, min(6, $products->count()));
            $selectedProducts = $products->random(min($itemsCount, $products->count()));

            $totalItemsAmount = 0;
            $itemsData = [];
            $valueMultiplier = (float) (rand(15, 80) / 10);

            foreach ($selectedProducts as $product) {
                $quantity = random_int(1, 5);
                $unitPrice = (float) $product->price * $valueMultiplier;
                $optionsAmount = 0;
                $additionsAmount = (float) round(rand(0, 50), 2);
                $totalPrice = ($unitPrice * $quantity) + $optionsAmount + $additionsAmount;
                $totalItemsAmount += $totalPrice;

                $productName = is_array($product->name) ? ($product->name['en'] ?? $product->name['ar'] ?? 'Product') : $product->name;

                $itemsData[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'options_amount' => $optionsAmount,
                    'additions_amount' => $additionsAmount,
                    'total_price' => $totalPrice,
                    'product_data' => ['name' => $productName, 'id' => $product->id],
                ];
            }

            $deliveryAmount = (float) round(rand(8, 45), 2);
            $taxAmount = (float) round($totalItemsAmount * 0.05, 2);
            $total = $totalItemsAmount + $deliveryAmount + $taxAmount;

            $status = $statuses[array_rand($statuses)];
            $willBePaid = rand(1, 10) <= 7;

            $orderCreatedAt = now()
                ->subDays(rand(0, 29))
                ->subHours(rand(0, 23))
                ->subMinutes(rand(0, 59))
                ->subSeconds(rand(0, 59));

            $order = Order::create([
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'address_id' => $addressId,
                'customer_data' => $customerData,
                'address_data' => $addressData,
                'status' => $status,
                'payment_status' => PaymentStatusEnum::UNPAID,
                'total_items_amount' => round($totalItemsAmount, 2),
                'delivery_amount' => $deliveryAmount,
                'tax_amount' => $taxAmount,
                'total' => round($total, 2),
                'notes' => rand(0, 1) ? 'Please deliver in the morning.' : null,
                'created_at' => $orderCreatedAt,
                'updated_at' => $orderCreatedAt,
            ]);

            foreach ($itemsData as $item) {
                orderItems::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'product_data' => $item['product_data'],
                    'options_amount' => $item['options_amount'],
                    'options_data' => null,
                    'additions_amount' => $item['additions_amount'],
                    'additions_data' => null,
                    'total_price' => $item['total_price'],
                    'created_at' => $orderCreatedAt,
                    'updated_at' => $orderCreatedAt,
                ]);
            }

            if ($willBePaid) {
                $this->transactionsService->handleOrderPaid($order);
                Transaction::query()
                    ->where('source_type', Order::class)
                    ->where('source_id', $order->id)
                    ->update([
                        'created_at' => $orderCreatedAt,
                        'updated_at' => $orderCreatedAt,
                    ]);
            }
        }

        $this->command->info("Created {$orderCount} orders for Beta Market store.");
    }

    private function getProductTemplates(): array
    {
        return [
            ['name' => ['en' => 'Premium Smartphone 128GB', 'ar' => 'هاتف ذكي متميز 128 جيجابايت'], 'description' => ['en' => 'Latest generation smartphone.', 'ar' => 'هاتف ذكي من الجيل الأخير.'], 'price' => 899.99, 'keywords' => ['smartphone', 'mobile']],
            ['name' => ['en' => 'Gaming Laptop 16GB RAM', 'ar' => 'لابتوب ألعاب 16 جيجابايت'], 'description' => ['en' => 'High-performance gaming laptop.', 'ar' => 'لابتوب ألعاب عالي الأداء.'], 'price' => 1499.99, 'keywords' => ['laptop', 'gaming']],
            ['name' => ['en' => 'Wireless Bluetooth Headphones', 'ar' => 'سماعات لاسلكية بلوتوث'], 'description' => ['en' => 'Noise-cancelling headphones.', 'ar' => 'سماعات إلغاء ضوضاء.'], 'price' => 199.99, 'keywords' => ['headphones', 'audio']],
            ['name' => ['en' => 'Smart Watch Series 8', 'ar' => 'ساعة ذكية سلسلة 8'], 'description' => ['en' => 'Health tracking smartwatch.', 'ar' => 'ساعة ذكية لتتبع الصحة.'], 'price' => 399.99, 'keywords' => ['smartwatch', 'fitness']],
            ['name' => ['en' => '4K Ultra HD TV 55 inch', 'ar' => 'تلفزيون 4K 55 بوصة'], 'description' => ['en' => 'Stunning 4K display.', 'ar' => 'شاشة 4K مذهلة.'], 'price' => 799.99, 'keywords' => ['TV', '4K']],
            ['name' => ['en' => 'Wireless Charging Pad', 'ar' => 'لوحة شحن لاسلكية'], 'description' => ['en' => 'Fast Qi wireless charging.', 'ar' => 'شحن لاسلكي Qi سريع.'], 'price' => 29.99, 'keywords' => ['charger', 'wireless']],
            ['name' => ['en' => 'Power Bank 20000mAh', 'ar' => 'بنك طاقة 20000 مللي أمبير'], 'description' => ['en' => 'High-capacity power bank.', 'ar' => 'بنك طاقة عالي السعة.'], 'price' => 49.99, 'keywords' => ['power bank', 'portable']],
            ['name' => ['en' => 'USB-C Hub Multiport', 'ar' => 'محول USB-C متعدد المنافذ'], 'description' => ['en' => 'HDMI, USB 3.0, SD reader.', 'ar' => 'HDMI وUSB 3.0 وقارئ SD.'], 'price' => 39.99, 'keywords' => ['adapter', 'USB-C']],
            ['name' => ['en' => 'Mechanical Gaming Keyboard', 'ar' => 'لوحة مفاتيح ألعاب ميكانيكية'], 'description' => ['en' => 'RGB mechanical keyboard.', 'ar' => 'لوحة مفاتيح ميكانيكية RGB.'], 'price' => 129.99, 'keywords' => ['keyboard', 'gaming']],
            ['name' => ['en' => 'Wireless Ergonomic Mouse', 'ar' => 'فأرة لاسلكية مريحة'], 'description' => ['en' => 'Precision wireless mouse.', 'ar' => 'فأرة لاسلكية دقيقة.'], 'price' => 34.99, 'keywords' => ['mouse', 'wireless']],
            ['name' => ['en' => 'Classic Denim Jeans', 'ar' => 'بنطلون جينز كلاسيكي'], 'description' => ['en' => 'Comfortable denim jeans.', 'ar' => 'جينز مريح.'], 'price' => 79.99, 'keywords' => ['jeans', 'denim']],
            ['name' => ['en' => 'Cotton T-Shirt Premium', 'ar' => 'قميص قطني متميز'], 'description' => ['en' => 'Soft cotton t-shirt.', 'ar' => 'قميص قطني ناعم.'], 'price' => 24.99, 'keywords' => ['t-shirt', 'cotton']],
            ['name' => ['en' => 'Leather Jacket Classic', 'ar' => 'سترة جلدية كلاسيكية'], 'description' => ['en' => 'Genuine leather jacket.', 'ar' => 'سترة جلد أصلية.'], 'price' => 299.99, 'keywords' => ['jacket', 'leather']],
            ['name' => ['en' => 'Running Sneakers Sport', 'ar' => 'أحذية رياضية للجري'], 'description' => ['en' => 'Comfortable running shoes.', 'ar' => 'أحذية جري مريحة.'], 'price' => 89.99, 'keywords' => ['sneakers', 'running']],
            ['name' => ['en' => 'Designer Handbag Leather', 'ar' => 'حقيبة يد مصممة جلدية'], 'description' => ['en' => 'Elegant leather handbag.', 'ar' => 'حقيبة يد جلدية أنيقة.'], 'price' => 199.99, 'keywords' => ['handbag', 'leather']],
            ['name' => ['en' => 'Organic Fresh Strawberries', 'ar' => 'فراولة طازجة عضوية'], 'description' => ['en' => 'Fresh organic strawberries.', 'ar' => 'فراولة عضوية طازجة.'], 'price' => 5.99, 'keywords' => ['strawberries', 'organic']],
            ['name' => ['en' => 'Premium Arabica Coffee Beans', 'ar' => 'حبوب قهوة أرابيكا متميزة'], 'description' => ['en' => 'Freshly roasted coffee beans.', 'ar' => 'حبوب قهوة محمصة طازجة.'], 'price' => 24.99, 'keywords' => ['coffee', 'beans']],
            ['name' => ['en' => 'Fresh Whole Milk 1 Gallon', 'ar' => 'حليب كامل طازج 1 جالون'], 'description' => ['en' => 'Fresh whole milk.', 'ar' => 'حليب كامل طازج.'], 'price' => 4.99, 'keywords' => ['milk', 'dairy']],
            ['name' => ['en' => 'Artisan Sourdough Bread', 'ar' => 'خبز خميرة طبيعي حرفي'], 'description' => ['en' => 'Freshly baked sourdough.', 'ar' => 'خبز خميرة طازج.'], 'price' => 6.99, 'keywords' => ['bread', 'sourdough']],
            ['name' => ['en' => 'Organic Free-Range Eggs 12', 'ar' => 'بيض عضوي 12 قطعة'], 'description' => ['en' => 'Premium organic eggs.', 'ar' => 'بيض عضوي متميز.'], 'price' => 7.99, 'keywords' => ['eggs', 'organic']],
            ['name' => ['en' => 'Vitamin C Serum 30ml', 'ar' => 'مصل فيتامين سي 30 مل'], 'description' => ['en' => 'Brightening vitamin C serum.', 'ar' => 'مصل فيتامين سي مضيء.'], 'price' => 29.99, 'keywords' => ['serum', 'skincare']],
            ['name' => ['en' => 'Hydrating Face Moisturizer', 'ar' => 'مرطب وجه مرطب'], 'description' => ['en' => 'Hyaluronic acid moisturizer.', 'ar' => 'مرطب بحمض الهيالورونيك.'], 'price' => 24.99, 'keywords' => ['moisturizer', 'face']],
            ['name' => ['en' => 'Matte Lipstick Set 6 Colors', 'ar' => 'مجموعة أحمر شفاه مات 6 ألوان'], 'description' => ['en' => 'Long-lasting matte lipstick.', 'ar' => 'أحمر شفاه مات طويل الأمد.'], 'price' => 19.99, 'keywords' => ['lipstick', 'makeup']],
            ['name' => ['en' => 'Professional Hair Dryer', 'ar' => 'مجفف شعر احترافي'], 'description' => ['en' => 'Ionic hair dryer.', 'ar' => 'مجفف شعر أيوني.'], 'price' => 79.99, 'keywords' => ['hair dryer', 'styling']],
            ['name' => ['en' => 'Luxury Perfume 50ml', 'ar' => 'عطر فاخر 50 مل'], 'description' => ['en' => 'Long-lasting perfume.', 'ar' => 'عطر طويل الأمد.'], 'price' => 89.99, 'keywords' => ['perfume', 'fragrance']],
            ['name' => ['en' => 'Yoga Mat Premium 6mm', 'ar' => 'سجادة يوغا متميزة 6 مم'], 'description' => ['en' => 'Non-slip yoga mat.', 'ar' => 'سجادة يوغا غير قابلة للانزلاق.'], 'price' => 29.99, 'keywords' => ['yoga', 'fitness']],
            ['name' => ['en' => 'Dumbbell Set 20kg Pair', 'ar' => 'مجموعة دمبل 20 كجم'], 'description' => ['en' => 'Adjustable dumbbell set.', 'ar' => 'مجموعة دمبل قابلة للتعديل.'], 'price' => 89.99, 'keywords' => ['dumbbells', 'fitness']],
            ['name' => ['en' => 'Camping Tent 4-Person', 'ar' => 'خيمة تخييم 4 أشخاص'], 'description' => ['en' => 'Weather-resistant tent.', 'ar' => 'خيمة مقاومة للطقس.'], 'price' => 149.99, 'keywords' => ['tent', 'camping']],
            ['name' => ['en' => 'Running Shoes Athletic', 'ar' => 'أحذية جري رياضية'], 'description' => ['en' => 'Lightweight running shoes.', 'ar' => 'أحذية جري خفيفة.'], 'price' => 79.99, 'keywords' => ['running', 'shoes']],
            ['name' => ['en' => 'Hiking Backpack 40L', 'ar' => 'حقيبة ظهر 40 لتر'], 'description' => ['en' => 'Durable hiking backpack.', 'ar' => 'حقيبة ظهر متينة.'], 'price' => 69.99, 'keywords' => ['backpack', 'hiking']],
            ['name' => ['en' => 'Resistance Bands Set', 'ar' => 'مجموعة عصابات المقاومة'], 'description' => ['en' => 'Full-body resistance set.', 'ar' => 'مجموعة مقاومة كاملة.'], 'price' => 24.99, 'keywords' => ['resistance', 'fitness']],
            ['name' => ['en' => 'Modern Sofa 3-Seater', 'ar' => 'أريكة عصرية 3 مقاعد'], 'description' => ['en' => 'Comfortable modern sofa.', 'ar' => 'أريكة عصرية مريحة.'], 'price' => 899.99, 'keywords' => ['sofa', 'furniture']],
            ['name' => ['en' => 'Queen Memory Foam Mattress', 'ar' => 'مرتبة رغوة ذاكرة كوين'], 'description' => ['en' => 'Premium memory foam.', 'ar' => 'رغوة ذاكرة متميزة.'], 'price' => 599.99, 'keywords' => ['mattress', 'bed']],
            ['name' => ['en' => 'LED Floor Lamp Modern', 'ar' => 'مصباح أرضي LED عصري'], 'description' => ['en' => 'Adjustable LED lamp.', 'ar' => 'مصباح LED قابل للتعديل.'], 'price' => 79.99, 'keywords' => ['lamp', 'LED']],
            ['name' => ['en' => 'Garden Tool Set 10-Piece', 'ar' => 'مجموعة أدوات حديقة 10 قطع'], 'description' => ['en' => 'Complete garden tool set.', 'ar' => 'مجموعة أدوات حديقة كاملة.'], 'price' => 49.99, 'keywords' => ['garden', 'tools']],
            ['name' => ['en' => 'Stainless Steel Cookware Set', 'ar' => 'مجموعة أواني طهي'], 'description' => ['en' => 'Professional cookware set.', 'ar' => 'مجموعة أواني احترافية.'], 'price' => 199.99, 'keywords' => ['cookware', 'kitchen']],
            ['name' => ['en' => 'Indoor Plant Collection 5-Pack', 'ar' => 'مجموعة نباتات داخلية 5 قطع'], 'description' => ['en' => 'Indoor plants for decoration.', 'ar' => 'نباتات داخلية للديكور.'], 'price' => 39.99, 'keywords' => ['plants', 'indoor']],
            ['name' => ['en' => 'Luxury Bedding Set King', 'ar' => 'مجموعة فراش فاخرة كينغ'], 'description' => ['en' => 'Premium cotton bedding.', 'ar' => 'فراش قطن متميز.'], 'price' => 129.99, 'keywords' => ['bedding', 'bedroom']],
            ['name' => ['en' => 'Wall Art Canvas Set 3-Piece', 'ar' => 'مجموعة لوحات 3 قطع'], 'description' => ['en' => 'Modern wall art set.', 'ar' => 'مجموعة لوحات عصرية.'], 'price' => 89.99, 'keywords' => ['wall art', 'decoration']],
            ['name' => ['en' => 'Bestselling Fiction Novel', 'ar' => 'رواية خيال الأكثر مبيعاً'], 'description' => ['en' => 'Award-winning fiction.', 'ar' => 'رواية خيال حائزة على جوائز.'], 'price' => 16.99, 'keywords' => ['book', 'fiction']],
            ['name' => ['en' => 'Programming Guide Advanced', 'ar' => 'دليل البرمجة المتقدم'], 'description' => ['en' => 'Advanced programming guide.', 'ar' => 'دليل برمجة متقدم.'], 'price' => 49.99, 'keywords' => ['programming', 'book']],
            ['name' => ['en' => 'Children\'s Storybook Collection', 'ar' => 'مجموعة قصص أطفال'], 'description' => ['en' => 'Illustrated storybook collection.', 'ar' => 'مجموعة قصص مصورة.'], 'price' => 19.99, 'keywords' => ['children', 'books']],
            ['name' => ['en' => 'Engine Oil Premium 5W-30', 'ar' => 'زيت محرك متميز 5W-30'], 'description' => ['en' => 'Synthetic engine oil.', 'ar' => 'زيت محرك اصطناعي.'], 'price' => 34.99, 'keywords' => ['engine oil', 'automotive']],
            ['name' => ['en' => 'Brake Pads Set Front & Rear', 'ar' => 'وسادات فرامل أمامية وخلفية'], 'description' => ['en' => 'Premium brake pads.', 'ar' => 'وسادات فرامل متميزة.'], 'price' => 79.99, 'keywords' => ['brake', 'automotive']],
            ['name' => ['en' => 'Car Battery 12V 60Ah', 'ar' => 'بطارية سيارة 12 فولت 60 أمبير'], 'description' => ['en' => 'Reliable car battery.', 'ar' => 'بطارية سيارة موثوقة.'], 'price' => 119.99, 'keywords' => ['battery', 'car']],
            ['name' => ['en' => 'Car Air Filter Premium', 'ar' => 'مرشح هواء سيارة متميز'], 'description' => ['en' => 'High-efficiency air filter.', 'ar' => 'مرشح هواء عالي الكفاءة.'], 'price' => 24.99, 'keywords' => ['air filter', 'car']],
            ['name' => ['en' => 'LED Headlight Bulbs Pair', 'ar' => 'زوج مصابيح LED أمامية'], 'description' => ['en' => 'Bright LED headlights.', 'ar' => 'مصابيح LED ساطعة.'], 'price' => 49.99, 'keywords' => ['headlights', 'LED']],
            ['name' => ['en' => 'Car Floor Mats Set 4-Piece', 'ar' => 'سجاد أرضية سيارة 4 قطع'], 'description' => ['en' => 'Durable floor mats.', 'ar' => 'سجاد أرضية متين.'], 'price' => 39.99, 'keywords' => ['floor mats', 'car']],
            ['name' => ['en' => 'Spark Plugs Set of 4', 'ar' => 'شمعات إشعال 4 قطع'], 'description' => ['en' => 'Premium spark plugs.', 'ar' => 'شمعات إشعال متميزة.'], 'price' => 29.99, 'keywords' => ['spark plugs', 'engine']],
            ['name' => ['en' => 'Car Phone Mount Universal', 'ar' => 'حامل هاتف سيارة عالمي'], 'description' => ['en' => 'Universal phone mount.', 'ar' => 'حامل هاتف عالمي.'], 'price' => 14.99, 'keywords' => ['phone mount', 'car']],
        ];
    }
}
