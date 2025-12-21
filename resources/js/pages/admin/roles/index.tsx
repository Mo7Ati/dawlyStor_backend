import { DataTable } from '@/components/data-table/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse, Role } from '@/types/dashboard'
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, PencilIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import DeleteAction from '@/components/delete-action';
import rolesRoutes from '@/routes/admin/roles';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import roles from '@/routes/admin/roles';
import { DeleteActionButton } from '@/components/data-table/column-actions/delete-action-button';
import { EditAction } from '@/components/data-table/column-actions/edit-action';

const RolesIndex = ({ roles: rolesData }: { roles: PaginatedResponse<Role> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');
    const { t: tForms } = useTranslation('forms');

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
                <DataTableColumnHeader column={column} title={tTables('roles.permissions_count')} indexRoute={roles.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('roles.created_at')} indexRoute={roles.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction
                            editRoute={roles.edit.url({ role: row.original.id })}
                            permission="roles.update"
                        />
                        <DeleteActionButton
                            deleteRoute={roles.destroy.url({ role: row.original.id })}
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
            href: '/admin/roles',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tDashboard('roles.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={rolesData.data}
                    meta={rolesData.meta}
                    createHref={rolesRoutes.create.url()}
                    model="roles"
                    indexRoute={rolesRoutes.index}
                    onRowClick={(role) => router.visit(rolesRoutes.edit({ role: role.id }), { preserveState: true, preserveScroll: true })}
                />
            </div>
        </AppLayout>
    );
}

export default RolesIndex
