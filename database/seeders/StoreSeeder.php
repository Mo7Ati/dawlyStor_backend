<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\StoreCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreSeeder extends Seeder
{
    public function run()
    {
        DB::transaction(function () {
            // Disable auth guard requirement for Category creation
            Category::unsetEventDispatcher();

            // 8 Store Categories
            $storeCategories = [
                [
                    'name' => ['en' => 'Electronics & Technology', 'ar' => 'الإلكترونيات والتكنولوجيا'],
                    'description' => ['en' => 'Latest gadgets, smartphones, computers, and tech accessories', 'ar' => 'أحدث الأجهزة والهواتف الذكية وأجهزة الكمبيوتر وملحقات التكنولوجيا'],
                ],
                [
                    'name' => ['en' => 'Fashion & Apparel', 'ar' => 'الموضة والملابس'],
                    'description' => ['en' => 'Trendy clothing, shoes, accessories, and fashion items', 'ar' => 'ملابس عصرية وأحذية وإكسسوارات وعناصر الموضة'],
                ],
                [
                    'name' => ['en' => 'Food & Beverages', 'ar' => 'الطعام والمشروبات'],
                    'description' => ['en' => 'Fresh groceries, restaurant meals, beverages, and snacks', 'ar' => 'البقالة الطازجة ووجبات المطاعم والمشروبات والوجبات الخفيفة'],
                ],
                [
                    'name' => ['en' => 'Home & Garden', 'ar' => 'المنزل والحديقة'],
                    'description' => ['en' => 'Furniture, home decor, garden supplies, and household items', 'ar' => 'الأثاث وديكور المنزل ومستلزمات الحديقة والأدوات المنزلية'],
                ],
                [
                    'name' => ['en' => 'Health & Beauty', 'ar' => 'الصحة والجمال'],
                    'description' => ['en' => 'Cosmetics, skincare, health supplements, and personal care', 'ar' => 'مستحضرات التجميل والعناية بالبشرة والمكملات الصحية والعناية الشخصية'],
                ],
                [
                    'name' => ['en' => 'Sports & Outdoors', 'ar' => 'الرياضة والهواء الطلق'],
                    'description' => ['en' => 'Sports equipment, outdoor gear, fitness accessories, and athletic wear', 'ar' => 'معدات الرياضة ومعدات الهواء الطلق وإكسسوارات اللياقة البدنية والملابس الرياضية'],
                ],
                [
                    'name' => ['en' => 'Books & Media', 'ar' => 'الكتب والوسائط'],
                    'description' => ['en' => 'Books, magazines, movies, music, and educational materials', 'ar' => 'الكتب والمجلات والأفلام والموسيقى والمواد التعليمية'],
                ],
                [
                    'name' => ['en' => 'Automotive & Parts', 'ar' => 'السيارات وقطع الغيار'],
                    'description' => ['en' => 'Car parts, accessories, tools, and automotive services', 'ar' => 'قطع غيار السيارات والإكسسوارات والأدوات وخدمات السيارات'],
                ],
            ];

            $createdStoreCategories = [];
            foreach ($storeCategories as $index => $categoryData) {
                $storeCategory = StoreCategory::create($categoryData);
                $createdStoreCategories[] = $storeCategory;
            }

            // Stores data - 4 stores per category (32 stores total)
            $storesData = [
                // Electronics & Technology (4 stores)
                [
                    ['en' => 'TechHub Electronics', 'ar' => 'تيك هب للإلكترونيات'],
                    ['en' => '123 Main Street, Tech District', 'ar' => '123 شارع الرئيسي، حي التكنولوجيا'],
                    ['en' => 'Your one-stop shop for all electronics needs. We offer the latest smartphones, laptops, tablets, and accessories with competitive prices and excellent customer service.', 'ar' => 'متجرك الشامل لجميع احتياجاتك الإلكترونية. نقدم أحدث الهواتف الذكية وأجهزة الكمبيوتر المحمولة والأجهزة اللوحية والإكسسوارات بأسعار تنافسية وخدمة عملاء ممتازة.'],
                    'techhub@store.com',
                    '+1234567890',
                    ['smartphone', 'laptop', 'tablet', 'electronics', 'technology'],
                ],
                [
                    ['en' => 'Smart Devices Pro', 'ar' => 'برو للأجهزة الذكية'],
                    ['en' => '456 Innovation Boulevard', 'ar' => '456 جادة الابتكار'],
                    ['en' => 'Specializing in smart home devices, wearables, and IoT products. We help you build a connected lifestyle.', 'ar' => 'متخصصون في أجهزة المنزل الذكي والأجهزة القابلة للارتداء ومنتجات إنترنت الأشياء. نساعدك في بناء نمط حياة متصل.'],
                    'smartdevices@store.com',
                    '+1234567891',
                    ['smart home', 'wearables', 'IoT', 'connected devices'],
                ],
                [
                    ['en' => 'Gaming World', 'ar' => 'عالم الألعاب'],
                    ['en' => '789 Gaming Plaza', 'ar' => '789 ساحة الألعاب'],
                    ['en' => 'Everything for gamers! Gaming PCs, consoles, accessories, and the latest games. Your gaming paradise awaits.', 'ar' => 'كل شيء للاعبين! أجهزة الكمبيوتر للألعاب وأجهزة الألعاب والإكسسوارات وأحدث الألعاب. جنتك للألعاب في انتظارك.'],
                    'gamingworld@store.com',
                    '+1234567892',
                    ['gaming', 'console', 'PC', 'games', 'accessories'],
                ],
                [
                    ['en' => 'Audio Excellence', 'ar' => 'التميز الصوتي'],
                    ['en' => '321 Sound Avenue', 'ar' => '321 جادة الصوت'],
                    ['en' => 'Premium audio equipment including headphones, speakers, sound systems, and professional audio gear.', 'ar' => 'معدات صوتية متميزة تشمل سماعات الرأس ومكبرات الصوت وأنظمة الصوت ومعدات الصوت الاحترافية.'],
                    'audioexcellence@store.com',
                    '+1234567893',
                    ['audio', 'headphones', 'speakers', 'sound system'],
                ],
                // Fashion & Apparel (4 stores)
                [
                    ['en' => 'Style Boutique', 'ar' => 'بوتيك الأسلوب'],
                    ['en' => '100 Fashion Street', 'ar' => '100 شارع الموضة'],
                    ['en' => 'Trendy fashion for men and women. Latest collections from top designers at affordable prices.', 'ar' => 'موضة عصرية للرجال والنساء. أحدث المجموعات من كبار المصممين بأسعار معقولة.'],
                    'styleboutique@store.com',
                    '+1234567894',
                    ['fashion', 'clothing', 'style', 'boutique'],
                ],
                [
                    ['en' => 'Shoe Paradise', 'ar' => 'جنة الأحذية'],
                    ['en' => '200 Footwear Lane', 'ar' => '200 حارة الأحذية'],
                    ['en' => 'Wide selection of shoes for all occasions. From casual sneakers to formal dress shoes.', 'ar' => 'مجموعة واسعة من الأحذية لجميع المناسبات. من الأحذية الرياضية العادية إلى الأحذية الرسمية.'],
                    'shoeparadise@store.com',
                    '+1234567895',
                    ['shoes', 'footwear', 'sneakers', 'boots'],
                ],
                [
                    ['en' => 'Accessory World', 'ar' => 'عالم الإكسسوارات'],
                    ['en' => '300 Accessory Road', 'ar' => '300 طريق الإكسسوارات'],
                    ['en' => 'Complete your look with our collection of bags, watches, jewelry, and fashion accessories.', 'ar' => 'أكمل إطلالتك مع مجموعتنا من الحقائب والساعات والمجوهرات وإكسسوارات الموضة.'],
                    'accessoryworld@store.com',
                    '+1234567896',
                    ['accessories', 'bags', 'watches', 'jewelry'],
                ],
                [
                    ['en' => 'Kids Fashion Store', 'ar' => 'متجر أزياء الأطفال'],
                    ['en' => '400 Children Avenue', 'ar' => '400 جادة الأطفال'],
                    ['en' => 'Adorable and comfortable clothing for kids of all ages. Quality materials and fun designs.', 'ar' => 'ملابس رائعة ومريحة للأطفال من جميع الأعمار. مواد عالية الجودة وتصاميم ممتعة.'],
                    'kidsfashion@store.com',
                    '+1234567897',
                    ['kids', 'children', 'clothing', 'fashion'],
                ],
                // Food & Beverages (4 stores)
                [
                    ['en' => 'Fresh Market', 'ar' => 'السوق الطازج'],
                    ['en' => '500 Grocery Boulevard', 'ar' => '500 جادة البقالة'],
                    ['en' => 'Fresh fruits, vegetables, dairy products, and organic foods delivered to your door.', 'ar' => 'فواكه وخضروات طازجة ومنتجات ألبان وأطعمة عضوية يتم توصيلها إلى بابك.'],
                    'freshmarket@store.com',
                    '+1234567898',
                    ['groceries', 'fresh', 'organic', 'vegetables', 'fruits'],
                ],
                [
                    ['en' => 'Gourmet Kitchen', 'ar' => 'المطبخ الذواقة'],
                    ['en' => '600 Culinary Street', 'ar' => '600 شارع الطهي'],
                    ['en' => 'Premium ingredients, spices, sauces, and gourmet food items for the discerning chef.', 'ar' => 'مكونات متميزة وتوابل وصلصات وأطعمة ذواقة للطاهي المتميز.'],
                    'gourmetkitchen@store.com',
                    '+1234567899',
                    ['gourmet', 'ingredients', 'spices', 'premium'],
                ],
                [
                    ['en' => 'Beverage Central', 'ar' => 'مركز المشروبات'],
                    ['en' => '700 Drink Avenue', 'ar' => '700 جادة المشروبات'],
                    ['en' => 'Wide variety of beverages including coffee, tea, juices, soft drinks, and specialty drinks.', 'ar' => 'مجموعة واسعة من المشروبات تشمل القهوة والشاي والعصائر والمشروبات الغازية والمشروبات الخاصة.'],
                    'beveragecentral@store.com',
                    '+1234567900',
                    ['beverages', 'coffee', 'tea', 'juices', 'drinks'],
                ],
                [
                    ['en' => 'Sweet Treats Bakery', 'ar' => 'مخبز الحلويات'],
                    ['en' => '800 Dessert Lane', 'ar' => '800 حارة الحلويات'],
                    ['en' => 'Fresh baked goods, cakes, pastries, cookies, and custom desserts for every occasion.', 'ar' => 'مخبوزات طازجة وكعك ومعجنات وبسكويت وحلويات مخصصة لكل مناسبة.'],
                    'sweettreats@store.com',
                    '+1234567901',
                    ['bakery', 'cakes', 'pastries', 'desserts', 'sweets'],
                ],
                // Home & Garden (4 stores)
                [
                    ['en' => 'Home Decor Plus', 'ar' => 'ديكور المنزل بلس'],
                    ['en' => '900 Interior Design Road', 'ar' => '900 طريق التصميم الداخلي'],
                    ['en' => 'Transform your home with our collection of furniture, decor items, lighting, and home accessories.', 'ar' => 'حوّل منزلك مع مجموعتنا من الأثاث وعناصر الديكور والإضاءة وإكسسوارات المنزل.'],
                    'homedecor@store.com',
                    '+1234567902',
                    ['furniture', 'home decor', 'lighting', 'interior'],
                ],
                [
                    ['en' => 'Garden Paradise', 'ar' => 'جنة الحديقة'],
                    ['en' => '1000 Green Street', 'ar' => '1000 شارع الأخضر'],
                    ['en' => 'Everything for your garden: plants, seeds, tools, fertilizers, and garden decorations.', 'ar' => 'كل شيء لحديقتك: نباتات وبذور وأدوات وأسمدة وديكورات الحديقة.'],
                    'gardenparadise@store.com',
                    '+1234567903',
                    ['garden', 'plants', 'seeds', 'tools', 'fertilizers'],
                ],
                [
                    ['en' => 'Kitchen Essentials', 'ar' => 'أساسيات المطبخ'],
                    ['en' => '1100 Cookware Boulevard', 'ar' => '1100 جادة أواني الطهي'],
                    ['en' => 'Complete your kitchen with quality cookware, utensils, appliances, and storage solutions.', 'ar' => 'أكمل مطبخك بأواني طهي عالية الجودة وأدوات وأجهزة وحلول تخزين.'],
                    'kitchenessentials@store.com',
                    '+1234567904',
                    ['kitchen', 'cookware', 'utensils', 'appliances'],
                ],
                [
                    ['en' => 'Bed & Bath Collection', 'ar' => 'مجموعة غرفة النوم والحمام'],
                    ['en' => '1200 Comfort Avenue', 'ar' => '1200 جادة الراحة'],
                    ['en' => 'Luxurious bedding, towels, bath accessories, and bedroom essentials for ultimate comfort.', 'ar' => 'فراش فاخر ومناشف وإكسسوارات الحمام وأساسيات غرفة النوم للراحة القصوى.'],
                    'bedbath@store.com',
                    '+1234567905',
                    ['bedding', 'towels', 'bath', 'bedroom'],
                ],
                // Health & Beauty (4 stores)
                [
                    ['en' => 'Beauty Essentials', 'ar' => 'أساسيات الجمال'],
                    ['en' => '1300 Glamour Street', 'ar' => '1300 شارع الجمال'],
                    ['en' => 'Premium cosmetics, skincare products, makeup, and beauty tools from top brands.', 'ar' => 'مستحضرات تجميل متميزة ومنتجات العناية بالبشرة ومستحضرات التجميل وأدوات الجمال من العلامات التجارية الرائدة.'],
                    'beautyessentials@store.com',
                    '+1234567906',
                    ['cosmetics', 'makeup', 'skincare', 'beauty'],
                ],
                [
                    ['en' => 'Wellness Pharmacy', 'ar' => 'صيدلية العافية'],
                    ['en' => '1400 Health Boulevard', 'ar' => '1400 جادة الصحة'],
                    ['en' => 'Health supplements, vitamins, personal care products, and wellness items for a healthy lifestyle.', 'ar' => 'مكملات صحية وفيتامينات ومنتجات العناية الشخصية وعناصر العافية لنمط حياة صحي.'],
                    'wellnesspharmacy@store.com',
                    '+1234567907',
                    ['health', 'supplements', 'vitamins', 'wellness'],
                ],
                [
                    ['en' => 'Hair Care Pro', 'ar' => 'برو العناية بالشعر'],
                    ['en' => '1500 Salon Avenue', 'ar' => '1500 جادة الصالون'],
                    ['en' => 'Professional hair care products, styling tools, treatments, and hair accessories.', 'ar' => 'منتجات العناية بالشعر الاحترافية وأدوات التصفيف والعلاجات وإكسسوارات الشعر.'],
                    'haircarepro@store.com',
                    '+1234567908',
                    ['hair', 'shampoo', 'styling', 'treatment'],
                ],
                [
                    ['en' => 'Fragrance World', 'ar' => 'عالم العطور'],
                    ['en' => '1600 Perfume Lane', 'ar' => '1600 حارة العطور'],
                    ['en' => 'Luxury perfumes, colognes, body sprays, and fragrance accessories from renowned brands.', 'ar' => 'عطور فاخرة وكولونيا ورشاشات الجسم وإكسسوارات العطور من العلامات التجارية المشهورة.'],
                    'fragranceworld@store.com',
                    '+1234567909',
                    ['perfume', 'fragrance', 'cologne', 'scent'],
                ],
                // Sports & Outdoors (4 stores)
                [
                    ['en' => 'Sports Equipment Hub', 'ar' => 'مركز معدات الرياضة'],
                    ['en' => '1700 Athletic Road', 'ar' => '1700 طريق الرياضة'],
                    ['en' => 'Complete range of sports equipment for all activities: football, basketball, tennis, and more.', 'ar' => 'مجموعة كاملة من معدات الرياضة لجميع الأنشطة: كرة القدم وكرة السلة والتنس والمزيد.'],
                    'sportsequipment@store.com',
                    '+1234567910',
                    ['sports', 'equipment', 'football', 'basketball'],
                ],
                [
                    ['en' => 'Fitness Gear', 'ar' => 'معدات اللياقة البدنية'],
                    ['en' => '1800 Gym Street', 'ar' => '1800 شارع الجيم'],
                    ['en' => 'Gym equipment, weights, yoga mats, fitness accessories, and workout gear for your fitness journey.', 'ar' => 'معدات الجيم والأثقال وسجاد اليوغا وإكسسوارات اللياقة البدنية ومعدات التمرين لرحلتك اللياقة البدنية.'],
                    'fitnessgear@store.com',
                    '+1234567911',
                    ['fitness', 'gym', 'weights', 'yoga'],
                ],
                [
                    ['en' => 'Outdoor Adventures', 'ar' => 'مغامرات الهواء الطلق'],
                    ['en' => '1900 Camping Boulevard', 'ar' => '1900 جادة التخييم'],
                    ['en' => 'Camping gear, hiking equipment, outdoor clothing, and adventure essentials for nature lovers.', 'ar' => 'معدات التخييم ومعدات المشي لمسافات طويلة وملابس الهواء الطلق وأساسيات المغامرة لعشاق الطبيعة.'],
                    'outdooradventures@store.com',
                    '+1234567912',
                    ['camping', 'hiking', 'outdoor', 'adventure'],
                ],
                [
                    ['en' => 'Cycling Store', 'ar' => 'متجر الدراجات'],
                    ['en' => '2000 Bike Avenue', 'ar' => '2000 جادة الدراجات'],
                    ['en' => 'Bicycles, bike accessories, safety gear, and cycling equipment for all cycling enthusiasts.', 'ar' => 'دراجات وإكسسوارات الدراجات ومعدات السلامة ومعدات ركوب الدراجات لجميع عشاق ركوب الدراجات.'],
                    'cyclingstore@store.com',
                    '+1234567913',
                    ['bicycle', 'cycling', 'bike', 'safety gear'],
                ],
                // Books & Media (4 stores)
                [
                    ['en' => 'Book Haven', 'ar' => 'ملاذ الكتب'],
                    ['en' => '2100 Literature Street', 'ar' => '2100 شارع الأدب'],
                    ['en' => 'Extensive collection of books: fiction, non-fiction, academic, children books, and bestsellers.', 'ar' => 'مجموعة واسعة من الكتب: الخيال والواقعية والأكاديمية وكتب الأطفال والأكثر مبيعاً.'],
                    'bookhaven@store.com',
                    '+1234567914',
                    ['books', 'literature', 'fiction', 'reading'],
                ],
                [
                    ['en' => 'Educational Resources', 'ar' => 'الموارد التعليمية'],
                    ['en' => '2200 Learning Boulevard', 'ar' => '2200 جادة التعلم'],
                    ['en' => 'Textbooks, educational materials, stationery, and learning tools for students and educators.', 'ar' => 'كتب مدرسية ومواد تعليمية وقرطاسية وأدوات تعليمية للطلاب والمعلمين.'],
                    'educationalresources@store.com',
                    '+1234567915',
                    ['education', 'textbooks', 'stationery', 'learning'],
                ],
                [
                    ['en' => 'Music & Movies Store', 'ar' => 'متجر الموسيقى والأفلام'],
                    ['en' => '2300 Entertainment Avenue', 'ar' => '2300 جادة الترفيه'],
                    ['en' => 'CDs, DVDs, vinyl records, movie collections, and music accessories for entertainment lovers.', 'ar' => 'أقراص مدمجة وأقراص DVD وتسجيلات فينيل ومجموعات أفلام وإكسسوارات موسيقية لعشاق الترفيه.'],
                    'musicmovies@store.com',
                    '+1234567916',
                    ['music', 'movies', 'CDs', 'DVDs', 'entertainment'],
                ],
                [
                    ['en' => 'Magazine Central', 'ar' => 'مركز المجلات'],
                    ['en' => '2400 Press Road', 'ar' => '2400 طريق الصحافة'],
                    ['en' => 'Wide selection of magazines covering fashion, technology, sports, lifestyle, and current affairs.', 'ar' => 'مجموعة واسعة من المجلات تغطي الموضة والتكنولوجيا والرياضة ونمط الحياة والشؤون الجارية.'],
                    'magazinecentral@store.com',
                    '+1234567917',
                    ['magazines', 'periodicals', 'news', 'lifestyle'],
                ],
                // Automotive & Parts (4 stores)
                [
                    ['en' => 'Auto Parts Express', 'ar' => 'إكسبريس قطع غيار السيارات'],
                    ['en' => '2500 Car Parts Boulevard', 'ar' => '2500 جادة قطع غيار السيارات'],
                    ['en' => 'Genuine car parts, engine components, filters, brakes, and automotive accessories for all makes.', 'ar' => 'قطع غيار سيارات أصلية ومكونات المحرك ومرشحات وفرامل وإكسسوارات سيارات لجميع الماركات.'],
                    'autopartsexpress@store.com',
                    '+1234567918',
                    ['car parts', 'engine', 'brakes', 'filters'],
                ],
                [
                    ['en' => 'Tire & Wheel Center', 'ar' => 'مركز الإطارات والعجلات'],
                    ['en' => '2600 Tire Avenue', 'ar' => '2600 جادة الإطارات'],
                    ['en' => 'Quality tires, wheels, rims, and tire accessories for all vehicle types. Expert installation available.', 'ar' => 'إطارات عالية الجودة وعجلات وطوق وإكسسوارات إطارات لجميع أنواع المركبات. تركيب احترافي متاح.'],
                    'tirewheelcenter@store.com',
                    '+1234567919',
                    ['tires', 'wheels', 'rims', 'automotive'],
                ],
                [
                    ['en' => 'Car Care Products', 'ar' => 'منتجات العناية بالسيارات'],
                    ['en' => '2700 Maintenance Street', 'ar' => '2700 شارع الصيانة'],
                    ['en' => 'Car cleaning supplies, wax, polish, interior care products, and maintenance essentials.', 'ar' => 'مستلزمات تنظيف السيارات والشمع واللمعان ومنتجات العناية الداخلية وأساسيات الصيانة.'],
                    'carcareproducts@store.com',
                    '+1234567920',
                    ['car care', 'cleaning', 'wax', 'maintenance'],
                ],
                [
                    ['en' => 'Auto Accessories Plus', 'ar' => 'بلس إكسسوارات السيارات'],
                    ['en' => '2800 Accessory Road', 'ar' => '2800 طريق الإكسسوارات'],
                    ['en' => 'Car accessories, seat covers, floor mats, phone mounts, and customization items for your vehicle.', 'ar' => 'إكسسوارات السيارات وأغطية المقاعد وسجاد الأرضيات وحوامل الهواتف وعناصر التخصيص لمركبتك.'],
                    'autoaccessoriesplus@store.com',
                    '+1234567921',
                    ['accessories', 'seat covers', 'floor mats', 'customization'],
                ],
            ];

            $storeIndex = 0;
            foreach ($createdStoreCategories as $storeCategory) {
                // Create 4 stores for each category
                for ($i = 0; $i < 4; $i++) {
                    $storeData = $storesData[$storeIndex];
                    $store = Store::create([
                        'name' => $storeData[0],
                        'address' => $storeData[1],
                        'description' => $storeData[2],
                        'email' => $storeData[3],
                        'phone' => $storeData[4],
                        'password' => 'password123',
                        'category_id' => $storeCategory->id,
                        'delivery_time' => rand(30, 120), // 30 to 120 minutes
                        'keywords' => $storeData[5],
                        'social_media' => [
                            'facebook' => 'https://facebook.com/' . str_replace('@store.com', '', $storeData[3]),
                            'instagram' => 'https://instagram.com/' . str_replace('@store.com', '', $storeData[3]),
                            'twitter' => 'https://twitter.com/' . str_replace('@store.com', '', $storeData[3]),
                        ],
                        'is_active' => true,
                    ]);

                    // Create 5 product categories for each store
                    $storeCategoryName = $this->getEnglishTranslation($storeCategory, 'name');
                    $categoryNames = $this->getCategoryNamesForStore($storeCategoryName);
                    $createdCategories = [];
                    foreach ($categoryNames as $catName) {
                        $category = Category::create([
                            'name' => $catName,
                            'description' => [
                                'en' => 'Browse our selection of ' . strtolower($catName['en']) . ' products.',
                                'ar' => 'تصفح مجموعتنا من منتجات ' . strtolower($catName['ar']) . '.',
                            ],
                            'store_id' => $store->id,
                            'is_active' => true,
                        ]);
                        $createdCategories[] = $category;
                    }

                    // Create 10 products for each store
                    $storeCategoryName = $this->getEnglishTranslation($storeCategory, 'name');
                    $storeName = $this->getEnglishTranslation($store, 'name');
                    $productData = $this->getProductDataForStore($storeCategoryName, $storeName);
                    foreach ($productData as $index => $product) {
                        Product::create([
                            'uuid' => (string) Str::uuid(),
                            'name' => $product['name'],
                            'description' => $product['description'],
                            'price' => $product['price'],
                            'compare_price' => $product['compare_price'],
                            'store_id' => $store->id,
                            'category_id' => $createdCategories[$index % 5]->id, // Distribute across 5 categories
                            'keywords' => $product['keywords'],
                            'quantity' => $product['quantity'],
                            'is_active' => true,
                            'is_accepted' => true,
                        ]);
                    }

                    $storeIndex++;
                }
            }
        });
    }

    private function getCategoryNamesForStore($storeCategoryName)
    {
        $categoriesMap = [
            'Electronics & Technology' => [
                ['en' => 'Smartphones', 'ar' => 'الهواتف الذكية'],
                ['en' => 'Laptops & Computers', 'ar' => 'أجهزة الكمبيوتر المحمولة'],
                ['en' => 'Tablets', 'ar' => 'الأجهزة اللوحية'],
                ['en' => 'Accessories', 'ar' => 'الإكسسوارات'],
                ['en' => 'Audio Devices', 'ar' => 'الأجهزة الصوتية'],
            ],
            'Fashion & Apparel' => [
                ['en' => 'Men\'s Clothing', 'ar' => 'ملابس رجالية'],
                ['en' => 'Women\'s Clothing', 'ar' => 'ملابس نسائية'],
                ['en' => 'Shoes', 'ar' => 'الأحذية'],
                ['en' => 'Accessories', 'ar' => 'الإكسسوارات'],
                ['en' => 'Kids Wear', 'ar' => 'ملابس الأطفال'],
            ],
            'Food & Beverages' => [
                ['en' => 'Fresh Produce', 'ar' => 'المنتجات الطازجة'],
                ['en' => 'Dairy Products', 'ar' => 'منتجات الألبان'],
                ['en' => 'Beverages', 'ar' => 'المشروبات'],
                ['en' => 'Snacks', 'ar' => 'الوجبات الخفيفة'],
                ['en' => 'Pantry Items', 'ar' => 'أغراض المخزن'],
            ],
            'Home & Garden' => [
                ['en' => 'Furniture', 'ar' => 'الأثاث'],
                ['en' => 'Home Decor', 'ar' => 'ديكور المنزل'],
                ['en' => 'Garden Supplies', 'ar' => 'مستلزمات الحديقة'],
                ['en' => 'Kitchenware', 'ar' => 'أدوات المطبخ'],
                ['en' => 'Bedding', 'ar' => 'الفراش'],
            ],
            'Health & Beauty' => [
                ['en' => 'Skincare', 'ar' => 'العناية بالبشرة'],
                ['en' => 'Makeup', 'ar' => 'مستحضرات التجميل'],
                ['en' => 'Hair Care', 'ar' => 'العناية بالشعر'],
                ['en' => 'Fragrances', 'ar' => 'العطور'],
                ['en' => 'Health Supplements', 'ar' => 'المكملات الصحية'],
            ],
            'Sports & Outdoors' => [
                ['en' => 'Sports Equipment', 'ar' => 'معدات الرياضة'],
                ['en' => 'Fitness Gear', 'ar' => 'معدات اللياقة البدنية'],
                ['en' => 'Outdoor Gear', 'ar' => 'معدات الهواء الطلق'],
                ['en' => 'Athletic Wear', 'ar' => 'الملابس الرياضية'],
                ['en' => 'Sports Accessories', 'ar' => 'إكسسوارات الرياضة'],
            ],
            'Books & Media' => [
                ['en' => 'Fiction Books', 'ar' => 'كتب الخيال'],
                ['en' => 'Non-Fiction', 'ar' => 'الواقعية'],
                ['en' => 'Educational', 'ar' => 'التعليمية'],
                ['en' => 'Children\'s Books', 'ar' => 'كتب الأطفال'],
                ['en' => 'Media & Entertainment', 'ar' => 'الوسائط والترفيه'],
            ],
            'Automotive & Parts' => [
                ['en' => 'Engine Parts', 'ar' => 'قطع المحرك'],
                ['en' => 'Brake Systems', 'ar' => 'أنظمة الفرامل'],
                ['en' => 'Tires & Wheels', 'ar' => 'الإطارات والعجلات'],
                ['en' => 'Car Care', 'ar' => 'العناية بالسيارة'],
                ['en' => 'Accessories', 'ar' => 'الإكسسوارات'],
            ],
        ];

        return $categoriesMap[$storeCategoryName] ?? [
            ['en' => 'Category 1', 'ar' => 'الفئة 1'],
            ['en' => 'Category 2', 'ar' => 'الفئة 2'],
            ['en' => 'Category 3', 'ar' => 'الفئة 3'],
            ['en' => 'Category 4', 'ar' => 'الفئة 4'],
            ['en' => 'Category 5', 'ar' => 'الفئة 5'],
        ];
    }

    private function getProductDataForStore($storeCategoryName, $storeName)
    {
        $productsMap = [
            'Electronics & Technology' => [
                ['name' => ['en' => 'Premium Smartphone 128GB', 'ar' => 'هاتف ذكي متميز 128 جيجابايت'], 'description' => ['en' => 'Latest generation smartphone with advanced camera, fast processor, and long battery life.', 'ar' => 'هاتف ذكي من الجيل الأخير مع كاميرا متقدمة ومعالج سريع وعمر بطارية طويل.'], 'price' => 899.99, 'compare_price' => 1099.99, 'keywords' => ['smartphone', 'mobile', 'phone'], 'quantity' => 50],
                ['name' => ['en' => 'Gaming Laptop 16GB RAM', 'ar' => 'جهاز كمبيوتر محمول للألعاب 16 جيجابايت RAM'], 'description' => ['en' => 'High-performance gaming laptop with dedicated graphics card, perfect for gamers and content creators.', 'ar' => 'جهاز كمبيوتر محمول عالي الأداء للألعاب مع بطاقة رسومات مخصصة، مثالي للاعبين ومنشئي المحتوى.'], 'price' => 1499.99, 'compare_price' => 1799.99, 'keywords' => ['laptop', 'gaming', 'computer'], 'quantity' => 30],
                ['name' => ['en' => 'Wireless Bluetooth Headphones', 'ar' => 'سماعات لاسلكية بلوتوث'], 'description' => ['en' => 'Premium noise-cancelling headphones with crystal clear sound quality and 30-hour battery.', 'ar' => 'سماعات متميزة لإلغاء الضوضاء مع جودة صوت واضحة وعمر بطارية 30 ساعة.'], 'price' => 199.99, 'compare_price' => 249.99, 'keywords' => ['headphones', 'audio', 'bluetooth'], 'quantity' => 75],
                ['name' => ['en' => 'Smart Watch Series 8', 'ar' => 'ساعة ذكية سلسلة 8'], 'description' => ['en' => 'Feature-rich smartwatch with health tracking, GPS, and smartphone connectivity.', 'ar' => 'ساعة ذكية غنية بالميزات مع تتبع الصحة ونظام تحديد المواقع العالمي واتصال الهاتف الذكي.'], 'price' => 399.99, 'compare_price' => 499.99, 'keywords' => ['smartwatch', 'wearable', 'fitness'], 'quantity' => 60],
                ['name' => ['en' => '4K Ultra HD TV 55 inch', 'ar' => 'تلفزيون 4K فائق الوضوح 55 بوصة'], 'description' => ['en' => 'Stunning 4K display with HDR support, smart TV features, and immersive viewing experience.', 'ar' => 'شاشة 4K مذهلة مع دعم HDR وميزات التلفزيون الذكي وتجربة مشاهدة غامرة.'], 'price' => 799.99, 'compare_price' => 999.99, 'keywords' => ['TV', 'television', '4K'], 'quantity' => 25],
                ['name' => ['en' => 'Wireless Charging Pad', 'ar' => 'لوحة شحن لاسلكية'], 'description' => ['en' => 'Fast wireless charging pad compatible with all Qi-enabled devices.', 'ar' => 'لوحة شحن لاسلكية سريعة متوافقة مع جميع الأجهزة المدعومة بتقنية Qi.'], 'price' => 29.99, 'compare_price' => 39.99, 'keywords' => ['charger', 'wireless', 'accessory'], 'quantity' => 100],
                ['name' => ['en' => 'Portable Power Bank 20000mAh', 'ar' => 'بنك طاقة محمول 20000 مللي أمبير'], 'description' => ['en' => 'High-capacity power bank with fast charging and multiple USB ports.', 'ar' => 'بنك طاقة عالي السعة مع شحن سريع ومنافذ USB متعددة.'], 'price' => 49.99, 'compare_price' => 69.99, 'keywords' => ['power bank', 'charger', 'portable'], 'quantity' => 80],
                ['name' => ['en' => 'USB-C Hub Multiport Adapter', 'ar' => 'محول USB-C متعدد المنافذ'], 'description' => ['en' => 'Expand your laptop connectivity with HDMI, USB 3.0, SD card reader, and more.', 'ar' => 'وسّع اتصال جهاز الكمبيوتر المحمول مع HDMI وUSB 3.0 وقارئ بطاقة SD والمزيد.'], 'price' => 39.99, 'compare_price' => 59.99, 'keywords' => ['adapter', 'USB-C', 'hub'], 'quantity' => 90],
                ['name' => ['en' => 'Mechanical Gaming Keyboard', 'ar' => 'لوحة مفاتيح ميكانيكية للألعاب'], 'description' => ['en' => 'RGB backlit mechanical keyboard with customizable keys and fast response time.', 'ar' => 'لوحة مفاتيح ميكانيكية مضاءة بخلفية RGB مع مفاتيح قابلة للتخصيص ووقت استجابة سريع.'], 'price' => 129.99, 'compare_price' => 159.99, 'keywords' => ['keyboard', 'gaming', 'mechanical'], 'quantity' => 55],
                ['name' => ['en' => 'Wireless Mouse Ergonomic', 'ar' => 'فأرة لاسلكية مريحة'], 'description' => ['en' => 'Comfortable ergonomic wireless mouse with precision tracking and long battery life.', 'ar' => 'فأرة لاسلكية مريحة مع تتبع دقيق وعمر بطارية طويل.'], 'price' => 34.99, 'compare_price' => 49.99, 'keywords' => ['mouse', 'wireless', 'ergonomic'], 'quantity' => 70],
            ],
            'Fashion & Apparel' => [
                ['name' => ['en' => 'Classic Denim Jeans', 'ar' => 'بنطلون جينز كلاسيكي'], 'description' => ['en' => 'Comfortable and stylish denim jeans with perfect fit and durable material.', 'ar' => 'بنطلون جينز مريح وأنيق مع قصة مثالية ومواد متينة.'], 'price' => 79.99, 'compare_price' => 99.99, 'keywords' => ['jeans', 'denim', 'pants'], 'quantity' => 100],
                ['name' => ['en' => 'Cotton T-Shirt Premium', 'ar' => 'قميص قطني متميز'], 'description' => ['en' => 'Soft cotton t-shirt available in multiple colors, perfect for everyday wear.', 'ar' => 'قميص قطني ناعم متوفر بألوان متعددة، مثالي للارتداء اليومي.'], 'price' => 24.99, 'compare_price' => 34.99, 'keywords' => ['t-shirt', 'cotton', 'casual'], 'quantity' => 200],
                ['name' => ['en' => 'Leather Jacket Classic', 'ar' => 'سترة جلدية كلاسيكية'], 'description' => ['en' => 'Genuine leather jacket with timeless design and excellent craftsmanship.', 'ar' => 'سترة جلدية أصلية بتصميم خالد وحرفية ممتازة.'], 'price' => 299.99, 'compare_price' => 399.99, 'keywords' => ['jacket', 'leather', 'outerwear'], 'quantity' => 40],
                ['name' => ['en' => 'Running Sneakers Sport', 'ar' => 'أحذية رياضية للجري'], 'description' => ['en' => 'Comfortable running shoes with cushioned sole and breathable material.', 'ar' => 'أحذية جري مريحة مع نعل مبطّن ومواد قابلة للتنفس.'], 'price' => 89.99, 'compare_price' => 119.99, 'keywords' => ['sneakers', 'running', 'shoes'], 'quantity' => 80],
                ['name' => ['en' => 'Designer Handbag Leather', 'ar' => 'حقيبة يد مصممة جلدية'], 'description' => ['en' => 'Elegant leather handbag with multiple compartments and stylish design.', 'ar' => 'حقيبة يد جلدية أنيقة مع أقسام متعددة وتصميم أنيق.'], 'price' => 199.99, 'compare_price' => 249.99, 'keywords' => ['handbag', 'leather', 'accessory'], 'quantity' => 50],
                ['name' => ['en' => 'Silk Scarf Premium', 'ar' => 'وشاح حريري متميز'], 'description' => ['en' => 'Luxurious silk scarf with beautiful patterns, perfect accessory for any outfit.', 'ar' => 'وشاح حريري فاخر بأنماط جميلة، إكسسوار مثالي لأي إطلالة.'], 'price' => 49.99, 'compare_price' => 69.99, 'keywords' => ['scarf', 'silk', 'accessory'], 'quantity' => 120],
                ['name' => ['en' => 'Wool Winter Coat', 'ar' => 'معطف شتوي صوفي'], 'description' => ['en' => 'Warm and stylish winter coat made from premium wool material.', 'ar' => 'معطف شتوي دافئ وأنيق مصنوع من مواد صوفية متميزة.'], 'price' => 179.99, 'compare_price' => 229.99, 'keywords' => ['coat', 'winter', 'wool'], 'quantity' => 60],
                ['name' => ['en' => 'Casual Dress Summer', 'ar' => 'فستان صيفي عادي'], 'description' => ['en' => 'Light and comfortable summer dress perfect for warm weather occasions.', 'ar' => 'فستان صيفي خفيف ومريح مثالي لمناسبات الطقس الدافئ.'], 'price' => 59.99, 'compare_price' => 79.99, 'keywords' => ['dress', 'summer', 'casual'], 'quantity' => 90],
                ['name' => ['en' => 'Leather Belt Classic', 'ar' => 'حزام جلدي كلاسيكي'], 'description' => ['en' => 'Genuine leather belt with adjustable buckle, essential wardrobe accessory.', 'ar' => 'حزام جلدي أصلي مع إبزيم قابل للتعديل، إكسسوار أساسي للخزانة.'], 'price' => 34.99, 'compare_price' => 49.99, 'keywords' => ['belt', 'leather', 'accessory'], 'quantity' => 150],
                ['name' => ['en' => 'Sports Cap Adjustable', 'ar' => 'قبعة رياضية قابلة للتعديل'], 'description' => ['en' => 'Comfortable sports cap with adjustable strap and breathable fabric.', 'ar' => 'قبعة رياضية مريحة مع حزام قابل للتعديل ونسيج قابل للتنفس.'], 'price' => 19.99, 'compare_price' => 29.99, 'keywords' => ['cap', 'sports', 'accessory'], 'quantity' => 180],
            ],
            'Food & Beverages' => [
                ['name' => ['en' => 'Organic Fresh Strawberries', 'ar' => 'فراولة طازجة عضوية'], 'description' => ['en' => 'Fresh organic strawberries, locally sourced and pesticide-free.', 'ar' => 'فراولة عضوية طازجة، من مصادر محلية وخالية من المبيدات.'], 'price' => 5.99, 'compare_price' => 7.99, 'keywords' => ['strawberries', 'organic', 'fresh'], 'quantity' => 200],
                ['name' => ['en' => 'Premium Arabica Coffee Beans', 'ar' => 'حبوب قهوة أرابيكا متميزة'], 'description' => ['en' => '100% Arabica coffee beans, freshly roasted for rich flavor and aroma.', 'ar' => 'حبوب قهوة أرابيكا 100%، محمصة طازجة لنكهة ورائحة غنية.'], 'price' => 24.99, 'compare_price' => 34.99, 'keywords' => ['coffee', 'beans', 'arabica'], 'quantity' => 150],
                ['name' => ['en' => 'Fresh Whole Milk 1 Gallon', 'ar' => 'حليب كامل طازج 1 جالون'], 'description' => ['en' => 'Fresh whole milk from local farms, pasteurized and rich in nutrients.', 'ar' => 'حليب كامل طازج من مزارع محلية، مبستر وغني بالعناصر الغذائية.'], 'price' => 4.99, 'compare_price' => 6.99, 'keywords' => ['milk', 'dairy', 'fresh'], 'quantity' => 300],
                ['name' => ['en' => 'Artisan Sourdough Bread', 'ar' => 'خبز خميرة طبيعي حرفي'], 'description' => ['en' => 'Freshly baked artisan sourdough bread with crispy crust and soft interior.', 'ar' => 'خبز خميرة طبيعي حرفي مخبوز طازج بقشرة مقرمشة وداخل ناعم.'], 'price' => 6.99, 'compare_price' => 8.99, 'keywords' => ['bread', 'sourdough', 'artisan'], 'quantity' => 100],
                ['name' => ['en' => 'Organic Free-Range Eggs 12 Pack', 'ar' => 'بيض عضوي من حظائر حرة 12 قطعة'], 'description' => ['en' => 'Premium organic eggs from free-range chickens, rich in protein.', 'ar' => 'بيض عضوي متميز من دجاج حظائر حرة، غني بالبروتين.'], 'price' => 7.99, 'compare_price' => 9.99, 'keywords' => ['eggs', 'organic', 'free-range'], 'quantity' => 250],
                ['name' => ['en' => 'Fresh Salmon Fillet 1lb', 'ar' => 'شرائح سلمون طازجة 1 رطل'], 'description' => ['en' => 'Fresh Atlantic salmon fillet, rich in omega-3 fatty acids.', 'ar' => 'شرائح سلمون أطلسي طازجة، غنية بأحماض أوميغا 3 الدهنية.'], 'price' => 18.99, 'compare_price' => 24.99, 'keywords' => ['salmon', 'fish', 'fresh'], 'quantity' => 80],
                ['name' => ['en' => 'Extra Virgin Olive Oil 500ml', 'ar' => 'زيت زيتون بكر ممتاز 500 مل'], 'description' => ['en' => 'Premium extra virgin olive oil, cold-pressed and full of flavor.', 'ar' => 'زيت زيتون بكر ممتاز متميز، معصور على البارد وغني بالنكهة.'], 'price' => 12.99, 'compare_price' => 16.99, 'keywords' => ['olive oil', 'cooking', 'premium'], 'quantity' => 120],
                ['name' => ['en' => 'Organic Honey Raw 16oz', 'ar' => 'عسل عضوي خام 16 أونصة'], 'description' => ['en' => 'Pure raw organic honey, unfiltered and packed with natural enzymes.', 'ar' => 'عسل عضوي خام نقي، غير مصفى ومحشو بالإنزيمات الطبيعية.'], 'price' => 14.99, 'compare_price' => 19.99, 'keywords' => ['honey', 'organic', 'raw'], 'quantity' => 90],
                ['name' => ['en' => 'Fresh Spinach Bunch', 'ar' => 'حزمة سبانخ طازجة'], 'description' => ['en' => 'Fresh organic spinach, rich in iron and vitamins.', 'ar' => 'سبانخ عضوية طازجة، غنية بالحديد والفيتامينات.'], 'price' => 3.99, 'compare_price' => 5.99, 'keywords' => ['spinach', 'vegetables', 'organic'], 'quantity' => 180],
                ['name' => ['en' => 'Premium Dark Chocolate Bar', 'ar' => 'لوح شوكولاتة داكنة متميزة'], 'description' => ['en' => 'Luxurious dark chocolate bar with 70% cocoa content, perfect for indulgence.', 'ar' => 'لوح شوكولاتة داكنة فاخرة مع محتوى كاكاو 70%، مثالي للاستمتاع.'], 'price' => 8.99, 'compare_price' => 12.99, 'keywords' => ['chocolate', 'dark', 'premium'], 'quantity' => 200],
            ],
            'Home & Garden' => [
                ['name' => ['en' => 'Modern Sofa 3-Seater', 'ar' => 'أريكة عصرية 3 مقاعد'], 'description' => ['en' => 'Comfortable modern sofa with premium fabric upholstery and sturdy frame.', 'ar' => 'أريكة عصرية مريحة مع تنجيد قماشي متميز وإطار متين.'], 'price' => 899.99, 'compare_price' => 1199.99, 'keywords' => ['sofa', 'furniture', 'living room'], 'quantity' => 15],
                ['name' => ['en' => 'Queen Size Memory Foam Mattress', 'ar' => 'مرتبة رغوة الذاكرة حجم كوين'], 'description' => ['en' => 'Premium memory foam mattress for ultimate comfort and support.', 'ar' => 'مرتبة رغوة ذاكرة متميزة للراحة والدعم المثاليين.'], 'price' => 599.99, 'compare_price' => 799.99, 'keywords' => ['mattress', 'bed', 'memory foam'], 'quantity' => 20],
                ['name' => ['en' => 'LED Floor Lamp Modern', 'ar' => 'مصباح أرضي LED عصري'], 'description' => ['en' => 'Stylish LED floor lamp with adjustable brightness and modern design.', 'ar' => 'مصباح أرضي LED أنيق مع سطوع قابل للتعديل وتصميم عصري.'], 'price' => 79.99, 'compare_price' => 109.99, 'keywords' => ['lamp', 'LED', 'lighting'], 'quantity' => 50],
                ['name' => ['en' => 'Garden Tool Set 10-Piece', 'ar' => 'مجموعة أدوات الحديقة 10 قطع'], 'description' => ['en' => 'Complete garden tool set with ergonomic handles and rust-resistant materials.', 'ar' => 'مجموعة أدوات حديقة كاملة مع مقابض مريحة ومواد مقاومة للصدأ.'], 'price' => 49.99, 'compare_price' => 69.99, 'keywords' => ['garden tools', 'gardening', 'tools'], 'quantity' => 60],
                ['name' => ['en' => 'Stainless Steel Cookware Set', 'ar' => 'مجموعة أواني طهي من الفولاذ المقاوم للصدأ'], 'description' => ['en' => 'Professional-grade cookware set with non-stick coating and heat-resistant handles.', 'ar' => 'مجموعة أواني طهي من الدرجة الاحترافية مع طلاء غير لاصق ومقابض مقاومة للحرارة.'], 'price' => 199.99, 'compare_price' => 279.99, 'keywords' => ['cookware', 'kitchen', 'stainless steel'], 'quantity' => 30],
                ['name' => ['en' => 'Indoor Plant Collection 5-Pack', 'ar' => 'مجموعة نباتات داخلية 5 قطع'], 'description' => ['en' => 'Beautiful indoor plants perfect for home decoration and air purification.', 'ar' => 'نباتات داخلية جميلة مثالية لديكور المنزل وتنقية الهواء.'], 'price' => 39.99, 'compare_price' => 59.99, 'keywords' => ['plants', 'indoor', 'decoration'], 'quantity' => 80],
                ['name' => ['en' => 'Luxury Bedding Set King Size', 'ar' => 'مجموعة فراش فاخرة حجم كينغ'], 'description' => ['en' => 'Premium cotton bedding set with elegant design and soft texture.', 'ar' => 'مجموعة فراش قطنية متميزة بتصميم أنيق وملمس ناعم.'], 'price' => 129.99, 'compare_price' => 179.99, 'keywords' => ['bedding', 'sheets', 'bedroom'], 'quantity' => 40],
                ['name' => ['en' => 'Wall Art Canvas Set 3-Piece', 'ar' => 'مجموعة لوحات قماشية 3 قطع'], 'description' => ['en' => 'Modern wall art canvas set to enhance your home decor.', 'ar' => 'مجموعة لوحات قماشية عصرية لتعزيز ديكور منزلك.'], 'price' => 89.99, 'compare_price' => 129.99, 'keywords' => ['wall art', 'decoration', 'canvas'], 'quantity' => 35],
                ['name' => ['en' => 'Garden Hose 50ft with Nozzle', 'ar' => 'خرطوم حديقة 50 قدم مع فوهة'], 'description' => ['en' => 'Durable garden hose with adjustable nozzle for efficient watering.', 'ar' => 'خرطوم حديقة متين مع فوهة قابلة للتعديل للري الفعال.'], 'price' => 34.99, 'compare_price' => 49.99, 'keywords' => ['hose', 'garden', 'watering'], 'quantity' => 70],
                ['name' => ['en' => 'Storage Baskets Set 6-Piece', 'ar' => 'مجموعة سلال تخزين 6 قطع'], 'description' => ['en' => 'Stylish storage baskets for organizing your home beautifully.', 'ar' => 'سلال تخزين أنيقة لتنظيم منزلك بشكل جميل.'], 'price' => 44.99, 'compare_price' => 64.99, 'keywords' => ['storage', 'baskets', 'organization'], 'quantity' => 55],
            ],
            'Health & Beauty' => [
                ['name' => ['en' => 'Vitamin C Serum 30ml', 'ar' => 'مصل فيتامين سي 30 مل'], 'description' => ['en' => 'Brightening vitamin C serum for radiant and even skin tone.', 'ar' => 'مصل فيتامين سي مضيء للبشرة المتوهجة والمتساوية.'], 'price' => 29.99, 'compare_price' => 39.99, 'keywords' => ['serum', 'vitamin C', 'skincare'], 'quantity' => 100],
                ['name' => ['en' => 'Hydrating Face Moisturizer', 'ar' => 'مرطب وجه مرطب'], 'description' => ['en' => 'Deeply hydrating face moisturizer with hyaluronic acid for all skin types.', 'ar' => 'مرطب وجه مرطب بعمق مع حمض الهيالورونيك لجميع أنواع البشرة.'], 'price' => 24.99, 'compare_price' => 34.99, 'keywords' => ['moisturizer', 'face', 'hydrating'], 'quantity' => 120],
                ['name' => ['en' => 'Matte Lipstick Set 6 Colors', 'ar' => 'مجموعة أحمر شفاه مات 6 ألوان'], 'description' => ['en' => 'Long-lasting matte lipstick set in trending colors with smooth application.', 'ar' => 'مجموعة أحمر شفاه مات طويل الأمد بألوان عصرية مع تطبيق سلس.'], 'price' => 19.99, 'compare_price' => 29.99, 'keywords' => ['lipstick', 'makeup', 'matte'], 'quantity' => 150],
                ['name' => ['en' => 'Professional Hair Dryer', 'ar' => 'مجفف شعر احترافي'], 'description' => ['en' => 'Ionic hair dryer with multiple heat settings and cool shot button.', 'ar' => 'مجفف شعر أيوني مع إعدادات حرارة متعددة وزر تدفق هواء بارد.'], 'price' => 79.99, 'compare_price' => 109.99, 'keywords' => ['hair dryer', 'hair care', 'styling'], 'quantity' => 60],
                ['name' => ['en' => 'Luxury Perfume 50ml', 'ar' => 'عطر فاخر 50 مل'], 'description' => ['en' => 'Elegant long-lasting perfume with sophisticated fragrance notes.', 'ar' => 'عطر أنيق طويل الأمد مع نوتات عطرية متطورة.'], 'price' => 89.99, 'compare_price' => 119.99, 'keywords' => ['perfume', 'fragrance', 'luxury'], 'quantity' => 80],
                ['name' => ['en' => 'Multivitamin Supplement 60 Tablets', 'ar' => 'مكمل متعدد الفيتامينات 60 قرص'], 'description' => ['en' => 'Complete multivitamin supplement for daily nutritional support.', 'ar' => 'مكمل متعدد الفيتامينات كامل للدعم الغذائي اليومي.'], 'price' => 16.99, 'compare_price' => 24.99, 'keywords' => ['vitamins', 'supplements', 'health'], 'quantity' => 200],
                ['name' => ['en' => 'Sunscreen SPF 50 100ml', 'ar' => 'واقي شمس SPF 50 100 مل'], 'description' => ['en' => 'Broad-spectrum sunscreen with SPF 50 for maximum sun protection.', 'ar' => 'واقي شمس واسع الطيف مع SPF 50 للحماية القصوى من الشمس.'], 'price' => 18.99, 'compare_price' => 26.99, 'keywords' => ['sunscreen', 'SPF', 'protection'], 'quantity' => 140],
                ['name' => ['en' => 'Face Cleansing Brush', 'ar' => 'فرشاة تنظيف الوجه'], 'description' => ['en' => 'Sonic facial cleansing brush for deep pore cleansing and exfoliation.', 'ar' => 'فرشاة تنظيف وجهية صوتية لتنظيف المسام العميق والتقشير.'], 'price' => 39.99, 'compare_price' => 59.99, 'keywords' => ['cleansing brush', 'skincare', 'exfoliation'], 'quantity' => 90],
                ['name' => ['en' => 'Hair Shampoo & Conditioner Set', 'ar' => 'مجموعة شامبو وبلسم للشعر'], 'description' => ['en' => 'Nourishing shampoo and conditioner set for healthy and shiny hair.', 'ar' => 'مجموعة شامبو وبلسم مغذية للشعر الصحي واللامع.'], 'price' => 22.99, 'compare_price' => 32.99, 'keywords' => ['shampoo', 'conditioner', 'hair care'], 'quantity' => 110],
                ['name' => ['en' => 'Nail Polish Set 12 Colors', 'ar' => 'مجموعة طلاء أظافر 12 لون'], 'description' => ['en' => 'Long-lasting nail polish set in vibrant colors with glossy finish.', 'ar' => 'مجموعة طلاء أظافر طويل الأمد بألوان نابضة بالحياة مع لمسة نهائية لامعة.'], 'price' => 14.99, 'compare_price' => 22.99, 'keywords' => ['nail polish', 'makeup', 'beauty'], 'quantity' => 130],
            ],
            'Sports & Outdoors' => [
                ['name' => ['en' => 'Professional Football', 'ar' => 'كرة قدم احترافية'], 'description' => ['en' => 'Official size and weight football with durable construction for professional play.', 'ar' => 'كرة قدم بالحجم والوزن الرسميين مع بناء متين للعب الاحترافي.'], 'price' => 34.99, 'compare_price' => 49.99, 'keywords' => ['football', 'soccer', 'sports'], 'quantity' => 80],
                ['name' => ['en' => 'Yoga Mat Premium 6mm', 'ar' => 'سجادة يوغا متميزة 6 مم'], 'description' => ['en' => 'Non-slip premium yoga mat with extra cushioning for comfort.', 'ar' => 'سجادة يوغا متميزة غير قابلة للانزلاق مع وسادة إضافية للراحة.'], 'price' => 29.99, 'compare_price' => 39.99, 'keywords' => ['yoga mat', 'fitness', 'yoga'], 'quantity' => 100],
                ['name' => ['en' => 'Dumbbell Set 20kg Pair', 'ar' => 'مجموعة دمبل 20 كجم زوج'], 'description' => ['en' => 'Adjustable dumbbell set with comfortable grips for home workouts.', 'ar' => 'مجموعة دمبل قابلة للتعديل مع مقابض مريحة لتمارين المنزل.'], 'price' => 89.99, 'compare_price' => 119.99, 'keywords' => ['dumbbells', 'weights', 'fitness'], 'quantity' => 50],
                ['name' => ['en' => 'Camping Tent 4-Person', 'ar' => 'خيمة تخييم 4 أشخاص'], 'description' => ['en' => 'Weather-resistant camping tent with easy setup and spacious interior.', 'ar' => 'خيمة تخييم مقاومة للطقس مع إعداد سهل وداخل فسيح.'], 'price' => 149.99, 'compare_price' => 199.99, 'keywords' => ['tent', 'camping', 'outdoor'], 'quantity' => 30],
                ['name' => ['en' => 'Running Shoes Athletic', 'ar' => 'أحذية جري رياضية'], 'description' => ['en' => 'Lightweight running shoes with cushioned sole and breathable mesh.', 'ar' => 'أحذية جري خفيفة الوزن مع نعل مبطّن وشبكة قابلة للتنفس.'], 'price' => 79.99, 'compare_price' => 109.99, 'keywords' => ['running shoes', 'athletic', 'fitness'], 'quantity' => 70],
                ['name' => ['en' => 'Basketball Official Size', 'ar' => 'كرة سلة بالحجم الرسمي'], 'description' => ['en' => 'Official size basketball with premium grip and durable construction.', 'ar' => 'كرة سلة بالحجم الرسمي مع قبضة متميزة وبناء متين.'], 'price' => 39.99, 'compare_price' => 54.99, 'keywords' => ['basketball', 'sports', 'ball'], 'quantity' => 60],
                ['name' => ['en' => 'Hiking Backpack 40L', 'ar' => 'حقيبة ظهر للمشي 40 لتر'], 'description' => ['en' => 'Durable hiking backpack with multiple compartments and hydration system.', 'ar' => 'حقيبة ظهر متينة للمشي مع أقسام متعددة ونظام الترطيب.'], 'price' => 69.99, 'compare_price' => 99.99, 'keywords' => ['backpack', 'hiking', 'outdoor'], 'quantity' => 45],
                ['name' => ['en' => 'Resistance Bands Set', 'ar' => 'مجموعة عصابات المقاومة'], 'description' => ['en' => 'Complete resistance bands set with different resistance levels for full-body workout.', 'ar' => 'مجموعة عصابات مقاومة كاملة مع مستويات مقاومة مختلفة لتمرين كامل للجسم.'], 'price' => 24.99, 'compare_price' => 34.99, 'keywords' => ['resistance bands', 'fitness', 'workout'], 'quantity' => 90],
                ['name' => ['en' => 'Tennis Racket Professional', 'ar' => 'مضرب تنس احترافي'], 'description' => ['en' => 'Professional tennis racket with carbon fiber construction and comfortable grip.', 'ar' => 'مضرب تنس احترافي مع بناء من ألياف الكربون وقبضة مريحة.'], 'price' => 119.99, 'compare_price' => 159.99, 'keywords' => ['tennis racket', 'tennis', 'sports'], 'quantity' => 40],
                ['name' => ['en' => 'Swimming Goggles Anti-Fog', 'ar' => 'نظارات سباحة مضادة للضباب'], 'description' => ['en' => 'Comfortable swimming goggles with anti-fog technology and UV protection.', 'ar' => 'نظارات سباحة مريحة مع تقنية مضادة للضباب وحماية من الأشعة فوق البنفسجية.'], 'price' => 19.99, 'compare_price' => 29.99, 'keywords' => ['goggles', 'swimming', 'sports'], 'quantity' => 85],
            ],
            'Books & Media' => [
                ['name' => ['en' => 'Bestselling Fiction Novel', 'ar' => 'رواية خيال الأكثر مبيعاً'], 'description' => ['en' => 'Award-winning fiction novel with captivating storyline and rich character development.', 'ar' => 'رواية خيال حائزة على جوائز مع قصة ساحرة وتطوير شخصيات غني.'], 'price' => 16.99, 'compare_price' => 24.99, 'keywords' => ['book', 'fiction', 'novel'], 'quantity' => 150],
                ['name' => ['en' => 'Programming Guide Advanced', 'ar' => 'دليل البرمجة المتقدم'], 'description' => ['en' => 'Comprehensive programming guide covering advanced concepts and best practices.', 'ar' => 'دليل برمجة شامل يغطي المفاهيم المتقدمة وأفضل الممارسات.'], 'price' => 49.99, 'compare_price' => 69.99, 'keywords' => ['programming', 'book', 'education'], 'quantity' => 80],
                ['name' => ['en' => 'Children\'s Storybook Collection', 'ar' => 'مجموعة قصص أطفال'], 'description' => ['en' => 'Beautifully illustrated children\'s storybook collection with engaging stories.', 'ar' => 'مجموعة قصص أطفال مصورة بشكل جميل مع قصص جذابة.'], 'price' => 19.99, 'compare_price' => 29.99, 'keywords' => ['children', 'books', 'stories'], 'quantity' => 120],
                ['name' => ['en' => 'Music Album CD', 'ar' => 'ألبوم موسيقي CD'], 'description' => ['en' => 'Latest music album from popular artist available on CD format.', 'ar' => 'أحدث ألبوم موسيقي من فنان مشهور متاح بصيغة CD.'], 'price' => 14.99, 'compare_price' => 19.99, 'keywords' => ['music', 'CD', 'album'], 'quantity' => 200],
                ['name' => ['en' => 'Movie Collection Blu-ray', 'ar' => 'مجموعة أفلام Blu-ray'], 'description' => ['en' => 'Classic movie collection in high-definition Blu-ray format.', 'ar' => 'مجموعة أفلام كلاسيكية بصيغة Blu-ray عالية الوضوح.'], 'price' => 24.99, 'compare_price' => 34.99, 'keywords' => ['movies', 'Blu-ray', 'entertainment'], 'quantity' => 100],
                ['name' => ['en' => 'Art Supplies Sketchbook Set', 'ar' => 'مجموعة لوازم فنية دفتر رسم'], 'description' => ['en' => 'Complete art supplies set with sketchbook, pencils, and drawing tools.', 'ar' => 'مجموعة لوازم فنية كاملة مع دفتر رسم وأقلام رصاص وأدوات رسم.'], 'price' => 29.99, 'compare_price' => 39.99, 'keywords' => ['art supplies', 'sketchbook', 'drawing'], 'quantity' => 90],
                ['name' => ['en' => 'Language Learning Course', 'ar' => 'دورة تعلم اللغة'], 'description' => ['en' => 'Comprehensive language learning course with audio CDs and workbook.', 'ar' => 'دورة تعلم لغة شاملة مع أقراص صوتية وكتاب تمارين.'], 'price' => 39.99, 'compare_price' => 54.99, 'keywords' => ['language', 'education', 'learning'], 'quantity' => 70],
                ['name' => ['en' => 'Magazine Subscription Annual', 'ar' => 'اشتراك مجلة سنوي'], 'description' => ['en' => 'Annual subscription to popular lifestyle magazine with 12 monthly issues.', 'ar' => 'اشتراك سنوي في مجلة نمط حياة شائعة مع 12 عدد شهري.'], 'price' => 49.99, 'compare_price' => 69.99, 'keywords' => ['magazine', 'subscription', 'lifestyle'], 'quantity' => 60],
                ['name' => ['en' => 'Vinyl Record Classic Album', 'ar' => 'أسطوانة فينيل ألبوم كلاسيكي'], 'description' => ['en' => 'Classic music album on vinyl record format for audiophiles.', 'ar' => 'ألبوم موسيقي كلاسيكي بصيغة أسطوانة فينيل لعشاق الصوت.'], 'price' => 34.99, 'compare_price' => 44.99, 'keywords' => ['vinyl', 'record', 'music'], 'quantity' => 50],
                ['name' => ['en' => 'Educational Puzzle Set', 'ar' => 'مجموعة ألغاز تعليمية'], 'description' => ['en' => 'Educational puzzle set designed to enhance learning and problem-solving skills.', 'ar' => 'مجموعة ألغاز تعليمية مصممة لتعزيز التعلم ومهارات حل المشكلات.'], 'price' => 22.99, 'compare_price' => 32.99, 'keywords' => ['puzzle', 'education', 'learning'], 'quantity' => 110],
            ],
            'Automotive & Parts' => [
                ['name' => ['en' => 'Engine Oil Premium 5W-30', 'ar' => 'زيت محرك متميز 5W-30'], 'description' => ['en' => 'High-performance synthetic engine oil for optimal engine protection.', 'ar' => 'زيت محرك اصطناعي عالي الأداء للحماية المثلى للمحرك.'], 'price' => 34.99, 'compare_price' => 49.99, 'keywords' => ['engine oil', 'motor oil', 'automotive'], 'quantity' => 150],
                ['name' => ['en' => 'Brake Pads Set Front & Rear', 'ar' => 'مجموعة وسادات فرامل أمامية وخلفية'], 'description' => ['en' => 'Premium brake pads set with excellent stopping power and durability.', 'ar' => 'مجموعة وسادات فرامل متميزة مع قوة توقف ممتازة ومتانة.'], 'price' => 79.99, 'compare_price' => 109.99, 'keywords' => ['brake pads', 'brakes', 'automotive'], 'quantity' => 60],
                ['name' => ['en' => 'Car Battery 12V 60Ah', 'ar' => 'بطارية سيارة 12 فولت 60 أمبير ساعة'], 'description' => ['en' => 'Reliable car battery with long lifespan and excellent cold-cranking performance.', 'ar' => 'بطارية سيارة موثوقة بعمر طويل وأداء بدء بارد ممتاز.'], 'price' => 119.99, 'compare_price' => 159.99, 'keywords' => ['battery', 'car battery', 'automotive'], 'quantity' => 40],
                ['name' => ['en' => 'All-Season Tires Set of 4', 'ar' => 'مجموعة إطارات لجميع الفصول 4 قطع'], 'description' => ['en' => 'High-quality all-season tires with excellent traction and long tread life.', 'ar' => 'إطارات عالية الجودة لجميع الفصول مع جر ممتاز وعمر مداس طويل.'], 'price' => 449.99, 'compare_price' => 599.99, 'keywords' => ['tires', 'all-season', 'automotive'], 'quantity' => 25],
                ['name' => ['en' => 'Car Air Filter Premium', 'ar' => 'مرشح هواء سيارة متميز'], 'description' => ['en' => 'High-efficiency air filter for improved engine performance and air quality.', 'ar' => 'مرشح هواء عالي الكفاءة لتحسين أداء المحرك وجودة الهواء.'], 'price' => 24.99, 'compare_price' => 34.99, 'keywords' => ['air filter', 'car filter', 'automotive'], 'quantity' => 100],
                ['name' => ['en' => 'Car Wax Polish Premium', 'ar' => 'شمع تلميع سيارة متميز'], 'description' => ['en' => 'Premium car wax for long-lasting shine and protection against elements.', 'ar' => 'شمع سيارة متميز لللمعان طويل الأمد والحماية من العناصر.'], 'price' => 19.99, 'compare_price' => 29.99, 'keywords' => ['car wax', 'polish', 'car care'], 'quantity' => 120],
                ['name' => ['en' => 'LED Headlight Bulbs Pair', 'ar' => 'زوج مصابيح LED أمامية'], 'description' => ['en' => 'Bright LED headlight bulbs with improved visibility and energy efficiency.', 'ar' => 'مصابيح LED أمامية ساطعة مع تحسين الرؤية وكفاءة الطاقة.'], 'price' => 49.99, 'compare_price' => 69.99, 'keywords' => ['headlights', 'LED', 'bulbs'], 'quantity' => 80],
                ['name' => ['en' => 'Car Floor Mats Set 4-Piece', 'ar' => 'مجموعة سجاد أرضية سيارة 4 قطع'], 'description' => ['en' => 'Durable car floor mats with custom fit and easy-to-clean material.', 'ar' => 'سجاد أرضية سيارة متين مع قياس مخصص ومواد سهلة التنظيف.'], 'price' => 39.99, 'compare_price' => 54.99, 'keywords' => ['floor mats', 'car accessories', 'interior'], 'quantity' => 70],
                ['name' => ['en' => 'Spark Plugs Set of 4', 'ar' => 'مجموعة شمعات إشعال 4 قطع'], 'description' => ['en' => 'Premium spark plugs for improved engine performance and fuel efficiency.', 'ar' => 'شمعات إشعال متميزة لتحسين أداء المحرك وكفاءة الوقود.'], 'price' => 29.99, 'compare_price' => 39.99, 'keywords' => ['spark plugs', 'engine', 'automotive'], 'quantity' => 90],
                ['name' => ['en' => 'Car Phone Mount Universal', 'ar' => 'حامل هاتف سيارة عالمي'], 'description' => ['en' => 'Universal car phone mount with secure grip and adjustable angle.', 'ar' => 'حامل هاتف سيارة عالمي مع قبضة آمنة وزاوية قابلة للتعديل.'], 'price' => 14.99, 'compare_price' => 24.99, 'keywords' => ['phone mount', 'car accessory', 'mount'], 'quantity' => 140],
            ],
        ];

        // Return products based on store category
        $baseProducts = $productsMap[$storeCategoryName] ?? [];
        
        // Return first 10 products (or all if less than 10)
        return array_slice($baseProducts, 0, 10);
    }

    /**
     * Safely extract English translation from a translatable attribute
     */
    private function getEnglishTranslation($model, $attribute)
    {
        // Try getTranslations first (Spatie HasTranslations method)
        if (method_exists($model, 'getTranslations')) {
            $translations = $model->getTranslations($attribute);
            if (is_array($translations) && isset($translations['en'])) {
                return $translations['en'];
            }
        }

        // Try direct access if it's already an array
        $value = $model->getAttribute($attribute);
        if (is_array($value) && isset($value['en'])) {
            return $value['en'];
        }

        // Try to decode from raw attributes (JSON string)
        $rawValue = $model->getAttributes()[$attribute] ?? null;
        if (is_string($rawValue)) {
            $decoded = json_decode($rawValue, true);
            if (is_array($decoded) && isset($decoded['en'])) {
                return $decoded['en'];
            }
        }

        // Fallback: return as string if all else fails
        return is_string($value) ? $value : '';
    }
}
