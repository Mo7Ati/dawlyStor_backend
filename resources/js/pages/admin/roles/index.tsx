import { DataTable } from '@/components/data-table/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse, Role } from '@/types/dashboard'
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, PencilIcon } from 'lucide-react';
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
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/admin/roles',
    },
];

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
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableHiding: false,
    },
    {
        accessorKey: 'guard_name',
        header: 'Guard Name',
        enableHiding: false,
    },
    {
        accessorKey: 'permissions_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Permissions Count" indexRoute={roles.index} />
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" indexRoute={roles.index} />
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const role = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuItem onClick={() => router.visit(rolesRoutes.edit({ role: role.id }))} >
                            <PencilIcon className="h-4 w-4" /> {'Edit Role'}
                        </DropdownMenuItem>
                        <DeleteAction onDelete={() => router.delete(rolesRoutes.destroy({ role: role.id }))} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        enableHiding: false,
    },
];


const RolesIndex = ({ roles }: { roles: PaginatedResponse<Role> }) => {
    console.log(roles);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Roles' />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={roles.data}
                    meta={roles.meta}
                    createHref={rolesRoutes.create.url()}
                    showCreateButton={true}
                    indexRoute={rolesRoutes.index}
                    onRowClick={(role) => router.visit(rolesRoutes.edit({ role: role.id }), { preserveState: true, preserveScroll: true })}
                />
            </div>
        </AppLayout>
    );
}

export default RolesIndex
