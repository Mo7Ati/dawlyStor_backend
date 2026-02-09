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

import { MetaType } from "@/types/dashboard";
import { type RouteDefinition, type RouteQueryOptions } from "@/wayfinder";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function DataTablePagination({ meta, indexRoute }: { meta: MetaType, indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get"> }) {
    const [perPage, setPerPage] = useState<string>(meta.per_page || '10');
    const { links } = meta;
    const { t } = useTranslation('common');
    if (!links || links.length === 0) {
        return null;
    }
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
        router.get(indexRoute({
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
                        text={t('pagination.previous')}
                    />
                </PaginationItem>
            );
        }

        if (isNext) {
            return (
                <PaginationItem key={`next-${index}`}>
                    <PaginationNext
                        text={t('pagination.next')}
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
                <span className="text-sm font-medium">{t('pagination.showing', { from: meta.from, to: meta.to, total: meta.total })}</span>
            </div>

            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{t('pagination.rows_per_page')}</p>
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
