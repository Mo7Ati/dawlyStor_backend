import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

/**
 * Hook to check user permissions
 * @returns Object with permission checking methods
 */
export function usePermissions() {
    const { auth, enums } = usePage<SharedData>().props;

    const permissions = auth?.permissions || [];

    /**
     * Check if user has a specific permission
     * @param permission - The permission name to check (e.g., 'admins.update')
     * @returns boolean - True if user has the permission
     */
    const hasPermission = (permission: string): boolean => {
        if (!permissions) {
            return false;
        }
        console.log(permissions);

        // Handle both array format and object format (Record<number, string>)
        if (Array.isArray(permissions)) {
            return permissions.length > 0 && permissions.includes(permission);
        } else {
            // If it's an object (Record<number, string>), check the values
            const permissionValues = Object.values(permissions);
            return permissionValues.length > 0 && permissionValues.includes(permission);
        }
    };

    /**
     * Check if user has any of the provided permissions
     * @param permissionList - Array of permission names to check
     * @returns boolean - True if user has at least one of the permissions
     */
    const hasAnyPermission = (permissionList: string[]): boolean => {
        return permissionList.some(permission => hasPermission(permission));
    };

    /**
     * Check if user has all of the provided permissions
     * @param permissionList - Array of permission names to check
     * @returns boolean - True if user has all of the permissions
     */
    const hasAllPermissions = (permissionList: string[]): boolean => {
        return permissionList.every(permission => hasPermission(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        permissions,
    };
}

