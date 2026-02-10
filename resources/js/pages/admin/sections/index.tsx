import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { PaginatedResponse } from '@/types/dashboard';
import { ReorderableDataTable } from '@/components/table/reorderable-data-table';
import SectionController from '@/wayfinder/App/Http/Controllers/dashboard/admin/SectionController';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';
import { toast } from 'sonner';
import IsActiveBadge from '@/components/table/badges/is-active-badge';
import { SectionEnum } from '@/wayfinder/App/Enums/SectionEnum';
import { App } from '@/wayfinder/types';

const SectionsIndex = ({ sections: sectionsData }: { sections: PaginatedResponse<App.Models.Section> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const handleReorder = (newOrder: App.Models.Section[]) => {
        // Send to backend
        router.post(
            SectionController.reorder.url(),
            { sections: newOrder.map((section) => ({ id: section.id, order: section.order })) }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(tDashboard('messages.updated_successfully') || 'Order updated successfully');
            },
            onError: () => {
                toast.error('Failed to update order');
            },
        });
    };

    const columns: ColumnDef<App.Models.Section>[] = [
        {
            accessorKey: 'type',
            header: tTables('common.type'),
            enableHiding: false,
        },
        {
            accessorKey: 'is_active',
            header: tTables('common.status'),
            enableHiding: false,
            cell: ({ row }) => <IsActiveBadge isActive={row.original.is_active} />,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <EditAction
                            editRoute={SectionController.edit.url({ section: row.original.id })}
                            permission="sections.update"
                        />
                        <DeleteAction
                            deleteRoute={SectionController.destroy.url({ section: row.original.id })}
                            permission="sections.destroy"
                        />
                    </div>
                )
            },
        },
    ];


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('sections.title') || 'Sections',
            href: SectionController.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('sections.title') || 'Sections'}>
            <ReorderableDataTable
                columns={columns}
                data={sectionsData.data}
                meta={sectionsData.meta}
                model="sections"
                createHref={SectionController.create.url()}
                indexRoute={SectionController.index}
                onReorder={handleReorder}
            />
        </AppLayout>
    )
}

export default SectionsIndex;
