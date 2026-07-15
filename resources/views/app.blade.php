<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
        @php
            $appName = config('app.name', 'Finanzas OS');
            $seoTitle = $appName . ' | Plataforma financiera multi-tenant en español';
            $seoDescription = 'Finanzas OS centraliza clientes, usuarios, departamentos, presupuestos, compras, inventario y movimientos financieros en una sola plataforma multi-tenant.';
            $seoKeywords = 'finanzas, multi-tenant, clientes, usuarios, presupuestos, compras, inventario, reportes, SaaS financiero, software financiero';
            $seoImage = asset('pwa/og-image.png');
            $currentUrl = url()->current();
            $structuredData = [
                '@context' => 'https://schema.org',
                '@type' => 'SoftwareApplication',
                'name' => $appName,
                'applicationCategory' => 'BusinessApplication',
                'operatingSystem' => 'Web',
                'inLanguage' => 'es-CO',
                'description' => $seoDescription,
                'url' => $currentUrl,
                'image' => $seoImage,
                'offers' => [
                    '@type' => 'Offer',
                    'price' => '0',
                    'priceCurrency' => 'COP',
                ],
                'featureList' => [
                    'Gestión multi-tenant por cliente',
                    'Control de usuarios, roles y permisos',
                    'Movimientos financieros y presupuestos',
                    'Compras, inventario y reportes operativos',
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => $appName,
                    'url' => config('app.url'),
                ],
            ];
        @endphp
        <meta name="theme-color" content="#07131b">
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="keywords" content="{{ $seoKeywords }}">
        <meta name="robots" content="index,follow">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Finanzas OS">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="application-name" content="{{ $appName }}">

        <meta property="og:type" content="website">
        <meta property="og:locale" content="es_CO">
        <meta property="og:site_name" content="{{ $appName }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $currentUrl }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="Finanzas OS application icon">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">
        <meta name="twitter:image:alt" content="Vista previa de Finanzas OS">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="canonical" href="{{ $currentUrl }}">
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
        <link rel="manifest" href="{{ asset('build/manifest.webmanifest') }}">
        <link rel="apple-touch-icon" href="{{ asset('pwa/icon-192.svg') }}">
        <script type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
