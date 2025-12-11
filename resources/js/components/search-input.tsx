import admins from '@/routes/admin/admins';
import { Input } from '@/components/ui/input'
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react'
import { SearchIcon } from 'lucide-react';

const SearchInput = () => {
    const url = new URL(window.location.href);
    const firstRender = useRef(true);
    const [search, setSearch] = useState(url.searchParams.get('search') || '');

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(admins.index.url(),
                { search, page: 1 },
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
                type="text"
                value={search}
                placeholder="Search admins..."
                onChange={(e) => setSearch(e.target.value)}
            />
        </>
    )
}

export default SearchInput
