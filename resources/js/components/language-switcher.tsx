import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
    const { locale } = usePage<SharedData>().props as SharedData & { locale: string };

    const isZh = locale?.toLowerCase() === 'zh-tw';
    const zhUrl = '/locale/zh-TW';
    const enUrl = '/locale/en';

    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            <a href={zhUrl} className={`hover:underline ${isZh ? 'font-semibold' : 'opacity-70'}`}>繁中</a>
            <span className="opacity-50">/</span>
            <a href={enUrl} className={`hover:underline ${!isZh ? 'font-semibold' : 'opacity-70'}`}>EN</a>
        </div>
    );
}

