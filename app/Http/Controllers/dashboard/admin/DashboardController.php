<?php

namespace App\Http\Controllers\dashboard\admin;

use App\Enums\PermissionsEnum;
use App\Http\Controllers\Controller;
use App\Enums\OrderStatusEnum;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('admin'), PermissionsEnum::DASHBOARD_INDEX->value);

        $stats = [
            'orders_count' => Order::count(),
            'customers_count' => Customer::count(),
            'products_count' => Product::count(),
            'total_revenue' => (float) Order::sum('total'),
            'stores_count' => Store::count(),
        ];

        $ordersOverTime = $this->getOrdersOverTime();
        $ordersByStatus = $this->getOrdersByStatus();
        $revenueByStore = $this->getRevenueByStore();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'chartData' => [
                'ordersOverTime' => $ordersOverTime,
                'ordersByStatus' => $ordersByStatus,
                'revenueByStore' => $revenueByStore,
            ],
        ]);
    }

    /**
     * Last 90 days: daily orders count and revenue for time-series chart.
     */
    private function getOrdersOverTime(): array
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

