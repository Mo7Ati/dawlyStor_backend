import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Store, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import StoresFilters from './components/store-filters';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import stores from '@/routes/admin/stores';
import IsActiveBadge from '@/components/table/badges/is-active-badge';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';

const StoresIndex = ({ stores: storesData }: { stores: PaginatedResponse<Store> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<Store>[] = [
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
            accessorKey: "name",
            header: tTables('common.name'),
            enableHiding: false,
        },
        {
            accessorKey: "email",
            header: tTables('common.email'),
            enableHiding: false,
        },
        {
            accessorKey: "phone",
            header: tTables('common.phone'),
            enableHiding: false,
        },
        {
            accessorKey: "category.name",
            header: tTables('stores.category'),
        },
        {
            accessorKey: "is_active",
            header: tTables('common.status'),
            cell: ({ row }) => <IsActiveBadge isActive={row.original.is_active} />,
            enableHiding: false,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('stores.created_at')} indexRoute={stores.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction
                            editRoute={stores.edit.url({ store: row.original.id })}
                            permission="stores.update"
                        />
                        <DeleteAction
                            deleteRoute={stores.destroy.url({ store: row.original.id })}
                            permission="stores.destroy"
                        />
                    </div>
                )
            },
        },
    ]

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('stores.title'),
            href: stores.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('stores.title')}>
            <DataTable
                columns={columns}
                data={storesData.data}
                meta={storesData.meta}
                filters={<StoresFilters />}
                model="stores"
                onRowClick={(store) => router.visit(stores.edit.url({ store: store.id }), { preserveState: true, preserveScroll: true })}
                createHref={stores.create.url()}
                indexRoute={stores.index}
            />
        </AppLayout>
    )
}

export default StoresIndex;

