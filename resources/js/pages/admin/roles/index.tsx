import { DataTable } from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse, Role } from '@/types/dashboard';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';
import RoleController from '@/wayfinder/App/Http/Controllers/dashboard/admin/RoleController';

const RolesIndex = ({ roles: rolesData }: { roles: PaginatedResponse<Role> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');


    const columns: ColumnDef<Role>[] = [
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
            accessorKey: 'name',
            header: tTables('roles.name'),
            enableHiding: false,
        },
        {
            accessorKey: 'guard_name',
            header: tTables('roles.guard_name'),
            enableHiding: false,
        },
        {
            accessorKey: 'permissions_count',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={tTables('roles.permissions_count')}
                    indexRoute={RoleController.index}
                />
            ),
            enableHiding: false,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={tTables('roles.created_at')}
                    indexRoute={RoleController.index}
                />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction
                            editRoute={RoleController.edit.url({ role: row.original.id.toString() })}
                            permission="roles.update"
                        />
                        <DeleteAction
                            deleteRoute={RoleController.destroy.url({ role: row.original.id.toString() })}
                            permission="roles.destroy"
                        />
                    </div>
                )
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('roles.title'),
            href: RoleController.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('roles.title')}>
            <DataTable
                columns={columns}
                data={rolesData.data}
                meta={rolesData.meta}
                model="roles"
                createHref={RoleController.create.url()}
                indexRoute={RoleController.index}
                onRowClick={(role) =>
                    router.visit(RoleController.edit.url({ role: role.id.toString() }), {
                        preserveState: true,
                        preserveScroll: true,
                    })
                }
            />
        </AppLayout>
    );
}

export default RolesIndex
