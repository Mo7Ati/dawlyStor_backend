import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import wallets from '@/routes/admin/wallets';

export interface AdminWallet {
    id: number | string;
    holder_type: string;
    holder_id: number | string;
    owner_name: string | null;
    balance: number;
    name: string;
    slug: string;
    created_at: string | null;
    updated_at: string | null;
}

const WalletsIndex = ({ wallets: walletsData }: { wallets: PaginatedResponse<AdminWallet> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const columns: ColumnDef<AdminWallet>[] = [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('wallets.id') || 'ID'} indexRoute={wallets.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "holder",
            header: tTables('wallets.holder'),
        },
        {
            accessorKey: "name",
            header: tTables('wallets.name'),
        },
        {
            accessorKey: "slug",
            header: tTables('wallets.slug'),
        },
        {
            accessorKey: "balance",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('wallets.balance') || 'Balance'} indexRoute={wallets.index} />
            ),
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('wallets.created_at') || 'Created At'} indexRoute={wallets.index} />
            ),
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('wallets.title'),
            href: wallets.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('wallets.title')}>
            <DataTable
                columns={columns}
                data={walletsData.data}
                meta={walletsData.meta}
                indexRoute={wallets.index}
                model="wallets"
            />
        </AppLayout>
    )
}

export default WalletsIndex;
