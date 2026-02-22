import admins from '@/routes/admin/admins';
import orders from '@/routes/admin/orders';
import products from '@/routes/admin/products';
import roles from '@/routes/admin/roles';
import storeCategories from '@/routes/admin/store-categories';
import stores from '@/routes/admin/stores';
import sections from '@/routes/admin/sections';

import { usePermission } from '@/hooks/use-permission';
import { useTranslation } from 'react-i18next';

import { LayoutGrid, List, Monitor, Package, Percent, Receipt, Settings, Shield, ShoppingCart, Store, Users, Wallet } from 'lucide-react';
import { NavGroup, NavItem } from '@/types';
import wallets from '@/routes/admin/wallets';
import transactions from '@/routes/admin/transactions';




export function getAdminPanelNavItems(): NavGroup[] {
    const { t } = useTranslation("common");
    return [
        {
            title: t('nav_groups.overview'),
            items: [
                {
                    title: t('nav_labels.dashboard'),
                    href: '/admin',
                    icon: LayoutGrid,
                    visible: usePermission('dashboard.index'),
                },
                {
                    title: t('nav_labels.settings'),
                    href: '/admin/settings/profile',
                    icon: Settings,
                    visible: true,
                },
                {
                    title: t('nav_labels.sections'),
                    href: sections.index.url(),
                    icon: List,
                    visible: usePermission('sections.index'),
                }
            ],
        },
        {
            title: t('nav_groups.users_permissions'),
            items: [
                {
                    title: t('nav_labels.admins'),
                    href: admins.index.url(),
                    icon: Users,
                    visible: usePermission('admins.index'),
                },
                {
                    title: t('nav_labels.roles'),
                    href: roles.index.url(),
                    icon: Shield,
                    visible: usePermission('roles.index'),
                },
            ],
        },
        {
            title: t('nav_groups.commerce'),
            items: [
                {
                    title: t('nav_labels.stores'),
                    href: stores.index.url(),
                    icon: Store,
                    visible: usePermission('stores.index'),
                },
                {
                    title: t('nav_labels.store_categories'),
                    href: storeCategories.index.url(),
                    icon: List,
                    visible: usePermission('store-categories.index'),
                },
                {
                    title: t('nav_labels.orders'),
                    href: orders.index.url(),
                    icon: ShoppingCart,
                    visible: usePermission('orders.index'),
                },
                {
                    title: t('nav_labels.products'),
                    href: products.index.url(),
                    icon: Package,
                    visible: usePermission('products.index'),
                },
            ],
        },
        {
            title: t('nav_groups.finance'),
            items: [
                {
                    title: t('nav_labels.transactions'),
                    href: transactions.index.url(),
                    icon: Receipt,
                    visible: usePermission('transactions.index'),
                },
                {
                    title: t('nav_labels.wallets'),
                    href: wallets.index.url(),
                    icon: Wallet,
                    visible: usePermission('wallets.index'),
                },
                {
                    title: t('nav_labels.subscriptions_transactions'),
                    href: transactions.subscriptions.index.url(),
                    icon: Receipt,
                    visible: usePermission('transactions.index'),
                },
            ],
        }
    ];
}


export function getAdminSettingsNavItems(): NavItem[] {
    const { t } = useTranslation("settings");
    return [
        {
            title: t('sections.profile'),
            href: '/admin/settings/profile',
            icon: Settings,
        },
        {
            title: t('sections.password'),
            href: '/admin/settings/password',
            icon: Shield,
        },
        {
            title: t('sections.appearance'),
            href: '/admin/settings/appearance',
            icon: Monitor,
        },
        {
            title: t('sections.platform_fees'),
            href: '/admin/settings/platform-fees',
            icon: Percent,
        },
    ];
}

