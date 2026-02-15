import { OrdersByStatusChart, type OrderStatusChartPoint } from '@/components/charts/orders-by-status-chart';
import { OrdersAndRevenuesOverTimeChart, OrdersAndRevenuesOverTimePoint } from '@/components/charts/orders-revenues-chart';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Banknote, Package, ShoppingCart, Store, Ticket, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart } from 'recharts';

interface StatItem {
    total: number;
    new_this_month: number;
    new_this_month_percent: number;
}

interface StatsOverTimePoint {
    period: string;
    label: string;
    count: number;
}

interface RevenueOverTimePoint {
    period: string;
    label: string;
    value: number;
}

interface ChartData {
    ordersAndRevenuesOverTime: OrdersAndRevenuesOverTimePoint[];
    customersOverTime: StatsOverTimePoint[];
    storesOverTime: StatsOverTimePoint[];
    ordersByStatus: OrderStatusChartPoint[];
    orderRevenueOverTime: RevenueOverTimePoint[];
    subscriptionRevenueOverTime: RevenueOverTimePoint[];
    platformCommissionOverTime?: RevenueOverTimePoint[];
    productsOverTime?: StatsOverTimePoint[];
}

interface DashboardStatsData {
    customers: StatItem;
    stores: StatItem;
    orders: StatItem;
    order_revenue: StatItem;
    platform_commission: StatItem;
    subscription_revenue: StatItem;
    products: StatItem;
    average_order_value: StatItem;
}

interface DashboardProps {
    chartData: ChartData;
    stats?: DashboardStatsData;
}

const defaultStats: DashboardStatsData = {
    customers: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    stores: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    orders: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    order_revenue: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    platform_commission: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    subscription_revenue: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    products: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
    average_order_value: { total: 0, new_this_month: 0, new_this_month_percent: 0 },
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

export default function Dashboard({ chartData, stats: statsProp }: DashboardProps) {
    const { t } = useTranslation('dashboard');
    const stats = statsProp ?? defaultStats;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('title'),
            href: '/admin/dashboard',
        },
    ];

    const trendDataByKey = {
        customers: chartData.customersOverTime.map((p) => ({ date: p.period, value: p.count })),
        stores: chartData.storesOverTime.map((p) => ({ date: p.period, value: p.count })),
        orders: chartData.ordersAndRevenuesOverTime.map((p) => ({ date: p.date, value: p.orders_count })),
        order_revenue: chartData.orderRevenueOverTime.map((p) => ({ date: p.period, value: p.value })),
        platform_commission: (chartData.platformCommissionOverTime ?? []).map((p) => ({ date: p.period, value: p.value })),
        subscription_revenue: chartData.subscriptionRevenueOverTime.map((p) => ({ date: p.period, value: p.value })),
        products: (chartData.productsOverTime ?? []).map((p) => ({ date: p.period, value: p.count })),
        average_order_value: chartData.orderRevenueOverTime.map((p) => ({ date: p.period, value: p.value })),
    };

    type StatKey = keyof DashboardStatsData;
    const statCards: Array<{
        key: StatKey;
        titleKey: string;
        icon: typeof Users;
        descColor: string;
        chartConfig: ChartConfig;
        chartColorId: string;
        formatValue: (n: number) => string;
        formatNewThisMonth: (n: number) => string;
    }> = [
            {
                key: 'customers',
                titleKey: 'stats.customers',
                icon: Users,
                descColor: 'text-emerald-600 dark:text-emerald-400',
                chartConfig: { trend: { color: 'hsl(160 84% 39%)' } },
                chartColorId: 'fillCustomers',
                formatValue: formatNumber,
                formatNewThisMonth: (n) => t('stats.new_this_month', { count: n }),
            },
            {
                key: 'stores',
                titleKey: 'stats.stores',
                icon: Store,
                descColor: 'text-amber-600 dark:text-amber-400',
                chartConfig: { trend: { color: 'hsl(38 92% 50%)' } },
                chartColorId: 'fillStores',
                formatValue: formatNumber,
                formatNewThisMonth: (n) => t('stats.new_this_month', { count: n }),
            },
            {
                key: 'orders',
                titleKey: 'stats.orders',
                icon: ShoppingCart,
                descColor: 'text-blue-600 dark:text-blue-400',
                chartConfig: { trend: { color: 'hsl(217 91% 60%)' } },
                chartColorId: 'fillOrders',
                formatValue: formatNumber,
                formatNewThisMonth: (n) => t('stats.new_this_month', { count: n }),
            },
            {
                key: 'order_revenue',
                titleKey: 'stats.order_revenue',
                icon: Banknote,
                descColor: 'text-violet-600 dark:text-violet-400',
                chartConfig: { trend: { color: 'hsl(263 70% 50%)' } },
                chartColorId: 'fillOrderRevenue',
                formatValue: formatCurrency,
                formatNewThisMonth: (n) => t('stats.new_this_month_amount', { amount: formatCurrency(n) }),
            },
            {
                key: 'platform_commission',
                titleKey: 'stats.platform_commission',
                icon: Ticket,
                descColor: 'text-rose-600 dark:text-rose-400',
                chartConfig: { trend: { color: 'hsl(350 89% 60%)' } },
                chartColorId: 'fillPlatformCommission',
                formatValue: formatCurrency,
                formatNewThisMonth: (n) => t('stats.new_this_month_amount', { amount: formatCurrency(n) }),
            },
            {
                key: 'subscription_revenue',
                titleKey: 'stats.subscription_revenue',
                icon: Banknote,
                descColor: 'text-teal-600 dark:text-teal-400',
                chartConfig: { trend: { color: 'hsl(173 80% 40%)' } },
                chartColorId: 'fillSubscriptionRevenue',
                formatValue: formatCurrency,
                formatNewThisMonth: (n) => t('stats.new_this_month_amount', { amount: formatCurrency(n) }),
            },
            {
                key: 'products',
                titleKey: 'stats.products',
                icon: Package,
                descColor: 'text-sky-600 dark:text-sky-400',
                chartConfig: { trend: { color: 'hsl(199 89% 48%)' } },
                chartColorId: 'fillProducts',
                formatValue: formatNumber,
                formatNewThisMonth: (n) => t('stats.new_this_month', { count: n }),
            },
            {
                key: 'average_order_value',
                titleKey: 'stats.average_order_value',
                icon: TrendingUp,
                descColor: 'text-indigo-600 dark:text-indigo-400',
                chartConfig: { trend: { color: 'hsl(239 84% 67%)' } },
                chartColorId: 'fillAverageOrderValue',
                formatValue: formatCurrency,
                formatNewThisMonth: (n) => t('stats.new_this_month_amount', { amount: formatCurrency(n) }),
            },
        ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('title')}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
