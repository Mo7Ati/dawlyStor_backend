export type Locale = 'en' | 'ar';

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

export type Role = {
    id: number | string;
    name: string;
    guard_name: string;
    permissions?: Permission[];
    permissions_count: number;
    created_at: string;
    updated_at: string;
}

export type Permission = {
    id: number | string;
    name: string
}

export type GroupedPermissions = {
    [key: string]: Permission[];
}


export type Media = {
    id: number | string;
    name: string;
    url: string;
    type: string;
    uuid: string;
    size: number;
    mime_type: string;
    file_name: string;
}

export interface LocaleData {
    code: string;
    label: string;
}

export interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea';
    value: Record<Locale, string>;
    onChange?: (value: any) => void;
    [key: string]: any;
}

export interface LocalizedData {
    [fieldName: string]: {
        [localeCode: string]: string;
    };
}
