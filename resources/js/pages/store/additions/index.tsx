import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Addition, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import additions from '@/routes/store/additions';
import IsActiveBadge from '@/components/table/badges/is-active-badge';
import StatusFilter from '@/components/table/table-filters/status-filter';
import FilterDropdown from '@/components/table/table-filters/filters-dropdown';
import { useFilters } from '@/hooks/use-filters';
import { RouteQueryOptions, RouteDefinition } from '@/wayfinder';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';

const AdditionsFilters = ({ indexRoute }: { indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get"> }) => {
    const {
        filters,
        activeFiltersCount,
        onChange,
        reset,
    } = useFilters({
        indexRoute: indexRoute,
        initialKeys: ['is_active'],
    })
    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount} onClearFilters={reset}>
            <div className="flex flex-col gap-4">
                <StatusFilter value={filters.is_active} onChange={onChange} />
            </div>
        </FilterDropdown>
    )
}

const AdditionsIndex = ({ additions: additionsData }: { additions: PaginatedResponse<Addition> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<Addition>[] = [
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
                <DataTableColumnHeader column={column} title={tTables('additions.id') || 'ID'} indexRoute={additions.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: tTables('common.name'),
        },
        {
            accessorKey: "is_active",
            header: tTables('common.status'),
            cell: ({ row }) => <IsActiveBadge isActive={row.original.is_active} />,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('additions.created_at') || 'Created At'} indexRoute={additions.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction editRoute={additions.edit.url({ addition: Number(row.original.id) })} />
                        <DeleteAction deleteRoute={additions.destroy.url({ addition: Number(row.original.id) })} />
                    </div>
                )
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('additions.title'),
            href: additions.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('additions.title')}>
            <DataTable
                columns={columns}
                data={additionsData.data}
                meta={additionsData.meta}
                indexRoute={additions.index}
                filters={<AdditionsFilters indexRoute={additions.index} />}
                createHref={additions.create.url()}
                onRowClick={(row: Addition) => router.visit(additions.edit.url({ addition: Number(row.id) }))}
            />
        </AppLayout>
    )
}

export default AdditionsIndex;

