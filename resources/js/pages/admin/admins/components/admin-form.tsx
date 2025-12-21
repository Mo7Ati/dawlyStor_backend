import { Form, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Admin, Role } from '@/types/dashboard'
import adminRoutes from '@/routes/admin/admins'
import RoleAssignmentCard from './role-assignment-card'
import FormButtons from '@/components/form/form-buttons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import IsActiveFormField from '@/components/form/is-active'

interface AdminFormProps {
    admin: Admin
    roles: Role[]
    type: 'create' | 'edit'
}

export default function AdminForm({ admin, roles, type }: AdminFormProps) {
    const { t } = useTranslation('forms');

    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && admin.id)
                    ? adminRoutes.update.url({ admin: admin.id })
                    : adminRoutes.store.url()
            }
        >
            {({ processing, errors }) => (
                <>
                    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                        {/* Left column – main admin form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {type === 'edit' ? t('admins.edit_admin') : t('admins.create')}
                                </CardTitle>
                                <CardDescription>
                                    {type === 'edit'
                                        ? t('admins.update_admin_info')
                                        : t('admins.create_admin_info')}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 md:space-y-6">
                                <div>
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input
                                        name="name"
                                        type="text"
                                        required={true}
                                        placeholder={t('admins.enter_admin_name')}
                                        defaultValue={admin.name}
                                        aria-invalid={errors.name ? 'true' : 'false'}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="email">{t('common.email')}</Label>
                                    <Input
                                        name="email"
                                        type="email"
                                        required={true}
                                        placeholder={t('admins.enter_email')}
                                        defaultValue={admin.email}
                                        aria-invalid={errors.email ? 'true' : 'false'}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div>
                                    <Label htmlFor="password">{t('common.password')}</Label>
                                    <Input
                                        name="password"
                                        type="password"
                                        required={type === 'create'}
                                        placeholder={type === 'create' ? t('admins.enter_password') : t('admins.enter_new_password')}
                                        aria-invalid={errors.password ? 'true' : 'false'}
                                    />
                                    <InputError message={errors.password} />
                                    {type === 'create' && (
                                        <span className="text-sm text-muted-foreground">
                                            {t('admins.leave_blank')}
                                        </span>
                                    )}
                                </div>

                                <IsActiveFormField value={admin.is_active ?? true} />
                            </CardContent>
                        </Card>

                        {/* Right column – roles assignment */}
                        <RoleAssignmentCard
                            roles={roles}
                            selectedRoleNames={admin.roles?.map((role) => role.name) ?? []}
                            errors={errors}
                        />
                    </div>

                    <FormButtons
                        processing={processing}
                        handleCancel={() => router.visit(adminRoutes.index.url())}
                        isEditMode={type === 'edit'}
                    />
                </>
            )}
        </Form>
    )
}

