import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { MultiSelect } from '@/components/ui/multi-select'
import { Role } from '@/types/dashboard'
import InputError from '@/components/shared/input-error'

interface RoleAssignmentCardProps {
    allRoles: Role[]
    currentAdminRoles: string[]
    className?: string
    onChange: (roles: string[]) => void
    errors?: {
        roles?: string
    }
}

export default function RoleAssignmentCard({
    allRoles,
    currentAdminRoles,
    errors,
    onChange,
    className,
}: RoleAssignmentCardProps) {
    const { t } = useTranslation('forms');

    const options = allRoles.map((role) => ({
        label: role.name,
        value: role.name,
    }))

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{t('admins.assign_roles')}</CardTitle>
                <CardDescription>
                    {t('admins.assign_roles_desc')}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div>
                    {allRoles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            {t('admins.no_roles_available')}
                        </p>
                    ) : (
                        <>
                            <MultiSelect
                                name="roles"
                                options={options}
                                onValueChange={onChange}
                                defaultValue={currentAdminRoles}
                            />
                        </>
                    )}
                    {errors?.roles && (
                        <InputError message={errors.roles} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

