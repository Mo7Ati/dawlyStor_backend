import { Form, router } from '@inertiajs/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { GroupedPermissions, Role } from '@/types/dashboard'
import FormButtons from '@/components/form/form-buttons'
import InputError from '@/components/shared/input-error'
import PermissionList from './permission-list'
import { Input } from '@/components/ui/input'
import RoleController from '@/wayfinder/App/Http/Controllers/dashboard/admin/RoleController'
import { Label } from '@/components/ui/label'


interface RoleFormProps {
    role: Role
    permissions: GroupedPermissions,
    type: 'create' | 'edit'
}

export default function RoleForm({ role, permissions, type }: RoleFormProps) {
    const { t } = useTranslation('forms');
    const [selectedPermissions, setSelectedPermissions] = useState<GroupedPermissions>(permissions)

    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    {type === 'edit' ? t('roles.edit_role') : t('roles.create_role')}
                </CardTitle>
                <CardDescription>
                    {type === 'edit'
                        ? t('roles.update_role_info')
                        : t('roles.create_role_info')}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form
                    method={type === 'edit' ? 'put' : 'post'}
                    action={
                        (type === 'edit' && role.id)
                            ? RoleController.update.url({ role: role.id.toString() })
                            : RoleController.store.url()
                    }
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div>
                                <Label htmlFor="name">{t('roles.name')}</Label>
                                <Input
                                    name="name"
                                    type="text"
                                    required={true}
                                    placeholder={t('roles.enter_role_name')}
                                    defaultValue={role.name}
                                    aria-invalid={errors.name ? 'true' : 'false'}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-base font-semibold">
                                        {t('roles.permissions')}
                                    </Label>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {t('roles.select_permissions_desc')}
                                    </p>
                                    <InputError message={errors.permissions} />
                                </div>

                                <PermissionList role={role} permissions={permissions} />
                            </div>

                            <CardFooter className="flex justify-end gap-2">
                                <FormButtons
                                    processing={processing}
                                    handleCancel={() => router.visit(RoleController.index.url())}
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

