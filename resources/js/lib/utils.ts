import { Locale, NavGroup, NavItem, PanelType } from '@/types';
import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getAdminPanelNavItems, getAdminSettingsNavItems } from './admin-panel';
import { getStorePanelNavItems, getStoreSettingsNavItems } from './store-panel';

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




export function getSettingsNavItems(panel: PanelType): NavItem[] {
    switch (panel) {
        case PanelType.ADMIN: return getAdminSettingsNavItems();
        case PanelType.STORE: return getStoreSettingsNavItems();
        default: return [];
    }
}


