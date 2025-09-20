import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ className = '', variant = 'dark' }: { className?: string; variant?: 'dark' | 'light' }) {
    const { locale } = usePage<SharedData>().props as SharedData & { locale: string };

    const isZh = locale?.toLowerCase() === 'zh-tw';
    const zhUrl = '/locale/zh-TW';
    const enUrl = '/locale/en';

    const isLight = variant === 'light';

    return (
        <div
            className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-sm backdrop-blur',
                isLight ? 'bg-white text-neutral-600 ring-1 ring-neutral-200' : 'bg-white/10 text-white/70',
                className,
            )}
        >
            <a
                href={zhUrl}
                className={cn(
                    'rounded-full px-2 py-1 transition',
                    isLight
                        ? isZh
                            ? 'bg-neutral-100 font-semibold text-neutral-700'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        : isZh
                            ? 'bg-white/25 font-semibold text-white'
                            : 'text-white/70 hover:bg-white/20 hover:text-white',
                )}
            >
                繁中
            </a>
            <span className={cn('px-1', isLight ? 'text-neutral-400' : 'text-white/40')}>/</span>
            <a
                href={enUrl}
                className={cn(
                    'rounded-full px-2 py-1 transition',
                    isLight
                        ? !isZh
                            ? 'bg-neutral-100 font-semibold text-neutral-700'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        : !isZh
                            ? 'bg-white/25 font-semibold text-white'
                            : 'text-white/70 hover:bg-white/20 hover:text-white',
                )}
            >
                EN
            </a>
        </div>
    );
}
