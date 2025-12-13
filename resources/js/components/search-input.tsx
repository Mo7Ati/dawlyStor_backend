import admins from '@/routes/admin/admins';
import { Input } from '@/components/ui/input'
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react'
import { type RouteDefinition, type RouteQueryOptions } from '@/wayfinder';

const SearchInput = ({ indexRoute }: { indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get"> }) => {
    const url = new URL(window.location.href);
    const firstRender = useRef(true);
    const [search, setSearch] = useState(url.searchParams.get('tableSearch') || '');

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                indexRoute({
                    mergeQuery: {
                        tableSearch: search || undefined,
                        page: 1,
                    },
                }).url,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Input
                name="tableSearch"
                type="text"
                value={search}
                placeholder={'search ...'}
                onChange={(e) => setSearch(e.target.value)}
            />
        </>
    )
}

export default SearchInput;
