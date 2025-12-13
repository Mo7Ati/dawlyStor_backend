import { Form, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { GroupedPermissions, Permission, Role } from '@/types/dashboard'
import rolesRoutes from '@/routes/admin/roles'
import FormInput from '@/components/form/form-input'
import FormButtons from '@/components/form/form-buttons'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import InputError from '@/components/input-error'
import PermissionList from './permission-list'


interface RoleFormProps {
    role: Role
    permissions: GroupedPermissions,
    type: 'create' | 'edit'
}

// const formatPermissionName = (name: string): string => {
//     const parts = name.split('.')
//     if (parts.length >= 2) {
//         const action = parts[1]
//         return action.charAt(0).toUpperCase() + action.slice(1)
//     }
//     return name
// }

export default function RoleForm({ role, permissions, type }: RoleFormProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<GroupedPermissions>(permissions)
    console.log(permissions, role);

    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    {type === 'edit' ? 'Edit Role' : 'Create Role'}
                </CardTitle>
                <CardDescription>
                    {type === 'edit'
                        ? 'Update the role information and permissions below.'
                        : 'Fill in the information to create a new role.'}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form
                    method={type === 'edit' ? 'put' : 'post'}
                    action={
                        (type === 'edit' && role.id)
                            ? rolesRoutes.update.url({ role: role.id })
                            : rolesRoutes.store.url()
                    }
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                name="name"
                                label="Name"
                                type="text"
                                required={true}
                                placeholder="Enter role name"
                                defaultValue={role.name}
                                error={errors.name}
                                className="max-w-100"
                            />

                            <div className="space-y-6">
                                <div>
                                    <Label className="text-base font-semibold">
                                        Permissions
                                    </Label>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Select the permissions for this role
                                    </p>
                                    <InputError message={errors.permissions} />
                                </div>

                                <PermissionList role={role} permissions={permissions} />
                            </div>

                            <CardFooter className="flex justify-end gap-2">
                                <FormButtons
                                    processing={processing}
                                    handleCancel={() => router.visit(rolesRoutes.index.url())}
                                    isEditMode={type === 'edit'}
                                />
                            </CardFooter>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    )
}

