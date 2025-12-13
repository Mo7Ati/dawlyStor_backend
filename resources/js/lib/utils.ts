import { NavItem, PanelType } from '@/types';
import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { LayoutGrid, Shield, Users } from 'lucide-react';
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

export function getPanelNavItems(panel: PanelType): NavItem[] {
    switch (panel) {
        case PanelType.ADMIN: return getAdminPanelNavItems();
        default: return [];
    }
}

export function getAdminPanelNavItems(): NavItem[] {
    const { t } = useTranslation("common");
    return [
        {
            title: t('nav_labels.dashboard'),
            href: '/admin',
            icon: LayoutGrid,
            isActive: isSameUrl('/admin', window.location.pathname),
        },
        {
            title: t('nav_labels.admins'),
            href: '/admin/admins',
            icon: Users,
            isActive: isSameUrl('/admin/admins', window.location.pathname),
        },
        {
            title: t('nav_labels.roles'),
            href: '/admin/roles',
            icon: Shield,
            isActive: isSameUrl('/admin/roles', window.location.pathname),
        },
    ];
}

