import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Section, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/data-table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import sections from '@/routes/admin/sections';
import { EditAction } from '@/components/data-table/column-actions/edit-action';
import { DeleteAction } from '@/components/data-table/column-actions/delete-action-button';
import { toast } from 'sonner';
import IsActiveBadge from '@/components/data-table/badges/is-active-badge';

const SectionsIndex = ({ sections: sectionsData, sectionTypes }: { sections: PaginatedResponse<Section>; sectionTypes: Record<string, string> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const handleReorder = (newOrder: Section[]) => {
        // Send to backend
        router.post(
            sections.reorder.url(),
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

    const columns: ColumnDef<Section>[] = [
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
                            editRoute={sections.edit.url({ section: row.original.id })}
                            permission="sections.update"
                        />
                        <DeleteAction
                            deleteRoute={sections.destroy.url({ section: row.original.id })}
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
            href: sections.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tDashboard('sections.title') || 'Sections'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns}
                    data={sectionsData.data}
                    meta={sectionsData.meta}
                    model="sections"
                    createHref={sections.create.url()}
                    indexRoute={sections.index}
                    reorderable={true}
                    onReorder={handleReorder}
                />
            </div>
        </AppLayout>
    )
}

export default SectionsIndex;
