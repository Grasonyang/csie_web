import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import LanguageSwitcher from './language-switcher';
import FloatingNav from '@/components/floating-nav';

export default function PublicHeader() {
    const page = usePage<SharedData & { i18n: any; auth: any }>();
    const { auth, i18n } = page.props;

    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;

    const nav = [
        { key: 'about', href: '#' },
        { key: 'people', href: '#' },
        { key: 'research', href: '#' },
        { key: 'courses', href: '#' },
        { key: 'education', href: '#' },
        { key: 'admission', href: '#' },
        { key: 'bulletin', href: '#' },
        { key: 'others', href: '#' },
    ];

    return (
        <>
        <header className="border-b bg-white text-neutral-800 relative z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <img
                        src="/images/ncue-csie-logo.png"
                        alt="Logo"
                        className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
                    />
                    <div className="min-w-0 leading-tight">
                        <div className="truncate max-w-[70vw] whitespace-nowrap text-lg font-bold tracking-wide sm:max-w-none sm:text-xl md:text-3xl">{t('site.university', 'University')}</div>
                        <div className="truncate text-sm font-medium opacity-80 sm:text-base md:text-lg">{t('site.title_full', 'Department of CSIE')}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    {auth?.user ? (
                        <Link href="/dashboard" className="text-sm hover:underline">
                            {t('auth.dashboard', 'Dashboard')}
                        </Link>
                    ) : (
                        <Link href="/login" className="text-sm hover:underline">
                            {t('auth.login', 'Login')}
                        </Link>
                    )}
                    <div className="hidden md:block"><LanguageSwitcher /></div>
                    <div className="hidden items-center rounded-md border px-2 py-1 text-sm md:flex">
                        <input
                            type="search"
                            placeholder={t('search', 'Search')}
                            className="w-48 md:w-64 bg-transparent outline-none placeholder:opacity-60"
                        />
                    </div>
                </div>
            </div>
            <nav className="mx-auto hidden max-w-7xl items-center gap-7 px-4 pb-4 lg:flex">
                {nav.map((item) => (
                    <a key={item.key} href={item.href} className="text-lg font-medium text-neutral-800 hover:text-black">
                        {t(`nav.${item.key}`, item.key)}
                    </a>
                ))}
            </nav>
        </header>
        <div className="lg:hidden">
            <FloatingNav nav={nav.map((n) => ({ ...n, label: t(`nav.${n.key}`, n.key) }))} />
        </div>
        </>
    );
}
