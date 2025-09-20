import { cn } from '@/lib/utils';
import { palettes, type DashboardTone } from '@/styles/layout-system';
import { TrendingUp } from 'lucide-react';
import type { ComponentType } from 'react';
import { getDashboardToneStyle } from './tone-styles';

const brand = palettes.brand;

export interface StatCardProps {
    title: string;
    value: string;
    icon: ComponentType<any>;
    trend?: string;
    tone?: DashboardTone;
    className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, tone = 'primary', className }: StatCardProps) {
    const toneStyle = getDashboardToneStyle(tone);

    return (
        <article
            className={cn(
                'relative overflow-hidden rounded-3xl px-6 py-6 shadow-sm transition-shadow duration-200 hover:shadow-md',
                brand.surface,
                brand.border,
                brand.textPrimary,
                toneStyle.borderColor,
                className,
            )}
        >
            <span className={cn('absolute inset-x-6 top-0 h-1 rounded-full', toneStyle.indicator)} aria-hidden />
            <span
                className={cn(
                    'pointer-events-none absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full blur-3xl',
                    toneStyle.soft,
                )}
                aria-hidden
            />
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <p className={cn('text-xs font-semibold uppercase tracking-[0.32em]', brand.textMuted)}>{title}</p>
                    <p className="text-4xl font-semibold text-[#151f54] md:text-5xl">{value}</p>
                    {trend && (
                        <span
                            className={cn(
                                'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                                toneStyle.chip,
                            )}
                        >
                            <TrendingUp className="size-3" />
                            {trend}
                        </span>
                    )}
                </div>
                <span className={cn('inline-flex items-center justify-center rounded-2xl p-3', toneStyle.icon)}>
                    <Icon className="size-5" />
                </span>
            </div>
        </article>
    );
}
