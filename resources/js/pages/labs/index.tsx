import PublicLayout from '@/layouts/public-layout';
import SectionHeader from '@/components/public/section-header';
import useScrollReveal from '@/hooks/use-scroll-reveal';
import type { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowRight, Mail, Phone, Search, Users } from 'lucide-react';

interface LocaleRecord {
    ['zh-TW']?: string | null;
    en?: string | null;
}

interface LabSummary {
    id: number;
    code?: string | null;
    name: LocaleRecord;
    description: LocaleRecord;
    cover_image_url?: string | null;
    website_url?: string | null;
    email?: string | null;
    phone?: string | null;
    teachers: Array<{
        id: number;
        name: LocaleRecord;
    }>;
}

interface LabsIndexProps {
    labs: LabSummary[];
    filters?: {
        q?: string;
    };
}

function pickLocale(locale: string, record: LocaleRecord, fallback = ''): string {
    const primary = locale === 'zh-TW' ? record['zh-TW'] : record.en;
    const secondary = locale === 'zh-TW' ? record.en : record['zh-TW'];
    return (primary ?? secondary ?? fallback ?? '').toString();
}

export default function LabsIndex({ labs, filters }: LabsIndexProps) {
    const page = usePage<SharedData>();
    const locale = page.props.locale ?? 'zh-TW';
    const isZh = locale.toLowerCase() === 'zh-tw';
    const [searchValue, setSearchValue] = useState(filters?.q ?? '');

    const filteredLabs = useMemo(() => {
        if (!filters?.q) return labs;
        const keyword = filters.q.toLowerCase();
        return labs.filter((lab) => {
            const name = pickLocale(isZh ? 'zh-TW' : 'en', lab.name, '').toLowerCase();
            const desc = pickLocale(isZh ? 'zh-TW' : 'en', lab.description, '').toLowerCase();
            return name.includes(keyword) || desc.includes(keyword);
        });
    }, [labs, filters?.q, isZh]);

    const [primaryLab, ...secondaryLabs] = filteredLabs;

    const applyFilters = (query: { q?: string | null }) => {
        const params: Record<string, string> = {};
        if (query.q) params.q = query.q;
        router.get('/labs', params, {
            preserveScroll: true,
            replace: true,
        });
    };

    const onSubmitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        applyFilters({ q: searchValue || null });
    };

    const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const listRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

    return (
        <PublicLayout>
            <Head title={isZh ? '研究實驗室' : 'Research Labs'} />

            <section className="section-padding bg-[var(--surface-muted)]">
                <div ref={heroRef} className="content-container space-y-6">
                    <div className="grid gap-6 rounded-3xl bg-surface-panel p-8 shadow-lg backdrop-blur lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                        <div className="space-y-4">
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                                {isZh ? '研究中心' : 'Research'}
                            </span>
                            <h1 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
                                {isZh ? '探索資訊工程研究實驗室' : 'Discover Our Research Labs'}
                            </h1>
                            <p className="max-w-2xl text-neutral-600">
                                {isZh
                                    ? '涵蓋人工智慧、資安、嵌入式系統與智慧製造等領域，支持產學合作與跨域研究。'
                                    : 'Covering AI, cybersecurity, embedded systems, and smart manufacturing with strong industry collaboration.'}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                                <div className="glass-panel rounded-2xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg, rgba(21,31,84,0.9), rgba(21,31,84,0.6))' }}>
                                    <span className="text-xs uppercase tracking-[0.25em] text-white/70">{isZh ? '實驗室數' : 'Labs'}</span>
                                    <p className="text-2xl font-semibold">{labs.length}</p>
                                </div>
                                <div className="glass-panel rounded-2xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg, rgba(255,180,1,0.85), rgba(255,214,99,0.65))' }}>
                                    <span className="text-xs uppercase tracking-[0.25em] text-white/70">{isZh ? '合作指導教授' : 'Advisors'}</span>
                                    <p className="text-2xl font-semibold">
                                        {labs.reduce((total, lab) => total + lab.teachers.length, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={onSubmitSearch} className="flex flex-col justify-center gap-4 rounded-[2rem] border border-neutral-200 bg-surface-soft p-6 shadow-sm">
                            <span className="text-sm font-medium text-neutral-500">
                                {isZh ? '搜尋實驗室' : 'Search labs'}
                            </span>
                            <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2">
                                <Search className="size-5 text-primary" />
                                <input
                                    type="search"
                                    value={searchValue}
                                    onChange={(event) => setSearchValue(event.target.value)}
                                    placeholder={isZh ? '輸入實驗室名稱或關鍵字' : 'Lab name or keyword'}
                                    className="w-full bg-transparent text-sm outline-none"
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchValue('');
                                            applyFilters({ q: null });
                                        }}
                                        className="text-xs text-neutral-400 transition hover:text-primary"
                                    >
                                        {isZh ? '清除' : 'Clear'}
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                            >
                                {isZh ? '搜尋' : 'Search'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div ref={listRef} className="content-container space-y-8">
                    <SectionHeader
                        eyebrow={isZh ? '研究領域' : 'Research domains'}
                        title={isZh ? '實驗室列表' : 'Lab Directory'}
                        description={
                            filters?.q
                                ? isZh
                                    ? `顯示符合「${filters.q}」的實驗室。`
                                    : `Showing labs matching “${filters.q}”.`
                                : isZh
                                ? '選擇您感興趣的實驗室，了解研究主題與指導教授。'
                                : 'Select a lab to learn more about its research focus and advisors.'
                        }
                    />

                    {primaryLab ? (
                        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                            <Link
                                href={primaryLab.code ? `/labs/${primaryLab.code}` : '/labs'}
                                className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2.5rem] border border-primary/15 bg-[#060d29] text-white shadow-[0_36px_110px_-60px_rgba(8,13,36,0.85)]"
                            >
                                <img
                                    src={primaryLab.cover_image_url ?? '/images/placeholders/lab.svg'}
                                    alt={pickLocale(isZh ? 'zh-TW' : 'en', primaryLab.name, `Lab ${primaryLab.id}`)}
                                    className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-[1.05]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#050f2e]/88 via-[#0f1c4d]/45 to-transparent" />
                                <div className="relative z-10 flex flex-1 flex-col justify-end gap-5 p-10">
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 font-semibold uppercase tracking-[0.3em]">
                                            {primaryLab.code ?? (isZh ? '研究團隊' : 'Research Lab')}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1">
                                            {isZh
                                                ? `${primaryLab.teachers.length} 位合作教師`
                                                : `${primaryLab.teachers.length} faculty mentors`}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-semibold md:text-4xl">
                                        {pickLocale(isZh ? 'zh-TW' : 'en', primaryLab.name, `Lab ${primaryLab.id}`)}
                                    </h3>
                                    <p className="max-w-2xl text-sm text-white/75 md:text-base line-clamp-4">
                                        {pickLocale(isZh ? 'zh-TW' : 'en', primaryLab.description, '')}
                                    </p>
                                    {(primaryLab.email || primaryLab.phone) && (
                                        <div className="flex flex-wrap gap-3 text-xs text-white/70">
                                            {primaryLab.email && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                                                    <Mail className="size-3" />
                                                    {primaryLab.email}
                                                </span>
                                            )}
                                            {primaryLab.phone && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                                                    <Phone className="size-3" />
                                                    {primaryLab.phone}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {primaryLab.teachers.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                                            <Users className="size-4" />
                                            {primaryLab.teachers.slice(0, 4).map((teacher) => (
                                                <span key={teacher.id}>
                                                    {pickLocale(isZh ? 'zh-TW' : 'en', teacher.name, '')}
                                                </span>
                                            ))}
                                            {primaryLab.teachers.length > 4 && <span>+{primaryLab.teachers.length - 4}</span>}
                                        </div>
                                    )}
                                    <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80">
                                        {isZh ? '深入了解實驗室' : 'Discover this lab'}
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>

                            <div className="overflow-hidden rounded-[2.5rem] border border-primary/12 bg-white/85 shadow-[0_24px_70px_-48px_rgba(18,35,90,0.25)]">
                                {secondaryLabs.length > 0 ? (
                                    <ul className="divide-y divide-primary/10">
                                        {secondaryLabs.map((lab) => {
                                            const name = pickLocale(isZh ? 'zh-TW' : 'en', lab.name, '');
                                            const description = pickLocale(isZh ? 'zh-TW' : 'en', lab.description, '');
                                            const href = lab.code ? `/labs/${lab.code}` : '/labs';

                                            return (
                                                <li key={lab.id}>
                                                    <Link
                                                        href={href}
                                                        className="group grid gap-4 p-6 transition hover:bg-primary/5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
                                                    >
                                                        <span className="relative flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-primary/10 bg-primary/5">
                                                            <img
                                                                src={lab.cover_image_url ?? '/images/placeholders/lab.svg'}
                                                                alt={name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </span>
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-base font-semibold text-neutral-900 md:text-lg">{name}</span>
                                                            {lab.teachers.length > 0 && (
                                                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                                                    <Users className="size-4 text-primary" />
                                                                    {lab.teachers.slice(0, 3).map((teacher) => (
                                                                        <span key={teacher.id}>
                                                                            {pickLocale(isZh ? 'zh-TW' : 'en', teacher.name, '')}
                                                                        </span>
                                                                    ))}
                                                                    {lab.teachers.length > 3 && <span>+{lab.teachers.length - 3}</span>}
                                                                </div>
                                                            )}
                                                            {description && <p className="text-sm text-neutral-600 line-clamp-2">{description}</p>}
                                                            {(lab.email || lab.phone) && (
                                                                <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                                                                    {lab.email && (
                                                                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-primary">
                                                                            <Mail className="size-3" />
                                                                            {lab.email}
                                                                        </span>
                                                                    )}
                                                                    {lab.phone && (
                                                                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-primary">
                                                                            <Phone className="size-3" />
                                                                            {lab.phone}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <ArrowRight className="size-4 text-primary/60 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="p-8 text-center text-sm text-neutral-600">
                                        {isZh ? '僅顯示單一實驗室。' : 'Only one lab matches the filters.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-white/70 p-12 text-center text-neutral-500">
                            {isZh ? '沒有符合條件的實驗室。' : 'No labs match your filters.'}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
