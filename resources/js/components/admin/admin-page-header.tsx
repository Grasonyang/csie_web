import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import { Children, type ReactNode } from 'react';

interface AdminPageHeaderProps {
    title: ReactNode;
    description?: ReactNode;
    icon?: LucideIcon | ReactNode;
    actions?: ReactNode | ReactNode[];
    className?: string;
    contentClassName?: string;
}

export default function AdminPageHeader({
    title,
    description,
    icon,
    actions,
    className,
    contentClassName,
}: AdminPageHeaderProps) {
    const iconContent = (() => {
        if (!icon) {
            return null;
        }

        if (typeof icon === 'function') {
            const IconComponent = icon as LucideIcon;
            return <IconComponent className="h-8 w-8 sm:h-10 sm:w-10" />;
        }

        return icon;
    })();

    const actionNodes = Children.toArray(actions);

    return (
        <header
            className={cn(
                'relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151f54] via-[#1f2a6d] to-[#050a30] text-white shadow-lg ring-1 ring-white/10',
                className
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff24_0%,transparent_55%)] opacity-70" />

            <div
                className={cn(
                    'relative flex flex-col gap-6 px-6 py-8 sm:px-8 md:px-10',
                    contentClassName
                )}
            >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                        {iconContent && (
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[0_12px_30px_-15px_rgba(21,31,84,0.95)] sm:size-16">
                                {iconContent}
                            </div>
                        )}

                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                                {title}
                            </h1>
                            {description ? (
                                <p className="max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
                                    {description}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {actionNodes.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3">
                            {actionNodes}
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
