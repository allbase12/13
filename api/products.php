<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$jsonPath = __DIR__ . '/products.json';
if (!file_exists($jsonPath)) {
    echo json_encode(['error' => 'Database file not found.']);
    exit;
}

$rawProducts = json_decode(file_get_contents($jsonPath), true);

// Helper to categorize products
function getCategory($name) {
    $name = strtolower($name);
    
    // PC Games keywords
    $pcKeywords = ['steam', 'nintendo', 'pc', 'valorant', 'league of legends', 'conquer', 'ea fc', 'point blank', 'lost saga', 'roblox', 'r6', 'rainbow six', 'division'];
    // Voucher / Apps keywords
    $appKeywords = ['tinder', 'bigo', 'starmaker', 'poppo', 'mixu', 'nonton', 'bioskop', 'google play', 'itunes', 'apple', 'psn', 'tinder', 'bookbot', 'mentalup', 'kidoland', 'codinggame'];
    
    foreach ($pcKeywords as $kw) {
        if (strpos($name, $kw) !== false) {
            return 'pc';
        }
    }
    
    foreach ($appKeywords as $kw) {
        if (strpos($name, $kw) !== false) {
            return 'vouchers';
        }
    }
    
    return 'mobile'; // Default category
}

// Inject category and a unique ID for each product
$products = [];
foreach ($rawProducts as $index => $prod) {
    $name = $prod['name'];
    $category = getCategory($name);
    
    // Make a URL friendly ID
    $id = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
    $id = trim($id, '-');
    
    $products[] = [
        'id' => $id,
        'name' => $name,
        'image' => $prod['image'],
        'link' => $prod['link'],
        'category' => $category
    ];
}

