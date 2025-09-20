import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Megaphone, Beaker, NotebookPen, Settings, HelpCircle } from 'lucide-react';

export default function TeacherSidebar() {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const mainNavItems: NavItem[] = [
        { title: isZh ? '教職儀表板' : 'Teaching Home', href: '/manage/dashboard', icon: LayoutGrid },
        { title: isZh ? '公告管理' : 'Announcements', href: '/manage/teacher/posts', icon: Megaphone },
        { title: isZh ? '研究管理' : 'Research', href: '/manage/teacher/labs', icon: Beaker },
        { title: isZh ? '課程與活動' : 'Courses & Activities', href: '/manage/teacher/courses', icon: NotebookPen },
        { title: isZh ? '個人設定' : 'Profile Settings', href: '/settings/profile', icon: Settings },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: isZh ? '教學資源指南' : 'Teaching Guide',
            href: 'https://github.com/Grasonyang/csie_web',
            icon: HelpCircle,
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
                <NavMain items={mainNavItems} label={isZh ? '教學管理' : 'Teaching'} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
