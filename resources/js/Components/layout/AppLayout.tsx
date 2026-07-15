import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Bell, BriefcaseBusiness, Building2, ChevronUp, LayoutDashboard, LogOut, Menu, Package, Settings, ShieldCheck, UserCircle, Users, WalletCards, Warehouse } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Separator } from '@/Components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { cn } from '@/lib/utils';
import { NavigationItem, PageProps, User } from '@/types';

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
} as const;

function SidebarContent({ user }: { user: User }) {
    const currentPath = window.location.pathname;
    const { auth } = usePage<PageProps>().props;
    const navItems = auth.navigation ?? [];
    const isSuperAdmin = user.roles?.some((role) => role.name === 'super_admin');

    return (
        <div className="flex h-full flex-col">
            <div className="px-4 py-5">
                <div className="text-lg font-semibold text-white">Finanzas OS</div>
                <p className="text-xs text-muted-foreground">{isSuperAdmin ? 'Control central' : user.client?.name ?? 'Operación multi-tenant'}</p>
            </div>
            <Separator />
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-white', currentPath === item.href && 'bg-cyan-500/20 text-white')}>
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
                        <Button variant="outline" className={cn('w-full justify-between border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white', currentPath === '/profile' && 'bg-cyan-500/20 text-white')}>
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
            <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-[#0b1a24]/90 backdrop-blur lg:block">
                <SidebarContent user={user} />
            </aside>
            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07131b]/80 backdrop-blur">
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
                            <div className="text-sm text-muted-foreground">{isSuperAdmin ? 'Administración global' : 'Operación financiera por cliente'}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <UserMenu user={user} />
                        </div>
                    </div>
                </header>
                <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