// Check if a single product package detail is requested
if (isset($_GET['game_id'])) {
    $gameId = $_GET['game_id'];
    $foundGame = null;
    
    foreach ($products as $p) {
        if ($p['id'] === $gameId) {
            $foundGame = $p;
            break;
        }
    }
    
    if (!$foundGame) {
        echo json_encode(['error' => 'Game not found.']);
        exit;
    }
    
    // Mock packages based on game name
    $packages = [];
    $nameLower = strtolower($foundGame['name']);
    
    if (strpos($nameLower, 'mobile legends') !== false || strpos($nameLower, 'mlbb') !== false || strpos($nameLower, 'magic chess') !== false) {
        $packages = [
            ['id' => 'ml_5', 'name' => '5 Diamonds', 'price' => 1500, 'promo' => false],
            ['id' => 'ml_12', 'name' => '12 Diamonds', 'price' => 3500, 'promo' => false],
            ['id' => 'ml_50', 'name' => '50 Diamonds', 'price' => 15000, 'promo' => false],
            ['id' => 'ml_100', 'name' => '100 Diamonds', 'price' => 29500, 'promo' => true, 'promo_text' => 'Popular'],
            ['id' => 'ml_250', 'name' => '250 Diamonds', 'price' => 74000, 'promo' => false],
            ['id' => 'ml_500', 'name' => '500 Diamonds', 'price' => 145000, 'promo' => true, 'promo_text' => 'Best Value'],
            ['id' => 'ml_1000', 'name' => '1000 Diamonds', 'price' => 290000, 'promo' => false],
            ['id' => 'ml_starlight', 'name' => 'Starlight Member', 'price' => 139000, 'promo' => false],
            ['id' => 'ml_twilight', 'name' => 'Twilight Pass', 'price' => 149000, 'promo' => false]
        ];
    } elseif (strpos($nameLower, 'free fire') !== false || strpos($nameLower, 'ff') !== false) {
        $packages = [
            ['id' => 'ff_5', 'name' => '5 Diamonds', 'price' => 1000, 'promo' => false],
            ['id' => 'ff_12', 'name' => '12 Diamonds', 'price' => 2200, 'promo' => false],
            ['id' => 'ff_50', 'name' => '50 Diamonds', 'price' => 9000, 'promo' => false],
            ['id' => 'ff_140', 'name' => '140 Diamonds', 'price' => 24000, 'promo' => true, 'promo_text' => 'Hot Seller'],
            ['id' => 'ff_355', 'name' => '355 Diamonds', 'price' => 59000, 'promo' => false],
            ['id' => 'ff_720', 'name' => '720 Diamonds', 'price' => 112000, 'promo' => true, 'promo_text' => 'Save 10%'],
            ['id' => 'ff_weekly', 'name' => 'Weekly Membership', 'price' => 29000, 'promo' => false],
            ['id' => 'ff_monthly', 'name' => 'Monthly Membership', 'price' => 119000, 'promo' => false]
        ];
    } elseif (strpos($nameLower, 'valorant') !== false) {
        $packages = [
            ['id' => 'val_125', 'name' => '125 Valorant Points', 'price' => 14500, 'promo' => false],
            ['id' => 'val_380', 'name' => '380 Valorant Points', 'price' => 42000, 'promo' => false],
            ['id' => 'val_790', 'name' => '790 Valorant Points', 'price' => 88000, 'promo' => true, 'promo_text' => 'Most Popular'],
            ['id' => 'val_1650', 'name' => '1650 Valorant Points', 'price' => 175000, 'promo' => false],
            ['id' => 'val_2850', 'name' => '2850 Valorant Points', 'price' => 295000, 'promo' => true, 'promo_text' => 'Bonus Included'],
            ['id' => 'val_5800', 'name' => '5800 Valorant Points', 'price' => 580000, 'promo' => false]
        ];
    } elseif (strpos($nameLower, 'pubg') !== false) {
        $packages = [
            ['id' => 'pubg_30', 'name' => '30 + 2 Unknown Cash', 'price' => 7000, 'promo' => false],
            ['id' => 'pubg_60', 'name' => '60 + 4 Unknown Cash', 'price' => 14000, 'promo' => false],
            ['id' => 'pubg_300', 'name' => '300 + 25 Unknown Cash', 'price' => 69000, 'promo' => true, 'promo_text' => 'Hot'],
            ['id' => 'pubg_600', 'name' => '600 + 60 Unknown Cash', 'price' => 139000, 'promo' => true, 'promo_text' => 'Best Value'],
            ['id' => 'pubg_1500', 'name' => '1500 + 300 Unknown Cash', 'price' => 349000, 'promo' => false]
        ];
    } elseif ($foundGame['category'] === 'vouchers') {
        // Generic app subscription/voucher packages
        $packages = [
            ['id' => 'app_basic', 'name' => 'Basic Pass / Promo', 'price' => 20000, 'promo' => false],
            ['id' => 'app_medium', 'name' => 'Premium Pass (1 Month)', 'price' => 50000, 'promo' => true, 'promo_text' => 'Best Seller'],
            ['id' => 'app_vip', 'name' => 'VIP Club (3 Months)', 'price' => 135000, 'promo' => false],
            ['id' => 'app_annual', 'name' => 'Ultimate Year Pass', 'price' => 450000, 'promo' => true, 'promo_text' => 'Save 30%']
        ];
    } else {
        // Generic game top up packages
        $packages = [
            ['id' => 'game_eco', 'name' => 'Eco Top-Up (Small Box)', 'price' => 10000, 'promo' => false],
            ['id' => 'game_standard', 'name' => 'Standard Pack', 'price' => 25000, 'promo' => false],
            ['id' => 'game_pro', 'name' => 'Warrior Chest (500 Credits)', 'price' => 65000, 'promo' => true, 'promo_text' => 'Recommended'],
            ['id' => 'game_epic', 'name' => 'Hero Vault (1200 Credits)', 'price' => 150000, 'promo' => true, 'promo_text' => 'Bonus Credits'],
            ['id' => 'game_legend', 'name' => 'Legendary Cache (3000 Credits)', 'price' => 350000, 'promo' => false]
        ];
    }
    
    // Add payment methods
    $paymentMethods = [
        ['id' => 'qris', 'name' => 'QRIS (Gopay/OVO/Dana)', 'fee' => 0, 'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg'],
        ['id' => 'gopay', 'name' => 'GoPay', 'fee' => 100, 'image' => 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg'],
        ['id' => 'dana', 'name' => 'DANA', 'fee' => 100, 'image' => 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg'],
        ['id' => 'shopeepay', 'name' => 'ShopeePay', 'fee' => 150, 'image' => 'https://upload.wikimedia.org/wikipedia/commons/e/fe/ShopeePay-Logo.svg'],
        ['id' => 'alfamart', 'name' => 'Alfamart', 'fee' => 2500, 'image' => 'https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg'],
        ['id' => 'indomaret', 'name' => 'Indomaret', 'fee' => 2500, 'image' => 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Logo_Indomaret.svg']
    ];
    
    echo json_encode([
        'game' => $foundGame,
        'packages' => $packages,
        'payment_methods' => $paymentMethods
    ]);
    exit;
}

// Handle search query
if (isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
    $filtered = [];
    foreach ($products as $p) {
        if (strpos(strtolower($p['name']), $q) !== false) {
            $filtered[] = $p;
        }
    }
    $products = $filtered;
}

// Handle category filter
if (isset($_GET['category'])) {
    $cat = strtolower($_GET['category']);
    if ($cat !== 'all') {
        $filtered = [];
        foreach ($products as $p) {
            if ($p['category'] === $cat) {
                $filtered[] = $p;
            }
        }
        $products = $filtered;
    }
}

echo json_encode($products);
?>
