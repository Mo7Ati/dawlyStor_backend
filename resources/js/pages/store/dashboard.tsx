import { OrdersByStatusChart, type OrderStatusChartPoint } from '@/components/charts/orders-by-status-chart';
import { OrdersAndRevenuesOverTimeChart, type OrdersAndRevenuesOverTimePoint } from '@/components/charts/orders-revenues-chart';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Banknote, Package, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart } from 'recharts';

interface StatItem {
    total: number;
    new_this_month: number;
    new_this_month_percent: number;
}

interface RevenueOverTimePoint {
    period: string;
    label: string;
    value: number;
}

interface StatsOverTimePoint {
    period: string;
    label: string;
    count: number;
}

interface StoreChartData {
    ordersAndRevenuesOverTime: OrdersAndRevenuesOverTimePoint[];
    orderRevenueOverTime: RevenueOverTimePoint[];
    productsOverTime: StatsOverTimePoint[];
    ordersByStatus: OrderStatusChartPoint[];
}

interface StoreDashboardStats {
    orders: StatItem;
    order_revenue: StatItem;
    products: StatItem;
}

interface StoreDashboardProps {
    stats?: StoreDashboardStats;
    chartData?: StoreChartData;
}

const defaultStats: StoreDashboardStats = {
    orders: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    order_revenue: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    products: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
};

const emptyChartData = (): StoreChartData => {
    const days90 = Array.from({ length: 90 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (89 - i));
        return { date: d.toISOString().slice(0, 10), orders_count: 0, revenue: 0 };
    });
    const days30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return { period: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: 0, count: 0 };
    });
    return {
        ordersAndRevenuesOverTime: days90,
        orderRevenueOverTime: days30.map(({ period, label, value }) => ({ period, label, value })),
        productsOverTime: days30.map(({ period, label, count }) => ({ period, label, count })),
        ordersByStatus: [],
    };
};

function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export default function Dashboard({ stats: statsProp, chartData: chartDataProp }: StoreDashboardProps) {
    const { t } = useTranslation('dashboard');
    const stats = statsProp ?? defaultStats;
    const chartData = chartDataProp ?? emptyChartData();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('title'),
            href: '/store',
        },
    ];

    const trendDataByKey = {
        orders: chartData.ordersAndRevenuesOverTime.map((p) => ({ date: p.date, value: p.orders_count })),
        order_revenue: chartData.orderRevenueOverTime.map((p) => ({ date: p.period, value: p.value })),
        products: chartData.productsOverTime.map((p) => ({ date: p.period, value: p.count })),
    };

    type StatKey = keyof StoreDashboardStats;
    const statCards: Array<{
        key: StatKey;
        titleKey: string;
        icon: typeof ShoppingCart;
        descColor: string;
        chartConfig: ChartConfig;
        chartColorId: string;
        formatValue: (n: number) => string;
        formatNewThisMonth: (n: number) => string;
    }> = [
        {
            key: 'orders',
            titleKey: 'stats.orders',
            icon: ShoppingCart,
            descColor: 'text-blue-600 dark:text-blue-400',
            chartConfig: { trend: { color: 'hsl(217 91% 60%)' } },
            chartColorId: 'fillStoreOrders',
            formatValue: formatNumber,
            formatNewThisMonth: (n) => t('stats.new_this_month', { count: n }),
        },
        {
            key: 'order_revenue',
            titleKey: 'stats.order_revenue',
            icon: Banknote,
            descColor: 'text-violet-600 dark:text-violet-400',
            chartConfig: { trend: { color: 'hsl(263 70% 50%)' } },
            chartColorId: 'fillStoreOrderRevenue',
            formatValue: formatCurrency,
            formatNewThisMonth: (n) => t('stats.new_this_month_amount', { amount: formatCurrency(n) }),
        },
        {
            key: 'products',
            titleKey: 'stats.products',
            icon: Package,
            descColor: 'text-sky-600 dark:text-sky-400',
            chartConfig: { trend: { color: 'hsl(199 89% 48%)' } },
            chartColorId: 'fillStoreProducts',
            formatValue: formatNumber,
            formatNewThisMonth: (n) => t('stats.new_this_month', { count: n }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('title')}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map(({ key, titleKey, icon: Icon, descColor, chartConfig, chartColorId, formatValue, formatNewThisMonth }) => {
                        const trendData = trendDataByKey[key];
                        const stat = stats[key];
                        return (
                            <Card key={key} className="overflow-hidden shadow-sm">
                                <CardHeader className="space-y-0 px-4 pb-0.5 pt-3">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">
                                        {t(titleKey)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-0 px-4 pb-0 pt-0">
                                    <div className="text-xl font-bold tracking-tight tabular-nums">
                                        {formatValue(stat.total)}
                                    </div>
                                    <div className={`mt-1.5 flex items-center gap-1 text-xs ${descColor}`}>
                                        <span>{formatNewThisMonth(stat.new_this_month)}</span>
                                        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                                    </div>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="mt-3 h-10 w-full"
                                    >
                                        <AreaChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id={chartColorId} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="var(--color-trend)" stopOpacity={0.4} />
                                                    <stop offset="100%" stopColor="var(--color-trend)" stopOpacity={0.05} />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                dataKey="value"
                                                type="natural"
                                                fill={`url(#${chartColorId})`}
                                                stroke="var(--color-trend)"
                                                strokeWidth={1.5}
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <OrdersAndRevenuesOverTimeChart chartData1={chartData.ordersAndRevenuesOverTime} />
                <OrdersByStatusChart
                    data={chartData.ordersByStatus}
                    title={t('charts.orders_by_status_title')}
                    description={t('charts.orders_by_status_description')}
                />
            </div>
        </AppLayout>
    );
}
