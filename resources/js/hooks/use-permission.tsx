import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';


export function usePermission(permission: string) {
    const { permissions } = usePage<SharedData>().props.auth;
    return permissions.includes(permission);
}

