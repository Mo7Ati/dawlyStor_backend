import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { Section, PaginatedResponse } from '@/types/dashboard';
import { ReorderableDataTable } from '@/components/table/reorderable-data-table';
import sections from '@/routes/admin/sections';
import { EditAction } from '@/components/table/column-actions/edit-action';
import { DeleteAction } from '@/components/table/column-actions/delete-action-button';
import IsActiveBadge from '@/components/table/badges/is-active-badge';

const SectionsIndex = ({ sections: sectionsData, sectionTypes }: { sections: PaginatedResponse<Section>; sectionTypes: Record<string, string> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const handleReorder = (newOrder: Section[]) => {
        // Send to backend
        router.post(
            sections.reorder.url(),
            { sections: newOrder.map((section) => ({ id: section.id, order: section.order })) }, {
            preserveScroll: true,
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
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('sections.title') || 'Sections'}>
            <ReorderableDataTable
                columns={columns}
                data={sectionsData.data}
                meta={sectionsData.meta}
                model="sections"
                createHref={sections.create.url()}
                indexRoute={sections.index}
                onRowClick={(section) => router.visit(sections.edit({ section: section.id }))}
                onReorder={handleReorder}
            />
        </AppLayout>
    )
}

export default SectionsIndex;
