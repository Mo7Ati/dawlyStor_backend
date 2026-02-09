import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Option, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import options from '@/routes/store/options';
import IsActiveBadge from '@/components/table/badges/is-active-badge';
import StatusFilter from '@/components/table/table-filters/status-filter';
import FilterDropdown from '@/components/table/table-filters/filters-dropdown';
import { useFilters } from '@/hooks/use-filters';
import { RouteQueryOptions, RouteDefinition } from '@/wayfinder';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';

const OptionsFilters = ({ indexRoute }: { indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get"> }) => {
    const {
        filters,
        onChange,
        reset,
        activeFiltersCount,
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

const OptionsIndex = ({ options: optionsData }: { options: PaginatedResponse<Option> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<Option>[] = [
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
                <DataTableColumnHeader column={column} title={tTables('options.id') || 'ID'} indexRoute={options.index} />
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
                <DataTableColumnHeader column={column} title={tTables('options.created_at') || 'Created At'} indexRoute={options.index} />
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction editRoute={options.edit.url({ option: Number(row.original.id) })} />
                        <DeleteAction deleteRoute={options.destroy.url({ option: Number(row.original.id) })} />
                    </div>
                )
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('options.title'),
            href: options.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('options.title')}>
            <DataTable
                columns={columns}
                data={optionsData.data}
                meta={optionsData.meta}
                indexRoute={options.index}
                filters={<OptionsFilters indexRoute={options.index} />}
                createHref={options.create.url()}
                onRowClick={(row: Option) => router.visit(options.edit.url({ option: Number(row.id) }))}
            />
        </AppLayout>
    )
}

export default OptionsIndex;

