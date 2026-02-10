import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Admin, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import AdminsFilters from './components/admin-filters';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import AdminController from '@/wayfinder/App/Http/Controllers/dashboard/admin/AdminController';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';
import IsActiveTableColumn from '@/components/table/badges/is-active-badge';
import { App } from "@/wayfinder/types";

const AdminsIndex = ({ admins: adminsData }: { admins: PaginatedResponse<App.Models.Admin> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<App.Models.Admin>[] = [
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
            header: tTables('common.status'),
            cell: ({ row }) => <IsActiveTableColumn isActive={row.original.is_active} />,
            enableHiding: false,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('admins.created_at')} indexRoute={AdminController.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction
                            editRoute={AdminController.edit.url({ admin: row.original.id.toString() })}
                            permission="admins.update"
                        />
                        <DeleteAction
                            deleteRoute={AdminController.destroy.url({ admin: row.original.id.toString() })}
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
            href: AdminController.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('admins.title')}>
            <DataTable
                columns={columns}
                data={adminsData.data}
                meta={adminsData.meta}
                model="admins"
                filters={<AdminsFilters />}
                onRowClick={(admin) => router.visit(AdminController.edit.url({ admin: admin.id.toString() }), { preserveState: true, preserveScroll: true })}
                createHref={AdminController.create.url()}
                indexRoute={AdminController.index}
            />
        </AppLayout>
    )
}

export default AdminsIndex;
