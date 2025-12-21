import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

/**
 * Hook to access enums shared from the backend
 * @returns Object containing all available enums with their options
 */
export function useEnums() {
    const { enums } = usePage<SharedData>().props;

    return {
        orderStatus: enums.orderStatus,
        paymentStatus: enums.paymentStatus,
        permissions: enums.permissions,
        /**
         * Get enum option by value
         */
        getOrderStatus: (value: string) => {
            return enums.orderStatus.find((option) => option.value === value);
        },
        /**
         * Get enum option by value
         */
        getPaymentStatus: (value: string) => {
            return enums.paymentStatus.find((option) => option.value === value);
        },
        /**
         * Get enum option by value
         */
        getPermission: (value: string) => {
            return enums.permissions.find((option) => option.value === value);
        },
    };
}

