import { ExternalLink, PlayCircle, Video } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

const hyperframesUrl = import.meta.env.VITE_ADMIN_HYPERFRAMES_URL as string | undefined;
const onboardingVideoUrl = import.meta.env.VITE_ADMIN_ONBOARDING_VIDEO_URL as string | undefined;

export function AdminHyperframesPanel() {
    const hasVideo = typeof onboardingVideoUrl === 'string' && onboardingVideoUrl.trim().length > 0;
    const hasEmbed = typeof hyperframesUrl === 'string' && hyperframesUrl.trim().length > 0;

    return (
        <Card className="overflow-hidden border-white/10 bg-[#0d1d28]/90 shadow-[0_24px_60px_rgba(2,8,23,0.35)]">
            <CardHeader className="border-b border-white/10">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl text-white">
                            <Video className="h-5 w-5 text-cyan-200" />
                            Flujo guiado para admin
                        </CardTitle>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300/80">
                            Espacio para el onboarding visual del usuario admin. Este bloque soporta un video MP4 exportado en local o, si lo prefieres, un embed remoto de HyperFrames.
                        </p>
                    </div>

                    <Button asChild variant="outline" className="border-white/10 bg-white/[0.04] hover:bg-white/10">
                        <a href="https://hyperframes.heygen.com/" target="_blank" rel="noreferrer">
                            Ver HyperFrames
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {hasVideo ? (
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#09141c]">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                            <span>Admin onboarding</span>
                            <span>Video local</span>
                        </div>
                        <div className="aspect-[16/9] w-full bg-black">
                            <video
                                src={onboardingVideoUrl}
                                className="h-full w-full"
                                controls
                                preload="metadata"
                                playsInline
                            />
                        </div>
                    </div>
                ) : hasEmbed ? (
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#09141c]">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                            <span>Admin onboarding</span>
                            <span>HyperFrames embed</span>
                        </div>
                        <div className="aspect-[16/9] w-full">
                            <iframe
                                src={hyperframesUrl}
                                title="Flujo de onboarding admin"
                                className="h-full w-full"
                                allow="autoplay; fullscreen"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-cyan-400/25 bg-cyan-400/[0.05] p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                                <PlayCircle className="h-6 w-6 text-cyan-200" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white">Conecta tu onboarding aqui</h3>
                                <p className="text-sm leading-7 text-slate-300/80">
                                    Para hosting compartido te recomendamos exportar un MP4 en local y cargarlo con <code>VITE_ADMIN_ONBOARDING_VIDEO_URL</code>. Si prefieres un embed remoto, tambien puedes usar <code>VITE_ADMIN_HYPERFRAMES_URL</code>.
                                </p>
                                <div className="rounded-2xl border border-white/10 bg-[#0b1822]/80 px-4 py-3 text-sm text-slate-300">
                                    MP4 recomendado: <code>VITE_ADMIN_ONBOARDING_VIDEO_URL=/videos/admin-onboarding.mp4</code>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-[#0b1822]/80 px-4 py-3 text-sm text-slate-300">
                                    Embed opcional: <code>VITE_ADMIN_HYPERFRAMES_URL=https://hyperframes.dev/...</code>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
