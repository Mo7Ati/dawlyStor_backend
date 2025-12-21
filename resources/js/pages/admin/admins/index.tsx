import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Admin, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/data-table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import AdminsFilters from './components/admin-filters';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import admins from '@/routes/admin/admins';
import { EditAction } from '@/components/data-table/column-actions/edit-action';
import { DeleteActionButton } from '@/components/data-table/column-actions/delete-action-button';
import IsActiveTableColumn from '@/components/data-table/badges/is-active-badge';

const AdminsIndex = ({ admins: adminsData }: { admins: PaginatedResponse<Admin> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<Admin>[] = [
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
            header: tTables('admins.name'),
            enableHiding: false,
        },
        {
            accessorKey: "email",
            header: tTables('admins.email'),
            enableHiding: false,
        },
        {
            accessorKey: "is_active",
            header: tTables('admins.status'),
            cell: ({ row }) => <IsActiveTableColumn isActive={row.original.is_active} />,
            enableHiding: false,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('admins.created_at')} indexRoute={admins.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction
                            editRoute={admins.edit.url({ admin: row.original.id })}
                            permission="admins.update"
                        />
                        <DeleteActionButton
                            deleteRoute={admins.destroy.url({ admin: row.original.id })}
                            permission="admins.destroy"
                        />
                    </div>
                );
            },
        },
    ]

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('admins.title'),
            href: admins.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tDashboard('admins.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={adminsData.data}
                    meta={adminsData.meta}
                    model="admins"
                    filters={<AdminsFilters />}
                    onRowClick={(admin) => router.visit(admins.edit({ admin: admin.id }), { preserveState: true, preserveScroll: true })}
                    createHref={admins.create.url()}
                    indexRoute={admins.index}
                />
            </div>
        </AppLayout>
    )
}

export default AdminsIndex;
