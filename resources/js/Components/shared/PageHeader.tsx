import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function PageHeader({ title, description, actions, eyebrow = 'Resumen financiero' }: { title: string; description?: string; actions?: ReactNode; eyebrow?: string }) {
    return (
        <motion.div data-tour="page-header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="module-kicker">{eyebrow}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
                {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </motion.div>
    );
}
