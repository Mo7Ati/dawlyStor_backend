import AppLayout from '@/layouts/app-layout'
import { AdminTransaction } from '.'
import { PaginatedResponse } from '@/types/dashboard'
import { DataTable } from '@/components/table/data-table'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { BreadcrumbItem } from '@/types'
import transactions from '@/routes/admin/transactions'




const SubscriptionsTransactions = ({ transactions: transactionsData }: { transactions: PaginatedResponse<AdminTransaction> }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            title: tDashboard('nav_labels.subscriptions_transactions'),
            href: transactions.subscriptions.index.url(),
        },
    ];

    const columns: ColumnDef<AdminTransaction>[] = [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={tTables('transactions.id') || 'ID'} indexRoute={transactions.index} />
            ),
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

    return (
        <AppLayout breadcrumbs={breadcrumbItems} title={tDashboard('nav_labels.subscriptions_transactions')}>
            <DataTable
                columns={columns}
                data={transactionsData.data}
                meta={transactionsData.meta}
                indexRoute={transactions.subscriptions.index}
                model="transactions"
            />
        </AppLayout>
    )
}

export default SubscriptionsTransactions
