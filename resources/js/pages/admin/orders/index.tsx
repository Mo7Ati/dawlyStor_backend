import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Order, PaginatedResponse, Store } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { StatusBadge } from '@/components/table/table-filters/status-badge';
import orders from '@/routes/admin/orders';
import OrderFilters from '@/components/table/table-filters/order-filters';

const OrdersIndex = ({ orders: ordersData }: { orders: PaginatedResponse<Order> }) => {
    const { t: tTables } = useTranslation('tables');
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
                model="orders"
                filters={<OrderFilters indexRoute={orders.index} />}
            />
        </AppLayout>
    )
}

export default OrdersIndex;

