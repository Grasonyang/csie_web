import PublicLayout from '@/layouts/public-layout';
import SectionHeader from '@/components/public/section-header';
import useScrollReveal from '@/hooks/use-scroll-reveal';
import type { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone, Search, Users } from 'lucide-react';

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

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredLabs.map((lab) => {
                            const name = pickLocale(isZh ? 'zh-TW' : 'en', lab.name, '');
                            const description = pickLocale(isZh ? 'zh-TW' : 'en', lab.description, '');
                            const href = lab.code ? `/labs/${lab.code}` : '/labs';

                            return (
                                <Link
                                    key={lab.id}
                                    href={href}
                                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-surface-soft shadow-sm hover-lift"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={lab.cover_image_url ?? '/images/banner/banner1.png'}
                                            alt={name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        {lab.code && (
                                            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700">
                                                {lab.code}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-4 p-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-neutral-900 transition group-hover:text-primary">{name}</h2>
                                            {description && (
                                                <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{description}</p>
                                            )}
                                        </div>
                                        {lab.teachers.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
                                                <Users className="size-4" />
                                                {lab.teachers.slice(0, 3).map((teacher) => (
                                                    <span key={`lab-${lab.id}-teacher-${teacher.id}`}>
                                                        {pickLocale(isZh ? 'zh-TW' : 'en', teacher.name, '')}
                                                    </span>
                                                ))}
                                                {lab.teachers.length > 3 && <span>+{lab.teachers.length - 3}</span>}
                                            </div>
                                        )}
                                        <div className="mt-auto flex flex-wrap gap-2 text-xs text-neutral-500">
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
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary/80">
                                            {isZh ? '查看實驗室' : 'View lab'}
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {filteredLabs.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-neutral-200 bg-surface-soft p-12 text-center text-neutral-500">
                                {isZh ? '沒有符合條件的實驗室。' : 'No labs match your filters.'}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
