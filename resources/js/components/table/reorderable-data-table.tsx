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
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from "react";
import { router } from "@inertiajs/react";
import { MetaType } from "@/types/dashboard";
import DataTablePagination from "./data-table-pagination";
import SearchInput from "./search-input";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, GripVertical } from "lucide-react";
import { type RouteDefinition, type RouteQueryOptions } from "@/wayfinder";
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

export interface ReorderableDataTableProps<TData extends { id: number | string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    meta?: MetaType;
    model?: string;
    filters?: React.ReactNode;
    createHref?: string;
    onRowClick?: (row: TData) => void;
    indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get">;
    onReorder: (newOrder: TData[]) => void;
}

interface SortableTableRowProps<TData extends { id: number | string }> {
    row: any;
    onRowClick?: (row: TData) => void;
    model?: string;
    hasPermission: (permission: string) => boolean;
}

function SortableTableRow<TData extends { id: number | string }>({
    row,
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
            <TableCell className="w-10">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-2"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            </TableCell>
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

const dragHandleColumn = {
    id: "drag-handle",
    header: "",
    enableHiding: false,
    cell: () => null,
};

export function ReorderableDataTable<TData extends { id: number | string }, TValue>({
    columns,
    data,
    meta,
    filters,
    model,
    createHref,
    onRowClick,
    indexRoute,
    onReorder,
}: ReorderableDataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [localData, setLocalData] = useState<TData[]>(data);

    const { hasPermission } = usePermissions();

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const columnsWithDragHandle = useMemo<ColumnDef<TData, TValue>[]>(
        () => [dragHandleColumn as ColumnDef<TData, TValue>, ...columns],
        [columns]
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setLocalData((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                onReorder(newItems);
                return newItems;
            });
        }
    };

    const table = useReactTable({
        data: localData,
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
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div id="create-button">
                    {createHref && (!model || hasPermission(`${model}.create`)) && (
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() =>
                                router.visit(createHref || "", {
                                    preserveState: true,
                                    preserveScroll: true,
                                })
                            }
                        >
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
                                            typeof column.accessorFn !== "undefined" &&
                                            column.getCanHide()
                                    )
                                    .map((column) => (
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
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
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
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <SortableTableRow
                                            key={row.id}
                                            row={row}
                                            onRowClick={onRowClick}
                                            model={model}
                                            hasPermission={hasPermission}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columnsWithDragHandle.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </SortableContext>
                </DndContext>
            </div>

            {meta && <DataTablePagination meta={meta} indexRoute={indexRoute} />}
        </div>
    );
}
