import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from "@tanstack/react-table"
import { PaginatedResponse } from '@/types/dashboard';
import { DataTable } from '@/components/table/data-table';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { TransactionType } from '@/types/dashboard';
import transactions from '@/routes/admin/transactions';


export interface AdminTransaction {
    id: number | string;
    order_id: number | null;
    receiver: string | null;
    store_id: number | null;
    store_name: string | null;
    amount: number;
    explanation: string;
    type: string;
    created_at: string | null;
    updated_at: string | null;
}

const TransactionsIndex = ({ transactions: transactionsData }: { transactions: PaginatedResponse<AdminTransaction> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const explanationLabel = (value: string) => {
        const key = value === TransactionType.DEPOSIT_ORDER_TOTAL_IN_STORE_WALLET ? 'ORDER_PAYMENT'
            : value === TransactionType.WITHDRAW_PLATFORM_FEE_FROM_STORE_WALLET ? 'PLATFORM_SHARE'
                : value === TransactionType.DEPOSIT_STORE_SUBSCRIPTION_TO_PLATFORM_WALLET ? 'STORE_SUBSCRIPTION'
                    : value;
        return tTables(`transactions.explanation_${key}`) || value;
    };

    const columns: ColumnDef<AdminTransaction>[] = [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('transactions.id') || 'ID'} indexRoute={transactions.index} />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "receiver",
            header: tTables('transactions.receiver'),
        },
        {
            accessorKey: "source",
            header: tTables('transactions.source'),
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('transactions.amount') || 'Amount'} indexRoute={transactions.index} />
            ),
        },
        {
            accessorKey: "explanation",
            header: tTables('transactions.explanation'),
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('transactions.created_at') || 'Created At'} indexRoute={transactions.index} />
            ),
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('transactions.title'),
            href: transactions.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('transactions.title')}>
            <DataTable
                columns={columns}
                data={transactionsData.data}
                meta={transactionsData.meta}
                indexRoute={transactions.index}
                model="transactions"
            />
        </AppLayout>
    )
}

export default TransactionsIndex;
