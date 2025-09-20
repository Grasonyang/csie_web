import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    UserCheck,
    Beaker,
    GraduationCap,
    Megaphone,
    FileText,
    Mail,
    Settings,
    Folder,
    HelpCircle,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale?.toLowerCase() === 'zh-tw';
    const role = auth.user.role;

    type UserRole = SharedData['auth']['user']['role'];
    type RoleAwareNavItem = NavItem & { roles?: UserRole[] };

    const localizedMainNavItems: RoleAwareNavItem[] = [
        {
            title: 'Dashboard',
            href: '/manage/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: isZh ? '公告管理' : 'Posts',
            href: '/manage/admin/posts',
            icon: Megaphone,
        },
        {
            title: isZh ? '師資與職員' : 'Faculty & Staff',
            href: '/manage/admin/staff',
            icon: UserCheck,
            roles: ['admin', 'teacher'],
        },
        {
            title: isZh ? '實驗室管理' : 'Laboratories',
            href: '/manage/admin/labs',
            icon: Beaker,
        },
        {
            title: isZh ? '課程與學程' : 'Courses & Programs',
            href: '/manage/admin/academics',
            icon: GraduationCap,
        },
        {
            title: isZh ? '使用者管理' : 'Users',
            href: '/manage/admin/users',
            icon: Users,
        },
        {
            title: isZh ? '聯絡訊息' : 'Messages',
            href: '/manage/admin/contact-messages',
            icon: Mail,
        },
        {
            title: isZh ? '附件管理' : 'Attachments',
            href: '/manage/admin/attachments',
            icon: FileText,
        },
    ];

    const localizedFooterNavItems: NavItem[] = [
        {
            title: isZh ? '系統設定' : 'Settings',
            href: '/settings/profile',
            icon: Settings,
        },
        {
            title: isZh ? '說明文件' : 'Documentation',
            href: 'https://laravel.com/docs',
            icon: HelpCircle,
        },
        {
            title: 'Repository',
            href: 'https://github.com/Grasonyang/csie_web',
            icon: Folder,
        },
    ];

    const mainNavItems = localizedMainNavItems.filter((item) => !item.roles || item.roles.includes(role));

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={localizedFooterNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
