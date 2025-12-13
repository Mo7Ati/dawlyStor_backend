import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowDownUp, ArrowUp, ChevronsUpDown, EyeOff, X } from "lucide-react"
import { router } from "@inertiajs/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import admins from "@/routes/admin/admins"
import { useState } from "react"
import { type RouteDefinition, type RouteQueryOptions } from "@/wayfinder"

interface Props<TData, TValue> {
    column: Column<TData, TValue>
    title: string
    indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get">
    className?: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    indexRoute,
    className,
}: Props<TData, TValue> & React.HTMLAttributes<HTMLDivElement>) {
    const columnName = column.id;
    const url = new URL(window.location.href);

    const [sort, setSort] = useState(url.searchParams.get('sort'));
    const [direction, setDirection] = useState<'asc' | 'desc' | undefined>(url.searchParams.get('direction') as ("asc" | "desc") || undefined);


    const applySort = (direction: "asc" | "desc" | undefined) => {
        setDirection(direction);
        setSort(columnName);

        const url = indexRoute({
            mergeQuery: {
                direction,
                sort: direction ? columnName : undefined,
                page: 1,
            },
        }).url;

        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="data-[state=open]:bg-accent -ml-3 h-8">
                        <span>{title}</span>
                        {sort === columnName && direction === "desc" ? (
                            <ArrowDown />
                        ) : sort === columnName && direction === "asc" ? (
                            <ArrowUp />
                        ) : (
                            <ChevronsUpDown />
                        )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => applySort("asc")}>
                        <ArrowUp className="mr-2 h-4 w-4" /> صعودي
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => applySort("desc")}>
                        <ArrowDown className="mr-2 h-4 w-4" /> تنازلي
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => applySort(undefined)}>
                        <ArrowDownUp className="mr-2 h-4 w-4" /> غير مفعل
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="mr-2 h-4 w-4" /> إخفاء
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
