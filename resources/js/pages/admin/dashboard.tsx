import { ChartAreaInteractive } from '@/components/charts/orders-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { DollarSign, Package, ShoppingCart, Store, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardStats {
    orders_count: number;
    customers_count: number;
    products_count: number;
    total_revenue: number;
    stores_count: number;
}

export default function Dashboard() {
    const { t } = useTranslation("dashboard");
    const { stats } = usePage<SharedData & { stats: DashboardStats }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('title'),
            href: '/admin/dashboard',
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const statCards = [
        {
            title: 'Total Orders',
            value: formatNumber(stats?.orders_count || 0),
            description: 'All time orders',
            icon: ShoppingCart,
            className: 'border-blue-200 dark:border-blue-800',
        },
        {
            title: 'Total Customers',
            value: formatNumber(stats?.customers_count || 0),
            description: 'Registered customers',
            icon: Users,
            className: 'border-green-200 dark:border-green-800',
        },
        {
            title: 'Total Products',
            value: formatNumber(stats?.products_count || 0),
            description: 'Available products',
            icon: Package,
            className: 'border-purple-200 dark:border-purple-800',
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.total_revenue || 0),
            description: 'All time revenue',
            icon: DollarSign,
            className: 'border-amber-200 dark:border-amber-800',
        },
        {
            title: 'Total Stores',
            value: formatNumber(stats?.stores_count || 0),
            description: 'Active stores',
            icon: Store,
            className: 'border-orange-200 dark:border-orange-800',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('title')}>
            {/* <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className={stat.className}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <CardDescription className="text-xs mt-1">
                                        {stat.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div> */}
            <ChartAreaInteractive />
        </AppLayout>
    );
}
