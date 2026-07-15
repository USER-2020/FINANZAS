export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    client_id?: number | null;
    client?: {
        id: number;
        name: string;
    } | null;
    roles?: Array<{
        id: number;
        name: string;
    }>;
}

export interface NavigationItem {
    key: string;
    label: string;
    href: string;
    icon: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        navigation?: NavigationItem[];
    };
    flash?: {
        success?: string | null;
        error?: string | null;
        status?: string | null;
    };
};
