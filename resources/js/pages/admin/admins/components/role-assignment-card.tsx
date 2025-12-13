import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { MultiSelect } from '@/components/ui/multi-select'
import { Role } from '@/types/dashboard'
import InputError from '@/components/input-error'

interface RoleAssignmentCardProps {
    roles: Role[]
    selectedRoleNames?: string[]
    errors?: {
        roles?: string
    }
}

export default function RoleAssignmentCard({
    roles,
    selectedRoleNames = [],
    errors
}: RoleAssignmentCardProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(selectedRoleNames);

    // Sync selectedRoles with selectedRoleNames prop when it changes (important for edit mode)
    useEffect(() => {
        setSelectedRoles(selectedRoleNames);
    }, [selectedRoleNames]);

    const options = roles.map((role) => ({
        label: role.name,
        value: role.name,
        permissions_count: role.permissions_count,
    }))

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Assign Roles</CardTitle>
                <CardDescription>
                    Select the roles to assign to this admin. The admin will inherit all permissions from the selected roles.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {roles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No roles available. Please create roles first.
                        </p>
                    ) : (
                        <>
                            <MultiSelect
                                options={options}
                                selected={selectedRoles}
                                onSelectedChange={(selected) => {
                                    setSelectedRoles(selected.map((roleName) => roleName.toString()));
                                }}
                                placeholder="Select roles..."
                                searchPlaceholder="Search roles..."
                                emptyMessage="No roles found."
                                // maxCount={2}
                                renderOption={(option) => (
                                    <div className="flex items-center justify-between w-full">
                                        <span>{option.label}</span>
                                        {option.permissions_count !== undefined && (
                                            <span className="text-xs text-muted-foreground ml-2">
                                                ({option.permissions_count} {option.permissions_count === 1 ? 'permission' : 'permissions'})
                                            </span>
                                        )}
                                    </div>
                                )}
                            />
                            {/* Hidden inputs for form submission */}
                            {selectedRoles.map((roleName) => (
                                <input
                                    key={roleName}
                                    type="hidden"
                                    name="rules[]"
                                    value={roleName}
                                />
                            ))}
                        </>
                    )}
                    {errors?.roles && (
                        <InputError message={errors.roles} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

