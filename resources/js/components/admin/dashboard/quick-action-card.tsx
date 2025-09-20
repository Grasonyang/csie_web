import { cn } from '@/lib/utils';
import { palettes, type DashboardTone } from '@/styles/layout-system';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type { ComponentType } from 'react';
import { getDashboardToneStyle } from './tone-styles';

const brand = palettes.brand;

export interface QuickActionCardProps {
    title: string;
    description: string;
    href: string;
    icon: ComponentType<any>;
    tone?: DashboardTone;
    className?: string;
}

export function QuickActionCard({ title, description, href, icon: Icon, tone = 'primary', className }: QuickActionCardProps) {
    const toneStyle = getDashboardToneStyle(tone);

    return (
        <Link
            href={href}
            prefetch
            className={cn(
                'group relative flex h-full min-h-[208px] flex-col justify-between gap-6 rounded-3xl px-6 py-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg',
                brand.surface,
                brand.border,
                brand.textPrimary,
                brand.focusRing,
                toneStyle.borderColor,
                className,
            )}
        >
            <span className={cn('absolute inset-x-6 top-0 h-1 rounded-full', toneStyle.indicator)} aria-hidden />
            <div className="flex items-start justify-between">
                <span className={cn('inline-flex items-center rounded-xl p-3 transition-colors duration-200', toneStyle.icon)}>
                    <Icon className="size-5" />
                </span>
                <ChevronRight
                    className={cn(
                        'size-5 transition-transform duration-200 group-hover:translate-x-1.5',
                        toneStyle.arrow,
                    )}
                />
            </div>
            <div className="space-y-3">
                <h3 className={cn('text-lg font-semibold tracking-tight', toneStyle.accent)}>{title}</h3>
                <p className={cn('text-sm leading-relaxed', brand.textMuted)}>{description}</p>
            </div>
        </Link>
    );
}
