import FilterDropdown from '@/components/data-table/table-filters/filters-dropdown';
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select';
import { useFilters } from '@/hooks/use-filters';
import { useEnums } from '@/hooks/use-enums';
import orders from '@/routes/admin/orders';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const OrderFilters = () => {
    const { t: tForms } = useTranslation('forms');
    const { t: tTables } = useTranslation('tables');
    const { orderStatus, paymentStatus } = useEnums();

    const {
        filters,
        onChange,
        reset,
        activeFiltersCount,
    } = useFilters({
        indexRoute: orders.index,
        initialKeys: ['status', 'payment_status'],
    })


    return (
        <FilterDropdown activeFiltersCount={activeFiltersCount}>
            <div className="flex flex-col gap-4">
                {/* Status Filter */}
                <div className="flex flex-col gap-2">
                    <Label>{tTables('orders.status')}</Label>
                    <Select value={filters.status ?? 'all'} onValueChange={(value) => onChange("status", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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


            {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={reset} className="h-9 px-2 lg:px-3">
                    <X className="h-4 w-4 mr-1" />
                    {tForms('common.clear_filters')}
                </Button>
            )}
        </FilterDropdown>
    )
}

export default OrderFilters;
