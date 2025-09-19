import AppLayout from '@/layouts/app-layout';
import { GlassChip, GlassPanel, GlassTile } from '@/components/glass';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPageLayout } from '@/styles/page-layouts';
import { dashboardTones, type DashboardTone } from '@/styles/layout-system';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Megaphone,
    UserCheck,
    Beaker,
    BookOpen,
    GraduationCap,
    Users,
    Mail,
    TrendingUp,
    Clock,
    Calendar,
    Eye,
    ChevronRight,
    Inbox,
    ShieldCheck,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type StatTone = DashboardTone;

type QuickTone = DashboardTone;

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    tone = 'primary',
    className,
}: {
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    trend?: string;
    tone?: StatTone;
    className?: string;
}) {
    const tonePalette = dashboardTones[tone].stat;
    return (
        <GlassPanel
            as="article"
            shimmer
            float="slow"
            className={cn(
                'relative overflow-hidden px-6 py-6 transition-shadow duration-300',
                tonePalette.surface,
                tonePalette.hover,
                className,
            )}
        >
            <span
                className={cn(
                    'pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full blur-[120px]',
                    tonePalette.aura,
                )}
                aria-hidden
            />
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#151f54]/65">{title}</p>
                    <p className="text-4xl font-semibold text-[#151f54] md:text-5xl">{value}</p>
                    {trend && (
                        <GlassChip
                            className={cn(
                                'inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold',
                                tonePalette.chip,
                                tonePalette.trend,
                            )}
                        >
                            <TrendingUp className="size-3" />
                            {trend}
                        </GlassChip>
                    )}
                </div>
                <span
                    className={cn(
                        'glass-ring inline-flex items-center justify-center rounded-2xl p-3',
                        tonePalette.icon,
                    )}
                >
                    <Icon className="size-5" />
                </span>
            </div>
        </GlassPanel>
    );
}

