import { ReactNode } from 'react';

export function MetricGrid({ children }: { children: ReactNode }) {
    return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
