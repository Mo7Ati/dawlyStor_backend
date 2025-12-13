import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { GroupedPermissions, Role } from '@/types/dashboard'
import React, { useState } from 'react'

const PermissionList = ({ role, permissions }: { role: Role; permissions: GroupedPermissions }) => {
    const [selectedPermissionNames, setSelectedPermissionNames] = useState<string[]>(role.permissions?.map((p) => p.name) || []);

    const handlePermissionToggle = (permissionName: string, checked: boolean) => {
        setSelectedPermissionNames((prev) => {
            if (checked) {
                return [...prev, permissionName];
            } else {
                return prev.filter((name) => name !== permissionName);
            }
        });
    };

    const handleSelectAllGroup = (group: string, checked: boolean) => {
        setSelectedPermissionNames((prev) => {
            if (checked) {
                return [...prev, ...permissions[group].map((p) => p.name)];
            } else {
                return prev.filter((name) => !permissions[group].map((p) => p.name).includes(name));
            }
        });
    }

    const handleSelectAllPermissions = (checked: boolean) => {
        Object.entries(permissions).forEach(([group, perms]) => {
            perms.forEach((p) => {
                handlePermissionToggle(p.name, checked === true);
            });
        });
    }

    return (
        <>
            <div className="flex justify-end gap-3">
                <Checkbox
                    id={'select-all'}
                    defaultChecked={Object.values(permissions).every((perms) => perms.every((p) => selectedPermissionNames.includes(p.name)))}
                    onCheckedChange={handleSelectAllPermissions}
                />
                <Label htmlFor={'select-all'} className="text-sm font-normal cursor-pointer">Select All Permissions</Label>
            </div>
            {Object.entries(permissions).map(([group, perms]) => (
                <Card key={group} className="border-muted">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base capitalize flex items-center justify-between">
                            <span>{group.replace(/([A-Z])/g, " $1")}</span>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={`select-all-${group}`}
                                    checked={perms.every((p) => selectedPermissionNames.includes(p.name))}
                                    onCheckedChange={(checked) => {
                                        handleSelectAllGroup(group, checked === true);
                                    }}
                                />
                                <Label htmlFor={`select-all-${group}`} className="text-sm font-normal cursor-pointer">Select All</Label>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {perms.map((permission) => {
                            const isChecked = selectedPermissionNames.includes(permission.name);
                            return (
                                <div
                                    key={permission.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`perm-${permission.id}`}
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                            handlePermissionToggle(permission.name, checked === true);
                                        }}
                                    />

                                    <Label
                                        htmlFor={`perm-${permission.id}`}
                                        className="cursor-pointer text-sm"
                                    >
                                        {permission.name.split('.').pop()?.replace(/([A-Z])/g, " $1")}
                                    </Label>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            ))}

            {selectedPermissionNames.map((permissionName) => (
                <input
                    key={permissionName}
                    type="hidden"
                    name="permissions[]"
                    value={permissionName}
                />
            ))}
        </>
    )
}

export default PermissionList
