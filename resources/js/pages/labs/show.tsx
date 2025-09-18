import PublicLayout from '@/layouts/public-layout';
import useScrollReveal from '@/hooks/use-scroll-reveal';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Mail, Phone, Users } from 'lucide-react';

interface LocaleRecord {
    ['zh-TW']?: string | null;
    en?: string | null;
}

interface LabTeacher {
    id: number;
    name: LocaleRecord;
}

interface LabDetail {
    id: number;
    code?: string | null;
    name: LocaleRecord;
    description: LocaleRecord;
    cover_image_url?: string | null;
    website_url?: string | null;
    email?: string | null;
    phone?: string | null;
    teachers: LabTeacher[];
}

interface LabShowProps {
    lab: LabDetail;
}

function pickLocale(locale: string, record: LocaleRecord, fallback = ''): string {
    const primary = locale === 'zh-TW' ? record['zh-TW'] : record.en;
    const secondary = locale === 'zh-TW' ? record.en : record['zh-TW'];
    return (primary ?? secondary ?? fallback ?? '').toString();
}

export default function LabShow({ lab }: LabShowProps) {
    const page = usePage<SharedData>();
    const locale = page.props.locale ?? 'zh-TW';
    const isZh = locale.toLowerCase() === 'zh-tw';

    const name = pickLocale(isZh ? 'zh-TW' : 'en', lab.name, '');
    const description = pickLocale(isZh ? 'zh-TW' : 'en', lab.description, '');

    const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const infoRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
    const sidebarRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

    return (
        <PublicLayout>
            <Head title={name} />

            <section className="relative isolate overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={lab.cover_image_url ?? '/images/banner/banner2.png'}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />
                </div>
                <div className="relative z-10 section-padding" ref={heroRef}>
                    <div className="content-container flex flex-col gap-6 text-white">
                        <Link
                            href="/labs"
                            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-white transition hover:bg-white/20"
                        >
                            <ArrowLeft className="size-4" />
                            {isZh ? '返回實驗室列表' : 'Back to labs'}
                        </Link>
                        <div className="flex flex-col gap-4 md:max-w-3xl">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                                {isZh ? '研究實驗室' : 'Research Lab'}
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{name}</h1>
                            {description && <p className="text-sm text-white/80 md:text-base">{description}</p>}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                            {lab.code && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                    {isZh ? '代碼' : 'Code'} {lab.code}
                                </span>
                            )}
                            {lab.email && (
                                <a href={`mailto:${lab.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20">
                                    <Mail className="size-4" />
                                    {lab.email}
                                </a>
                            )}
                            {lab.phone && (
                                <a href={`tel:${lab.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20">
                                    <Phone className="size-4" />
                                    {lab.phone}
                                </a>
                            )}
                            {lab.website_url && (
                                <a
                                    href={lab.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20"
                                >
                                    {isZh ? '官方網站' : 'Official website'}
                                    <ArrowRight className="size-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="content-container grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
                    <article ref={infoRef} className="space-y-6">
                        <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-8 shadow-sm">
                            <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '實驗室介紹' : 'About the lab'}</h2>
                            <p className="mt-4 whitespace-pre-line text-neutral-700">{description || (isZh ? '內容更新中。' : 'Description coming soon.')}</p>
                        </div>

                        {lab.teachers.length > 0 && (
                            <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-8 shadow-sm">
                                <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '指導教授與成員' : 'Advisors & members'}</h2>
                                <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                                    {lab.teachers.map((teacher) => (
                                        <li key={teacher.id} className="flex items-center justify-between">
                                            <span>{pickLocale(isZh ? 'zh-TW' : 'en', teacher.name, '')}</span>
                                            <Link
                                                href={`/people?role=faculty&q=${encodeURIComponent(
                                                    pickLocale(isZh ? 'zh-TW' : 'en', teacher.name, ''),
                                                )}`}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                                            >
                                                {isZh ? '查看師資' : 'View profile'}
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </article>

                    <aside ref={sidebarRef} className="space-y-6">
                        <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '申請與合作' : 'Join & collaborate'}</h2>
                            <p className="mt-2 text-sm text-neutral-500">
                                {isZh
                                    ? '對研究主題或合作有興趣嗎？歡迎透過 Email 與指導老師聯繫，瞭解專題、論文、實習等機會。'
                                    : 'Interested in the research topics or collaboration? Contact the advisor to discuss thesis, projects, or internship opportunities.'}
                            </p>
                            <Link
                                href="/people?role=faculty"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                {isZh ? '查看師資列表' : 'Browse faculty list'}
                                <Users className="size-4" />
                            </Link>
                        </div>

                        {lab.website_url && (
                            <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '外部資源' : 'External resources'}</h2>
                                <a
                                    href={lab.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                                >
                                    {lab.website_url}
                                    <ArrowRight className="size-4" />
                                </a>
                            </div>
                        )}
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}
