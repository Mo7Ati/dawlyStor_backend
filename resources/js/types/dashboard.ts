
export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    }[];
    meta: MetaType;
}

export interface MetaType {
    current_page: number;
    from: number;
    last_page: number;
    links: {
        url: string | null;
        label: string;
        page: number;
        active: boolean;
    }[];
    path: string;
    per_page: string;
    to: number;
    total: number;
}

export interface ColumnFilter {
    id: string
    label: string
    type: "radio" | "checkbox" | "select" | "input"
    options: { value: string; label: string }[]
}

export type Admin = {
    id: number | string;
    name: string;
    email: string;
    password: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

export type Role = {
    id: number | string;
    name: string;
    guard_name: string;
    permissions?: Permission[];
    permissions_count: number;
    created_at: string;
    updated_at: string;
}

export type GroupedPermissions = {
    [key: string]: Permission[];
}

export type Permission = {
    id: number | string;
    name: string
}

export type StoreCategory = {
    id: number | string;
    name: Record<Locale, string> | string;
    description?: Record<string, string> | string;
}

export type Locale = 'en' | 'ar';

export type Store = {
    id: number | string;
    name: Record<Locale, string> | string;
    address: Record<Locale, string> | string;
    description?: Record<Locale, string> | string;
    keywords?: string[];
    social_media?: Record<string, any>;
    email: string;
    phone: string;
    password?: string;
    category_id?: number | string;
    delivery_time: number;
    delivery_area_polygon?: any;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    category?: StoreCategory;
    logo?: string;
}


// delete late

export interface LocaleData {
    code: string;
    label: string;
}

export interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea';
    value: Record<Locale, string>;
    [key: string]: any;
}

export interface LocalizedData {
    [fieldName: string]: {
        [localeCode: string]: string;
    };
}
