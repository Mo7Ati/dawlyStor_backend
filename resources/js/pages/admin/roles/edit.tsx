import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { GroupedPermissions, Role } from '@/types/dashboard'
import { Head } from '@inertiajs/react'
import RoleForm from './components/role-form'
import rolesRoutes from '@/routes/admin/roles'


const RolesEdit = ({ role, permissions }: { role: Role; permissions: GroupedPermissions }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: rolesRoutes.index.url(),
        },
        {
            title: 'Edit Role',
            href: rolesRoutes.edit.url({ role: role.id }),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <RoleForm role={role} permissions={permissions} type="edit" />
            </div>
        </AppLayout>
    )
}

export default RolesEdit

