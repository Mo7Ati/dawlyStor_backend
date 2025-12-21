import { usePermissions } from '@/hooks/use-permissions';
import admin from '@/routes/admin';
import admins from '@/routes/admin/admins';
import orders from '@/routes/admin/orders';
import products from '@/routes/admin/products';
import roles from '@/routes/admin/roles';
import storeCategories from '@/routes/admin/store-categories';
import stores from '@/routes/admin/stores';
import { Locale, NavGroup, NavItem, PanelType } from '@/types';
import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { LayoutGrid, List, Package, Shield, ShoppingCart, Store, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

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

export function getPanelNavItems(panel: PanelType): NavGroup[] {
    switch (panel) {
        case PanelType.ADMIN: return getAdminPanelNavItems();
        default: return [];
    }
}

export function getAdminPanelNavItems(): NavGroup[] {
    const { t } = useTranslation("common");
    const { hasPermission } = usePermissions();
    return [
        {
            title: t('nav_groups.overview'),
            items: [
                {
                    title: t('nav_labels.dashboard'),
                    href: '/admin',
                    icon: LayoutGrid,
                    visible: hasPermission('dashboard.index'),
                },
            ],
        },
        {
            title: t('nav_groups.users_permissions'),
            items: [
                {
                    title: t('nav_labels.admins'),
                    href: admins.index.url(),
                    icon: Users,
                    visible: hasPermission('admins.index'),
                },
                {
                    title: t('nav_labels.roles'),
                    href: roles.index.url(),
                    icon: Shield,
                    visible: hasPermission('roles.index'),
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
                    visible: hasPermission('stores.index'),
                },
                {
                    title: t('nav_labels.store_categories'),
                    href: storeCategories.index.url(),
                    icon: List,
                    visible: hasPermission('store-categories.index'),
                },
                {
                    title: t('nav_labels.orders'),
                    href: orders.index.url(),
                    icon: ShoppingCart,
                    visible: hasPermission('orders.index'),
                },
                {
                    title: t('nav_labels.products'),
                    href: products.index.url(),
                    icon: Package,
                    visible: hasPermission('products.index'),
                },
            ],
        },
    ];
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
