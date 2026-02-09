import StatusFilter from '@/components/table/table-filters/status-filter'
import FilterDropdown from '@/components/table/table-filters/filters-dropdown'
import { useFilters } from '@/hooks/use-filters'
import IsAcceptedFilter from './is-accepted-filter'
import { RouteQueryOptions } from '@/wayfinder';
import { RouteDefinition } from '@/wayfinder';

const ProductsFilters = ({ indexRoute }: { indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get"> }) => {
    const {
        filters,
        activeFiltersCount,
        onChange,
        reset,
    } = useFilters({
        indexRoute: indexRoute,
        initialKeys: ['is_active', 'is_accepted'],
    })
    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount} onClearFilters={reset}>
            <div className="flex flex-col gap-4">
                {/* Status Filter */}
                <StatusFilter value={filters.is_active} onChange={onChange} />

                {/* Accepted Filter */}
                <IsAcceptedFilter value={filters.is_accepted ?? 'all'} onChange={onChange} />
            </div>
        </FilterDropdown>
    )
}

export default ProductsFilters
