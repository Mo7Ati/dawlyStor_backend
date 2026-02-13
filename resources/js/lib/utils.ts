import { usePermission } from '@/hooks/use-permission';
import { Locale, NavGroup, NavItem, PanelType } from '@/types';
import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { CreditCard, LayoutGrid, List, Monitor, Package, Plus, Receipt, Settings, Shield, ShoppingCart, Store, Users, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

// Admin routes
import admins from '@/routes/admin/admins';
import orders from '@/routes/admin/orders';
import products from '@/routes/admin/products';
import roles from '@/routes/admin/roles';
import storeCategories from '@/routes/admin/store-categories';
import stores from '@/routes/admin/stores';
import sections from '@/routes/admin/sections';

// Store routes
import storeOrders from '@/routes/store/orders';
import storeProducts from '@/routes/store/products';
import additions from '@/routes/store/additions';
import options from '@/routes/store/options';
import categories from '@/routes/store/categories';
import settings from '@/routes/store/settings';
import storeTransactions from '@/routes/store/transactions';
import transactions from '@/routes/admin/transactions';
import wallets from '@/routes/admin/wallets';



export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function normalizeFieldValue(value: string | Record<Locale, string> | undefined): Record<Locale, string> {
    if (!value) {
        return { en: '', ar: '' }
    }

    if (typeof value === 'string') {
        return { en: value, ar: value }
    }

    return value
}

export function getPanelNavItems(panel: PanelType): NavGroup[] {
    switch (panel) {
        case PanelType.ADMIN: return getAdminPanelNavItems();
        case PanelType.STORE: return getStorePanelNavItems();
        default: return [];
    }
}

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

export function getStorePanelNavItems(): NavGroup[] {
    const { t } = useTranslation("common");

    return [
        {
            title: t('nav_groups.overview'),
            items: [
                {
                    title: t('nav_labels.dashboard'),
                    href: '/store',
                    icon: LayoutGrid,
                    visible: true,
                },
                {
                    title: t('nav_labels.subscription'),
                    href: '/store/subscription',
                    icon: CreditCard,
                    visible: true,
                },
                {
                    title: t('nav_labels.settings'),
                    href: settings.profile.url(),
                    icon: Settings,
                    visible: true,
                },
            ],
        },
        {
            title: t('nav_groups.commerce'),
            items: [
                {
                    title: t('nav_labels.orders'),
                    href: storeOrders.index.url(),
                    icon: ShoppingCart,
                    visible: true,
                },
                {
                    title: t('nav_labels.products'),
                    href: storeProducts.index.url(),
                    icon: Package,
                    visible: true,
                },
                {
                    title: t('nav_labels.categories'),
                    href: categories.index.url(),
                    icon: List,
                    visible: true,
                },
            ],
        },
        {
            title: t('nav_groups.settings'),
            items: [
                {
                    title: t('nav_labels.additions'),
                    href: additions.index.url(),
                    icon: Plus,
                    visible: true,
                },
                {
                    title: t('nav_labels.options'),
                    href: options.index.url(),
                    icon: Settings,
                    visible: true,
                },
            ],
        },
        {
            title: t('nav_groups.finance'),
            items: [
                {
                    title: t('nav_labels.transactions'),
                    href: storeTransactions.index.url(),
                    icon: Receipt,
                    visible: true,
                },
            ],
        },
    ];
}


export function getSettingsNavItems(panel: PanelType): NavItem[] {
    switch (panel) {
        case PanelType.ADMIN: return getAdminSettingsNavItems();
        case PanelType.STORE: return getStoreSettingsNavItems();
        default: return [];
    }
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
    ];
}


export function getStoreSettingsNavItems(): NavItem[] {
    const { t } = useTranslation("settings");
    return [
        {
            title: t('sections.profile'),
            href: settings.profile.url(),
            icon: Settings,
        },
        {
            title: t('sections.password'),
            href: '/store/settings/password',
            icon: Shield,
        },
        {
            title: t('sections.appearance'),
            href: '/store/settings/appearance',
            icon: Monitor,
        },
    ];
}
