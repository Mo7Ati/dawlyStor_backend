import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import FilterDropdown from '@/components/table/table-filters/filters-dropdown'
import StatusFilter from '@/components/table/table-filters/status-filter'
import stores from '@/routes/admin/stores'
import { useFilters } from '@/hooks/use-filters'

export default function StoresFilters() {
    const { t: tForms } = useTranslation('forms')

    const {
        filters,
        activeFiltersCount,
        onChange,
        reset,
    } = useFilters({
        indexRoute: stores.index,
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
