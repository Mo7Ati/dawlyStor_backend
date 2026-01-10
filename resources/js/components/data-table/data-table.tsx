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
} from "@/components/ui/dropdown-menu";

import { useState, useEffect, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import { MetaType } from "@/types/dashboard";
import DataTablePagination from "./data-table-pagination";
import SearchInput from "./search-input";
import { Button } from "../ui/button";
import { Plus, Pointer, Settings2, GripVertical } from "lucide-react";
import { type RouteDefinition, type RouteQueryOptions } from "@/wayfinder";
import Filters from "./table-filters/filters-dropdown";
import { usePermissions } from "@/hooks/use-permissions";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DataTableProps<TData extends { id: number | string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    meta?: MetaType
    model?: string
    filters?: React.ReactNode
    createHref?: string
    onRowClick?: (row: TData) => void
    indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get">
    reorderable?: boolean
    onReorder?: (newOrder: TData[]) => void
}

interface SortableTableRowProps<TData extends { id: number | string }> {
    row: any
    reorderable: boolean
    onRowClick?: (row: TData) => void
    model?: string
    hasPermission: (permission: string) => boolean
}

function SortableTableRow<TData extends { id: number | string }>({
    row,
    reorderable,
    onRowClick,
    model,
    hasPermission,
}: SortableTableRowProps<TData>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: row.original.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && "selected"}
            className={cn(
                isDragging && "bg-muted",
                onRowClick && (!model || hasPermission(`${model}.update`)) ? "cursor-pointer" : ""
            )}
            onClick={(e) => {
                if ((!model || hasPermission(`${model}.update`)) && onRowClick) {
                    const target = e.target as HTMLElement;
                    if (target.closest('button, a, [role="menuitem"]')) return;
                    onRowClick?.(row.original);
                }
            }}
        >
            {reorderable && (
                <TableCell className="w-10">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2"
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                </TableCell>
            )}
            {row.getVisibleCells()
                .filter((cell: any) => cell.column.id !== "drag-handle")
                .map((cell: any) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
        </TableRow>
    );
}

export function DataTable<TData extends { id: number | string }, TValue>({
    columns,
    data,
    meta,
    filters,
    model,
    onRowClick,
    createHref,
    indexRoute,
    reorderable = false,
    onReorder,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [localData, setLocalData] = useState<TData[]>(data);

    const { hasPermission } = usePermissions();

    // Sync local data with prop data
    useEffect(() => {
        setLocalData(data);
    }, [data]);

    // Add drag handle column when reorderable is enabled
    const columnsWithDragHandle = useMemo(() => {
        if (!reorderable) return columns;

        const dragHandleColumn: ColumnDef<TData, TValue> = {
            id: "drag-handle",
            header: "",
            enableHiding: false,
            cell: () => null, // Cell content is handled in SortableTableRow
        };

        return [dragHandleColumn, ...columns];
    }, [columns, reorderable]);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle drag end event
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setLocalData((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Call onReorder callback if provided
                if (onReorder) {
                    onReorder(newItems);
                }

                return newItems;
            });
        }
    };

    const table = useReactTable({
        data: reorderable ? localData : data,
        columns: columnsWithDragHandle,
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
                    </div>
                </div>

            </div>

            <div className="overflow-hidden rounded-md border">
                {reorderable ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localData.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
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
                                            <SortableTableRow
                                                key={row.id}
                                                row={row}
                                                reorderable={reorderable}
                                                onRowClick={onRowClick}
                                                model={model}
                                                hasPermission={hasPermission}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columnsWithDragHandle.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </SortableContext>
                    </DndContext>
                ) : (
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
                )}
            </div>

            {meta && <DataTablePagination meta={meta} indexRoute={indexRoute} />}
        </div>
    )
}
