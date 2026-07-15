import './bootstrap';
import '../css/app.css';
import 'react-phone-input-2/lib/style.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { FlashToaster } from '@/Components/shared/FlashToaster';

type InitialFlashProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
        status?: string | null;
    };
};

const appName = import.meta.env.VITE_APP_NAME || 'Finanzas OS';

document.documentElement.classList.add('dark');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <FlashToaster initialFlash={(props.initialPage.props as unknown as InitialFlashProps).flash} />
            </>
        );
    },
    progress: {
        color: '#06b6d4',
    },
});
