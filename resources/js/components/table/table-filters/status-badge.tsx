import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import OrderStatusEnum from "@/wayfinder/App/Enums/OrderStatusEnum";
import PaymentStatusEnum from "@/wayfinder/App/Enums/PaymentStatusEnum";

type StatusType = 'orderStatus' | 'paymentStatus';

interface StatusBadgeProps {
    type: StatusType;
    value: string;
    className?: string;
}

/**
 * Badge component that displays enum status with appropriate color
 */
export function StatusBadge({ type, value, className }: StatusBadgeProps) {

    const status = type === 'orderStatus'
        ? OrderStatusEnum[value as keyof typeof OrderStatusEnum]
        : PaymentStatusEnum[value as keyof typeof PaymentStatusEnum];

    if (!status) {
        return (
            <Badge variant="outline" className={className}>
                {value}
            </Badge>
        );
    }

    // Map color names to badge variants and custom classes
    const getBadgeVariant = (color: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (color) {
            case 'destructive':
                return 'destructive';
            case 'success':
            case 'info':
            case 'primary':
            case 'orange':
                return 'secondary';
            case 'warning':
            case 'muted':
            default:
                return 'outline';
        }
    };

    const getColorClasses = (color: string): string => {
        switch (color) {
            case 'success':
                return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
            case 'warning':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
            case 'info':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
            case 'primary':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
            case 'orange':
                return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
            case 'muted':
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
            case 'destructive':
                return ''; // Use default destructive variant
            default:
                return '';
        }
    };

    // const variant = getBadgeVariant(status.color());
    // const colorClasses = getColorClasses(status.color());

    return (
        <Badge
            variant={'outline'}
            className={cn('bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20', className)}
        >
            {status}
        </Badge>
    );
}
