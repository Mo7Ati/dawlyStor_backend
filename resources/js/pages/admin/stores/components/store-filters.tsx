import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import FilterDropdown from '@/components/data-table/table-filters/filters-dropdown'
import StatusFilter from '@/components/data-table/table-filters/status-filter'
import stores from '@/routes/admin/stores'
import { useFilters } from '@/hooks/use-filters'

export default function StoresFilters() {
    const { t: tForms } = useTranslation('forms')

    const {
        filters,
        onChange,
        reset,
        activeFiltersCount,
    } = useFilters({
        indexRoute: stores.index,
        initialKeys: ['is_active'],
    })

    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount}>
            <div className="flex flex-col items-center gap-2">
                <StatusFilter
                    value={filters.is_active}
                    onChange={onChange}
                />

                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={reset}
                        className="h-9 px-2 lg:px-3"
                    >
                        <X className="h-4 w-4 mr-1" />
                        {tForms('common.clear_filters')}
                    </Button>
                )}
            </div>
        </FilterDropdown>
    )
}
