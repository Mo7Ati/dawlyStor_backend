import { useEffect, useRef, useState } from 'react';
import { ColumnFilter } from './data-table'
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { router } from '@inertiajs/react';
import admins from '@/routes/admin/admins';
import { Input } from '@/components/ui/input'

const Filters = ({ columnFilters }: { columnFilters?: ColumnFilter[] }) => {

    const getFilters = (): { [key: string]: string[] | string } => {
        const url = new URL(window.location.href);
        const search = url.searchParams.get('search');
        const columnFiltersValues = columnFilters?.reduce((acc, filter) => {
            const value = url.searchParams.get(filter.id) || '';
            return { ...acc, [filter.id]: value };
        }, {} as { [key: string]: string }) || {};
        return {
            search: search || '',
            ...columnFiltersValues,
        };
    }

    const [filters, setFilters] = useState<{ [key: string]: string[] | string }>(() => getFilters());
    const firstRender = useRef(true);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevFiltersRef = useRef<{ [key: string]: string[] | string }>(filters);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            prevFiltersRef.current = filters;
            return;
        }

        const searchChanged = prevFiltersRef.current.search !== filters.search;
        const otherFiltersChanged = Object.keys(filters).some(
            key => key !== 'search' && prevFiltersRef.current[key] !== filters[key]
        );

        // Clear existing timeout if search changed again
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        const makeRequest = () => {
            router.get(
                admins.index.url(),
                {
                    page: 1,
                    ...filters,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
            prevFiltersRef.current = filters;
        };

        if (searchChanged && !otherFiltersChanged) {
            // Debounce search changes (500ms delay)
            debounceTimeoutRef.current = setTimeout(() => {
                makeRequest();
            }, 500);
        } else {
            // Immediate update for other filter changes
            makeRequest();
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [filters]);

    if (!columnFilters) return null;

    return (
        <>
            <Input
                type="text"
                value={filters['search'] || ''}
                placeholder="Search admins..."
                onChange={(e) => setFilters({
                    ...filters,
                    search: e.target.value,
                })}
            />
            {
                columnFilters.map((filter) => (
                    <DropdownMenu key={filter.id}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{filter.label}</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-48">
                            {filter.options.map((option) => (
                                <DropdownMenuCheckboxItem
                                    key={option.value}
                                    checked={filters[filter.id]?.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                        setFilters({
                                            ...filters,
                                            [filter.id]: option.value,
                                        });
                                    }}
                                >
                                    {option.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ))
            }
        </>
    );
}

export default Filters
