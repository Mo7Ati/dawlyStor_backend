
import AdminController from '@/wayfinder/App/Http/Controllers/dashboard/admin/AdminController'
import FilterDropdown from "@/components/table/table-filters/filters-dropdown";
import StatusFilter from "@/components/table/table-filters/status-filter";
import { useFilters } from "@/hooks/use-filters";

export default function AdminsFilters() {

    const {
        filters,
        activeFiltersCount,
        onChange,
        reset,
    } = useFilters({
        indexRoute: AdminController.index,
        initialKeys: ['is_active'],
    })



    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount} onClearFilters={reset}>
            <div className="flex flex-col items-center gap-2">
                {/* Status Filter */}
                <StatusFilter value={filters.is_active} onChange={onChange} />
            </div>
        </FilterDropdown>
    );
}
