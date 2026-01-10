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

export type Admin = {
    id: number | string;
    name: string;
    email: string;
    email_verified_at?: Date
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

export type Permission = {
    id: number | string;
    name: string
}

export type GroupedPermissions = {
    [key: string]: Permission[];
}

export type StoreCategory = {
    id: number | string;
    name: Record<Locale, string> | string;
    description?: Record<string, string> | string;
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
    logo: Media[] | null;
}

export type Order = {
    id: number | string;
    status: string;
    payment_status: string;
    cancelled_reason?: string | null;
    customer_id?: number | string | null;
    customer_data?: Record<string, any> | null;
    store_id?: number | string | null;
    address_id?: number | string | null;
    address_data?: Record<string, any> | null;
    total: number;
    total_items_amount: number;
    delivery_amount: number;
    tax_amount: number;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
    customer?: {
        id: number | string;
        name: string;
        email: string;
        phone_number: string;
    } | null;
    store?: Store | null;
    address?: {
        id: number | string;
        name?: string;
        location?: string;
    } | null;
}

export type Product = {
    id: number | string;
    name: Record<Locale, string> | string;
    description?: Record<Locale, string> | string;
    keywords?: string[];
    price: number;
    compare_price?: number | null;
    store_id: number | string;
    category_id: number | string | null;
    is_active: boolean;
    is_accepted: boolean;
    quantity: number;
    created_at?: string;
    updated_at?: string;
    store?: Store | null;
    category?: Category;
    images: Media[];
    additions?: ProductAddition[];
    options?: ProductOption[];
}

export type ProductAddition = {
    addition_id: number | string;
    price: number;
}

export type ProductOption = {
    option_id: number | string;
    price: number;
}

export interface Category {
    id: number | string
    name: Record<string, string> | string
    description?: Record<string, string> | string
    store_id: number | string
    is_active: boolean
    created_at?: string
    updated_at?: string
}


export type Addition = {
    id?: number | string;
    name: Record<Locale, string> | string;
    store_id: number | string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    store?: Store | null;
}

export type Option = {
    id?: number | string;
    name: Record<Locale, string> | string;
    store_id: number | string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    store?: Store | null;
}

export type Section = {
    id: number | string;
    title: Record<Locale, string> | string;
    description?: Record<Locale, string> | string;
    type: 'hero' | 'features' | 'products' | 'categories' | 'stores' | 'vendor_cta';
    is_active: boolean;
    order: number;
    data: any;
    created_at?: string;
    updated_at?: string;
    products?: Product[];
    categories?: Category[];
    stores?: Store[];
}

export type SectionData =
    | StaticSectionData
    | ProductsSectionData
    | CategoriesSectionData
    | StoresSectionData
    | HeroSectionData;

export type StaticSectionData = Record<string, any>;

export type ProductsSectionData = {
    source: 'latest' | 'best_seller' | 'manual';
    limit: number;
    product_ids?: number[];
}

export type CategoriesSectionData = {
    source: 'featured_only' | 'manual';
    limit: number;
    category_ids?: number[];
}

export type StoresSectionData = {
    source: 'trendy' | 'manual';
    limit: number;
    store_ids?: number[];
}

export type HeroSectionData = {
    title: Record<Locale, string> | string;
    sub_title: Record<Locale, string> | string;
    image: Media | null;
}

export type SectionItem = {
    id: number | string;
    type: string;
    data: any;
    ordered: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
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

export enum OrderStatus {
    PENDING = 'pending',
    PREPARING = 'preparing',
    ON_THE_WAY = 'on_the_way',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected',
}

export enum PaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}
