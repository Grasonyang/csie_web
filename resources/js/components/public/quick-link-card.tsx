import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export interface QuickLinkCardProps {
    title: string;
    description?: string;
    href: string;
    icon?: ReactNode;
    className?: string;
    badge?: string;
    ctaLabel?: string;
}

export function QuickLinkCard({ title, description, href, icon, className, badge, ctaLabel }: QuickLinkCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                'group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-surface-soft p-6 shadow-lg shadow-slate-900/5 transition-all hover:border-primary/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 hover-lift',
                className,
            )}
        >
            <div className="flex items-start gap-4">
                {icon && (
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                        {icon}
                    </div>
                )}
                <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground md:text-xl">{title}</h3>
                        {badge && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {badge}
                            </span>
                        )}
                    </div>
                    {description && <p className="text-sm text-neutral-600 md:text-base">{description}</p>}
                </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary/80">
                <span>{ctaLabel ?? '了解更多'}</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </div>
        </Link>
    );
}

export default QuickLinkCard;
