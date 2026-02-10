import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Product, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import ProductController from '@/wayfinder/App/Http/Controllers/dashboard/admin/ProductController';
import IsActiveBadge from '@/components/table/badges/is-active-badge';
import ProductsFilters from '@/components/table/table-filters/product-filters';
import { App } from '@/wayfinder/types';

const ProductsIndex = ({ products: productsData }: { products: PaginatedResponse<App.Models.Product> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<App.Models.Product>[] = [
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
                <DataTableColumnHeader column={column} title={tTables('products.id') || 'ID'} indexRoute={ProductController.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: tTables('common.name'),
        },
        {
            accessorKey: "store.name",
            header: tTables('products.store'),
        },
        {
            accessorKey: "category.name",
            header: tTables('products.category'),
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('products.price') || 'Price'} indexRoute={ProductController.index} />
            ),
            cell: ({ row }) => {
                const price = row.original.price;
                return price ? `$${price.toFixed(2)}` : '-';
            },
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('products.quantity') || 'Quantity'} indexRoute={ProductController.index} />
            ),
        },
        {
            accessorKey: "is_active",
            header: tTables('common.status'),
            cell: ({ row }) => <IsActiveBadge isActive={row.original.is_active} />,
        },
        {
            accessorKey: "is_accepted",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('products.is_accepted') || 'Accepted'} indexRoute={ProductController.index} />
            ),
            cell: ({ row }) => {
                const isAccepted = row.original.is_accepted;
                return (
                    <Badge variant={isAccepted ? "secondary" : "default"}>
                        {isAccepted ? 'Accepted' : 'Pending'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('products.created_at') || 'Created At'} indexRoute={ProductController.index} />
            ),
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('products.title'),
            href: ProductController.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('products.title')}>
            <DataTable
                columns={columns}
                data={productsData.data}
                meta={productsData.meta}
                indexRoute={ProductController.index}
                filters={<ProductsFilters indexRoute={ProductController.index} />}
                model="products"
            />
        </AppLayout>
    )
}

export default ProductsIndex;

