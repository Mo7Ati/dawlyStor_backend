import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, SharedData } from '@/types';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Order, PaginatedResponse, Store } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { StatusBadge } from '@/components/table/table-filters/status-badge';
import orders from '@/routes/store/orders';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, usePage } from '@inertiajs/react';
import OrderFilters from '@/components/table/table-filters/order-filters';
import PaymentStatusBadge from './components/payment-status-badge';

const OrdersIndex = ({ orders: ordersData }: { orders: PaginatedResponse<Order> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const orderStatus = usePage<SharedData>().props.enums.orderStatus;

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
                    aria-label={tTables('common.select_all')}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={tTables('common.select_row')}
                />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('orders.id') || 'ID'} indexRoute={orders.index} />
            ),
            enableHiding: false,
            cell: ({ row }) => (
                <button
                    type="button"
                    className="text-primary underline-offset-2 hover:underline"
                    onClick={() => router.visit(orders.show({ order: row.original.id }).url)}
                >
                    #{row.original.id}
                </button>
            ),
        },
        {
            accessorKey: "customer.name",
            header: tTables('orders.customer'),
        },
        {
            accessorKey: "status",
            header: tTables('orders.status'),
            cell: ({ row }) => (
                <Select
                    defaultValue={row.original.status.value}
                    onValueChange={(value) => {
                        router.visit(
                            orders.updateStatus({ order: Number(row.original.id) }, {
                                query: { status: value },
                            }).url,
                            {
                                method: 'patch',
                                preserveScroll: true,
                                preserveState: true,
                            }
                        );
                    }}
                >
                    <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {orderStatus.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ),
        },
        {
            accessorKey: "payment_status",
            header: tTables('orders.payment_status'),
            cell: ({ row }) => <PaymentStatusBadge status={row.original.payment_status} />,
        },
        {
            accessorKey: "total",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('orders.total') || 'Total'} indexRoute={orders.index} />
            ),
            cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('orders.created_at') || 'Created At'} indexRoute={orders.index} />
            ),
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('orders.title'),
            href: orders.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('orders.title')}>
            <DataTable
                columns={columns}
                data={ordersData.data}
                meta={ordersData.meta}
                indexRoute={orders.index}
                filters={<OrderFilters indexRoute={orders.index} />}
            />
        </AppLayout>
    )
}

export default OrdersIndex;

