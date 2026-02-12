import { Badge } from '@/components/ui/badge';
import { PhpEnumCase } from '@/types/enums';
import React from 'react'

const OrderStatusBadge = ({ status }: { status: PhpEnumCase }) => {
    const getClassNames = (status: PhpEnumCase) => {
        switch (status.value) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
            case 'preparing':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
            case 'on_the_way':
                return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
            case 'completed':
                return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
            case 'rejected':
                return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
            default:
                return 'outline';
        }
    }
    return (
        <Badge className={getClassNames(status)}>
            {status.label}
        </Badge>
    )
}

export default OrderStatusBadge
