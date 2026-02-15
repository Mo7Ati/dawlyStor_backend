<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Enums\PermissionsEnum;
use App\Http\Controllers\Controller;
use App\Enums\OrderStatusEnum;
use App\Enums\TransactionTypeEnum;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Platform;
use App\Models\Product;
use App\Models\Store;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), PermissionsEnum::DASHBOARD_INDEX->value);

        $stats = $this->getDashboardStats();
        $ordersAndRevenuesOverTime = $this->getOrdersAndRevenuesOverTime();
        $customersOverTime = $this->getCustomersOverTime();
        $storesOverTime = $this->getStoresOverTime();
        $ordersByStatus = $this->getOrdersByStatus();
        $orderRevenueOverTime = $this->getOrderRevenueOverTime();
        $subscriptionRevenueOverTime = $this->getSubscriptionRevenueOverTime();
        $platformCommissionOverTime = $this->getPlatformCommissionOverTime();
        $productsOverTime = $this->getProductsOverTime();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'chartData' => [
                'ordersAndRevenuesOverTime' => $ordersAndRevenuesOverTime,
                'customersOverTime' => $customersOverTime,
                'storesOverTime' => $storesOverTime,
                'ordersByStatus' => $ordersByStatus,
                'orderRevenueOverTime' => $orderRevenueOverTime,
                'subscriptionRevenueOverTime' => $subscriptionRevenueOverTime,
                'platformCommissionOverTime' => $platformCommissionOverTime,
                'productsOverTime' => $productsOverTime,
            ],
        ]);
    }

    /**
     * Aggregate stats: total and new-this-month counts with percentage for customers, stores, orders.
     */
    private function getDashboardStats(): array
    {
        $startOfMonth = now()->startOfMonth();

        $customersTotal = Customer::query()->count();
        $customersNewThisMonth = Customer::query()->where('created_at', '>=', $startOfMonth)->count();
        $storesTotal = Store::query()->count();
        $storesNewThisMonth = Store::query()->where('created_at', '>=', $startOfMonth)->count();
        $ordersTotal = Order::query()->count();
        $ordersNewThisMonth = Order::query()->where('created_at', '>=', $startOfMonth)->count();

        $orderRevenueTotal = (float) Order::query()->where('payment_status', 'paid')->sum('total');
        $orderRevenueNewThisMonth = (float) Order::query()
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total');

        $platformCommissionTotal = $this->getPlatformTransactionTotal(null);
        $platformCommissionNewThisMonth = $this->getPlatformTransactionTotal($startOfMonth);

        $subscriptionRevenueTotal = $this->getSubscriptionTransactionTotal(null);
        $subscriptionRevenueNewThisMonth = $this->getSubscriptionTransactionTotal($startOfMonth);

        $productsTotal = Product::query()->count();
        $productsNewThisMonth = Product::query()->where('created_at', '>=', $startOfMonth)->count();

        $paidOrdersTotal = (int) Order::query()->where('payment_status', 'paid')->count();
        $paidOrdersNewThisMonth = (int) Order::query()
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfMonth)
            ->count();
        $averageOrderValueTotal = $paidOrdersTotal > 0 ? round($orderRevenueTotal / $paidOrdersTotal, 2) : 0.0;
        $averageOrderValueNewThisMonth = $paidOrdersNewThisMonth > 0
            ? round($orderRevenueNewThisMonth / $paidOrdersNewThisMonth, 2)
            : 0.0;

        $percent = static function (int $newCount, int $total): float {
            return $total > 0 ? round((float) ($newCount / $total) * 100, 1) : 0.0;
        };

        return [
            'customers' => [
                'total' => $customersTotal,
                'new_this_month' => $customersNewThisMonth,
                'new_this_month_percent' => $percent($customersNewThisMonth, $customersTotal),
            ],
            'stores' => [
                'total' => $storesTotal,
                'new_this_month' => $storesNewThisMonth,
                'new_this_month_percent' => $percent($storesNewThisMonth, $storesTotal),
            ],
            'orders' => [
                'total' => $ordersTotal,
                'new_this_month' => $ordersNewThisMonth,
                'new_this_month_percent' => $percent($ordersNewThisMonth, $ordersTotal),
            ],
            'order_revenue' => [
                'total' => round($orderRevenueTotal, 2),
                'new_this_month' => round($orderRevenueNewThisMonth, 2),
                'new_this_month_percent' => 0,
            ],
            'platform_commission' => [
                'total' => round($platformCommissionTotal, 2),
                'new_this_month' => round($platformCommissionNewThisMonth, 2),
                'new_this_month_percent' => 0,
            ],
            'subscription_revenue' => [
                'total' => round($subscriptionRevenueTotal, 2),
                'new_this_month' => round($subscriptionRevenueNewThisMonth, 2),
                'new_this_month_percent' => 0,
            ],
            'products' => [
                'total' => $productsTotal,
                'new_this_month' => $productsNewThisMonth,
                'new_this_month_percent' => $percent($productsNewThisMonth, $productsTotal),
            ],
            'average_order_value' => [
                'total' => $averageOrderValueTotal,
                'new_this_month' => $averageOrderValueNewThisMonth,
                'new_this_month_percent' => 0,
            ],
        ];
    }

    /**
     * Sum platform fee deposits (transactions) to platform wallet. Amounts in cents, returns in main currency.
     */
    private function getPlatformTransactionTotal(?\DateTimeInterface $from): float
    {
        $platform = Platform::query()->first();
        if (! $platform instanceof Platform) {
            return 0.0;
        }
        $type = TransactionTypeEnum::DEPOSIT_PLATFORM_FEE_TO_PLATFORM_WALLET->value;
        $query = Transaction::query()
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('wallets.holder_type', Platform::class)
            ->where('wallets.holder_id', $platform->getKey())
            ->where('transactions.type', 'deposit')
            ->where('transactions.meta->type', $type);
        if ($from !== null) {
            $query->where('transactions.created_at', '>=', $from);
        }
        $sum = (float) $query->sum('transactions.amount');
        return $sum / 100;
    }

    /**
     * Sum subscription deposits (transactions) to platform wallet. Amounts in cents, returns in main currency.
     */
    private function getSubscriptionTransactionTotal(?\DateTimeInterface $from): float
    {
        $platform = Platform::query()->first();
        if (! $platform instanceof Platform) {
            return 0.0;
        }
        $type = TransactionTypeEnum::DEPOSIT_STORE_SUBSCRIPTION_TO_PLATFORM_WALLET->value;
        $query = Transaction::query()
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('wallets.holder_type', Platform::class)
            ->where('wallets.holder_id', $platform->getKey())
            ->where('transactions.type', 'deposit')
            ->where('transactions.meta->type', $type);
        if ($from !== null) {
            $query->where('transactions.created_at', '>=', $from);
        }
        $sum = (float) $query->sum('transactions.amount');
        return $sum / 100;
    }

    /**
     * Last 90 days: daily orders count and revenue for time-series chart.
     */
    private function getOrdersAndRevenuesOverTime(): array
    {
        $days = 90;
        $start = now()->subDays($days)->startOfDay();

        $query = Order::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('date(created_at) as date, count(*) as orders_count, coalesce(sum(total), 0) as revenue')
            ->groupBy('date')
            ->orderBy('date');

        $rows = $query->get()->keyBy('date');

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $row = $rows->get($date);
            $result[] = [
                'date' => $date,
                'orders_count' => (int) ($row->orders_count ?? 0),
                'revenue' => (float) ($row->revenue ?? 0),
            ];
        }
        return $result;
    }

    /**
     * Last 30 days: new customers per day for stats chart.
     */
    private function getCustomersOverTime(): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();

        $rows = Customer::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('date(created_at) as period, count(*) as count')
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $period = $date->format('Y-m-d');
            $label = $date->format('M j');
            $result[] = [
                'period' => $period,
                'label' => $label,
                'count' => (int) ($rows->get($period)?->count ?? 0),
            ];
        }

        return $result;
    }

    /**
     * Last 30 days: new stores per day for stats chart.
     */
    private function getStoresOverTime(): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();

        $rows = Store::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('date(created_at) as period, count(*) as count')
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $period = $date->format('Y-m-d');
            $label = $date->format('M j');
            $result[] = [
                'period' => $period,
                'label' => $label,
                'count' => (int) ($rows->get($period)?->count ?? 0),
            ];
        }

        return $result;
    }

    /**
     * Last 30 days: new products per day for stats chart.
     */
    private function getProductsOverTime(): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();

        $rows = Product::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('date(created_at) as period, count(*) as count')
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $period = $date->format('Y-m-d');
            $label = $date->format('M j');
            $result[] = [
                'period' => $period,
                'label' => $label,
                'count' => (int) ($rows->get($period)?->count ?? 0),
            ];
        }

        return $result;
    }

    /**
     * Last 30 days: order revenue (paid orders) per day for stats chart.
     */
    private function getOrderRevenueOverTime(): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();

        $rows = Order::query()
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $start)
            ->selectRaw('date(created_at) as period, coalesce(sum(total), 0) as value')
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $period = $date->format('Y-m-d');
            $label = $date->format('M j');
            $result[] = [
                'period' => $period,
                'label' => $label,
                'value' => (float) ($rows->get($period)?->value ?? 0),
            ];
        }

        return $result;
    }

    /**
     * Last 30 days: subscription revenue (platform wallet deposits) per day for stats chart.
     */
    private function getSubscriptionRevenueOverTime(): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();
        $platform = Platform::query()->first();
        if (! $platform instanceof Platform) {
            $result = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $result[] = [
                    'period' => $date->format('Y-m-d'),
                    'label' => $date->format('M j'),
                    'value' => 0.0,
                ];
            }
            return $result;
        }

        $subscriptionType = TransactionTypeEnum::DEPOSIT_STORE_SUBSCRIPTION_TO_PLATFORM_WALLET->value;
        $rows = Transaction::query()
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('wallets.holder_type', Platform::class)
            ->where('wallets.holder_id', $platform->getKey())
            ->where('transactions.type', 'deposit')
            ->where('transactions.meta->type', $subscriptionType)
            ->where('transactions.created_at', '>=', $start)
            ->selectRaw('date(transactions.created_at) as period, coalesce(sum(transactions.amount), 0) as total')
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $period = $date->format('Y-m-d');
            $label = $date->format('M j');
            $raw = (float) ($rows->get($period)?->total ?? 0);
            $result[] = [
                'period' => $period,
                'label' => $label,
                'value' => $raw / 100,
            ];
        }

        return $result;
    }

    /**
     * Last 30 days: platform commission (platform fee deposits) per day for stats chart.
     */
    private function getPlatformCommissionOverTime(): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();
        $platform = Platform::query()->first();
        if (! $platform instanceof Platform) {
            $result = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $result[] = [
                    'period' => $date->format('Y-m-d'),
                    'label' => $date->format('M j'),
                    'value' => 0.0,
                ];
            }
            return $result;
        }

        $feeType = TransactionTypeEnum::DEPOSIT_PLATFORM_FEE_TO_PLATFORM_WALLET->value;
        $rows = Transaction::query()
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('wallets.holder_type', Platform::class)
            ->where('wallets.holder_id', $platform->getKey())
            ->where('transactions.type', 'deposit')
            ->where('transactions.meta->type', $feeType)
            ->where('transactions.created_at', '>=', $start)
            ->selectRaw('date(transactions.created_at) as period, coalesce(sum(transactions.amount), 0) as total')
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $period = $date->format('Y-m-d');
            $label = $date->format('M j');
            $raw = (float) ($rows->get($period)?->total ?? 0);
            $result[] = [
                'period' => $period,
                'label' => $label,
                'value' => $raw / 100,
            ];
        }

        return $result;
    }

    /**
     * Order counts grouped by status for donut chart.
     */
    private function getOrdersByStatus(): array
    {
        $locale = app()->getLocale();
        $counts = Order::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $result = [];
        foreach (OrderStatusEnum::cases() as $status) {
            $result[] = [
                'status' => $status->value,
                'label' => $status->label(),
                'count' => (int) ($counts->get($status->value, 0)),
            ];
        }

        return $result;
    }

    /**
     * Top 10 stores by revenue (paid orders) for bar chart.
     */
    private function getRevenueByStore(): array
    {
        $revenues = Order::query()
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(90))
            ->selectRaw('store_id, sum(total) as revenue')
            ->groupBy('store_id')
            ->orderByDesc('revenue')
            ->limit(10)
            ->get();

        $storeIds = $revenues->pluck('store_id')->filter()->unique()->values()->all();
        $stores = Store::query()->whereIn('id', $storeIds)->get()->keyBy('id');

        $result = [];
        foreach ($revenues as $row) {
            $store = $stores->get($row->store_id);
            $name = $store
                ? (is_array($store->name) ? Arr::get($store->name, app()->getLocale(), Arr::first($store->name)) : $store->name)
                : __('Unknown');
            $result[] = [
                'store_id' => $row->store_id,
                'store_name' => $name ?? __('Unknown'),
                'revenue' => (float) $row->revenue,
            ];
        }

        return $result;
    }
}

