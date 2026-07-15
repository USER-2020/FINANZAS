import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Check, Clapperboard, Copy, ExternalLink, Share2 } from 'lucide-react';
import { AppLayout } from '@/Components/layout/AppLayout';
import { PageHeader } from '@/Components/shared/PageHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { PageProps } from '@/types';

type VideoItem = {
    slug: string;
    title: string;
    filename: string;
    extension: string;
    size: number;
    lastModified: number;
    publicUrl: string;
    shareUrl: string;
};

type Props = PageProps<{
    videos: VideoItem[];
}>;

function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(timestamp: number) {
    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(timestamp * 1000));
}

export default function SuperAdminVideos({ auth, videos }: Props) {
    const [copied, setCopied] = useState<string | null>(null);

    async function copyLink(url: string, slug: string) {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(slug);
            window.setTimeout(() => setCopied((current) => (current === slug ? null : current)), 1800);
        } catch {
            setCopied(null);
        }
    }

    return (
        <AppLayout user={auth.user}>
            <Head title="Videos" />

            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <PageHeader
                    title="Videos del super admin"
                    description="Previsualiza los videos exportados, copia su enlace compartible y abre la ruta pública de cada uno."
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clapperboard className="h-5 w-5 text-cyan-300" />
                            Biblioteca de videos
                        </CardTitle>
                        <CardDescription>
                            Los archivos se leen directamente desde <code>public/videos</code>. Cada tarjeta expone su ruta pública para compartirla fuera de la plataforma.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {videos.length > 0 ? (
                            <div className="grid gap-4 xl:grid-cols-2">
                                {videos.map((video) => (
                                    <Card key={video.slug} className="border-white/10 bg-white/[0.03]">
                                        <CardHeader className="gap-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <CardTitle className="text-xl">{video.title}</CardTitle>
                                                    <CardDescription className="mt-1 break-all">{video.filename}</CardDescription>
                                                </div>
                                                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                                                    {video.extension}
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                                                <video src={video.publicUrl} controls preload="metadata" className="aspect-video w-full bg-black" />
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
                                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Peso</div>
                                                    <div className="mt-1 font-medium text-white">{formatBytes(video.size)}</div>
                                                </div>
                                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
                                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Actualizado</div>
                                                    <div className="mt-1 font-medium text-white">{formatDate(video.lastModified)}</div>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                                                    <Share2 className="h-3.5 w-3.5" />
                                                    Ruta pública
                                                </div>
                                                <div className="mt-2 break-all text-sm text-white/90">{video.shareUrl}</div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" onClick={() => copyLink(video.shareUrl, video.slug)}>
                                                    {copied === video.slug ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                                    {copied === video.slug ? 'Copiado' : 'Copiar enlace'}
                                                </Button>
                                                <Button type="button" variant="outline" asChild>
                                                    <a href={video.shareUrl} target="_blank" rel="noreferrer">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Abrir ruta pública
                                                    </a>
                                                </Button>
                                                <Button type="button" variant="ghost" asChild>
                                                    <a href={video.publicUrl} target="_blank" rel="noreferrer">
                                                        Ver archivo directo
                                                    </a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-muted-foreground">
                                No se encontraron videos en <code>public/videos</code>.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
