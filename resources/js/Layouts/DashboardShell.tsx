import { PropsWithChildren } from 'react';

export function DashboardShell({ children }: PropsWithChildren) {
    return <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>;
}
