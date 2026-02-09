import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const IsActiveTableColumn = ({ isActive }: { isActive: boolean }) => {
    const { t: tTables } = useTranslation('tables');

    // Color classes for active/inactive states
    const activeClasses = 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    const inactiveClasses = 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';

    return (
        <Badge
            variant="outline"
            className={cn(isActive ? activeClasses : inactiveClasses)}
        >
            {isActive ? tTables('common.active') : tTables('common.inactive')}
        </Badge>
    )
}
export default IsActiveTableColumn
