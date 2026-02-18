// Store routes
import storeOrders from '@/routes/store/orders';
import storeProducts from '@/routes/store/products';
import additions from '@/routes/store/additions';
import options from '@/routes/store/options';
import categories from '@/routes/store/categories';
import settings from '@/routes/store/settings';
import storeTransactions from '@/routes/store/transactions';
import { NavGroup, NavItem } from '@/types';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, CreditCard, List, Monitor, Package, Plus, Receipt, Settings, Shield, ShoppingCart } from 'lucide-react';


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
