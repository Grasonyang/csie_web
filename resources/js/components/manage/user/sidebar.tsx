import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, User, Palette, ShieldCheck, LifeBuoy } from 'lucide-react';

export default function UserSidebar() {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const mainNavItems: NavItem[] = [
        { title: isZh ? '會員首頁' : 'Member Home', href: '/manage/dashboard', icon: LayoutGrid },
        { title: isZh ? '個人資料' : 'Profile', href: '/settings/profile', icon: User },
        { title: isZh ? '外觀偏好' : 'Appearance', href: '/settings/appearance', icon: Palette },
        { title: isZh ? '安全設定' : 'Security', href: '/settings/password', icon: ShieldCheck },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: isZh ? '協助中心' : 'Support',
            href: 'mailto:csie@cc.ncue.edu.tw',
            icon: LifeBuoy,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/manage/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label={isZh ? '會員專區' : 'Member Area'} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
