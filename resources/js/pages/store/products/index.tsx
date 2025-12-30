import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Product, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/data-table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import products from '@/routes/store/products';
import IsActiveBadge from '@/components/data-table/badges/is-active-badge';
import ProductsFilters from '@/components/data-table/table-filters/product-filters';
import { EditAction } from '@/components/data-table/column-actions/edit-action';
import { DeleteAction } from '@/components/data-table/column-actions/delete-action-button';

const ProductsIndex = ({ products: productsData }: { products: PaginatedResponse<Product> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<Product>[] = [
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
                <DataTableColumnHeader column={column} title={tTables('products.id') || 'ID'} indexRoute={products.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: tTables('common.name'),
        },
        {
            accessorKey: "category.name",
            header: tTables('products.category'),
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('products.price') || 'Price'} indexRoute={products.index} />
            ),
            cell: ({ row }) => {
                const price = row.original.price;
                return price ? `$${price.toFixed(2)}` : '-';
            },
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('products.quantity') || 'Quantity'} indexRoute={products.index} />
            ),
        },
        {
            accessorKey: "is_active",
            header: tTables('common.is_active'),
            cell: ({ row }) => <IsActiveBadge isActive={row.original.is_active} />,
        },
        {
            accessorKey: "is_accepted",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('products.is_accepted') || 'Accepted'} indexRoute={products.index} />
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
                <DataTableColumnHeader column={column} title={tTables('products.created_at') || 'Created At'} indexRoute={products.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction editRoute={products.edit.url({ product: Number(row.original.id) })} />
                        <DeleteAction deleteRoute={products.destroy.url({ product: Number(row.original.id) })} permission="products.destroy" />
                    </div>
                )
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('products.title'),
            href: products.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tDashboard('products.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={productsData.data}
                    meta={productsData.meta}
                    indexRoute={products.index}
                    filters={<ProductsFilters indexRoute={products.index} />}
                    createHref={products.create.url()}
                    onRowClick={(row: Product) => router.visit(products.edit.url({ product: Number(row.id) }))}
                />
            </div>
        </AppLayout>
    )
}

export default ProductsIndex;

