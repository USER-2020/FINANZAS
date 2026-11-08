import { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Bell, BellRing, CalendarDays, Check, CircleAlert, SlidersHorizontal, Sparkles, UsersRound } from 'lucide-react';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

export type AppNotification = {
    id: string;
    source?: string;
    title: string;
    message: string;
    priority?: 'normal' | 'high' | 'urgent';
    read_at?: string | null;
    created_at?: string;
};

type NotificationFilter = 'all' | 'unread' | 'priority';

const sourceStyles: Record<string, { icon: typeof Bell; color: string; background: string }> = {
    budget: { icon: CircleAlert, color: 'text-orange-300', background: 'bg-orange-300/10' },
    savings: { icon: Sparkles, color: 'text-violet-300', background: 'bg-violet-300/10' },
    recurring: { icon: CalendarDays, color: 'text-sky-300', background: 'bg-sky-300/10' },
    system: { icon: UsersRound, color: 'text-cyan-300', background: 'bg-cyan-300/10' },
};

function relativeTime(value?: string): string {
    if (!value) return 'Ahora';
    const elapsed = Date.now() - new Date(value).getTime();
    const minutes = Math.max(0, Math.floor(elapsed / 60000));
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
}

export function NotificationCenter() {
    const { props } = usePage<PageProps & { notifications?: AppNotification[] }>();
    const serverNotifications = props.notifications ?? [];
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<NotificationFilter>('all');
    const [readIds, setReadIds] = useState<string[]>([]);

    const notifications = useMemo(
        () => serverNotifications.map((notification) => ({ ...notification, read_at: notification.read_at || (readIds.includes(notification.id) ? new Date().toISOString() : null) })),
        [serverNotifications, readIds],
    );
    const unreadCount = notifications.filter((notification) => !notification.read_at).length;
    const urgentCount = notifications.filter((notification) => notification.priority === 'urgent' || notification.priority === 'high').length;
    const pendingCount = notifications.filter((notification) => notification.priority === 'high' || notification.priority === 'urgent').length;

    const filteredNotifications = notifications.filter((notification) => {
        if (filter === 'unread') return !notification.read_at;
        if (filter === 'priority') return notification.priority === 'high' || notification.priority === 'urgent';
        return true;
    });

    function markAllAsRead() {
        setReadIds(notifications.map((notification) => notification.id));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir centro de notificaciones" className="relative">
                    {unreadCount > 0 ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-300 ring-2 ring-[#0a1020]" />}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl overflow-hidden border-white/[0.08] bg-[#1d1f24] p-0 text-white shadow-[0_24px_100px_rgba(0,0,0,0.55)] sm:max-h-[88vh]">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <DialogHeader className="shrink-0 border-b border-white/[0.06] px-6 pb-5 pt-7 sm:px-8">
                        <div className="flex items-start gap-4 pr-8">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.1] text-white/85">
                                <Bell className="h-7 w-7" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Centro de notificaciones</DialogTitle>
                                <DialogDescription className="mt-1 text-base text-slate-400">Actividad de tu ecosistema financiero</DialogDescription>
                            </div>
                            <Button type="button" variant="ghost" size="icon" aria-label="Configurar notificaciones" className="ml-auto hidden shrink-0 text-slate-400 hover:bg-white/10 hover:text-white sm:inline-flex">
                                <SlidersHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <DialogBody className="px-4 py-5 sm:px-8 sm:py-6">
                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                ['Sin leer', unreadCount, 'text-white'],
                                ['Urgentes', urgentCount, 'text-orange-300'],
                                ['Pendientes', pendingCount, 'text-violet-300'],
                            ].map(([label, value, color]) => (
                                <div key={String(label)} className="rounded-2xl bg-[#292c32] px-5 py-4">
                                    <p className="text-sm text-slate-400">{label}</p>
                                    <p className={cn('mt-1 text-3xl font-semibold', color)}>{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex items-center gap-1 rounded-2xl bg-[#292c32] p-1">
                            {[
                                ['all', 'Todas'],
                                ['unread', 'No leídas'],
                                ['priority', 'Prioritarias'],
                            ].map(([value, label]) => (
                                <button key={value} type="button" onClick={() => setFilter(value as NotificationFilter)} className={cn('flex-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white sm:text-base', filter === value && 'bg-white text-slate-900 shadow-sm')}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-400">Hoy</p>
                            <Button type="button" variant="ghost" size="sm" onClick={markAllAsRead} disabled={!unreadCount} className="rounded-full bg-[#292c32] px-4 text-slate-200 hover:bg-white/10">
                                <Check className="h-4 w-4" /> Marcar leídas
                            </Button>
                        </div>

                        <div className="mt-3 space-y-3">
                            {filteredNotifications.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
                                    <Bell className="mx-auto h-8 w-8 text-slate-500" />
                                    <p className="mt-3 font-medium text-slate-200">No tienes notificaciones</p>
                                    <p className="mt-1 text-sm text-slate-500">Aquí aparecerán alertas de presupuestos, ahorro y movimientos.</p>
                                </div>
                            ) : filteredNotifications.map((notification) => {
                                const source = sourceStyles[notification.source ?? 'system'] ?? sourceStyles.system;
                                const Icon = source.icon;
                                const isUnread = !notification.read_at;
                                return (
                                    <button key={notification.id} type="button" onClick={() => setReadIds((current) => [...new Set([...current, notification.id])])} className={cn('relative flex w-full items-start gap-4 rounded-2xl bg-[#25282e] p-5 text-left transition hover:bg-[#2b2e35]', isUnread && 'ring-2 ring-cyan-400')}>
                                        <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', source.background, source.color)}><Icon className="h-6 w-6" /></span>
                                        <span className="min-w-0 flex-1">
                                            <span className={cn('block text-sm font-semibold', source.color)}>{notification.source ?? 'Finanzas OS'}</span>
                                            <span className="mt-2 block text-base font-semibold text-white">{notification.title}</span>
                                            <span className="mt-1 block text-sm text-slate-400">{notification.message}</span>
                                            {notification.priority && notification.priority !== 'normal' && <span className="mt-2 block text-sm font-medium text-orange-300">Requiere revisión</span>}
                                        </span>
                                        <span className="shrink-0 text-xs text-slate-400">{relativeTime(notification.created_at)}</span>
                                        {isUnread && <span className="absolute bottom-5 right-5 h-2 w-2 rounded-full bg-violet-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </DialogBody>
                </div>
            </DialogContent>
        </Dialog>
    );
}
