import FilterDropdown from '@/components/table/table-filters/filters-dropdown';
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select';
import { useFilters } from '@/hooks/use-filters';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { RouteQueryOptions } from '@/wayfinder';
import { RouteDefinition } from '@/wayfinder';
import OrderStatusEnum from "@/wayfinder/App/Enums/OrderStatusEnum";
import PaymentStatusEnum from "@/wayfinder/App/Enums/PaymentStatusEnum";

const OrderFilters = ({ indexRoute }: { indexRoute: (options?: RouteQueryOptions) => RouteDefinition<"get"> }) => {
    const { t: tForms } = useTranslation('forms');
    const { t: tTables } = useTranslation('tables');

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
                            {Object.values(OrderStatusEnum).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {tTables(`order_status.${status}`)}
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
                            {Object.values(PaymentStatusEnum).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {tTables(`payment_status.${status}`)}
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
