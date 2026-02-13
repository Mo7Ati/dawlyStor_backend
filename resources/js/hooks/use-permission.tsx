import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';


export function usePermission(permission: string) {
    const { permissions } = usePage<SharedData>().props.auth;
    console.log(permissions , permission);
    return permissions.includes(permission);
}

