import DashboardTemplate, {
    type HeroAction,
    type ScheduleItemConfig,
    type TaskSummaryItemConfig,
} from '@/components/manage/dashboard';
import { type SharedData } from '@/types';
import { useMemo, type ComponentType } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Beaker,
    BookOpen,
    Calendar,
    Clock,
    Eye,
    GraduationCap,
    Inbox,
    Mail,
    Megaphone,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';
import { type DashboardTone } from '@/styles/layout-system';

export default function AdminDashboard() {
    const { auth, locale } = usePage<SharedData>().props;
    const role: SharedData['auth']['user']['role'] = auth?.user?.role ?? 'user';
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const kpiSummary = [
        { label: isZh ? '本月公告瀏覽' : 'Bulletin views', value: '12.4k', trend: isZh ? '較上月 +18%' : '+18% vs last month' },
        { label: isZh ? '待處理事項' : 'Pending reviews', value: '6', trend: isZh ? '本週需處理' : 'due this week' },
    ];

    const heroActions: HeroAction[] = [
        { label: isZh ? '快速發布公告' : 'Compose bulletin', href: '/manage/admin/posts/create', icon: Megaphone, variant: 'primary' },
        { label: isZh ? '查看收件匣' : 'Review inbox', href: '/manage/admin/contact-messages', icon: Inbox, variant: 'secondary' },
    ];

    type UserRole = SharedData['auth']['user']['role'];
    type QuickActionConfig = {
        title: string;
        description: string;
        href: string;
        icon: ComponentType<any>;
        tone: DashboardTone;
        roles?: UserRole[];
    };

    const quickActions = useMemo(() => {
        const configs: QuickActionConfig[] = [
            { title: isZh ? '發布公告' : 'Create Post', description: isZh ? '新增公告、新聞或活動資訊' : 'Publish announcements, news, or events', href: '/manage/admin/posts/create', icon: Megaphone, tone: 'primary', roles: ['admin'] },
            { title: isZh ? '管理師資' : 'Manage Faculty', description: isZh ? '新增或編輯教師與行政人員資料' : 'Maintain faculty and staff records', href: '/manage/admin/staff', icon: UserCheck, tone: 'secondary', roles: ['admin', 'teacher'] },
            { title: isZh ? '實驗室設定' : 'Lab Settings', description: isZh ? '更新實驗室資訊與成員' : 'Update lab profiles and members', href: '/manage/admin/labs', icon: Beaker, tone: 'accent', roles: ['admin'] },
            { title: isZh ? '課程管理' : 'Course Management', description: isZh ? '設定課程資訊與學分' : 'Manage course catalog and credits', href: '/manage/admin/courses', icon: BookOpen, tone: 'primary', roles: ['admin'] },
            { title: isZh ? '學程規劃' : 'Program Planning', description: isZh ? '維護學位學程與模組' : 'Maintain program blueprints', href: '/manage/admin/programs', icon: GraduationCap, tone: 'secondary', roles: ['admin'] },
            { title: isZh ? '使用者管理' : 'User Management', description: isZh ? '調整權限與審核新帳號' : 'Adjust permissions and review new users', href: '/manage/admin/users', icon: Users, tone: 'accent', roles: ['admin'] },
        ];
        return configs.filter((action) => !action.roles || action.roles.includes(role));
    }, [isZh, role]);

    const recentBulletins = [1, 2, 3, 4].map((item) => ({
        id: item,
        title: isZh ? `重要公告標題 ${item}` : `Important Announcement ${item}`,
        time: isZh ? '2 小時前' : '2 hours ago',
        views: 124 + item * 3,
        date: '2024-03-12',
    }));

    const taskSummary: TaskSummaryItemConfig[] = [
        { icon: Mail, label: isZh ? '新聯絡訊息' : 'New contact messages', count: 3, tone: 'primary' },
        { icon: Users, label: isZh ? '待審核使用者' : 'Pending approvals', count: 1, tone: 'secondary' },
        { icon: ShieldCheck, label: isZh ? '權限調整請求' : 'Permission requests', count: 2, tone: 'accent' },
    ];

    const upcomingSchedule: ScheduleItemConfig[] = [
        { icon: Calendar, label: isZh ? '系務會議' : 'Faculty council', time: isZh ? '明日下午 14:00' : 'Tomorrow • 2:00 PM', tone: 'primary' },
        { icon: Clock, label: isZh ? '課程公告排程' : 'Course bulletin release', time: isZh ? '週五上午 09:00' : 'Friday • 9:00 AM', tone: 'secondary' },
    ];

    const statCards = [
        { title: isZh ? '總公告數' : 'Total bulletins', value: '48', icon: Megaphone, trend: isZh ? '本月 +12%' : '+12% this month', tone: 'primary' as DashboardTone },
        { title: isZh ? '師資人數' : 'Faculty members', value: '25', icon: UserCheck, trend: isZh ? '年度新增 3 名' : '+3 new this year', tone: 'secondary' as DashboardTone },
        { title: isZh ? '實驗室數' : 'Laboratories', value: '12', icon: Beaker, tone: 'accent' as DashboardTone },
        { title: isZh ? '開設課程' : 'Courses offered', value: '156', icon: BookOpen, trend: isZh ? '本學期 +8 門' : '+8 this semester', tone: 'primary' as DashboardTone },
    ];

    return (
        <DashboardTemplate
            isZh={isZh}
            kpiSummary={kpiSummary}
            heroActions={heroActions}
            statCards={statCards}
            quickActions={quickActions}
            recentBulletins={recentBulletins}
            taskSummary={taskSummary}
            upcomingSchedule={upcomingSchedule}
        />
    );
}
