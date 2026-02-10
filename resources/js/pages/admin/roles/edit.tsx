import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { GroupedPermissions, Role } from '@/types/dashboard'
import { useTranslation } from 'react-i18next'
import RoleForm from './components/role-form'
import RoleController from '@/wayfinder/App/Http/Controllers/dashboard/admin/RoleController'

const RolesEdit = ({ role, permissions }: { role: Role; permissions: GroupedPermissions }) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('roles.title'),
            href: RoleController.index.url(),
        },
        {
            title: t('roles.edit'),
            href: RoleController.edit.url({ role: role.id.toString() }),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('roles.edit')}>
            <RoleForm role={role} permissions={permissions} type="edit" />
        </AppLayout>
    )
}

export default RolesEdit

