<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $video['title'] }} | Finanzas OS</title>
    <meta name="description" content="Video compartido desde Finanzas OS para mostrar el flujo visual de operación y onboarding.">
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
    <meta name="geo.region" content="CO-DC">
    <meta name="geo.placename" content="Bogotá, Colombia">
    <meta name="geo.position" content="4.7110;-74.0721">
    <meta name="ICBM" content="4.7110;-74.0721">
    <meta property="og:title" content="{{ $video['title'] }} | Finanzas OS">
    <meta property="og:description" content="Mira este video compartido desde Finanzas OS.">
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="{{ $video['shareUrl'] }}">
    <meta property="og:video" content="{{ $video['publicUrl'] }}">
    <meta property="og:video:type" content="video/mp4">
    <meta property="og:site_name" content="Finanzas OS">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $video['title'] }} | Finanzas OS">
    <meta name="twitter:description" content="Video compartido desde Finanzas OS.">
    <link rel="canonical" href="{{ $video['shareUrl'] }}">
    <script type="application/ld+json">
        {!! json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'VideoObject',
            'name' => $video['title'],
            'description' => 'Video compartido desde Finanzas OS.',
            'contentUrl' => $video['publicUrl'],
            'embedUrl' => $video['shareUrl'],
            'url' => $video['shareUrl'],
            'thumbnailUrl' => [asset('pwa/og-image.png')],
            'uploadDate' => now()->setTimestamp($video['lastModified'])->toAtomString(),
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'Finanzas OS',
                'url' => config('app.url'),
            ],
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    </script>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            font-family: Inter, "Segoe UI", sans-serif;
            color: #f8fafc;
            background:
                radial-gradient(circle at top left, rgba(34, 211, 238, 0.14), transparent 24rem),
                radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 20rem),
                linear-gradient(180deg, #06131b 0%, #091a25 48%, #041018 100%);
        }
        .shell {
            width: min(1120px, calc(100% - 32px));
            margin: 0 auto;
            padding: 48px 0 64px;
        }
        .hero {
            display: grid;
            gap: 24px;
            margin-bottom: 28px;
        }
        .badge {
            display: inline-flex;
            width: fit-content;
            padding: 12px 16px;
            border-radius: 999px;
            border: 1px solid rgba(103, 232, 249, 0.22);
            background: rgba(34, 211, 238, 0.08);
            color: #a5f3fc;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .16em;
            text-transform: uppercase;
        }
        h1 {
            margin: 0;
            font-size: clamp(2rem, 4vw, 3.5rem);
            line-height: 1.02;
        }
        p {
            margin: 0;
            max-width: 760px;
            color: rgba(226, 232, 240, 0.78);
            font-size: 1.05rem;
            line-height: 1.65;
        }
        .card {
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(14, 31, 43, 0.82);
            box-shadow: 0 30px 90px rgba(2, 8, 23, 0.34);
            backdrop-filter: blur(18px);
        }
        .video-wrap {
            overflow: hidden;
        }
        video {
            display: block;
            width: 100%;
            aspect-ratio: 16 / 9;
            background: #000;
        }
        .meta {
            display: grid;
            gap: 18px;
            padding: 24px;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 14px;
        }
        .pill {
            padding: 16px 18px;
            border-radius: 18px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.06);
        }
        .pill small {
            display: block;
            color: rgba(191, 219, 254, 0.72);
            text-transform: uppercase;
            letter-spacing: .12em;
            font-size: .72rem;
        }
        .pill strong {
            display: block;
            margin-top: 8px;
            font-size: .98rem;
            word-break: break-word;
        }
        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            padding: 0 18px;
            border-radius: 16px;
            color: #fff;
            text-decoration: none;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.04);
        }
        .button.primary {
            background: linear-gradient(90deg, #0891b2 0%, #10b981 100%);
            border-color: transparent;
        }
        .other {
            margin-top: 28px;
            display: grid;
            gap: 14px;
        }
        .other-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 14px;
        }
        .other-card {
            padding: 18px;
            border-radius: 22px;
            text-decoration: none;
            color: inherit;
        }
        .other-card:hover {
            background: rgba(255,255,255,0.06);
        }
    </style>
</head>
<body>
    <div class="shell">
        <section class="hero">
            <span class="badge">Finanzas OS</span>
            <h1>{{ $video['title'] }}</h1>
            <p>Contenido visual compartido desde el panel de super administración para mostrar el flujo de uso, onboarding o presentación comercial de la plataforma.</p>
        </section>

        <section class="card video-wrap">
            <video controls preload="metadata" src="{{ $video['publicUrl'] }}"></video>
        </section>

        <section class="card meta">
            <div class="meta-grid">
                <div class="pill">
                    <small>Archivo</small>
                    <strong>{{ $video['filename'] }}</strong>
                </div>
                <div class="pill">
                    <small>Ruta pública</small>
                    <strong>{{ $video['shareUrl'] }}</strong>
                </div>
            </div>

            <div class="actions">
                <a class="button primary" href="{{ $video['publicUrl'] }}" target="_blank" rel="noreferrer">Abrir archivo directo</a>
                <a class="button" href="{{ url('/') }}">Ir a Finanzas OS</a>
            </div>
        </section>

        @if (! empty($otherVideos))
            <section class="other">
                <h2 style="margin:0;font-size:1.35rem;">Más videos compartibles</h2>
                <div class="other-grid">
                    @foreach ($otherVideos as $item)
                        <a class="card other-card" href="{{ $item['shareUrl'] }}">
                            <div style="font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:#67e8f9;">Video</div>
                            <div style="margin-top:10px;font-size:1.05rem;font-weight:700;">{{ $item['title'] }}</div>
                            <div style="margin-top:8px;color:rgba(203,213,225,.74);font-size:.95rem;">{{ $item['filename'] }}</div>
                        </a>
                    @endforeach
                </div>
            </section>
        @endif
    </div>
</body>
</html>
