import { ReactNode } from 'react';

export function DataTableFilters({ children }: { children: ReactNode }) {
    return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}
