import AppLayout from '@/layouts/app-layout';
import { QuickActionCard } from '@/components/admin/dashboard/quick-action-card';
import { StatCard } from '@/components/admin/dashboard/stat-card';
import { getDashboardToneStyle } from '@/components/admin/dashboard/tone-styles';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPageLayout } from '@/styles/page-layouts';
import { palettes, type DashboardTone } from '@/styles/layout-system';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Megaphone,
    UserCheck,
    Beaker,
    BookOpen,
    GraduationCap,
    Users,
    Mail,
    Clock,
    Calendar,
    Eye,
    ChevronRight,
    Inbox,
    ShieldCheck,
} from 'lucide-react';
import { useMemo, type ComponentType } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const brandPalette = palettes.brand;

type HeroActionVariant = 'primary' | 'secondary';

type HeroAction = {
    label: string;
    href: string;
    icon: ComponentType<any>;
    variant?: HeroActionVariant;
};

function DashboardHeroActions({ actions }: { actions?: HeroAction[] }) {
    if (!actions?.length) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 md:flex-none md:items-end md:self-start">
            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:justify-end">
                {actions.map(({ href, label, icon: Icon, variant = 'primary' }) => (
                    <Button
                        asChild
                        key={href}
                        size="lg"
                        variant={variant === 'primary' ? 'default' : 'secondary'}
                        className={cn(
                            'group shadow-sm transition hover:-translate-y-0.5 md:min-w-[200px]',
                            brandPalette.focusRing,
                            variant === 'secondary'
                                ? 'border border-[#151f54]/20 bg-white text-[#151f54] hover:bg-[#eef1ff]'
                                : 'bg-[#151f54] text-white hover:bg-[#1f2a6d]',
                        )}
                    >
                        <Link href={href} prefetch className="inline-flex items-center gap-2">
                            <Icon className="size-4 transition-transform group-hover:scale-110" />
                            {label}
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    );
}

type TaskSummaryItemConfig = {
    icon: ComponentType<any>;
    label: string;
    count: number;
    tone: DashboardTone;
};

type ScheduleItemConfig = {
    icon: ComponentType<any>;
    label: string;
    time: string;
    tone: DashboardTone;
};

function TaskSummaryItem({ icon: Icon, label, count, tone }: TaskSummaryItemConfig) {
    const toneStyle = getDashboardToneStyle(tone);

    return (
        <div
            className={cn(
                'flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-sm transition-colors duration-200 hover:bg-white',
                brandPalette.backgroundMuted,
                brandPalette.border,
                brandPalette.textPrimary,
                toneStyle.borderColor,
            )}
        >
            <span className="flex items-center gap-3">
                <span className={cn('inline-flex items-center justify-center rounded-xl p-2', toneStyle.icon)}>
                    <Icon className="size-4" />
                </span>
                <span>{label}</span>
            </span>
            <span
                className={cn(
                    'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold',
                    toneStyle.chip,
                )}
            >
                {count}
            </span>
        </div>
    );
}

function UpcomingScheduleItem({ icon: Icon, label, time, tone }: ScheduleItemConfig) {
    const toneStyle = getDashboardToneStyle(tone);

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm',
                brandPalette.surface,
                brandPalette.border,
                brandPalette.textPrimary,
                toneStyle.borderColor,
            )}
        >
            <span className={cn('inline-flex items-center justify-center rounded-xl p-2', toneStyle.icon)}>
                <Icon className="size-4" />
            </span>
            <div className="flex flex-col">
                <span className="font-medium">{label}</span>
                <span className={cn('text-xs', toneStyle.subtle)}>{time}</span>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { auth, locale } = usePage<SharedData>().props;
    const role: SharedData['auth']['user']['role'] = auth?.user?.role ?? 'user';
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const layout = getPageLayout('dashboard');
    const heroLayout = layout.hero!;
    const metricsLayout = layout.sections.metrics;
    const quickActionsLayout = layout.sections.quickActions;
    const activityLayout = layout.sections.activity;

    const kpiSummary = [
        {
            label: isZh ? '本月公告瀏覽' : 'Bulletin views',
            value: '12.4k',
            trend: isZh ? '較上月 +18%' : '+18% vs last month',
        },
        {
            label: isZh ? '待處理事項' : 'Pending reviews',
            value: '6',
            trend: isZh ? '本週需處理' : 'due this week',
        },
    ];

    const heroActions: HeroAction[] = [
        {
            label: isZh ? '快速發布公告' : 'Compose bulletin',
            href: '/admin/posts/create',
            icon: Megaphone,
            variant: 'primary',
        },
        {
            label: isZh ? '查看收件匣' : 'Review inbox',
            href: '/admin/contact-messages',
            icon: Inbox,
            variant: 'secondary',
        },
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
            {
                title: isZh ? '發布公告' : 'Create Post',
                description: isZh ? '新增公告、新聞或活動資訊' : 'Publish announcements, news, or events',
                href: '/admin/posts/create',
                icon: Megaphone,
                tone: 'primary',
                roles: ['admin'],
            },
            {
                title: isZh ? '管理師資' : 'Manage Faculty',
                description: isZh ? '新增或編輯教師與行政人員資料' : 'Maintain faculty and staff records',
                href: '/admin/staff',
                icon: UserCheck,
                tone: 'secondary',
                roles: ['admin', 'teacher'],
            },
            {
                title: isZh ? '實驗室設定' : 'Lab Settings',
                description: isZh ? '更新實驗室資訊與成員' : 'Update lab profiles and members',
                href: '/admin/labs',
                icon: Beaker,
                tone: 'accent',
                roles: ['admin'],
            },
            {
                title: isZh ? '課程管理' : 'Course Management',
                description: isZh ? '設定課程資訊與學分' : 'Manage course catalog and credits',
                href: '/admin/courses',
                icon: BookOpen,
                tone: 'primary',
                roles: ['admin'],
            },
            {
                title: isZh ? '學程規劃' : 'Program Planning',
                description: isZh ? '維護學位學程與模組' : 'Maintain program blueprints',
                href: '/admin/programs',
                icon: GraduationCap,
                tone: 'secondary',
                roles: ['admin'],
            },
            {
                title: isZh ? '使用者管理' : 'User Management',
                description: isZh ? '調整權限與審核新帳號' : 'Adjust permissions and review new users',
                href: '/admin/users',
                icon: Users,
                tone: 'accent',
                roles: ['admin'],
            },
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
        {
            icon: Mail,
            label: isZh ? '新聯絡訊息' : 'New contact messages',
            count: 3,
            tone: 'primary',
        },
        {
            icon: Users,
            label: isZh ? '待審核使用者' : 'Pending approvals',
            count: 1,
            tone: 'secondary',
        },
        {
            icon: ShieldCheck,
            label: isZh ? '權限調整請求' : 'Permission requests',
            count: 2,
            tone: 'accent',
        },
    ];

    const upcomingSchedule: ScheduleItemConfig[] = [
        {
            icon: Calendar,
            label: isZh ? '系務會議' : 'Faculty council',
            time: isZh ? '明日下午 14:00' : 'Tomorrow • 2:00 PM',
            tone: 'primary',
        },
        {
            icon: Clock,
            label: isZh ? '課程公告排程' : 'Course bulletin release',
            time: isZh ? '週五上午 09:00' : 'Friday • 9:00 AM',
            tone: 'secondary',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isZh ? '管理後台' : 'Dashboard'} />

            <section className={heroLayout.section}>
                <div className={cn(heroLayout.container, heroLayout.wrapper)}>
                    <div className={cn(heroLayout.surfaces?.base, heroLayout.primary)}>
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-1 flex-col gap-6">
                                <div className="space-y-4">
                                    <span
                                        className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d5dcf8] bg-[#f4f6ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#3d4a87]"
                                    >
                                        NCUE CSIE
                                    </span>
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-semibold text-[#151f54] md:text-4xl">
                                            {isZh ? '系統管理後台總覽' : 'Administrative control center'}
                                        </h1>
                                        <p className="max-w-xl text-slate-600">
                                            {isZh
                                                ? '快速掌握公告、師資、實驗室與課程等核心指標，從這裡展開每日的營運管理。'
                                                : 'Stay on top of announcements, faculty, labs, and courses—all the operational essentials in one place.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid w-full gap-3 sm:grid-cols-2 sm:gap-4 md:max-w-2xl">
                                    {kpiSummary.map((item) => (
                                        <div
                                            key={item.label}
                                            className={cn(
                                                'flex w-full flex-col gap-1 rounded-2xl px-5 py-4 shadow-sm',
                                                brandPalette.surface,
                                                brandPalette.border,
                                            )}
                                        >
                                            <p className={cn('text-xs font-semibold uppercase tracking-[0.35em]', brandPalette.textMuted)}>
                                                {item.label}
                                            </p>
                                            <p className="text-xl font-semibold text-[#151f54]">{item.value}</p>
                                            <span className={cn('text-xs font-medium', brandPalette.textMuted)}>{item.trend}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <DashboardHeroActions actions={heroActions} />
                        </div>
                    </div>
                </div>
            </section>

            <section className={metricsLayout.section}>
                <div className={cn(metricsLayout.container, metricsLayout.wrapper)}>
                    <StatCard
                        title={isZh ? '總公告數' : 'Total bulletins'}
                        value="48"
                        icon={Megaphone}
                        trend={isZh ? '本月 +12%' : '+12% this month'}
                        tone="primary"
                    />
                    <StatCard
                        title={isZh ? '師資人數' : 'Faculty members'}
                        value="25"
                        icon={UserCheck}
                        trend={isZh ? '年度新增 3 名' : '+3 new this year'}
                        tone="secondary"
                    />
                    <StatCard
                        title={isZh ? '實驗室數' : 'Laboratories'}
                        value="12"
                        icon={Beaker}
                        tone="accent"
                    />
                    <StatCard
                        title={isZh ? '開設課程' : 'Courses offered'}
                        value="156"
                        icon={BookOpen}
                        trend={isZh ? '本學期 +8 門' : '+8 this semester'}
                        tone="primary"
                    />
                </div>
            </section>

            <section className={quickActionsLayout.section}>
                <div className={cn(quickActionsLayout.container, 'space-y-6 w-full')}>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-[#151f54] md:text-2xl">
                                {isZh ? '快速操作' : 'Quick actions'}
                            </h2>
                            <p className="text-sm text-slate-600">
                                {isZh
                                    ? '常用管理任務整理於此，協助您迅速完成日常工作。'
                                    : 'Access the most common management tasks without digging through menus.'}
                            </p>
                        </div>
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 rounded-full border border-[#151f54]/20 bg-white px-4 py-2 text-sm font-medium text-[#151f54] transition hover:bg-[#eef1ff]"
                        >
                            {isZh ? '檢視完整控制台' : 'Open full control center'}
                            <ChevronRight className="size-4 text-current" />
                        </Link>
                    </div>
                    <div
                        className={cn(
                            quickActionsLayout.wrapper,
                            'grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr',
                        )}
                    >
                        {quickActions.map((action) => (
                            <QuickActionCard key={action.href} {...action} />
                        ))}
                    </div>
                </div>
            </section>

            <section className={activityLayout.section}>
                <div className={cn(activityLayout.container, activityLayout.wrapper)}>
                    <div className={cn(activityLayout.primary)}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-[#151f54] md:text-xl">
                                    {isZh ? '最新公告摘要' : 'Recent bulletin highlights'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {isZh ? '檢視最新置頂與近期公告' : 'Stay synced with the latest published updates.'}
                                </p>
                            </div>
                            <Link
                                href="/admin/posts"
                                className="inline-flex items-center gap-2 rounded-full border border-[#151f54]/20 bg-white px-3 py-1 text-sm font-medium text-[#151f54] transition hover:bg-[#eef1ff]"
                            >
                                {isZh ? '查看全部' : 'View all'}
                                <ChevronRight className="size-4 text-current" />
                            </Link>
                        </div>
                        <ol className={cn(activityLayout.surfaces?.timeline, 'space-y-6')}>
                            {recentBulletins.map((item) => (
                                <li key={item.id} className={cn('pl-6', activityLayout.surfaces?.timelineItem)}>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={`/admin/posts/${item.id}`}
                                            className="text-base font-semibold text-[#151f54] transition hover:text-[#8a6300]"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {item.time}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="size-3" />
                                                {item.date}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Eye className="size-3" />
                                                {item.views}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <aside className={cn(activityLayout.secondary)}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#151f54]">
                                {isZh ? '待處理事項' : 'Pending tasks'}
                            </h3>
                            <div className="space-y-3">
                                {taskSummary.map((task) => (
                                    <TaskSummaryItem key={task.label} {...task} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#151f54]">
                                {isZh ? '即將到來' : 'Upcoming schedule'}
                            </h3>
                            <div className="space-y-3">
                                {upcomingSchedule.map((item) => (
                                    <UpcomingScheduleItem key={item.label} {...item} />
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}
