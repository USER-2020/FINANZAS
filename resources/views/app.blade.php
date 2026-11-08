<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
        @php
            $appName = config('app.name', 'Finanzas OS');
            $seoTitle = $appName . ' | Ordena tu dinero y toma mejores decisiones';
            $seoDescription = 'Finanzas OS te ayuda a registrar movimientos, organizar gastos, controlar presupuestos y avanzar hacia tus metas de ahorro desde un solo lugar.';
            $seoKeywords = 'finanzas personales, control de gastos, presupuesto personal, metas de ahorro, movimientos financieros, Finanzas OS, dinero, ahorro';
            $assetVersion = '2026.11.07.2';
            $seoImage = asset('pwa/og-image.png').'?v='.$assetVersion;
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
                            'Registro inteligente de ingresos y gastos',
                            'Presupuestos y categorías personales',
                            'Metas de ahorro y movimientos recurrentes',
                            'Lectura de facturas con OCR',
                        ],
                        'publisher' => [
                            '@id' => config('app.url') . '#organization',
                        ],
                    ],
                ],
            ];
        @endphp
        <meta name="theme-color" content="#06111f">
        <meta name="msapplication-TileColor" content="#06111f">
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
        <link rel="icon" type="image/png" sizes="64x64" href="{{ asset('favicon.png') }}">
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
        @if (file_exists(public_path('build/manifest.webmanifest')))
            <link rel="manifest" href="{{ asset('build/manifest.webmanifest') }}">
        @endif
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('pwa/apple-touch-icon.png') }}">
        <script type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
