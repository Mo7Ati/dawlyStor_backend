import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Table, MoreHorizontal, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Admin, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/data-table';

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { t } from 'i18next';
import { Checkbox } from '@/components/ui/checkbox';



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
        accessorKey: "name",
        header: "Name",
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
        enableHiding: false,
    },
    {
        accessorKey: "is_active",
        header: "Active",
        enableHiding: false,
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const admin = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            onClick={() => router.visit(`/admin/admins/${admin.id}`)}
                        >
                            {t('edit')}
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator /> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        enableHiding: false,
    },
]

const AdminsIndex = ({ admins }: { admins: PaginatedResponse<Admin> }) => {
    const { t } = useTranslation('tables');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('admins.title'),
            href: '/admin/admins',
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admins.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={admins.data}
                    meta={admins.meta}
                    links={admins.links}
                    columnFilters={[
                        {
                            id: "is_active",
                            type: "checkbox",
                            label: "Status",
                            options: [
                                { value: "1", label: "Active" },
                                { value: "0", label: "Inactive" },
                            ],
                        }
                    ]}
                />
            </div>
        </AppLayout>
    )
}

export default AdminsIndex
