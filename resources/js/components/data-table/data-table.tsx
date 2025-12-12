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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { Button } from "../ui/button"
import { Link } from "@inertiajs/react"
import { MetaType } from "@/types/dashboard"
import DataTablePagination from "./data-table-pagination"
import SearchInput from "../search-input"
import DataTableFilters from "./data-table-filters"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    meta?: MetaType
    filters?: React.ReactNode
}

export function DataTable<TData, TValue>({
    columns,
    data,
    meta,
    filters,
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
                    <SearchInput  />
                    {filters}
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link method="get" type="button" href={'admin/admins/create'} className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]">
                        Create
                    </Link>
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

            {/* <div className="text-muted-foreground flex-1 text-sm">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            */}

            {meta && <DataTablePagination meta={meta} table={table} />}
        </div>
    )
}
