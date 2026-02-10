
import FilterDropdown from '@/components/table/table-filters/filters-dropdown'
import StatusFilter from '@/components/table/table-filters/status-filter'
import { useFilters } from '@/hooks/use-filters'
import StoreController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreController'

export default function StoresFilters() {
    const {
        filters,
        activeFiltersCount,
        onChange,
        reset,
    } = useFilters({
        indexRoute: StoreController.index,
        initialKeys: ['is_active'],
    })

    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount} onClearFilters={reset}>
            <div className="flex flex-col items-center gap-2">
                <StatusFilter
                    value={filters.is_active}
                    onChange={onChange}
                />
            </div>
        </FilterDropdown>
    )
}
