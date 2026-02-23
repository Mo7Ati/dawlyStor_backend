import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { ContactMessage, PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import type { RouteQueryOptions } from '@/wayfinder';

const CONTACT_MESSAGES_INDEX = '/admin/contact-messages';

function contactMessagesIndexRoute(options?: RouteQueryOptions) {
    const params = new URLSearchParams();
    const q = options?.query ?? options?.mergeQuery ?? {};
    Object.entries(q).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    const query = params.toString();
    return { url: query ? `${CONTACT_MESSAGES_INDEX}?${query}` : CONTACT_MESSAGES_INDEX, method: 'get' as const };
}

const ContactMessagesIndex = ({
    contactMessages: messagesData,
}: {
    contactMessages: PaginatedResponse<ContactMessage>;
}) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<ContactMessage>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label={tTables('common.select_all')}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={tTables('common.select_row')}
                />
            ),
            enableHiding: false,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={tTables('common.id') || 'ID'}
                    indexRoute={contactMessagesIndexRoute}
                />
            ),
            enableHiding: false,
        },
        {
            id: 'name',
            accessorFn: (row) => `${row.first_name} ${row.last_name}`,
            header: tDashboard('contact_messages.name') || 'Name',
        },
        {
            accessorKey: 'email',
            header: tDashboard('contact_messages.email') || 'Email',
        },
        {
            accessorKey: 'subject',
            header: tDashboard('contact_messages.subject') || 'Subject',
        },
        {
            id: 'read_at',
            accessorFn: (row) => row.read_at,
            header: tDashboard('contact_messages.read') || 'Read',
            cell: ({ row }) =>
                row.original.read_at ? (
                    <Badge >{tDashboard('contact_messages.read') || 'Read'}</Badge>
                ) : (
                    <Badge variant="outline">{tDashboard('contact_messages.unread') || 'Unread'}</Badge>
                ),
        },
        {
            id: 'replied_at',
            accessorFn: (row) => row.replied_at,
            header: tDashboard('contact_messages.replied') || 'Replied',
            cell: ({ row }) =>
                row.original.replied_at ? (
                    <Badge variant="default">{tDashboard('contact_messages.replied') || 'Replied'}</Badge>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={tDashboard('contact_messages.created_at') || 'Created'}
                    indexRoute={contactMessagesIndexRoute}
                />
            ),
            cell: ({ row }) =>
                row.original.created_at
                    ? new Date(row.original.created_at).toLocaleDateString()
                    : '—',
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('contact_messages.title') || 'Contact messages',
            href: CONTACT_MESSAGES_INDEX,
        },
    ];

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            title={tDashboard('contact_messages.title') || 'Contact messages'}
        >
            <DataTable
                columns={columns}
                data={messagesData.data}
                meta={messagesData.meta}
                indexRoute={contactMessagesIndexRoute}
                // model="contact-messages"
                onRowClick={(row) =>
                    router.visit(`/admin/contact-messages/${row.id}`)
                }
            />
        </AppLayout>
    );
};

export default ContactMessagesIndex;
