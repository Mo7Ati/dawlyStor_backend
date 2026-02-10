import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { router } from "@inertiajs/react";
import { MetaType } from "@/types/dashboard";
import DataTablePagination from "./data-table-pagination";
import SearchInput from "./search-input";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Settings2 } from "lucide-react";
import { type RouteDefinition, type RouteQueryOptions } from "@/wayfinder";
import { usePermissions } from "@/hooks/use-permissions";

interface DataTableProps<TData extends { id: number | string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    meta?: MetaType
    model?: string
    filters?: React.ReactNode
    createHref?: string
    onRowClick?: (row: TData) => void
    indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get">
}

export function DataTable<TData extends { id: number | string }, TValue>({
    columns,
    data,
    meta,
    filters,
    model,
    createHref,
    onRowClick,
    indexRoute,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const { hasPermission } = usePermissions();

    const table = useReactTable({
        data,
        columns,
        pageCount: meta?.last_page ?? 1,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        state: {
            rowSelection,
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
    })

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div id="create-button">
                    {createHref && (!model || hasPermission(`${model}.create`)) && (
                        <Button variant="outline" className="cursor-pointer" size="sm" onClick={() => router.visit(createHref || '', { preserveState: true, preserveScroll: true })}>
                            <Plus /> Create
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <SearchInput indexRoute={indexRoute} />
                    {filters}

                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto flex h-8 lg:flex"
                                >
                                    <Eye />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[150px]">
                                <DropdownMenuLabel>View columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) =>
                                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                                    )
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={(e) => {
                                        if ((!model || hasPermission(`${model}.update`)) && onRowClick) {
                                            const target = e.target as HTMLElement;
                                            if (target.closest('button, a, [role="menuitem"]')) return;
                                            onRowClick?.(row.original);
                                        }
                                    }}
                                    className={onRowClick && (!model || hasPermission(`${model}.update`)) ? "cursor-pointer" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && <DataTablePagination meta={meta} indexRoute={indexRoute} />}
        </div>
    )
}
