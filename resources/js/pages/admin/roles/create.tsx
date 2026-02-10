import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import RoleForm from './components/role-form'
import { GroupedPermissions, Role } from '@/types/dashboard'
import RoleController from '@/wayfinder/App/Http/Controllers/dashboard/admin/RoleController'
import { App } from '@/wayfinder/types';


const RolesCreate = ({ role, permissions }: { role: Role; permissions: GroupedPermissions }) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('roles.title'),
            href: RoleController.index.url(),
        },
        {
            title: t('roles.create'),
            href: RoleController.create.url(),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('roles.create')}>
            <RoleForm role={role} permissions={permissions} type="create" />
        </AppLayout>
    )
}

export default RolesCreate

