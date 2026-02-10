import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Order, PaginatedResponse, Store } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { StatusBadge } from '@/components/table/table-filters/status-badge';
import OrderController from '@/wayfinder/App/Http/Controllers/dashboard/admin/OrderController';
import OrderFilters from '@/components/table/table-filters/order-filters';
import { App } from '@/wayfinder/types';

const OrdersIndex = ({ orders: ordersData }: { orders: PaginatedResponse<App.Models.Order> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<App.Models.Order>[] = [
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
                <DataTableColumnHeader column={column} title={tTables('orders.id') || 'ID'} indexRoute={OrderController.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "customer.name",
            header: tTables('orders.customer'),
        },
        {
            accessorKey: "store.name",
            header: tTables('orders.store'),
        },
        {
            accessorKey: "status",
            header: tTables('orders.status'),
            cell: ({ row }) => <StatusBadge type="orderStatus" value={row.original.status} />,
        },
        {
            accessorKey: "payment_status",
            header: tTables('orders.payment_status'),
            cell: ({ row }) => <StatusBadge type="paymentStatus" value={row.original.payment_status} />,
        },
        {
            accessorKey: "total",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('orders.total') || 'Total'} indexRoute={OrderController.index} />
            ),
            cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('orders.created_at') || 'Created At'} indexRoute={OrderController.index} />
            ),
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('orders.title'),
            href: OrderController.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('orders.title')}>
            <DataTable
                columns={columns}
                data={ordersData.data}
                meta={ordersData.meta}
                indexRoute={OrderController.index}
                model="orders"
                filters={<OrderFilters indexRoute={OrderController.index} />}
            />
        </AppLayout>
    )
}

export default OrdersIndex;

