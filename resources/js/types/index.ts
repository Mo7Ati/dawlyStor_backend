import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
    permissions: Record<number, string> | string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | string | null;
    isActive?: boolean;
    visible?: boolean; // if false, the item will not be shown in the sidebar
}

export interface Flash {
    success?: string;
    error?: string;
}

export interface EnumOption {
    value: string;
    label: string;
    color?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    panel: PanelType;
    locales: Record<string, string>;
    currentLocale: Locale;
    navigationItems: NavItem[];
    sidebarOpen: boolean;
    flash?: Flash;
    enums: {
        orderStatus: EnumOption[];
        paymentStatus: EnumOption[];
        permissions: EnumOption[];
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export enum PanelType {
    ADMIN = 'admin',
}

export type Locale = 'ar' | 'en';
