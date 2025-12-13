import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
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
} from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { Link } from "@inertiajs/react"
import { MetaType } from "@/types/dashboard"
import DataTablePagination from "./data-table-pagination"
import SearchInput from "../search-input"
import { Button } from "../ui/button"
import { Plus, Pointer, Settings2 } from "lucide-react"
import { type RouteDefinition, type RouteQueryOptions } from "@/wayfinder"

interface DataTableProps<TData extends { id: number | string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    meta?: MetaType
    filters?: React.ReactNode
    showCreateButton?: boolean
    createHref?: string
    onRowClick?: (row: TData) => void
    indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get">
}

export function DataTable<TData extends { id: number | string }, TValue>({
    columns,
    data,
    meta,
    filters,
    onRowClick,
    createHref,
    indexRoute,
    showCreateButton = false,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
            <div className="flex justify-between">
                <div className="flex items-center  gap-2">
                    <SearchInput indexRoute={indexRoute} />
                    {filters}
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto hidden h-8 lg:flex"
                            >
                                <Settings2 />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
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

                    {showCreateButton && createHref && (
                        <Link method="get" href={createHref} as={Button} >
                            <Plus className="h-4 w-4" /> Create
                        </Link>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table >
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
                                        const target = e.target as HTMLElement;
                                        if (target.closest('button, a, [role="menuitem"]')) return;
                                        onRowClick?.(row.original);
                                    }}
                                    className={onRowClick ? "cursor-pointer" : ""}
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
