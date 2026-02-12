import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';
import { Order } from '@/types/dashboard';
import storeOrders from '@/routes/store/orders';
import { StatusBadge } from '@/components/table/table-filters/status-badge';
import PaymentStatusBadge from './components/payment-status-badge';
import OrderStatusBadge from './components/order-status-badge';

const StoreOrderShow = ({ order }: { order: Order }) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tDashboard } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tDashboard('orders.title'),
            href: storeOrders.index.url(),
        },
        {
            title: `${tTables('orders.id') ?? 'Order'} #${order.id}`,
            href: storeOrders.show({ order: order.id }).url,
        },
    ];

    const totals = [
        { label: tTables('orders.total_items_amount'), value: order.total_items_amount },
        { label: tTables('orders.delivery_amount'), value: order.delivery_amount },
        { label: tTables('orders.tax_amount'), value: order.tax_amount },
        { label: tTables('orders.total'), value: order.total },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tDashboard('orders.details_title') ?? `Order #${order.id}`}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {tDashboard('orders.invoice_title') ?? `Order Invoice #${order.id}`}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {order.created_at}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.payment_status} />
                    </div>
                </div>

                {/* Customer & Store Info */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="font-semibold">{tTables('orders.customer')}</h3>
                        <p>{order.customer?.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
                        <p className="text-sm text-muted-foreground">{order.customer?.phone_number}</p>
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="font-semibold">{tTables('orders.store')}</h3>
                        <p>{order.store && typeof order.store.name === 'string' ? order.store.name : ''}</p>
                        <p className="text-sm text-muted-foreground">{order.store?.email}</p>
                        <p className="text-sm text-muted-foreground">{order.store?.phone}</p>
                    </div>
                </div>

                {/* Address & Notes */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="font-semibold">{tTables('orders.address')}</h3>
                        <p>{order.address_data?.name}</p>
                        {/* <p className="text-sm text-muted-foreground">{order.address_data?.location}</p> */}
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="font-semibold">{tTables('orders.notes')}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {order.notes || '-'}
                        </p>
                    </div>
                </div>

                {/* Items */}
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left">{tTables('orders.items.product')}</th>
                                <th className="px-4 py-2 text-right">{tTables('orders.items.unit_price')}</th>
                                <th className="px-4 py-2 text-right">{tTables('orders.items.quantity')}</th>
                                <th className="px-4 py-2 text-right">{tTables('orders.items.total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order as any).items?.map((item: any) => (
                                <tr key={item.id} className="border-b last:border-0">
                                    <td className="px-4 py-2">
                                        {item.product_name || item.product_data?.name}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {item.unit_price?.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {item.total_price?.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex flex-col items-end gap-2">
                    {totals.map((row) => (
                        <div key={row.label} className="flex w-full max-w-md justify-between text-sm">
                            <span className="text-muted-foreground">{row.label}</span>
                            <span className="font-medium">${row.value?.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default StoreOrderShow;

