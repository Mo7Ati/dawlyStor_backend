import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Admin, PaginatedResponse, Role } from '@/types/dashboard'
import { Head } from '@inertiajs/react'
import AdminForm from './components/admin-form'
import adminRoutes from '@/routes/admin/admins'



const AdminsEdit = ({ admin, roles }: { admin: Admin; roles: Role[] }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admins',
            href: adminRoutes.index.url(),
        },
        {
            title: 'Edit Admin',
            href: adminRoutes.edit.url({ admin: admin.id }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <AdminForm admin={admin} roles={roles} type="edit" />
            </div>
        </AppLayout>
    )
}

export default AdminsEdit
