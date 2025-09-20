import { QuickActionCard, type QuickActionCardProps } from '@/components/admin/dashboard/quick-action-card';
import { StatCard } from '@/components/admin/dashboard/stat-card';
import { getDashboardToneStyle } from '@/components/admin/dashboard/tone-styles';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPageLayout } from '@/styles/page-layouts';
import { palettes, type DashboardTone } from '@/styles/layout-system';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ChevronRight, Clock, Eye } from 'lucide-react';
import type { ComponentType } from 'react';

const brandPalette = palettes.brand;

export type HeroActionVariant = 'primary' | 'secondary';

export type HeroAction = {
    label: string;
    href: string;
    icon: ComponentType<any>;
    variant?: HeroActionVariant;
};

function DashboardHeroActions({ actions }: { actions?: HeroAction[] }) {
    if (!actions?.length) return null;
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

export type TaskSummaryItemConfig = {
    icon: ComponentType<any>;
    label: string;
    count: number;
    tone: DashboardTone;
};

export type ScheduleItemConfig = {
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
            <span className={cn('inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold', toneStyle.chip)}>
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

export default function DashboardTemplate({
    breadcrumbs = [],
    isZh,
    title = isZh ? '管理後台' : 'Dashboard',
    kpiSummary = [],
    heroActions = [],
    statCards = [],
    quickActions = [],
    recentBulletins = [],
    taskSummary = [],
    upcomingSchedule = [],
}: {
    breadcrumbs?: BreadcrumbItem[];
    isZh: boolean;
    title?: string;
    kpiSummary: { label: string; value: string; trend?: string }[];
    heroActions?: HeroAction[];
    statCards: { title: string; value: string; icon: ComponentType<any>; trend?: string; tone?: DashboardTone }[];
    quickActions: QuickActionCardProps[];
    recentBulletins: { id: number | string; title: string; time: string; views: number; date: string }[];
    taskSummary: TaskSummaryItemConfig[];
    upcomingSchedule: ScheduleItemConfig[];
}) {
    const layout = getPageLayout('dashboard');
    const heroLayout = layout.hero!;
    const metricsLayout = layout.sections.metrics;
    const quickActionsLayout = layout.sections.quickActions;
    const activityLayout = layout.sections.activity;

    return (
        <>
            <Head title={title} />

            {/* Hero */}
            <section className={heroLayout.section}>
                <div className={cn(heroLayout.container, heroLayout.wrapper)}>
                    <div className={cn(heroLayout.surfaces?.base, heroLayout.primary)}>
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-1 flex-col gap-6">
                                <div className="space-y-4">
                                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d5dcf8] bg-[#f4f6ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#3d4a87]">
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
                                            className={cn('flex w-full flex-col gap-1 rounded-2xl px-5 py-4 shadow-sm', brandPalette.surface, brandPalette.border)}
                                        >
                                            <p className={cn('text-xs font-semibold uppercase tracking-[0.35em]', brandPalette.textMuted)}>{item.label}</p>
                                            <p className="text-xl font-semibold text-[#151f54]">{item.value}</p>
                                            {item.trend && <span className={cn('text-xs font-medium', brandPalette.textMuted)}>{item.trend}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <DashboardHeroActions actions={heroActions} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics */}
            <section className={metricsLayout.section}>
                <div className={cn(metricsLayout.container, metricsLayout.wrapper)}>
                    {statCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className={quickActionsLayout.section}>
                <div className={cn(quickActionsLayout.container, 'space-y-6 w-full')}>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-[#151f54] md:text-2xl">{isZh ? '快速操作' : 'Quick actions'}</h2>
                            <p className="text-sm text-slate-600">
                                {isZh ? '常用管理任務整理於此，協助您迅速完成日常工作。' : 'Access the most common management tasks without digging through menus.'}
                            </p>
                        </div>
                        <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-[#151f54]/20 bg-white px-4 py-2 text-sm font-medium text-[#151f54] transition hover:bg-[#eef1ff]">
                            {isZh ? '檢視完整控制台' : 'Open full control center'}
                            <ChevronRight className="size-4 text-current" />
                        </Link>
                    </div>
                    <div className={cn(quickActionsLayout.wrapper, 'grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr')}>
                        {quickActions.map((action) => (
                            <QuickActionCard key={action.href} {...action} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Activity */}
            <section className={activityLayout.section}>
                <div className={cn(activityLayout.container, activityLayout.wrapper)}>
                    <div className={cn(activityLayout.primary)}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-[#151f54] md:text-xl">{isZh ? '最新公告摘要' : 'Recent bulletin highlights'}</h3>
                                <p className="text-sm text-slate-600">{isZh ? '檢視最新置頂與近期公告' : 'Stay synced with the latest published updates.'}</p>
                            </div>
                            <Link href="/admin/posts" className="inline-flex items-center gap-2 rounded-full border border-[#151f54]/20 bg-white px-3 py-1 text-sm font-medium text-[#151f54] transition hover:bg-[#eef1ff]">
                                {isZh ? '查看全部' : 'View all'}
                                <ChevronRight className="size-4 text-current" />
                            </Link>
                        </div>
                        <ol className={cn(activityLayout.surfaces?.timeline, 'space-y-6')}>
                            {recentBulletins.map((item) => (
                                <li key={item.id} className={cn('pl-6', activityLayout.surfaces?.timelineItem)}>
                                    <div className="flex flex-col gap-2">
                                        <Link href={`/admin/posts/${item.id}`} className="text-base font-semibold text-[#151f54] transition hover:text-[#8a6300]">
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
                            <h3 className="text-lg font-semibold text-[#151f54]">{isZh ? '待處理事項' : 'Pending tasks'}</h3>
                            <div className="space-y-3">
                                {taskSummary.map((task) => (
                                    <TaskSummaryItem key={task.label} {...task} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#151f54]">{isZh ? '即將到來' : 'Upcoming schedule'}</h3>
                            <div className="space-y-3">
                                {upcomingSchedule.map((item) => (
                                    <UpcomingScheduleItem key={item.label} {...item} />
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
