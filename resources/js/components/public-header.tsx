import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import LanguageSwitcher from './language-switcher';
import FloatingNav from '@/components/floating-nav';
import { Mail, MapPin, Phone, Search, ArrowRight, GraduationCap, Users } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface NavChild {
    key: string;
    label: string;
    description?: string;
    href: string;
}

interface NavGroup {
    key: string;
    label: string;
    href: string;
    description?: string;
    children?: NavChild[];
}

export default function PublicHeader() {
    const page = usePage<SharedData & { i18n: any; auth: any }>();
    const { auth, i18n } = page.props;

    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ??
        fallback ??
        key;

    const navGroups: NavGroup[] = [
        {
            key: 'about',
            label: t('nav.about', '關於系所'),
            href: '#about',
            description: t('nav.about_description', '了解系所願景與學習環境'),
            children: [
                {
                    key: 'about-overview',
                    label: t('nav.about_overview', '系所簡介'),
                    description: t('nav.about_overview_desc', '我們的願景、使命與發展重點'),
                    href: '#about',
                },
                {
                    key: 'about-highlights',
                    label: t('nav.about_highlights', '特色亮點'),
                    description: t('nav.about_highlights_desc', '卓越教學成果與跨域合作'),
                    href: '#highlights',
                },
                {
                    key: 'about-partnership',
                    label: t('nav.about_partnership', '產學合作'),
                    description: t('nav.about_partnership_desc', '與業界攜手培育人才'),
                    href: '#partners',
                },
            ],
        },
        {
            key: 'people',
            label: t('nav.people', '師資團隊'),
            href: '/people',
            description: t('nav.people_description', '探索師資與行政團隊的背景'),
            children: [
                {
                    key: 'people-faculty',
                    label: t('people.faculty', '專任師資'),
                    description: t('nav.people_faculty_desc', '查看教授、教師陣容'),
                    href: '/people?role=faculty',
                },
                {
                    key: 'people-staff',
                    label: t('people.staff', '行政團隊'),
                    description: t('nav.people_staff_desc', '了解系所行政與專業助理'),
                    href: '/people?role=staff',
                },
            ],
        },
        {
            key: 'research',
            label: t('nav.research', '研究實驗室'),
            href: '/labs',
            description: t('nav.research_description', '掌握實驗室研究主題與成果'),
            children: [
                {
                    key: 'research-labs',
                    label: t('nav.labs', '全部實驗室'),
                    description: t('nav.research_labs_desc', '探索資訊工程各領域的研究團隊'),
                    href: '/labs',
                },
            ],
        },
        {
            key: 'bulletins',
            label: t('nav.bulletin', '公告訊息'),
            href: '/bulletins',
            description: t('nav.bulletin_description', '掌握最新公告、活動與招生資訊'),
        },
        {
            key: 'contact',
            label: t('nav.contact', '聯絡我們'),
            href: '#contact',
            description: t('nav.contact_description', '招生、合作與校友服務窗口'),
        },
    ];

    const mobileNav = navGroups.flatMap((group) => [
        { key: group.key, href: group.href, label: group.label },
        ...(group.children?.map((child) => ({ key: child.key, href: child.href, label: `- ${child.label}` })) ?? []),
    ]);

    const isAuthenticated = Boolean(auth?.user);

    return (
        <header className="relative z-50">
            <div className="bg-gradient-to-r from-[#172a6f] via-[#1f3d97] to-[#2744ac] text-white shadow-[0_10px_28px_-16px_rgba(16,32,93,0.55)]">
                <div className="content-container flex flex-col gap-3 py-3 text-xs md:flex-row md:items-center md:justify-between md:text-sm">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span className="flex items-center gap-2 opacity-90">
                            <MapPin className="size-4" />
                            <span>Changhua, Taiwan</span>
                        </span>
                        <a className="flex items-center gap-2 opacity-90 transition hover:opacity-100" href="tel:+886-4-7232105">
                            <Phone className="size-4" />
                            <span>+886-4-723-2105</span>
                        </a>
                        <a className="flex items-center gap-2 opacity-90 transition hover:opacity-100" href="mailto:csie@ncue.edu.tw">
                            <Mail className="size-4" />
                            <span>csie@ncue.edu.tw</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs ring-white/40 backdrop-blur md:flex">
                            <Search className="size-4 opacity-80" />
                            <input
                                type="search"
                                placeholder={t('search', '搜尋')}
                                className="w-40 bg-transparent text-white placeholder:text-white/60 focus:outline-none"
                                aria-label={t('search', '搜尋')}
                            />
                        </div>
                        <LanguageSwitcher />
                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-medium transition hover:border-white hover:bg-white/10"
                            >
                                {t('auth.dashboard', 'Dashboard')}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-medium transition hover:border-white hover:bg-white/10"
                            >
                                {t('auth.login', 'Login')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/95 shadow-[0_16px_36px_-26px_rgba(22,41,99,0.4)] backdrop-blur">
                <div className="content-container flex items-center gap-6 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-primary/25">
                                <img
                                    src="/images/ncue-csie-logo.png"
                                    alt={t('site.title_short', 'CSIE')}
                                    className="h-11 w-11 object-contain"
                                />
                            </div>
                            <div className="flex flex-col leading-tight text-neutral-800">
                            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-primary/70">
                                {t('site.university', 'National Changhua University of Education')}
                            </span>
                            <span className="text-xl font-bold text-neutral-900 md:text-2xl">
                                {t('site.title_full', 'Department of CSIE')}
                            </span>
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden flex-1 items-center justify-end lg:flex">
                        <NavigationMenu className="justify-end" viewport>
                            <NavigationMenuList className="gap-1.5">
                                {navGroups.map((group) => (
                                    <NavigationMenuItem key={group.key}>
                                        {group.children && group.children.length > 0 ? (
                                            <>
                                                <NavigationMenuTrigger className="rounded-full bg-transparent px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-primary/10 hover:text-primary focus-visible:ring-primary/40">
                                                    {group.label}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent className="bg-transparent backdrop-blur">
                                                    <div className="grid min-w-[28rem] gap-3 rounded-3xl bg-gradient-to-br from-white/96 to-slate-50/90 p-6 shadow-lg md:min-w-[32rem]">
                                                        {group.description && (
                                                            <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4 text-sm text-neutral-600">
                                                                <ArrowRight className="mt-0.5 size-4 text-primary" />
                                                                <p>{group.description}</p>
                                                            </div>
                                                        )}
                                                        <div className="grid gap-2">
                                                            {group.children.map((child) => (
                                                                <NavigationMenuLink asChild key={child.key}>
                                                                    <Link
                                                                        href={child.href}
                                                                        className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                                                    >
                                                                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                                            {child.key.includes('faculty') ? (
                                                                                <Users className="size-4" />
                                                                            ) : child.key.includes('labs') ? (
                                                                                <GraduationCap className="size-4" />
                                                                            ) : (
                                                                                <ArrowRight className="size-4" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-col gap-1 text-sm">
                                                                            <span className="font-semibold text-neutral-800">
                                                                                {child.label}
                                                                            </span>
                                                                            {child.description && (
                                                                                <span className="text-neutral-500">
                                                                                    {child.description}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={group.href}
                                                    className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        'rounded-full bg-transparent px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-primary/10 hover:text-primary focus-visible:ring-primary/40',
                                                    )}
                                                >
                                                    {group.label}
                                                </Link>
                                            </NavigationMenuLink>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                                <NavigationMenuIndicator />
                            </NavigationMenuList>
                            <NavigationMenuViewport className="bg-white/95 backdrop-blur" />
                        </NavigationMenu>
                    </nav>

                    <div className="ml-auto flex items-center gap-3 lg:hidden">
                        <button
                            type="button"
                            className="flex size-11 items-center justify-center rounded-full border border-primary/25 bg-white text-primary shadow-lg transition hover:border-primary/40 hover:shadow-2xl"
                            onClick={() => {
                                const searchInput = document.querySelector<HTMLInputElement>('header input[type="search"]');
                                searchInput?.focus();
                            }}
                            aria-label={t('search', '搜尋')}
                        >
                            <Search className="size-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:hidden">
                <FloatingNav nav={mobileNav} />
            </div>
        </header>
    );
}
