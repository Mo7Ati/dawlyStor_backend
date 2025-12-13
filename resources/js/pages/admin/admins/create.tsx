import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import AdminForm from './components/admin-form'
import adminRoutes from '@/routes/admin/admins'
import { Admin, Role } from '@/types/dashboard'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: adminRoutes.index.url(),
    },
    {
        title: 'Create Admin',
        href: adminRoutes.create.url(),
    },
]

const AdminsCreate = ({ admin, roles }: { admin: Admin; roles: Role[] }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <AdminForm admin={admin} roles={roles} type="create" />
            </div>
        </AppLayout>
    )
}

export default AdminsCreate

