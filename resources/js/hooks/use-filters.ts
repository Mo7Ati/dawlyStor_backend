import { useState } from 'react'
import { router } from '@inertiajs/react'
import { RouteDefinition, RouteQueryOptions } from '@/wayfinder'

type UseFiltersProps = {
    indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get">
    initialKeys: string[]
}

export function useFilters({ indexRoute, initialKeys }: UseFiltersProps) {
    const url = new URL(window.location.href)

    const initialFilters = Object.fromEntries(
        initialKeys.map(key => [key, url.searchParams.get(key) || undefined])
    )

    const [filters, setFilters] = useState<Record<string, string | undefined>>(initialFilters)

    const onChange = (key: string, value: string | undefined) => {
        if (value === 'all') {
            value = undefined
        }
        setFilters(prev => ({ ...prev, [key]: value }))

        router.get(
            indexRoute({
                mergeQuery: {
                    [key]: value,
                    page: 1,
                },
            }).url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        )
    }

    const reset = () => {
        setFilters({})
        router.get(indexRoute().url, {}, {
            // Do not preserve component state when resetting filters so that
            // components like the table search input are also cleared.
            preserveState: false,
            preserveScroll: true,
        })
    }

    const activeFiltersCount = Object.keys(filters).filter(key => filters[key] !== undefined).length

    return {
        filters,
        activeFiltersCount,
        onChange,
        reset,
    }
}
