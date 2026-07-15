<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
        @php
            $appName = config('app.name', 'Finanzas OS');
            $seoTitle = $appName . ' | Plataforma financiera multi-tenant para clientes, usuarios y operación';
            $seoDescription = 'Finanzas OS centraliza clientes, usuarios, departamentos, presupuestos, compras, inventario, reportes y movimientos financieros en una plataforma multi-tenant en español.';
            $seoKeywords = 'finanzas os, plataforma financiera, multi-tenant, clientes, usuarios, presupuestos, compras, inventario, reportes, software financiero, saas financiero, control financiero';
            $seoImage = asset('pwa/og-image.png');
            $currentUrl = url()->current();
            $geoRegion = 'CO-DC';
            $geoPlacename = 'Bogotá, Colombia';
            $geoPosition = '4.7110;-74.0721';
            $structuredData = [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'Organization',
                        '@id' => config('app.url') . '#organization',
                        'name' => $appName,
                        'url' => config('app.url'),
                        'logo' => $seoImage,
                    ],
                    [
                        '@type' => 'WebSite',
                        '@id' => config('app.url') . '#website',
                        'url' => config('app.url'),
                        'name' => $appName,
                        'inLanguage' => 'es-CO',
                        'description' => $seoDescription,
                        'publisher' => [
                            '@id' => config('app.url') . '#organization',
                        ],
                    ],
                    [
                        '@type' => 'SoftwareApplication',
                        '@id' => $currentUrl . '#software',
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
                            'Movimientos financieros, compras e inventario',
                            'Reportes y operación financiera centralizada',
                        ],
                        'publisher' => [
                            '@id' => config('app.url') . '#organization',
                        ],
                    ],
                ],
            ];
        @endphp
        <meta name="theme-color" content="#07131b">
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="keywords" content="{{ $seoKeywords }}">
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
        <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
        <meta name="author" content="{{ $appName }}">
        <meta name="creator" content="{{ $appName }}">
        <meta name="publisher" content="{{ $appName }}">
        <meta name="language" content="Spanish">
        <meta http-equiv="content-language" content="es-CO">
        <meta name="geo.region" content="{{ $geoRegion }}">
        <meta name="geo.placename" content="{{ $geoPlacename }}">
        <meta name="geo.position" content="{{ $geoPosition }}">
        <meta name="ICBM" content="{{ $geoPosition }}">
        <meta name="format-detection" content="telephone=no,address=no,email=no">
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
        <meta property="og:image:secure_url" content="{{ $seoImage }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="Vista previa de Finanzas OS">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">
        <meta name="twitter:image:alt" content="Vista previa de Finanzas OS">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="canonical" href="{{ $currentUrl }}">
        <link rel="alternate" hreflang="es-co" href="{{ $currentUrl }}">
        <link rel="alternate" hreflang="x-default" href="{{ $currentUrl }}">
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
        <link rel="manifest" href="{{ asset('build/manifest.webmanifest') }}">
        <link rel="apple-touch-icon" href="{{ asset('pwa/icon-192.svg') }}">
        <script type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
