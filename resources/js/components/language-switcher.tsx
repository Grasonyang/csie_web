import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
    const { locale } = usePage<SharedData>().props as SharedData & { locale: string };

    const isZh = locale?.toLowerCase() === 'zh-tw';
    const zhUrl = '/locale/zh-TW';
    const enUrl = '/locale/en';

    return (
        <div className={cn('flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-sm text-white/70 backdrop-blur', className)}>
            <a
                href={zhUrl}
                className={cn(
                    'rounded-full px-2 py-1 transition hover:bg-white/20 hover:text-white',
                    isZh ? 'bg-white/25 font-semibold text-white' : 'text-white/70',
                )}
            >
                繁中
            </a>
            <span className="px-1 text-white/40">/</span>
            <a
                href={enUrl}
                className={cn(
                    'rounded-full px-2 py-1 transition hover:bg-white/20 hover:text-white',
                    !isZh ? 'bg-white/25 font-semibold text-white' : 'text-white/70',
                )}
            >
                EN
            </a>
        </div>
    );
}
