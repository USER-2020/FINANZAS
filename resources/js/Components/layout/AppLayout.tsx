import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Banknote, BriefcaseBusiness, Building2, ChevronUp, Clapperboard, FileScan, LayoutDashboard, LogOut, Menu, Package, Settings, ShieldCheck, UserCircle, Users, WalletCards, Warehouse, Target, PiggyBank, RefreshCw, Tags } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Separator } from '@/Components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { cn } from '@/lib/utils';
import { NavigationItem, PageProps, User } from '@/types';
import { DriverTourLauncher } from '@/Components/guidance/DriverTourLauncher';
import { NotificationCenter } from '@/Components/notifications/NotificationCenter';

const iconMap = {
    LayoutDashboard,
    BriefcaseBusiness,
    Users,
    ShieldCheck,
    WalletCards,
    Package,
    Warehouse,
    Building2,
    BarChart3,
    Banknote,
    Clapperboard,
    Target,
    PiggyBank,
    RefreshCw,
    Tags,
} as const;

function SidebarContent({ user }: { user: User }) {
    const currentPath = window.location.pathname;
    const { auth } = usePage<PageProps>().props;
    const navItems = auth.navigation ?? [];
    const isSuperAdmin = user.roles?.some((role) => role.name === 'super_admin');

    return (
        <div className="flex h-full flex-col">
            <div className="px-5 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20">
                        <WalletCards className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-semibold tracking-tight text-white">Finanzas OS</div>
                        <p className="text-[0.68rem] uppercase tracking-[0.16em] text-emerald-300/75">Control financiero</p>
                    </div>
                </div>
                <p className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-muted-foreground">{isSuperAdmin ? 'Control central' : user.client?.name ?? 'Operación multi-tenant'}</p>
            </div>
            <Separator />
            {!isSuperAdmin && (
                <div className="px-3 pt-3">
                    <Link
                        href="/financial-movements?scan=1"
                        data-tour="quick-capture"
                        className="flex items-center gap-3 rounded-xl border border-emerald-300/25 bg-gradient-to-r from-emerald-300/15 to-cyan-300/10 px-3 py-3 text-sm font-medium text-emerald-100 shadow-[0_8px_24px_rgba(16,185,129,0.08)] transition hover:border-emerald-200/45 hover:from-emerald-300/20 hover:to-cyan-300/15"
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-300/15 text-emerald-300">
                            <FileScan className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate">Capturar movimiento</span>
                            <span className="mt-0.5 block truncate text-xs font-normal text-emerald-100/60">Leer factura con OCR</span>
                        </span>
                    </Link>
                </div>
            )}
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} data-tour={`menu:${item.key}`} className={cn('group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white', currentPath === item.href && 'bg-emerald-400/10 text-emerald-200 shadow-[inset_3px_0_0_#34d399]')}>
                        {(() => {
                            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
                            return <Icon className="h-4 w-4" />;
                        })()}
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-between border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/10 hover:text-white', currentPath === '/profile' && 'bg-emerald-400/10 text-white')}>
                            <span className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Ajustes
                            </span>
                            <ChevronUp className="h-4 w-4 opacity-60" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-64 border-white/10 bg-[#10212d] shadow-2xl shadow-black/50">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Cuenta</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="gap-2 px-3 py-2 text-sm hover:bg-cyan-500/15">
                            <Link href="/profile">
                                <UserCircle className="h-4 w-4 text-emerald-300" />
                                Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="gap-2 px-3 py-2 text-sm text-red-200 hover:bg-red-500/15">
                            <Link href={route('logout')} method="post" as="button" className="w-full">
                                <LogOut className="h-4 w-4" />
                                Cerrar sesión
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

function UserMenu({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 px-2">
                    <Avatar>
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#10212d] shadow-2xl shadow-black/50">
                <DropdownMenuLabel>
                    <div className="text-sm text-white">{user.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2 px-3 py-2 hover:bg-cyan-500/15">
                    <Link href="/profile">
                        <UserCircle className="h-4 w-4 text-emerald-300" />
                        Perfil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 px-3 py-2 text-red-200 hover:bg-red-500/15">
                    <Link href={route('logout')} method="post" as="button" className="w-full">
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function AppLayout({ user, children }: PropsWithChildren<{ user: User }>) {
    const isSuperAdmin = user.roles?.some((role) => role.name === 'super_admin');

    return (
        <div className="min-h-screen">
            <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/[0.08] bg-slate-950/55 backdrop-blur-2xl lg:block">
                <SidebarContent user={user} />
            </aside>
            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0a1020]/75 backdrop-blur-2xl">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="left-0 right-auto w-72 border-r border-white/10 p-0">
                                    <SidebarContent user={user} />
                                </SheetContent>
                            </Sheet>
                            <div>
                                <div className="text-sm font-medium text-white">{isSuperAdmin ? 'Administración global' : 'Tu espacio financiero'}</div>
                                <div className="hidden text-xs text-muted-foreground sm:block">Todo lo importante, en un solo lugar</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <DriverTourLauncher />
                            <NotificationCenter />
                            <UserMenu user={user} />
                        </div>
                    </div>
                </header>
                <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
                    <div className="surface-grid pointer-events-none absolute inset-x-0 top-0 h-80 opacity-70" />
                    <div className="relative">{children}</div>
                </motion.main>
            </div>
        </div>
    );
}
