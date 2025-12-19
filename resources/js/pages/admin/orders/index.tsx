import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Order, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/data-table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import orders from '@/routes/admin/orders';

const OrdersIndex = ({ orders: ordersData }: { orders: PaginatedResponse<Order> }) => {
    const { t: tTabels } = useTranslation('tabels');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<Order>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label={tTabels('common.select_all')}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={tTabels('common.select_row')}
                />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTabels('orders.id') || 'ID'} indexRoute={orders.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "customer",
            header: tTabels('orders.customer') || 'Customer',
            cell: ({ row }) => {
                const customer = row.original.customer;
                const customerData = row.original.customer_data;
                if (customer) {
                    return customer.name || customer.email || '-';
                }
                if (customerData) {
                    return customerData.name || customerData.email || '-';
                }
                return '-';
            },
        },
        {
            accessorKey: "store",
            header: tTabels('orders.store') || 'Store',
            cell: ({ row }) => {
                const store = row.original.store;
                if (!store) return '-';
                const storeName = typeof store.name === 'object' && store.name !== null
                    ? (store.name.en || store.name.ar || Object.values(store.name)[0])
                    : store.name;
                return storeName || store.email || '-';
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTabels('orders.status') || 'Status'} indexRoute={orders.index} />
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant="outline">
                        {status || '-'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "payment_status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTabels('orders.payment_status') || 'Payment Status'} indexRoute={orders.index} />
            ),
            cell: ({ row }) => {
                const paymentStatus = row.original.payment_status;
                return (
                    <Badge variant={paymentStatus === 'paid' ? "secondary" : "default"}>
                        {paymentStatus || '-'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "total",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTabels('orders.total') || 'Total'} indexRoute={orders.index} />
            ),
            cell: ({ row }) => {
                const total = row.original.total;
                return total ? `$${total.toFixed(2)}` : '-';
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTabels('orders.created_at') || 'Created At'} indexRoute={orders.index} />
            ),
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('orders.title') || 'Orders',
            href: '/admin/orders',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tDashboard('orders.title') || 'Orders'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={ordersData.data}
                    meta={ordersData.meta}
                    indexRoute={orders.index}
                    showCreateButton={false}
                />
            </div>
        </AppLayout>
    )
}

export default OrdersIndex;

