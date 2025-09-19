import AppLayout from '@/layouts/app-layout';
import { GlassChip, GlassPanel, GlassTile } from '@/components/glass';
import { cn } from '@/lib/utils';
import { getPageLayout } from '@/styles/page-layouts';
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

type StatTone = 'indigo' | 'emerald' | 'violet' | 'amber';

type QuickTone = 'indigo' | 'emerald' | 'violet' | 'amber';

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    tone = 'indigo',
    className,
}: {
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    trend?: string;
    tone?: StatTone;
    className?: string;
}) {
    const palette: Record<StatTone, { icon: string; surface: string; chip: string; trend: string; aura: string }> = {
        indigo: {
            icon: 'bg-gradient-to-br from-[#1d3bb8] to-[#3f66ff] shadow-[0_18px_55px_-28px_rgba(29,59,184,0.65)]',
            surface: 'bg-gradient-to-br from-white/90 via-white/70 to-[#1d3bb8]/14',
            chip: 'bg-[#1d3bb8]/14 text-[#1d3bb8]',
            trend: 'text-emerald-500',
            aura: 'bg-[#1d3bb8]/18',
        },
        emerald: {
            icon: 'bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-[0_18px_55px_-28px_rgba(16,185,129,0.5)]',
            surface: 'bg-gradient-to-br from-white/90 via-white/70 to-emerald-100/40',
            chip: 'bg-emerald-500/15 text-emerald-600',
            trend: 'text-emerald-600',
            aura: 'bg-emerald-400/24',
        },
        violet: {
            icon: 'bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_18px_55px_-28px_rgba(139,92,246,0.5)]',
            surface: 'bg-gradient-to-br from-white/90 via-white/68 to-violet-100/35',
            chip: 'bg-violet-500/15 text-violet-600',
            trend: 'text-violet-600',
            aura: 'bg-violet-500/22',
        },
        amber: {
            icon: 'bg-gradient-to-br from-amber-500 to-orange-400 shadow-[0_18px_55px_-28px_rgba(245,158,11,0.45)]',
            surface: 'bg-gradient-to-br from-white/90 via-white/70 to-amber-100/30',
            chip: 'bg-amber-400/20 text-amber-600',
            trend: 'text-amber-600',
            aura: 'bg-amber-400/28',
        },
    };
    return (
        <GlassPanel
            as="article"
            shimmer
            float="slow"
            className={cn('relative overflow-hidden px-6 py-6', palette[tone].surface, className)}
        >
            <span
                className={cn('pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full blur-[120px]', palette[tone].aura)}
                aria-hidden
            />
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500/75">{title}</p>
                    <p className="text-4xl font-semibold text-slate-900 md:text-5xl">{value}</p>
                    {trend && (
                        <GlassChip className={cn('inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-neutral-700', palette[tone].chip)}>
                            <TrendingUp className="size-3" />
                            {trend}
                        </GlassChip>
                    )}
                </div>
                <span
                    className={cn(
                        'glass-ring inline-flex items-center justify-center rounded-2xl p-3 text-white shadow-lg',
                        palette[tone].icon,
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
    tone = 'indigo',
    className,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<any>;
    tone?: QuickTone;
    className?: string;
}) {
    const palette: Record<QuickTone, { surface: string; icon: string; body: string; arrow: string }> = {
        indigo: {
            surface:
                'bg-gradient-to-br from-[#0e1a47]/92 via-[#192b6d]/88 to-[#233884]/78 text-white shadow-[0_42px_120px_-60px_rgba(6,12,39,0.75)]',
            icon: 'bg-white/12 text-white shadow-lg',
            body: 'text-slate-100/85',
            arrow: 'text-white/75',
        },
        emerald: {
            surface:
                'bg-gradient-to-br from-[#06392c]/90 via-[#0e5d45]/85 to-[#128965]/78 text-white shadow-[0_42px_120px_-60px_rgba(6,95,70,0.65)]',
            icon: 'bg-white/12 text-white shadow-lg',
            body: 'text-emerald-100/85',
            arrow: 'text-white/75',
        },
        violet: {
            surface:
                'bg-gradient-to-br from-[#2a1559]/92 via-[#452097]/86 to-[#6b31d0]/78 text-white shadow-[0_42px_120px_-60px_rgba(76,29,149,0.68)]',
            icon: 'bg-white/14 text-white shadow-lg',
            body: 'text-violet-100/85',
            arrow: 'text-white/75',
        },
        amber: {
            surface:
                'bg-gradient-to-br from-[#5a2c05]/92 via-[#8c4b09]/84 to-[#f29b0b]/76 text-white shadow-[0_42px_120px_-60px_rgba(217,119,6,0.6)]',
            icon: 'bg-white/14 text-white shadow-lg',
            body: 'text-amber-100/85',
            arrow: 'text-white/80',
        },
    };

    const paletteItem = palette[tone];

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
                'group relative flex h-full min-h-[208px] flex-col justify-between gap-6 overflow-hidden px-6 py-6 text-white focus:outline-none transition-all duration-300 hover:-translate-y-1.5',
                paletteItem.surface,
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <span className={cn('glass-ring inline-flex items-center rounded-xl p-3', paletteItem.icon)}>
                    <Icon className="size-5" />
                </span>
                <ChevronRight
                    className={cn(
                        'size-5 transition-transform duration-300 group-hover:translate-x-1.5',
                        paletteItem.arrow,
                    )}
                />
            </div>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
                <p className={cn('text-sm leading-relaxed', paletteItem.body)}>{description}</p>
            </div>
        </GlassTile>
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

    const quickActions = [
        {
            title: isZh ? '發布公告' : 'Create Post',
            description: isZh ? '新增公告、新聞或活動資訊' : 'Publish announcements, news, or events',
            href: '/admin/posts/create',
            icon: Megaphone,
            tone: 'indigo' as QuickTone,
        },
        {
            title: isZh ? '管理師資' : 'Manage Faculty',
            description: isZh ? '新增或編輯教師與行政人員資料' : 'Maintain faculty and staff records',
            href: '/admin/staff',
            icon: UserCheck,
            tone: 'emerald' as QuickTone,
        },
        {
            title: isZh ? '實驗室設定' : 'Lab Settings',
            description: isZh ? '更新實驗室資訊與成員' : 'Update lab profiles and members',
            href: '/admin/labs',
            icon: Beaker,
            tone: 'violet' as QuickTone,
        },
        {
            title: isZh ? '課程管理' : 'Course Management',
            description: isZh ? '設定課程資訊與學分' : 'Manage course catalog and credits',
            href: '/admin/courses',
            icon: BookOpen,
            tone: 'amber' as QuickTone,
        },
        {
            title: isZh ? '學程規劃' : 'Program Planning',
            description: isZh ? '維護學位學程與模組' : 'Maintain program blueprints',
            href: '/admin/programs',
            icon: GraduationCap,
            tone: 'indigo' as QuickTone,
        },
        {
            title: isZh ? '使用者管理' : 'User Management',
            description: isZh ? '調整權限與審核新帳號' : 'Adjust permissions and review new users',
            href: '/admin/users',
            icon: Users,
            tone: 'emerald' as QuickTone,
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
            surface: 'bg-gradient-to-br from-[#eef2ff] via-white to-[#f8faff] border-indigo-200/70 text-indigo-700 shadow-indigo-100/80',
            chip: 'bg-indigo-100 text-indigo-700',
            iconColor: 'text-indigo-500',
        },
        {
            icon: Users,
            label: isZh ? '待審核使用者' : 'Pending approvals',
            count: 1,
            surface: 'bg-gradient-to-br from-[#fff8eb] via-white to-white border-amber-200/70 text-amber-700 shadow-amber-100/80',
            chip: 'bg-amber-100 text-amber-700',
            iconColor: 'text-amber-500',
        },
        {
            icon: ShieldCheck,
            label: isZh ? '權限調整請求' : 'Permission requests',
            count: 2,
            surface: 'bg-gradient-to-br from-[#ecfeff] via-white to-white border-cyan-200/70 text-cyan-700 shadow-cyan-100/80',
            chip: 'bg-cyan-100 text-cyan-700',
            iconColor: 'text-cyan-600',
        },
    ];

    const upcomingSchedule = [
        {
            icon: Calendar,
            label: isZh ? '系務會議' : 'Faculty council',
            time: isZh ? '明日下午 14:00' : 'Tomorrow • 2:00 PM',
            surface: 'bg-gradient-to-br from-white via-[#eef2ff] to-white border-indigo-200/60 text-indigo-700',
            subtle: 'text-indigo-500/80',
            iconColor: 'text-indigo-500',
        },
        {
            icon: Clock,
            label: isZh ? '課程公告排程' : 'Course bulletin release',
            time: isZh ? '週五上午 09:00' : 'Friday • 9:00 AM',
            surface: 'bg-gradient-to-br from-white via-[#fff7ed] to-white border-amber-200/60 text-amber-700',
            subtle: 'text-amber-500/80',
            iconColor: 'text-amber-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isZh ? '管理後台' : 'Dashboard'} />

            <section className={heroLayout.section}>
                <div className={cn(heroLayout.container, heroLayout.wrapper)}>
                    <div className={cn(heroLayout.surfaces?.base, heroLayout.primary)}>
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
                        <div className="flex flex-wrap gap-3">
                            {kpiSummary.map((item) => (
                                <GlassTile
                                    key={item.label}
                                    shimmer
                                    float="slow"
                                    className="min-w-[160px] px-4 py-3 text-sm text-white/85 backdrop-blur-sm"
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
                            <div className="flex flex-col gap-3 text-sm text-white/80">
                                <Link
                                    href="/admin/posts/create"
                                    className="glass-chip inline-flex items-center gap-2 bg-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                                >
                                    <Megaphone className="size-4" />
                                    {isZh ? '快速發布公告' : 'Compose bulletin'}
                                </Link>
                                <Link
                                    href="/admin/contact-messages"
                                    className="glass-chip inline-flex items-center gap-2 bg-white/10 px-5 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/18"
                                >
                                    <Inbox className="size-4" />
                                    {isZh ? '查看收件匣' : 'Review inbox'}
                                </Link>
                            </div>
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
                        tone="indigo"
                    />
                    <StatCard
                        title={isZh ? '師資人數' : 'Faculty members'}
                        value="25"
                        icon={UserCheck}
                        trend={isZh ? '年度新增 3 名' : '+3 new this year'}
                        tone="emerald"
                    />
                    <StatCard
                        title={isZh ? '實驗室數' : 'Laboratories'}
                        value="12"
                        icon={Beaker}
                        tone="violet"
                    />
                    <StatCard
                        title={isZh ? '開設課程' : 'Courses offered'}
                        value="156"
                        icon={BookOpen}
                        trend={isZh ? '本學期 +8 門' : '+8 this semester'}
                        tone="amber"
                    />
                </div>
            </section>

            <section className={quickActionsLayout.section}>
                <div className={cn(quickActionsLayout.container, 'space-y-6 w-full')}>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">
                                {isZh ? '快速操作' : 'Quick actions'}
                            </h2>
                            <p className="text-sm text-neutral-500">
                                {isZh
                                    ? '常用管理任務整理於此，協助您迅速完成日常工作。'
                                    : 'Access the most common management tasks without digging through menus.'}
                            </p>
                        </div>
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40"
                        >
                            {isZh ? '檢視完整控制台' : 'Open full control center'}
                            <ChevronRight className="size-4" />
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
                                <h3 className="text-lg font-semibold text-neutral-900 md:text-xl">
                                    {isZh ? '最新公告摘要' : 'Recent bulletin highlights'}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    {isZh ? '檢視最新置頂與近期公告' : 'Stay synced with the latest published updates.'}
                                </p>
                            </div>
                            <Link
                                href="/admin/posts"
                                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/15"
                            >
                                {isZh ? '查看全部' : 'View all'}
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                        <ol className={cn(activityLayout.surfaces?.timeline, 'space-y-6')}>
                            {recentBulletins.map((item) => (
                                <li key={item.id} className={cn('pl-6', activityLayout.surfaces?.timelineItem)}>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={`/admin/posts/${item.id}`}
                                            className="text-base font-semibold text-neutral-900 transition hover:text-primary"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
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
                            <h3 className="text-lg font-semibold text-neutral-900">
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
                            <h3 className="text-lg font-semibold text-neutral-900">
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
