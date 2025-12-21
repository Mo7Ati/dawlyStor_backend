import StatusFilter from '@/components/data-table/table-filters/status-filter'
import FilterDropdown from '@/components/data-table/table-filters/filters-dropdown'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFilters } from '@/hooks/use-filters'
import products from '@/routes/admin/products'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IsAcceptedFilter from './is-accepted-filter'

const ProductsFilters = () => {
    const { t: tTables } = useTranslation('tables');
    const { t: tForms } = useTranslation('forms');

    const {
        filters,
        onChange,
        reset,
        activeFiltersCount,
    } = useFilters({
        indexRoute: products.index,
        initialKeys: ['is_active', 'is_accepted'],
    })
    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount}>
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
