<?php

namespace App\Http\Controllers\dashboard\store;

use App\Enums\OrderStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $store = $request->user('store');
        if (! $store instanceof Store) {
            return Inertia::render('store/dashboard', [
                'stats' => $this->emptyStats(),
                'chartData' => $this->emptyChartData(),
            ]);
        }

        $stats = $this->getDashboardStats($store);
        $ordersAndRevenuesOverTime = $this->getOrdersAndRevenuesOverTime($store);
        $orderRevenueOverTime = $this->getOrderRevenueOverTime($store);
        $productsOverTime = $this->getProductsOverTime($store);
        $ordersByStatus = $this->getOrdersByStatus($store);

        return Inertia::render('store/dashboard', [
            'stats' => $stats,
            'chartData' => [
                'ordersAndRevenuesOverTime' => $ordersAndRevenuesOverTime,
                'orderRevenueOverTime' => $orderRevenueOverTime,
                'productsOverTime' => $productsOverTime,
                'ordersByStatus' => $ordersByStatus,
            ],
        ]);
    }

    private function emptyStats(): array
    {
        $zero = ['total' => 0, 'new_this_month' => 0, 'new_this_month_percent' => 0];
        return [
            'orders' => $zero,
            'order_revenue' => $zero,
            'products' => $zero,
        ];
    }

    private function emptyChartData(): array
    {
        $days90 = [];
        for ($i = 89; $i >= 0; $i--) {
            $d = now()->subDays($i)->format('Y-m-d');
            $days90[] = ['date' => $d, 'orders_count' => 0, 'revenue' => 0.0];
        }
        $days30 = [];
        for ($i = 29; $i >= 0; $i--) {
            $d = now()->subDays($i);
            $days30[] = ['period' => $d->format('Y-m-d'), 'label' => $d->format('M j'), 'value' => 0.0, 'count' => 0];
        }
        $statuses = [];
        foreach (OrderStatusEnum::cases() as $status) {
            $statuses[] = ['status' => $status->value, 'label' => $status->label(), 'count' => 0];
        }
        return [
            'ordersAndRevenuesOverTime' => $days90,
            'orderRevenueOverTime' => array_map(fn ($r) => ['period' => $r['period'], 'label' => $r['label'], 'value' => $r['value']], $days30),
            'productsOverTime' => array_map(fn ($r) => ['period' => $r['period'], 'label' => $r['label'], 'count' => $r['count']], $days30),
            'ordersByStatus' => $statuses,
        ];
    }

    private function getDashboardStats(Store $store): array
    {
        $startOfMonth = now()->startOfMonth();

        $ordersTotal = Order::query()->where('store_id', $store->id)->count();
        $ordersNewThisMonth = Order::query()
            ->where('store_id', $store->id)
            ->where('created_at', '>=', $startOfMonth)
            ->count();

        $orderRevenueTotal = (float) Order::query()
            ->where('store_id', $store->id)
            ->where('payment_status', 'paid')
            ->sum('total');
        $orderRevenueNewThisMonth = (float) Order::query()
            ->where('store_id', $store->id)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total');

        $productsTotal = Product::query()->where('store_id', $store->id)->count();
        $productsNewThisMonth = Product::query()
            ->where('store_id', $store->id)
            ->where('created_at', '>=', $startOfMonth)
            ->count();

        $percent = static function (int $newCount, int $total): float {
            return $total > 0 ? round((float) ($newCount / $total) * 100, 1) : 0.0;
        };

        return [
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
            'products' => [
                'total' => $productsTotal,
                'new_this_month' => $productsNewThisMonth,
                'new_this_month_percent' => $percent($productsNewThisMonth, $productsTotal),
            ],
        ];
    }

    private function getOrdersAndRevenuesOverTime(Store $store): array
    {
        $days = 90;
        $start = now()->subDays($days)->startOfDay();

        $query = Order::query()
            ->where('store_id', $store->id)
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

    private function getOrderRevenueOverTime(Store $store): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();

        $rows = Order::query()
            ->where('store_id', $store->id)
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
            $result[] = [
                'period' => $period,
                'label' => $date->format('M j'),
                'value' => (float) ($rows->get($period)?->value ?? 0),
            ];
        }
        return $result;
    }

    private function getProductsOverTime(Store $store): array
    {
        $days = 30;
        $start = now()->subDays($days)->startOfDay();

        $rows = Product::query()
            ->where('store_id', $store->id)
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
            $result[] = [
                'period' => $period,
                'label' => $date->format('M j'),
                'count' => (int) ($rows->get($period)?->count ?? 0),
            ];
        }
        return $result;
    }

    private function getOrdersByStatus(Store $store): array
    {
        $counts = Order::query()
            ->where('store_id', $store->id)
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
}
