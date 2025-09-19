import PublicLayout from '@/layouts/public-layout';
import useScrollReveal from '@/hooks/use-scroll-reveal';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    LinkIcon,
    Mail,
    MapPin,
    Phone,
    Users,
} from 'lucide-react';
import { isRichTextEmpty } from '@/lib/rich-text';

interface LocaleRecord {
    ['zh-TW']?: string | string[] | null;
    en?: string | string[] | null;
}

interface PersonLink {
    id: number;
    type: string;
    label?: string | null;
    url: string;
}

interface PersonDetail {
    id: number;
    role: 'faculty' | 'staff';
    name: LocaleRecord;
    title: LocaleRecord;
    email?: string | null;
    phone?: string | null;
    office?: string | null;
    photo_url?: string | null;
    bio?: LocaleRecord;
    expertise?: LocaleRecord;
    education?: LocaleRecord;
    labs?: Array<{
        code?: string | null;
        name: LocaleRecord;
    }>;
    links?: PersonLink[];
}

interface PeopleShowProps {
    person: PersonDetail;
}

function pickLocale(locale: string, record?: LocaleRecord, fallback = ''): string | string[] {
    if (!record) return fallback;
    const value = locale === 'zh-TW' ? record['zh-TW'] : record.en;
    const alt = locale === 'zh-TW' ? record.en : record['zh-TW'];
    return value ?? alt ?? fallback;
}

export default function PeopleShow({ person }: PeopleShowProps) {
    const page = usePage<SharedData>();
    const locale = page.props.locale ?? 'zh-TW';
    const isZh = locale.toLowerCase() === 'zh-tw';

    const name = pickLocale(isZh ? 'zh-TW' : 'en', person.name, '') as string;
    const title = pickLocale(isZh ? 'zh-TW' : 'en', person.title, '') as string;
    const bioHtml = pickLocale(isZh ? 'zh-TW' : 'en', person.bio, '') as string;
    const expertiseHtml = pickLocale(isZh ? 'zh-TW' : 'en', person.expertise, '') as string;
    const educationHtml = pickLocale(isZh ? 'zh-TW' : 'en', person.education, '') as string;

    const labs = (person.labs ?? []).map((lab) => ({
        code: lab.code,
        name: pickLocale(isZh ? 'zh-TW' : 'en', lab.name, '') as string,
    }));

    const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const contentRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
    const sidebarRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

    return (
        <PublicLayout>
            <Head title={name} />

            <section className="relative isolate overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-primary/40" />
                <div className="relative z-10 section-padding" ref={heroRef}>
                    <div className="content-container grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
                        <div className="space-y-6 text-white">
                            <Link
                                href="/people"
                                className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-white transition hover:bg-white/25"
                            >
                                <ArrowLeft className="size-4" />
                                {isZh ? '返回成員列表' : 'Back to directory'}
                            </Link>
                            <div className="space-y-4">
                                <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                                    {person.role === 'faculty' ? (isZh ? '專任師資' : 'Faculty') : isZh ? '行政團隊' : 'Staff'}
                                </span>
                                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{name}</h1>
                                <p className="text-lg font-medium text-white/80">{title}</p>
                                <div className="flex flex-wrap gap-3 text-sm text-white/80">
                                    {person.email && (
                                        <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 transition hover:bg-white/25">
                                            <Mail className="size-4" />
                                            {person.email}
                                        </a>
                                    )}
                                    {person.phone && (
                                        <a href={`tel:${person.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 transition hover:bg-white/25">
                                            <Phone className="size-4" />
                                            {person.phone}
                                        </a>
                                    )}
                                    {person.office && (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                                            <MapPin className="size-4" />
                                            {person.office}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="relative mx-auto h-72 w-72 overflow-hidden rounded-[2.5rem] border-4 border-white/40 shadow-xl">
                            <img
                                src={person.photo_url ?? '/images/placeholders/faculty.svg'}
                                alt={name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="content-container grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                    <article ref={contentRef} className="space-y-8">
                        {!isRichTextEmpty(bioHtml) && (
                            <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-8 shadow-sm">
                                <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '個人簡介' : 'Biography'}</h2>
                                <div
                                    className="mt-4 space-y-3 text-neutral-700 [&>p]:m-0 [&>p]:leading-relaxed [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline"
                                    dangerouslySetInnerHTML={{ __html: bioHtml }}
                                />
                            </div>
                        )}

                        {!isRichTextEmpty(expertiseHtml) && (
                            <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-8 shadow-sm">
                                <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '研究專長' : 'Expertise'}</h2>
                                <div
                                    className="mt-4 space-y-3 text-neutral-700 [&>p]:m-0 [&>p]:leading-relaxed [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline"
                                    dangerouslySetInnerHTML={{ __html: expertiseHtml }}
                                />
                            </div>
                        )}

                        {!isRichTextEmpty(educationHtml) && (
                            <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-8 shadow-sm">
                                <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '學歷' : 'Education'}</h2>
                                <div
                                    className="mt-4 space-y-3 text-neutral-700 [&>p]:m-0 [&>p]:leading-relaxed [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline"
                                    dangerouslySetInnerHTML={{ __html: educationHtml }}
                                />
                            </div>
                        )}

                        {labs.length > 0 && (
                            <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-8 shadow-sm">
                                <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '指導實驗室' : 'Affiliated Labs'}</h2>
                                <ul className="mt-4 space-y-2 text-neutral-700">
                                    {labs.map((lab, index) => (
                                        <li key={`lab-${index}`} className="flex items-center justify-between">
                                            <span>
                                                {lab.name}
                                                {lab.code ? ` · ${lab.code}` : ''}
                                            </span>
                                            <Link
                                                href={lab.code ? `/labs/${lab.code}` : '/labs'}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                                            >
                                                {isZh ? '查看' : 'View'}
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
                            <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '聯絡方式' : 'Contact'}</h2>
                            <div className="mt-4 space-y-3 text-sm text-neutral-600">
                                {person.email && (
                                    <a href={`mailto:${person.email}`} className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-primary">
                                        <Mail className="size-4" />
                                        {person.email}
                                    </a>
                                )}
                                {person.phone && (
                                    <a href={`tel:${person.phone}`} className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-primary">
                                        <Phone className="size-4" />
                                        {person.phone}
                                    </a>
                                )}
                                {person.office && (
                                    <div className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-primary">
                                        <MapPin className="size-4" />
                                        {person.office}
                                    </div>
                                )}
                            </div>
                        </div>

                        {person.links && person.links.length > 0 && (
                            <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '相關連結' : 'Links'}</h2>
                                <div className="mt-4 flex flex-col gap-3 text-sm">
                                    {person.links.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-primary transition hover:bg-primary/10"
                                        >
                                            <LinkIcon className="size-4" />
                                            {link.label ?? link.type}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rounded-3xl border border-neutral-200 bg-surface-soft p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-neutral-900">{isZh ? '更多成員' : 'More members'}</h2>
                            <p className="mt-2 text-sm text-neutral-500">
                                {isZh
                                    ? '探索更多系所成員與研究夥伴。'
                                    : 'Explore more faculty and staff profiles.'}
                            </p>
                            <Link
                                href="/people"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                {isZh ? '回成員列表' : 'Back to directory'}
                                <Users className="size-4" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}
