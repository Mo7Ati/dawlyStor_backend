import FilterDropdown from '@/components/table/table-filters/filters-dropdown';
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select';
import { useFilters } from '@/hooks/use-filters';
import { useEnums } from '@/hooks/use-enums';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { RouteQueryOptions } from '@/wayfinder';
import { RouteDefinition } from '@/wayfinder';

const OrderFilters = ({ indexRoute }: { indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get"> }) => {
    const { t: tForms } = useTranslation('forms');
    const { t: tTables } = useTranslation('tables');
    const { orderStatus, paymentStatus } = useEnums();

    const {
        filters,
        activeFiltersCount,
        onChange,
        reset,
    } = useFilters({
        indexRoute: indexRoute,
        initialKeys: ['status', 'payment_status'],
    })


    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount} onClearFilters={reset}>
            <div className="flex flex-col gap-4">
                {/* Status Filter */}
                <div className="flex flex-col gap-2">
                    <Label>{tTables('orders.status')}</Label>
                    <Select value={filters.status ?? 'all'} onValueChange={(value) => onChange("status", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder={tForms('common.select_status')} />
                        </SelectTrigger>

                        <SelectContent>
                            {/* @ts-ignore */}
                            <SelectItem value="all">
                                {tForms('common.all')}
                            </SelectItem>
                            {orderStatus.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>


                {/* Payment Status Filter */}
                <div className="flex flex-col gap-2">
                    <Label>{tTables('orders.payment_status')}</Label>
                    <Select
                        value={filters.payment_status ?? 'all'}
                        onValueChange={(value) => onChange("payment_status", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>

                        <SelectContent>
                            {/* @ts-ignore */}
                            <SelectItem value="all">
                                {tForms('common.all')}
                            </SelectItem>
                            {paymentStatus.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
        </FilterDropdown>
    )
}

export default OrderFilters;
