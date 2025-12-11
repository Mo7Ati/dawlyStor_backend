import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { router } from "@inertiajs/react"
import { MetaType } from "@/types/dashboard"
import admins from "@/routes/admin/admins"

interface PaginationLinks {
    first: string | null
    last: string | null
    next: string | null
    prev: string | null
}

interface DataTablePaginationProps {
    meta?: MetaType
    links?: PaginationLinks | PaginationLinks[]
}

export function DataTablePagination({
    meta,
    links,
}: DataTablePaginationProps) {
    // Normalize links to always be an object
    const normalizedLinks: PaginationLinks | undefined = Array.isArray(links)
        ? links[0]
        : links

    const handlePageChange = (url: string | null) => {
        if (!url) return

        router.get(url, {}, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        })
    }

    const handlePerPageChange = (perPage: string) => {
        const url = new URL(window.location.href)
        url.searchParams.set('per_page', perPage)
        url.searchParams.set('page', '1')

        router.get(admins.index.url(), {
            per_page: perPage,
            page: 1,
        }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        })
    }

    if (!meta) {
        return null
    }

    const canPreviousPage = meta.current_page > 1
    const canNextPage = meta.current_page < meta.last_page

    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
                {meta.from && meta.to ? (
                    <>
                        Showing <strong>{meta.from}</strong> to <strong>{meta.to}</strong> of{" "}
                        <strong>{meta.total}</strong> result{meta.total !== 1 ? 's' : ''}
                    </>
                ) : (
                    <>No results</>
                )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${meta.per_page}`}
                        onValueChange={handlePerPageChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={meta.per_page} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {meta.current_page} of {meta.last_page}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => normalizedLinks?.first && handlePageChange(normalizedLinks.first)}
                        disabled={!canPreviousPage || !normalizedLinks?.first}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => normalizedLinks?.prev && handlePageChange(normalizedLinks.prev)}
                        disabled={!canPreviousPage || !normalizedLinks?.prev}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => normalizedLinks?.next && handlePageChange(normalizedLinks.next)}
                        disabled={!canNextPage || !normalizedLinks?.next}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => normalizedLinks?.last && handlePageChange(normalizedLinks.last)}
                        disabled={!canNextPage || !normalizedLinks?.last}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
