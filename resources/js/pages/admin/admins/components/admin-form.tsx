import { Form, router } from '@inertiajs/react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Admin, Role } from '@/types/dashboard'
import adminRoutes from '@/routes/admin/admins'
import IsActive from '@/components/form/is-active'
import FormInput from '@/components/form/form-input'
import FormButtons from '@/components/form/form-buttons'
import RoleAssignmentCard from './role-assignment-card'

interface AdminFormProps {
    admin: Admin
    roles: Role[]
    type: 'create' | 'edit'
}

export default function AdminForm({ admin, roles, type }: AdminFormProps) {
    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && admin.id)
                    ? adminRoutes.update.url({ admin: admin.id })
                    : adminRoutes.store.url()
            }
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <div className="flex w-full gap-4">
                    <Card className=" max-w-2xl flex-1">
                        <CardHeader>
                            <CardTitle>
                                {type === 'edit' ? 'Edit Admin' : 'Create Admin'}
                            </CardTitle>
                            <CardDescription>
                                {type === 'edit'
                                    ? 'Update the admin information below.'
                                    : 'Fill in the information to create a new admin.'}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <FormInput
                                name="name"
                                label="Name"
                                type="text"
                                required={true}
                                placeholder="Enter admin name"
                                defaultValue={admin.name}
                                error={errors.name}
                            />

                            <FormInput
                                name="email"
                                label="Email"
                                type="email"
                                required={true}
                                placeholder="Enter email address"
                                defaultValue={admin.email}
                                error={errors.email}
                            />

                            <FormInput
                                name="password"
                                label="Password"
                                type="password"
                                required={type === 'create'}
                                placeholder={type === 'create' ? 'Enter password (min. 8 characters)' : 'Enter new password (optional)'}
                                hint={type === 'create' ? '' : 'Leave blank to keep current'}
                                error={errors.password}
                            />

                            <IsActive value={admin.is_active ?? true} />
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            <FormButtons
                                processing={processing}
                                handleCancel={() => router.visit(adminRoutes.index.url())}
                                isEditMode={type === 'edit'}
                            />
                        </CardFooter>
                    </Card>


                    <RoleAssignmentCard
                        roles={roles}
                        selectedRoleNames={
                            admin.roles
                                ? (() => {
                                    // Check if roles is an array of IDs (numbers/strings) or Role objects
                                    if (admin.roles.length === 0) return [];
                                    const firstItem = admin.roles[0];
                                    if (typeof firstItem === 'object' && firstItem !== null && 'name' in firstItem) {
                                        // It's an array of Role objects
                                        return (admin.roles as Role[]).map((role) => role.name);
                                    } else {
                                        // It's an array of IDs (AdminResource returns IDs, not Role objects)
                                        return (admin.roles as unknown as (number | string)[])
                                            .map((roleId) => {
                                                const role = roles.find((r) => r.id === roleId || r.id === String(roleId));
                                                return role?.name;
                                            })
                                            .filter((name): name is string => Boolean(name));
                                    }
                                })()
                                : []
                        }
                        errors={errors}
                    />
                </div>

            )}
        </Form>
    )
}

