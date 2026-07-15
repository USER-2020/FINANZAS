import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            injectRegister: false,
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'pwa/icon-192.svg', 'pwa/icon-512.svg', 'pwa/icon-maskable.svg'],
            manifest: {
                name: 'Finanzas OS',
                short_name: 'Finanzas',
                description: 'Multi-tenant financial operations platform for clients, users, departments, and movements.',
                theme_color: '#07131b',
                background_color: '#07131b',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                id: '/',
                lang: 'es-CO',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/pwa/icon-192.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                    {
                        src: '/pwa/icon-512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                    {
                        src: '/pwa/icon-maskable.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'maskable',
                    },
                ],
            },
        }),
    ],
});
