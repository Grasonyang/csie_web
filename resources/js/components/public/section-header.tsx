import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: ReactNode;
    align?: 'left' | 'center';
    className?: string;
    actions?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, align = 'left', className, actions }: SectionHeaderProps) {
    return (
        <div
            className={cn(
                'section-header',
                align === 'center' && 'items-center text-center',
                align === 'left' && 'items-start text-left',
                className,
            )}
        >
            {eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
            <div className={cn('flex w-full flex-col gap-6 md:gap-8', align === 'center' && 'items-center')}>
                <div className="flex flex-col gap-3 md:gap-4">
                    <h2 className="section-header__title">{title}</h2>
                    {description && <div className="section-header__description">{description}</div>}
                </div>
                {actions && <div className={cn('flex flex-wrap gap-3', align === 'center' && 'justify-center')}>{actions}</div>}
            </div>
        </div>
    );
}

export default SectionHeader;
