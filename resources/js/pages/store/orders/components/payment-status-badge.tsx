import { Badge } from '@/components/ui/badge'
import { PhpEnumCase } from '@/types/enums';
import React from 'react'

const PaymentStatusBadge = ({ status }: { status: PhpEnumCase }) => {

    const getClassNames = (status: PhpEnumCase) => {
        switch (status.value) {
            case 'unpaid':
                return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
            case 'paid':
                return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
            case 'failed':
                return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
            case 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300':
                return 'outline';
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

export default PaymentStatusBadge;
