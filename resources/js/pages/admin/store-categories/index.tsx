import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { MoreHorizontal, PencilIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { StoreCategory, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';
import StoreCategoryController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreCategoryController';
import { App } from '@/wayfinder/types';


const StoreCategoriesIndex = ({ categories: categoriesData }: { categories: PaginatedResponse<App.Models.StoreCategory> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<App.Models.StoreCategory>[] = [
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
            accessorKey: "description",
            header: tTables('common.description'),
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('common.created_at')} indexRoute={StoreCategoryController.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction
                            editRoute={StoreCategoryController.edit.url({ store_category: row.original.id })}
                            permission="store-categories.update"
                        />
                        <DeleteAction
                            deleteRoute={StoreCategoryController.destroy.url({ store_category: row.original.id })}
                            permission="store-categories.destroy"
                        />
                    </div>
                )
            },
        },
    ]

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('store_categories.title'),
            href: StoreCategoryController.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('store_categories.title')}>
            <DataTable
                columns={columns}
                data={categoriesData.data}
                meta={categoriesData.meta}
                onRowClick={(category) => router.visit(StoreCategoryController.edit.url({ store_category: category.id }), { preserveState: true, preserveScroll: true })}
                createHref={StoreCategoryController.create.url()}
                indexRoute={StoreCategoryController.index}
                model="store-categories"
            />
        </AppLayout>
    )
}

export default StoreCategoriesIndex;

