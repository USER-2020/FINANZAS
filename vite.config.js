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
            includeAssets: [
                'favicon.svg',
                'favicon.png',
                'favicon.ico',
                'pwa/icon-192.svg',
                'pwa/icon-512.svg',
                'pwa/icon-maskable.svg',
                'pwa/icon-192.png',
                'pwa/icon-512.png',
                'pwa/icon-maskable.png',
                'pwa/apple-touch-icon.png',
            ],
            manifest: {
                name: 'Finanzas OS',
                short_name: 'Finanzas',
                description: 'Registra movimientos, organiza gastos, controla presupuestos y avanza hacia tus metas de ahorro.',
                theme_color: '#06111f',
                background_color: '#06111f',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                id: '/',
                lang: 'es-CO',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/pwa/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/pwa/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/pwa/icon-maskable.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
        }),
    ],
});
