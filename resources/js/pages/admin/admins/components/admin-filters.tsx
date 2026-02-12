import { useTranslation } from 'react-i18next';
import admins from "@/routes/admin/admins";
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
        indexRoute: admins.index,
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
