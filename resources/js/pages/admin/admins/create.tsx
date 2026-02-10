import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import AdminForm from './components/admin-form'
import AdminController from '@/wayfinder/App/Http/Controllers/dashboard/admin/AdminController'
import { Admin, Role } from '@/types/dashboard'
import { App } from "@/wayfinder/types";

const AdminsCreate = ({ admin, roles }: { admin: App.Models.Admin; roles: Role[] }) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('admins.title'),
            href: AdminController.create.url(),
        },
        {
            title: t('admins.create'),
            href: AdminController.create.url(),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('admins.create')}>
            <AdminForm admin={admin} roles={roles} type="create" />
        </AppLayout>
    )
}

export default AdminsCreate

