import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import RoleForm from './components/role-form'
import rolesRoutes from '@/routes/admin/roles'
import { GroupedPermissions, Role } from '@/types/dashboard'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: rolesRoutes.index.url(),
    },
    {
        title: 'Create Role',
        href: rolesRoutes.create.url(),
    },
]
const RolesCreate = ({ role, permissions }: { role: Role; permissions: GroupedPermissions }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <RoleForm role={role} permissions={permissions} type="create" />
            </div>
        </AppLayout>
    )
}

export default RolesCreate

