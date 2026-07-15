import { ReactNode } from 'react';

export function Header({ title, actions }: { title: string; actions?: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            {actions}
        </div>
    );
}