function QuickActionCard({
    title,
    description,
    href,
    icon: Icon,
    tone = 'primary',
    className,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<any>;
    tone?: QuickTone;
    className?: string;
}) {
    const tonePalette = dashboardTones[tone].action;

    return (
        <GlassTile
            as={Link}
            shimmer
            spotlight
            bleedShadow
            float="medium"
            href={href}
            prefetch
            className={cn(
                'group relative flex h-full min-h-[208px] flex-col justify-between gap-6 overflow-hidden px-6 py-6 focus:outline-none transition-all duration-300 hover:-translate-y-1.5',
                tonePalette.surface,
                tonePalette.hover,
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <span className={cn('glass-ring inline-flex items-center rounded-xl p-3', tonePalette.icon)}>
                    <Icon className="size-5" />
                </span>
                <ChevronRight
                    className={cn(
                        'size-5 transition-transform duration-300 group-hover:translate-x-1.5',
                        tonePalette.arrow,
                    )}
                />
            </div>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
                <p className={cn('text-sm leading-relaxed', tonePalette.body)}>{description}</p>
            </div>
        </GlassTile>
    );
}


type HeroActionVariant = 'primary' | 'secondary';

type HeroAction = {
    label: string;
    href: string;
    icon: React.ComponentType<any>;
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
                            'group shadow-lg transition hover:-translate-y-0.5 md:min-w-[200px]',
                            variant === 'secondary'
                                ? 'border border-white/20 bg-primary/15 text-white hover:bg-primary/25'
                                : 'text-primary-foreground',
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


export default function Dashboard() {
    const page = usePage<any>();
    const { locale } = page.props;
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

    const quickActions = [
        {
            title: isZh ? '發布公告' : 'Create Post',
            description: isZh ? '新增公告、新聞或活動資訊' : 'Publish announcements, news, or events',
            href: '/admin/posts/create',
            icon: Megaphone,
            tone: 'primary' as QuickTone,
        },
        {
            title: isZh ? '管理師資' : 'Manage Faculty',
            description: isZh ? '新增或編輯教師與行政人員資料' : 'Maintain faculty and staff records',
            href: '/admin/staff',
            icon: UserCheck,
            tone: 'secondary' as QuickTone,
        },
        {
            title: isZh ? '實驗室設定' : 'Lab Settings',
            description: isZh ? '更新實驗室資訊與成員' : 'Update lab profiles and members',
            href: '/admin/labs',
            icon: Beaker,
            tone: 'accent' as QuickTone,
        },
        {
            title: isZh ? '課程管理' : 'Course Management',
            description: isZh ? '設定課程資訊與學分' : 'Manage course catalog and credits',
            href: '/admin/courses',
            icon: BookOpen,
            tone: 'primary' as QuickTone,
        },
        {
            title: isZh ? '學程規劃' : 'Program Planning',
            description: isZh ? '維護學位學程與模組' : 'Maintain program blueprints',
            href: '/admin/programs',
            icon: GraduationCap,
            tone: 'secondary' as QuickTone,
        },
        {
            title: isZh ? '使用者管理' : 'User Management',
            description: isZh ? '調整權限與審核新帳號' : 'Adjust permissions and review new users',
            href: '/admin/users',
            icon: Users,
            tone: 'accent' as QuickTone,
        },
    ];

    const recentBulletins = [1, 2, 3, 4].map((item) => ({
        id: item,
        title: isZh ? `重要公告標題 ${item}` : `Important Announcement ${item}`,
        time: isZh ? '2 小時前' : '2 hours ago',
        views: 124 + item * 3,
        date: '2024-03-12',
    }));

    const taskSummary = [
        {
            icon: Mail,
            label: isZh ? '新聯絡訊息' : 'New contact messages',
            count: 3,
            surface:
                'bg-gradient-to-br from-[#151f54]/80 via-[#1f2a6d]/65 to-[#0f153f]/70 border-[#151f54]/45 text-white/85 shadow-[0_28px_90px_-58px_rgba(21,31,84,0.52)]',
            chip: 'bg-[#ffb401]/25 text-[#151f54]',
            iconColor: 'text-[#ffb401]',
        },
        {
            icon: Users,
            label: isZh ? '待審核使用者' : 'Pending approvals',
            count: 1,
            surface:
                'bg-gradient-to-br from-[#2b1a00]/80 via-[#8a6300]/65 to-[#ffb401]/58 border-[#ffb401]/45 text-white/90 shadow-[0_28px_90px_-58px_rgba(82,48,0,0.55)]',
            chip: 'bg-[#ffb401]/25 text-[#2b1a00]',
            iconColor: 'text-[#ffb401]',
        },
        {
            icon: ShieldCheck,
            label: isZh ? '權限調整請求' : 'Permission requests',
            count: 2,
            surface:
                'bg-gradient-to-br from-[#151f54]/78 via-[#3d3600]/62 to-[#fff809]/58 border-[#fff809]/35 text-white/90 shadow-[0_28px_90px_-58px_rgba(21,31,84,0.5)]',
            chip: 'bg-[#fff809]/30 text-[#151f54]',
            iconColor: 'text-[#fff809]',
        },
    ];

    const upcomingSchedule = [
        {
            icon: Calendar,
            label: isZh ? '系務會議' : 'Faculty council',
            time: isZh ? '明日下午 14:00' : 'Tomorrow • 2:00 PM',
            surface:
                'bg-gradient-to-br from-[#151f54]/85 via-[#1f2a6d]/70 to-[#0f153f]/65 border-[#151f54]/45 text-white/90',
            subtle: 'text-white/65',
            iconColor: 'text-[#ffb401]',
        },
        {
            icon: Clock,
            label: isZh ? '課程公告排程' : 'Course bulletin release',
            time: isZh ? '週五上午 09:00' : 'Friday • 9:00 AM',
            surface:
                'bg-gradient-to-br from-[#2b1a00]/80 via-[#8a6300]/60 to-[#ffb401]/55 border-[#ffb401]/40 text-white/90',
            subtle: 'text-white/65',
            iconColor: 'text-[#fff809]',
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
                                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                                        NCUE CSIE
                                    </span>
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-semibold text-white md:text-4xl">
                                            {isZh ? '系統管理後台總覽' : 'Administrative control center'}
                                        </h1>
                                        <p className="max-w-xl text-white/75">
                                            {isZh
                                                ? '快速掌握公告、師資、實驗室與課程等核心指標，從這裡展開每日的營運管理。'
                                                : 'Stay on top of announcements, faculty, labs, and courses—all the operational essentials in one place.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid w-full gap-3 sm:grid-cols-2 sm:gap-4 md:max-w-2xl">
                                    {kpiSummary.map((item) => (
                                        <GlassTile
                                            key={item.label}
                                            shimmer
                                            float="slow"
                                            className="w-full px-5 py-4 text-sm text-white/85 backdrop-blur-sm"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                                                {item.label}
                                            </p>
                                            <p className="text-xl font-semibold text-white">{item.value}</p>
                                            <span className="text-xs text-white/75">{item.trend}</span>
                                        </GlassTile>
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
                            <h2 className="text-xl font-semibold text-white md:text-2xl">
                                {isZh ? '快速操作' : 'Quick actions'}
                            </h2>
                            <p className="text-sm text-white/70">
                                {isZh
                                    ? '常用管理任務整理於此，協助您迅速完成日常工作。'
                                    : 'Access the most common management tasks without digging through menus.'}
                            </p>
                        </div>
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 rounded-full border border-[#ffb401]/45 px-4 py-2 text-sm font-medium text-[#ffb401] transition hover:bg-[#ffb401]/20 hover:text-[#151f54]"
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
                                <h3 className="text-lg font-semibold text-white md:text-xl">
                                    {isZh ? '最新公告摘要' : 'Recent bulletin highlights'}
                                </h3>
                                <p className="text-sm text-white/70">
                                    {isZh ? '檢視最新置頂與近期公告' : 'Stay synced with the latest published updates.'}
                                </p>
                            </div>
                            <Link
                                href="/admin/posts"
                                className="inline-flex items-center gap-2 rounded-full bg-[#ffb401]/15 px-3 py-1 text-sm font-medium text-[#ffb401] transition hover:bg-[#ffb401]/25 hover:text-[#151f54]"
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
                                            className="text-base font-semibold text-white transition hover:text-[#ffb401]"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
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
                            <h3 className="text-lg font-semibold text-white">
                                {isZh ? '待處理事項' : 'Pending tasks'}
                            </h3>
                            <div className="space-y-3">
                                {taskSummary.map((task) => (
                                    <GlassTile
                                        key={task.label}
                                        shimmer
                                        className={cn(
                                            'flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-white/90',
                                            task.surface,
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <task.icon className={cn('size-4', task.iconColor)} />
                                            {task.label}
                                        </span>
                                        <GlassChip className={cn('px-3 py-1 text-xs font-semibold text-white', task.chip)}>
                                            {task.count}
                                        </GlassChip>
                                    </GlassTile>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">
                                {isZh ? '即將到來' : 'Upcoming schedule'}
                            </h3>
                            <div className="space-y-3">
                                {upcomingSchedule.map((item) => (
                                    <GlassTile
                                        key={item.label}
                                        float="slow"
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 text-sm text-white/85',
                                            item.surface,
                                        )}
                                    >
                                        <item.icon className={cn('size-4', item.iconColor)} />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{item.label}</span>
                                            <span className={cn('text-xs', item.subtle)}>{item.time}</span>
                                        </div>
                                    </GlassTile>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}
