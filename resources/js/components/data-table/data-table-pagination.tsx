import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,

} from "@/components/ui/select";
import admins from "@/routes/admin/admins";

import { MetaType } from "@/types/dashboard";
import { router } from "@inertiajs/react";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

export default function DataTablePagination({ meta, table }: { meta: MetaType, table: Table<any> }) {
    const [perPage, setPerPage] = useState<string>(meta.per_page || '10');
    const { links } = meta;

    if (!links || links.length === 0) {
        return null;
    }
    console.log(perPage);

    const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string | null) => {
        e.preventDefault();

        if (!url) {
            return;
        }

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageSizeChange = (value: string) => {
        router.get(admins.index({
            mergeQuery: {
                per_page: value,
                page: 1,
            },
        }).url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const renderLink = (link: typeof links[0], index: number) => {
        const isPrevious = index === 0;
        const isNext = index === links.length - 1;


        const isEllipsis =
            link.label === "..." ||
            link.label === "…" ||
            (link.page === null && link.url === null && link.label.trim() === "") ||
            link.label.includes("…");

        if (isPrevious) {
            return (
                <PaginationItem key={`prev-${index}`}>
                    <PaginationPrevious
                        href={link.url || "#"}
                        onClick={(e) => handlePageClick(e, link.url)}
                        className={!link.url ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            );
        }

        if (isNext) {
            return (
                <PaginationItem key={`next-${index}`}>
                    <PaginationNext
                        href={link.url || "#"}
                        onClick={(e) => handlePageClick(e, link.url)}
                        className={!link.url ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            );
        }

        if (isEllipsis) {
            return (
                <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        return (
            <PaginationItem key={`page-${link.page || index}`}>
                <PaginationLink
                    href={link.url || "#"}
                    onClick={(e) => handlePageClick(e, link.url)}
                    isActive={link.active}
                    className={!link.url ? "pointer-events-none opacity-50" : "cursor-pointer"}
                >
                    {link.label}
                </PaginationLink>
            </PaginationItem>
        );
    };

    return (
        <Pagination className="flex items-center justify-between">
            
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Showing {meta.from} to {meta.to} of {meta.total} items</span>
            </div>

            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        onValueChange={(value) => {
                            setPerPage(value);
                            handlePageSizeChange(value);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={perPage} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>



                <PaginationContent>
                    {links.map((link, index) => renderLink(link, index))}
                </PaginationContent>
            </div>
        </Pagination>
    )
}


{/* <div className="flex w-[100px] items-center justify-center text-sm font-medium">
    Page {meta.current_page} of {meta.last_page}
</div> */}
