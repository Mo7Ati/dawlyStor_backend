import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import AdminForm from './components/admin-form'
import AdminController from '@/wayfinder/App/Http/Controllers/dashboard/admin/AdminController'
import { App } from "@/wayfinder/types";
import { Role } from '@/types/dashboard';

const AdminsEdit = ({ admin, roles }: { admin: App.Models.Admin; roles: Role[] }) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('admins.title'),
            href: AdminController.index.url(),
        },
        {
            title: t('admins.edit'),
            href: AdminController.edit.url({ admin: admin.id.toString() }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('admins.edit')}>
            <AdminForm admin={admin} roles={roles} type="edit" />
        </AppLayout>
    )
}

export default AdminsEdit
