export type Admin = {
    id: number | string;
    name: string;
    email: string;
    password: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
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
    per_page: number;
    to: number;
    total: number;
}
