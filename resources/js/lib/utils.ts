import { usePermissions } from '@/hooks/use-permissions';
import { Locale, NavGroup, NavItem, PanelType } from '@/types';

import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { CreditCard, LayoutGrid, List, Monitor, Package, Plus, Settings, Shield, ShoppingCart, Store, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import PasswordController from '@/wayfinder/App/Http/Controllers/Settings/PasswordController';


// Admin routes
import AdminController from '@/wayfinder/App/Http/Controllers/dashboard/admin/AdminController';
import OrderController from '@/wayfinder/App/Http/Controllers/dashboard/admin/OrderController';
import ProductController from '@/wayfinder/App/Http/Controllers/dashboard/admin/ProductController';
import RoleController from '@/wayfinder/App/Http/Controllers/dashboard/admin/RoleController';
import StoreController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreController';
import StoreCategoryController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreCategoryController';


// // Store routes
import StoreSettingsController from '@/wayfinder/App/Http/Controllers/dashboard/store/StoreSettingsController';
import StoreOrderController from '@/wayfinder/App/Http/Controllers/dashboard/store/OrderController';
import CategoryController from '@/wayfinder/App/Http/Controllers/dashboard/store/CategoryController';
import AdditionController from '@/wayfinder/App/Http/Controllers/dashboard/store/AdditionController';
import OptionController from '@/wayfinder/App/Http/Controllers/dashboard/store/OptionController';
import AdminSettingsController from '@/wayfinder/App/Http/Controllers/dashboard/admin/AdminSettingsController';


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

export function normalizeFieldValue(
    value: unknown
): Record<Locale, string> {
    if (!value) {
        return { en: '', ar: '' }
    }

    if (typeof value === 'string') {
        return { en: value, ar: value }
    }

    if (
        typeof value === 'object' &&
        value !== null &&
        'en' in value &&
        'ar' in value
    ) {
        return value as Record<Locale, string>
    }

    return { en: '', ar: '' }
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
                {
                    title: t('nav_labels.settings'),
                    href: '/admin/settings/profile',
                    icon: Settings,
                    visible: true,
                },
            ],
        },
        {
            title: t('nav_groups.users_permissions'),
            items: [
                {
                    title: t('nav_labels.admins'),
                    href: AdminController.index.url(),
                    icon: Users,
                    visible: hasPermission('admins.index'),
                },
                {
                    title: t('nav_labels.roles'),
                    href: RoleController.index.url(),
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
                    href: StoreController.index.url(),
                    icon: Store,
                    visible: hasPermission('stores.index'),
                },
                {
                    title: t('nav_labels.store_categories'),
                    href: StoreCategoryController.index.url(),
                    icon: List,
                    visible: hasPermission('store-categories.index'),
                },
                {
                    title: t('nav_labels.orders'),
                    href: OrderController.index.url(),
                    icon: ShoppingCart,
                    visible: hasPermission('orders.index'),
                },
                {
                    title: t('nav_labels.products'),
                    href: ProductController.index.url(),
                    icon: Package,
                    visible: hasPermission('products.index'),
                },
            ],
        },
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
                    href: StoreSettingsController.profile.url(),
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
                    href: StoreOrderController.index.url(),
                    icon: ShoppingCart,
                    visible: true,
                },
                {
                    title: t('nav_labels.products'),
                    href: ProductController.index.url(),
                    icon: Package,
                    visible: true,
                },
                {
                    title: t('nav_labels.categories'),
                    href: CategoryController.index.url(),
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
                    href: AdditionController.index.url(),
                    icon: Plus,
                    visible: true,
                },
                {
                    title: t('nav_labels.options'),
                    href: OptionController.index.url(),
                    icon: Settings,
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
            href: AdminSettingsController.profile.url(),
            icon: Settings,
        },
        {
            title: t('sections.password'),
            href: PasswordController.edit['/admin/settings/password'].url(),
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
            href: StoreSettingsController.profile.url(),
            icon: Settings,
        },
        {
            title: t('sections.password'),
            href: PasswordController.edit['/store/settings/password'].url(),
            icon: Shield,
        },
        {
            title: t('sections.appearance'),
            href: '/store/settings/appearance',
            icon: Monitor,
        },
    ];
}
