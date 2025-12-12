import { useEffect, useMemo, useRef, useState } from 'react';
import { ColumnFilter } from '@/types/dashboard'
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { router } from '@inertiajs/react';
import admins from '@/routes/admin/admins';
import { Input } from '@/components/ui/input'

const Filters = ({ columnFilters }: { columnFilters?: ColumnFilter[] }) => {

    type FiltersState = {
        tableSearch: string
        tableFilters: Record<string, string>
    }

    const getFilters = (): FiltersState => {
        const url = new URL(window.location.href)
        const tableSearch = url.searchParams.get('tableSearch') || ''

        const tableFiltersValues = columnFilters?.reduce((acc, filter) => {
            const value = url.searchParams.get(`tableFilters[${filter.id}][value]`) || ''
            return { ...acc, [filter.id]: value }
        }, {} as Record<string, string>) || {}

        return {
            tableSearch,
            tableFilters: tableFiltersValues,
        }
    }

    const [filters, setFilters] = useState<FiltersState>(() => getFilters());
    const firstRender = useRef(true);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevFiltersRef = useRef<FiltersState>(filters);

    const persistedParams = useMemo(() => {
        const url = new URL(window.location.href)
        const tableSortColumn = url.searchParams.get('tableSortColumn')
        const tableSortDirection = url.searchParams.get('tableSortDirection')
        const perPage = url.searchParams.get('per_page')

        const tableFiltersFromUrl = Array.from(url.searchParams.entries()).reduce<Record<string, { value: string }>>((acc, [key, value]) => {
            const match = key.match(/^tableFilters\[(.+)\]\[value\]$/)
            if (match && value) {
                acc[match[1]] = { value }
            }
            return acc
        }, {})

        return {
            tableSortColumn: tableSortColumn || undefined,
            tableSortDirection: tableSortDirection || undefined,
            per_page: perPage || undefined,
            tableFilters: tableFiltersFromUrl,
        }
    }, [])

    const buildRequestPayload = (nextFilters: FiltersState, pageOverride = 1) => {
        const filteredTableFilters = Object.entries(nextFilters.tableFilters || {}).reduce<Record<string, { value: string }>>((acc, [key, value]) => {
            if (value) {
                acc[key] = { value }
            }
            return acc
        }, {})

        return {
            page: pageOverride,
            ...persistedParams,
            tableSearch: nextFilters.tableSearch || undefined,
            tableFilters: filteredTableFilters,
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            prevFiltersRef.current = filters;
            return;
        }

        const searchChanged = prevFiltersRef.current.tableSearch !== filters.tableSearch;
        const otherFiltersChanged = JSON.stringify(prevFiltersRef.current.tableFilters) !== JSON.stringify(filters.tableFilters);

        // Clear existing timeout if search changed again
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        const makeRequest = () => {
            router.get(
                admins.index.url(),
                buildRequestPayload(filters),
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
                value={filters.tableSearch}
                placeholder="Search admins..."
                onChange={(e) => setFilters({
                    ...filters,
                    tableSearch: e.target.value,
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
                                        checked={filters.tableFilters[filter.id] === option.value}
                                        onCheckedChange={(checked) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                tableFilters: {
                                                    ...prev.tableFilters,
                                                    [filter.id]: checked ? option.value : '',
                                                },
                                            }))
                                        }
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
