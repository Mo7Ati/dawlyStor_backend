import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { MoreHorizontal, PencilIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Admin, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';

import AdminsFilters from './components/admin-filters';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import adminRoutes from '@/routes/admin/admins';
import { Badge } from '@/components/ui/badge';
import DeleteAction from '@/components/delete-action';
import admins from '@/routes/admin/admins';

const AdminsIndex = ({ admins: adminsData }: { admins: PaginatedResponse<Admin> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');
    const { t: tForms } = useTranslation('forms');

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
            cell: ({ row }) => {
                const isActive = row.original.is_active
                return (
                    <Badge variant={isActive ? "secondary" : "default"}>
                        {isActive ? tTables('common.active') : tTables('common.inactive')}
                    </Badge>
                )
            },
            enableHiding: false,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('admins.created_at')} indexRoute={admins.index} />
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const admin = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{tTables('common.open_menu')}</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                            <DropdownMenuItem onClick={() => router.visit(adminRoutes.edit({ admin: admin.id }))} >
                                <PencilIcon className="h-4 w-4" /> {tForms('common.edit')}
                            </DropdownMenuItem>

                            <DeleteAction onDelete={() => router.delete(adminRoutes.destroy.url({ admin: admin.id }))} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
            enableHiding: false,
        },
    ]

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('admins.title'),
            href: adminRoutes.index.url(),
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
                    filters={<AdminsFilters />}
                    onRowClick={(admin) => router.visit(adminRoutes.edit({ admin: admin.id }), { preserveState: true, preserveScroll: true })}
                    createHref={adminRoutes.create.url()}
                    indexRoute={adminRoutes.index}
                    showCreateButton={true}
                />
            </div>
        </AppLayout>
    )
}



export default AdminsIndex
