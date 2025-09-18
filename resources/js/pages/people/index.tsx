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

interface PersonSummary {
    id: number;
    slug: string;
    role: 'faculty' | 'staff';
    name: LocaleRecord;
    title: LocaleRecord;
    email?: string | null;
    phone?: string | null;
    office?: string | null;
    photo_url?: string | null;
    expertise?: LocaleRecord;
    bio?: LocaleRecord;
    labs?: Array<{
        code?: string | null;
        name: LocaleRecord;
    }>;
}

interface PeopleIndexProps {
    people: PersonSummary[];
    filters: {
        role?: 'faculty' | 'staff';
        q?: string;
    };
    statistics?: {
        faculty?: number;
        staff?: number;
    };
}

const FALLBACK_IMAGE = '/images/placeholder/faculty.png';

function pickLocale(locale: string, value?: LocaleRecord, fallback = ''): string {
    if (!value) return fallback;
    const primary = locale === 'zh-TW' ? value['zh-TW'] : value.en;
    const secondary = locale === 'zh-TW' ? value.en : value['zh-TW'];
    return (primary ?? secondary ?? fallback ?? '').toString();
}

function toTags(text: string, limit = 3): string[] {
    return text
        .split(/[,\n\r]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, limit);
}

export default function PeopleIndex({ people, filters, statistics }: PeopleIndexProps) {
    const page = usePage<SharedData>();
    const locale = page.props.locale ?? 'zh-TW';
    const isZh = locale.toLowerCase() === 'zh-tw';

    const [searchValue, setSearchValue] = useState(filters.q ?? '');

    const facultyCount = statistics?.faculty ?? people.filter((p) => p.role === 'faculty').length;
    const staffCount = statistics?.staff ?? people.filter((p) => p.role === 'staff').length;

    const filteredPeople = useMemo(() => {
        if (!filters.role) return people;
        return people.filter((person) => person.role === filters.role);
    }, [people, filters.role]);

    const applyFilters = (overrides: Partial<{ role?: 'faculty' | 'staff' | null; q?: string | null }>) => {
        const query = {
            ...(filters.role ? { role: filters.role } : {}),
            ...(filters.q ? { q: filters.q } : {}),
            ...overrides,
        };

        Object.keys(query).forEach((key) => {
            if (!query[key as keyof typeof query]) {
                delete query[key as keyof typeof query];
            }
        });

        router.get('/people', query, {
            preserveScroll: true,
            replace: true,
        });
    };

    const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const directoryRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

    const onSubmitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        applyFilters({ q: searchValue || null });
    };

    return (
        <PublicLayout>
            <Head title={isZh ? '系所成員' : 'People'} />

            <section className="section-padding bg-[var(--surface-muted)]">
                <div ref={heroRef} className="content-container space-y-6">
                    <div className="grid gap-6 rounded-3xl bg-surface-panel p-8 shadow-lg backdrop-blur lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                        <div className="space-y-4">
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                                {isZh ? '師資與行政' : 'People'}
                            </span>
                            <h1 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
                                {isZh ? '專業師資與行政團隊' : 'Our Faculty & Staff'}
                            </h1>
                            <p className="max-w-2xl text-neutral-600">
                                {isZh
                                    ? '結合教學與行政專業，提供學生完善的學習支援與國際級研究環境。'
                                    : 'A collaborative academic and administrative team dedicated to supporting students and driving impactful research.'}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="glass-panel rounded-2xl px-5 py-3 text-white" style={{ background: 'linear-gradient(135deg, rgba(21,31,84,0.9), rgba(21,31,84,0.6))' }}>
                                    <span className="text-xs uppercase tracking-[0.25em] text-white/70">{isZh ? '專任師資' : 'Faculty'}</span>
                                    <p className="text-2xl font-semibold">{facultyCount}</p>
                                </div>
                                <div className="glass-panel rounded-2xl px-5 py-3 text-white" style={{ background: 'linear-gradient(135deg, rgba(255,180,1,0.8), rgba(255,214,99,0.6))' }}>
                                    <span className="text-xs uppercase tracking-[0.25em] text-white/70">{isZh ? '行政團隊' : 'Staff'}</span>
                                    <p className="text-2xl font-semibold">{staffCount}</p>
                                </div>
                            </div>
                        </div>
                        <form
                            onSubmit={onSubmitSearch}
                            className="flex h-full flex-col justify-center gap-4 rounded-[2rem] border border-neutral-200 bg-surface-soft p-6 shadow-sm"
                        >
                            <span className="text-sm font-medium text-neutral-500">{isZh ? '搜尋與篩選' : 'Search & filters'}</span>
                            <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2">
                                <Search className="size-5 text-primary" />
                                <input
                                    type="search"
                                    value={searchValue}
                                    onChange={(event) => setSearchValue(event.target.value)}
                                    placeholder={isZh ? '輸入姓名、專長或職稱' : 'Name, expertise, or title'}
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
                            <div className="flex flex-wrap gap-2 text-sm">
                                <button
                                    type="button"
                                    onClick={() => applyFilters({ role: null })}
                                    className={`rounded-full px-4 py-2 transition ${
                                        !filters.role ? 'bg-primary text-white shadow' : 'bg-surface-soft text-neutral-600 shadow'
                                    }`}
                                >
                                    {isZh ? '全部成員' : 'All'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyFilters({ role: 'faculty' })}
                                    className={`rounded-full px-4 py-2 transition ${
                                        filters.role === 'faculty' ? 'bg-primary text-white shadow' : 'bg-surface-soft text-neutral-600 shadow'
                                    }`}
                                >
                                    {isZh ? '專任師資' : 'Faculty'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyFilters({ role: 'staff' })}
                                    className={`rounded-full px-4 py-2 transition ${
                                        filters.role === 'staff' ? 'bg-primary text-white shadow' : 'bg-surface-soft text-neutral-600 shadow'
                                    }`}
                                >
                                    {isZh ? '行政團隊' : 'Staff'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div ref={directoryRef} className="content-container space-y-8">
                    <SectionHeader
                        eyebrow={isZh ? '成員列表' : 'Directory'}
                        title={isZh ? '系所成員' : 'Department Directory'}
                        description={
                            filters.role
                                ? isZh
                                    ? `目前顯示「${filters.role === 'faculty' ? '專任師資' : '行政團隊'}」成員。`
                                    : `Currently showing ${filters.role === 'faculty' ? 'faculty' : 'staff'} members.`
                                : isZh
                                ? '包含專任師資與行政團隊，點擊卡片可查看詳細資料。'
                                : 'Browse our faculty and staff. Select a profile to view detailed information.'
                        }
                    />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredPeople.map((person) => {
                            const name = pickLocale(isZh ? 'zh-TW' : 'en', person.name, '');
                            const title = pickLocale(isZh ? 'zh-TW' : 'en', person.title, '');
                            const expertiseText = pickLocale(isZh ? 'zh-TW' : 'en', person.expertise, '');
                            const expertiseTags = expertiseText ? toTags(expertiseText) : [];
                            const labs = (person.labs ?? []).map((lab) => ({
                                code: lab.code,
                                name: pickLocale(isZh ? 'zh-TW' : 'en', lab.name, ''),
                            }));

                            return (
                                <Link
                                    key={person.slug}
                                    href={`/people/${person.slug}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-surface-soft shadow-sm hover-lift"
                                >
                                    <div className="relative h-52 overflow-hidden bg-primary/5">
                                        <img
                                            src={person.photo_url ?? FALLBACK_IMAGE}
                                            alt={name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-700">
                                            {person.role === 'faculty' ? (isZh ? '師資' : 'Faculty') : isZh ? '行政' : 'Staff'}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col gap-4 p-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-neutral-900">{name}</h2>
                                            <p className="text-sm text-neutral-500">{title}</p>
                                        </div>
                                        {(person.email || person.phone || person.office) && (
                                            <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                                                {person.email && (
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-primary">
                                                        <Mail className="size-3" />
                                                        {person.email}
                                                    </span>
                                                )}
                                                {person.phone && (
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-primary">
                                                        <Phone className="size-3" />
                                                        {person.phone}
                                                    </span>
                                                )}
                                                {person.office && (
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-primary">
                                                        <MapPin className="size-3" />
                                                        {person.office}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {expertiseTags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                                                {expertiseTags.map((tag, index) => (
                                                    <span
                                                        key={`${person.slug}-tag-${index}`}
                                                        className="rounded-full bg-neutral-100 px-3 py-1"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {labs.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
                                                <Users className="size-4" />
                                                {labs.map((lab, index) => (
                                                    <span key={`${person.slug}-lab-${index}`}>
                                                        {lab.code ? `${lab.code}` : ''} {lab.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary/80">
                                            {isZh ? '查看詳情' : 'View profile'}
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {filteredPeople.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-neutral-200 bg-surface-soft p-12 text-center text-neutral-500">
                                {isZh ? '沒有符合條件的成員。' : 'No members matched your filters.'}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
