import PublicLayout from '@/layouts/public-layout';
import SectionHeader from '@/components/public/section-header';
import TopCarousel from '@/components/top-carousel';
import useScrollReveal from '@/hooks/use-scroll-reveal';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, Mail, Phone, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isRichTextEmpty } from '@/lib/rich-text';
import { getPageLayout } from '@/styles/page-layouts';
import { useRef } from 'react';

interface LocaleRecord {
    ['zh-TW']?: string | null;
    en?: string | null;
}

interface HeroSlide {
    image: string;
    headline: LocaleRecord;
    summary: LocaleRecord;
    href: string;
}

interface Statistic {
    key: string;
    label: LocaleRecord;
    value: number;
}

interface PostSummary {
    id: number;
    slug: string;
    title: LocaleRecord;
    summary: LocaleRecord;
    cover_image_url?: string | null;
    publish_at?: string | null;
    category?: {
        name: string;
        name_en: string;
        slug: string;
    } | null;
    pinned?: boolean;
}

interface LabSummary {
    id: number;
    code: string | null;
    name: LocaleRecord;
    cover_image_url?: string | null;
    description: LocaleRecord;
    teachers_count: number;
    website_url?: string | null;
}

interface TeacherSummary {
    id: number;
    slug?: string | null;
    name: LocaleRecord;
    title: LocaleRecord;
    photo_url?: string | null;
    expertise: LocaleRecord;
}

interface QuickLink {
    href: string;
    title: LocaleRecord;
    description: LocaleRecord;
}

interface ProjectSummary {
    id: number;
    code?: string | null;
    title: LocaleRecord;
    sponsor?: string | null;
    website_url?: string | null;
    start_date?: string | null;
    end_date?: string | null;
}

interface WelcomeProps {
    heroSlides: HeroSlide[];
    statistics: Statistic[];
    latestPosts: PostSummary[];
    featuredLabs: LabSummary[];
    spotlightTeachers: TeacherSummary[];
    quickLinks: QuickLink[];
    activeProjects: ProjectSummary[];
}

const FALLBACK_SLIDES: HeroSlide[] = [
    {
        image: '/images/banner/banner1.png',
        headline: {
            'zh-TW': '資訊工程新視野',
            en: 'Explore Computer Science Horizons',
        },
        summary: {
            'zh-TW': '掌握最新的人工智慧與資安趨勢，打造跨域創新人才。',
            en: 'Discover AI and cybersecurity trends and cultivate cross-domain innovators.',
        },
        href: '/bulletins',
    },
];

function pickLocale(locale: string, record?: LocaleRecord | null, fallback = ''): string {
    if (!record) return fallback;
    const primary = locale === 'zh-TW' ? record['zh-TW'] : record.en;
    const secondary = locale === 'zh-TW' ? record.en : record['zh-TW'];
    return (primary ?? secondary ?? fallback ?? '').toString();
}

export default function Welcome() {
    const page = usePage<SharedData & WelcomeProps>();
    const {
        heroSlides = [],
        statistics = [],
        latestPosts = [],
        featuredLabs = [],
        spotlightTeachers = [],
        quickLinks = [],
        activeProjects = [],
        locale = 'zh-TW',
    } = page.props;
    const { i18n } = page.props;

    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.home) ??
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ??
        fallback ??
        key;

    const isZh = (locale ?? 'zh-TW').toLowerCase() === 'zh-tw';
    const localeKey = isZh ? 'zh-TW' : 'en';
    const numberFormatter = new Intl.NumberFormat(isZh ? 'zh-TW' : 'en-US');
    const dateFormatter = new Intl.DateTimeFormat(isZh ? 'zh-TW' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const heroItems = (heroSlides.length ? heroSlides : FALLBACK_SLIDES).map((slide) => ({
        image: slide.image,
        title: pickLocale(localeKey, slide.headline, isZh ? '資訊工程學系' : 'Department of CSIE'),
        subtitle: pickLocale(localeKey, slide.summary, isZh ? '掌握最新系所動態與特色亮點。' : 'Stay current with departmental highlights.'),
        href: slide.href,
        cta: isZh ? '閱讀詳情' : 'View details',
    }));

    const heroInfoRef = useScrollReveal<HTMLDivElement>({ threshold: 0.25 });
    const heroCarouselRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const highlightsRef = useScrollReveal<HTMLDivElement>({ threshold: 0.18 });
    const quickLinksRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const labsRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const facultyRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const projectsRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const contactRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

    const layout = getPageLayout('welcome');
    const heroLayout = layout.hero!;
    const highlightsLayout = layout.sections.highlights;
    const quickLinksLayout = layout.sections.quickLinks;
    const labsLayout = layout.sections.labs;
    const facultyLayout = layout.sections.faculty;
    const projectsLayout = layout.sections.projects;
    const contactLayout = layout.sections.contact;

    const [primaryHighlight, ...moreHighlights] = latestPosts;
    const [featuredLab, ...remainingLabs] = featuredLabs;

    const timelinePosts = moreHighlights.slice(0, 4);
    const supportingLabs = remainingLabs.slice(0, 4);
    const teacherList = spotlightTeachers;
    const teacherSliderRef = useRef<HTMLDivElement | null>(null);
    const scrollTeachers = (direction: 'prev' | 'next') => {
        const container = teacherSliderRef.current;
        if (!container) return;
        const sampleCard = container.querySelector('[data-teacher-card]') as HTMLElement | null;
        const scrollAmount = sampleCard ? sampleCard.clientWidth + 24 : 320;
        container.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    };
    const hasTeachers = teacherList.length > 0;
    const formatDate = (value?: string | null) => (value ? dateFormatter.format(new Date(value)) : null);

    const highlightTitle = primaryHighlight ? pickLocale(localeKey, primaryHighlight.title, primaryHighlight.slug) : null;
    const highlightSummary = primaryHighlight ? pickLocale(localeKey, primaryHighlight.summary, '') : '';
    const highlightCategory = primaryHighlight?.category
        ? isZh
            ? primaryHighlight.category.name
            : primaryHighlight.category.name_en
        : undefined;
    const highlightDate = primaryHighlight?.publish_at ? formatDate(primaryHighlight.publish_at) : null;

    const quickLinkHighlights = isZh
        ? ['招生資訊與報名', '最新活動快訊', '學生常用資源', '系友服務與系務專區']
        : ['Admissions & applications', 'Event highlights', 'Student resources hub', 'Alumni and department services'];

    const quickLinkAccents = [
        'bg-gradient-to-r from-[#4dd5c8]/15 via-white/10 to-transparent',
        'bg-gradient-to-r from-[#fca311]/20 via-white/10 to-transparent',
        'bg-gradient-to-r from-white/18 via-white/6 to-transparent',
    ];

    const copy = isZh
        ? {
              heroEyebrow: 'NCUE CSIE',
              heroTitle: '打造企業與社會所需的資訊人才',
              heroDescription:
                  '結合理論、實務與跨領域合作，提供學生最新的 AI、資安、智慧製造等專業課程，培養具備國際視野的資訊人才。',
              highlightsTitle: '最新公告與焦點',
              highlightsDesc: '掌握招生訊息、活動快訊與重要公告，確保您不錯過任何系上動態。',
              quickLinksTitle: '常用服務入口',
              quickLinksDesc: '整合招生、活動與資源入口，快速找到您需要的資訊。',
              labsTitle: '研究實驗室亮點',
              labsDesc: '從人工智慧、資安到智慧物聯網，探索多元的研究領域與實驗室成果。',
              teachersTitle: '師資陣容',
              teachersDesc: '結合產學經驗的專業師資，為學生打造高品質的學習環境。',
              projectsTitle: '產學合作夥伴',
              projectsDesc: '與產業夥伴攜手推動創新研究與人才培育，持續擴大合作影響力。',
              contactTitle: '聯絡我們',
              contactDesc: '有招生、合作、校友服務需求，歡迎透過以下方式與我們聯繫。',
              contactCta: '預約參訪',
          }
        : {
              heroEyebrow: 'NCUE CSIE',
              heroTitle: 'Empowering Future-ready Tech Leaders',
              heroDescription:
                  'Experience AI, cybersecurity, and smart manufacturing curricula that combine theory, real-world practices, and interdisciplinary collaboration.',
              highlightsTitle: 'Latest Highlights',
              highlightsDesc: 'Keep up with admission news, events, and key announcements from the department.',
              quickLinksTitle: 'Quick Access',
              quickLinksDesc: 'Centralized entry points for admission, events, and student resources.',
              labsTitle: 'Featured Research Labs',
              labsDesc: 'Explore diverse research domains from AI to smart IoT and discover lab achievements.',
              teachersTitle: 'Faculty Spotlight',
              teachersDesc: 'Meet our distinguished faculty who bring academic excellence and industry insights.',
              projectsTitle: 'Industry Partnerships',
              projectsDesc: 'Collaborating with industry partners to drive innovation and talent cultivation.',
              contactTitle: 'Get in Touch',
              contactDesc: 'Reach out for admission, collaboration, or alumni services and book a campus visit.',
              contactCta: 'Book a visit',
          };

    return (
        <PublicLayout>
            <Head title={isZh ? '資訊工程學系' : 'Department of CSIE'}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=noto-serif-tc:400,500,600" rel="stylesheet" />
            </Head>

            {/* Hero */}
            <section id="about" className={heroLayout.section}>
                <div className={cn(heroLayout.container, heroLayout.wrapper)}>
                    <div ref={heroInfoRef} className={cn(heroLayout.surfaces?.primary, heroLayout.primary)}>
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                            {copy.heroEyebrow}
                        </span>
                        <h1 className="text-4xl font-semibold text-gradient-brand md:text-6xl">{copy.heroTitle}</h1>
                        <p className="max-w-xl text-base text-neutral-600 md:text-lg">{copy.heroDescription}</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {statistics.length > 0 ? (
                                statistics.map((stat) => {
                                    const label = pickLocale(localeKey, stat.label, stat.key);
                                    return (
                                        <div
                                            key={stat.key}
                                            className="glass-panel flex flex-col gap-2 rounded-2xl p-5 text-neutral-50 shadow-lg"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(21,31,84,0.85), rgba(21,31,84,0.55))',
                                            }}
                                        >
                                            <span className="text-sm text-white/70">{label}</span>
                                            <span className="text-3xl font-semibold tracking-tight md:text-4xl">
                                                {numberFormatter.format(stat.value)}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="glass-panel rounded-2xl p-5 text-sm text-white/80">
                                    {isZh ? '統計數據更新中。' : 'Statistics will be updated soon.'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div ref={heroCarouselRef} className={cn(heroLayout.surfaces?.secondary, heroLayout.secondary)}>
                        <div className="relative h-[320px] w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-primary/10 md:h-[420px]">
                            <TopCarousel className="h-full" items={heroItems} />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {quickLinkHighlights.slice(0, 4).map((text, index) => (
                                <div
                                    key={text}
                                    className={cn(
                                        'flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 p-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-primary/40 hover:text-primary',
                                        quickLinkAccents[index % quickLinkAccents.length],
                                    )}
                                >
                                    <ArrowRight className="size-4 shrink-0 text-primary" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest bulletins */}
            <section id="highlights" className={highlightsLayout.section}>
                <div ref={highlightsRef} className={cn(highlightsLayout.container, 'space-y-10')}>
                    <SectionHeader
                        eyebrow={isZh ? '最新訊息' : 'Highlights'}
                        title={copy.highlightsTitle}
                        description={copy.highlightsDesc}
                    />
                    {latestPosts.length > 0 ? (
                        <div className={cn(highlightsLayout.wrapper)}>
                            {primaryHighlight && (
                                <Link
                                    key={primaryHighlight.id}
                                    href={`/bulletins/${primaryHighlight.slug}`}
                                    className={cn(
                                        'group relative flex min-h-[320px] flex-col overflow-hidden rounded-[2.5rem] shadow-[0_30px_95px_-65px_rgba(7,12,42,0.8)] ring-1 ring-white/20',
                                        highlightsLayout.surfaces?.feature,
                                    )}
                                >
                                    <img
                                        src={primaryHighlight.cover_image_url ?? '/images/banner/banner1.png'}
                                        alt={highlightTitle ?? primaryHighlight.slug}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#050f2e]/85 via-[#0f1c4d]/45 to-transparent" />
                                    <div className="relative z-10 flex flex-1 flex-col justify-end gap-4 p-8 text-white sm:p-10">
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                                            {highlightCategory && (
                                                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 font-medium uppercase tracking-[0.2em]">
                                                    {highlightCategory}
                                                </span>
                                            )}
                                            {highlightDate && (
                                                <span className="inline-flex items-center gap-2">
                                                    <CalendarDays className="size-4" />
                                                    {highlightDate}
                                                </span>
                                            )}
                                            {primaryHighlight.pinned && (
                                                <span className="inline-flex items-center rounded-full bg-secondary/25 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground/90">
                                                    {isZh ? '置頂' : 'Pinned'}
                                                </span>
                                            )}
                                        </div>
                                        {highlightTitle && <h3 className="text-3xl font-semibold leading-tight md:text-4xl">{highlightTitle}</h3>}
                                        {highlightSummary && (
                                            <p className="max-w-2xl text-sm text-white/80 md:text-base line-clamp-3">{highlightSummary}</p>
                                        )}
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80">
                                            {isZh ? '閱讀全文' : 'Read article'}
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            )}

                            <div className={cn(highlightsLayout.secondary)}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-neutral-900">
                                        {isZh ? '最新消息' : 'Latest updates'}
                                    </h3>
                                    <Link
                                        href="/bulletins"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                                    >
                                        {isZh ? '更多公告' : 'View all'}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                                {timelinePosts.length > 0 ? (
                                    <ol className={cn(highlightsLayout.surfaces?.timeline, 'space-y-6')}>
                                        {timelinePosts.map((post) => {
                                            const title = pickLocale(localeKey, post.title, post.slug);
                                            const summary = pickLocale(localeKey, post.summary, '');
                                            const categoryLabel = post.category
                                                ? isZh
                                                    ? post.category.name
                                                    : post.category.name_en
                                                : undefined;
                                            const publishDate = post.publish_at ? formatDate(post.publish_at) : null;

                                            return (
                                                <li key={post.id} className={cn('pl-6', highlightsLayout.surfaces?.timelineItem)}>
                                                    <div className="flex flex-col gap-1.5">
                                                        <Link
                                                            href={`/bulletins/${post.slug}`}
                                                            className="text-base font-semibold text-neutral-900 transition hover:text-primary"
                                                        >
                                                            {title}
                                                        </Link>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                                            {categoryLabel && (
                                                                <span className="mr-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                                                                    {categoryLabel}
                                                                </span>
                                                            )}
                                                            {publishDate && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <CalendarDays className="size-3" />
                                                                    {publishDate}
                                                                </span>
                                                            )}
                                                            {post.pinned && (
                                                                <span className="inline-flex items-center rounded-full bg-secondary/25 px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground/80">
                                                                    {isZh ? '置頂' : 'Pinned'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {summary && <p className="text-sm text-neutral-600 line-clamp-2">{summary}</p>}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-primary/20 bg-white/60 p-6 text-sm text-neutral-500">
                                        {isZh ? '更多公告即將更新，敬請期待。' : 'More announcements are on the way.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-white/70 p-12 text-center text-neutral-500">
                            {isZh ? '公告資訊更新中，敬請期待。' : 'Bulletin updates will be published shortly.'}
                        </div>
                    )}
                </div>
            </section>

            {/* Quick links */}
            <section className={quickLinksLayout.section}>
                <div ref={quickLinksRef} className={cn(quickLinksLayout.container, 'space-y-10')}>
                    <SectionHeader
                        eyebrow={isZh ? '快速入口' : 'Shortcuts'}
                        title={copy.quickLinksTitle}
                        description={copy.quickLinksDesc}
                    />
                    <div className={cn('grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]', quickLinksLayout.wrapper)}>
                        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-[#060d29]/95 p-10 text-white shadow-[0_40px_120px_-60px_rgba(6,13,41,0.85)]">
                            <span className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#4dd5c8]/25 blur-3xl" aria-hidden />
                            <span className="pointer-events-none absolute bottom-0 right-[-120px] h-80 w-80 rounded-full bg-[#fca311]/20 blur-3xl" aria-hidden />
                            <div className="relative flex flex-col gap-6">
                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                                    {isZh ? '服務導覽' : 'Service Hub'}
                                </span>
                                <h3 className="text-3xl font-semibold md:text-4xl">{copy.quickLinksTitle}</h3>
                                <p className="max-w-xl text-sm text-white/75 md:text-base">{copy.quickLinksDesc}</p>
                                <ul className="grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                                    {quickLinkHighlights.slice(0, 4).map((item, index) => (
                                        <li key={`quick-highlight-${index}`} className="flex items-center gap-2">
                                            <span className="size-2.5 rounded-full bg-secondary/80" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                    {isZh ? '向下滑動選擇適合您的入口' : 'Scroll to pick the entry that fits you'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {quickLinks.length > 0 ? (
                                quickLinks.map((link, index) => {
                                    const title = pickLocale(localeKey, link.title, link.href);
                                    const description = pickLocale(localeKey, link.description, '');
                                    const accent = quickLinkAccents[index % quickLinkAccents.length];

                                    return (
                                        <Link
                                            key={`${link.href}-${index}`}
                                            href={link.href}
                                            className={cn(quickLinksLayout.surfaces?.tile, accent)}
                                        >
                                            <span className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white/80">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="flex flex-1 flex-col gap-1">
                                                <span className="text-lg font-semibold md:text-xl">{title}</span>
                                                {description && <p className="text-sm text-white/70 line-clamp-2">{description}</p>}
                                            </div>
                                            <ArrowRight className="size-5 text-white/70 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="rounded-3xl border border-dashed border-white/20 bg-white/60 p-8 text-center text-sm text-neutral-600">
                                    {isZh ? '快速入口建置中，敬請期待。' : 'Quick links are coming soon.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Labs */}
            <section id="labs" className={labsLayout.section}>
                <div ref={labsRef} className={cn(labsLayout.container, 'space-y-10')}>
                    <SectionHeader
                        eyebrow={isZh ? '研究亮點' : 'Research'}
                        title={copy.labsTitle}
                        description={copy.labsDesc}
                    />
                    {featuredLab ? (
                        <div className={cn(labsLayout.wrapper)}>
                            <div className={cn(labsLayout.primary)}>
                                <Link
                                    href={featuredLab.code ? `/labs/${featuredLab.code}` : '/labs'}
                                    className={cn(
                                        'group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2.5rem] border border-primary/15 bg-[#060d29] text-white shadow-[0_38px_110px_-60px_rgba(8,12,36,0.9)]',
                                        labsLayout.surfaces?.feature,
                                    )}
                                >
                                    <img
                                        src={featuredLab.cover_image_url ?? '/images/placeholders/lab.svg'}
                                        alt={pickLocale(localeKey, featuredLab.name, `Lab ${featuredLab.id}`)}
                                        className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.05]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#050f2e]/85 via-[#0f1c4d]/50 to-transparent" />
                                    <div className="relative z-10 flex flex-1 flex-col justify-end gap-4 p-10">
                                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                                            {featuredLab.code ?? (isZh ? '研究團隊' : 'Research Lab')}
                                        </span>
                                        <h3 className="text-3xl font-semibold md:text-4xl">
                                            {pickLocale(localeKey, featuredLab.name, `Lab ${featuredLab.id}`)}
                                        </h3>
                                        <p className="max-w-2xl text-sm text-white/75 md:text-base line-clamp-4">
                                            {pickLocale(localeKey, featuredLab.description, '')}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                                            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
                                                {isZh
                                                    ? `${featuredLab.teachers_count} 位指導教授`
                                                    : `${featuredLab.teachers_count} faculty mentors`}
                                            </span>
                                            {featuredLab.website_url && (
                                                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1">
                                                    {featuredLab.website_url.replace(/^https?:\/\//, '')}
                                                </span>
                                            )}
                                        </div>
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80">
                                            {isZh ? '探索實驗室' : 'Explore the lab'}
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                                <div className={cn('grid gap-4 sm:grid-cols-2', labsLayout.surfaces?.grid)}>
                                    {supportingLabs.length > 0 ? (
                                        supportingLabs.map((lab, index) => {
                                            const name = pickLocale(localeKey, lab.name, `Lab ${lab.id}`);
                                            const description = pickLocale(localeKey, lab.description, '');
                                            const href = lab.code ? `/labs/${lab.code}` : '/labs';
                                            const isEven = index % 2 === 0;

                                            return (
                                                <Link
                                                    key={lab.id}
                                                    href={href}
                                                    className={cn(
                                                        'group relative flex min-h-[180px] flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white/80 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
                                                        isEven ? 'sm:col-span-2' : 'sm:col-span-1',
                                                        labsLayout.surfaces?.card,
                                                    )}
                                                >
                                                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                                                        {lab.code ?? (isZh ? '研究團隊' : 'Lab')}
                                                    </span>
                                                    <h4 className="mt-2 text-lg font-semibold text-neutral-900">{name}</h4>
                                                    {description && (
                                                        <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{description}</p>
                                                    )}
                                                    <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
                                                        <span>
                                                            {isZh
                                                                ? `${lab.teachers_count} 位合作教師`
                                                                : `${lab.teachers_count} mentors`}
                                                        </span>
                                                        <ArrowRight className="size-4 text-primary/60 transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="rounded-3xl border border-dashed border-primary/20 bg-white/70 p-8 text-center text-sm text-neutral-600 sm:col-span-2">
                                            {isZh ? '更多實驗室資訊即將發布。' : 'More lab profiles are coming soon.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-white/70 p-12 text-center text-neutral-500">
                            {isZh ? '實驗室資訊更新中，敬請期待。' : 'Lab information is coming soon.'}
                        </div>
                    )}
                </div>
            </section>

            {/* Faculty roster */}
            <section id="faculty" className={facultyLayout.section}>
                <div ref={facultyRef} className={cn(facultyLayout.container, facultyLayout.wrapper)}>
                    <SectionHeader
                        eyebrow={isZh ? '教學團隊' : 'Faculty'}
                        title={copy.teachersTitle}
                        description={copy.teachersDesc}
                    />
                    {hasTeachers ? (
                        <div className={cn(facultyLayout.primary)}>
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <p className="text-sm text-neutral-600">
                                    {isZh
                                        ? `目前收錄 ${teacherList.length} 位專任師資`
                                        : `Featuring ${teacherList.length} faculty members`}
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    {teacherList.length > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => scrollTeachers('prev')}
                                                className={cn(facultyLayout.surfaces?.navButton)}
                                                aria-label={isZh ? '上一組師資' : 'Scroll previous faculty cards'}
                                            >
                                                <ChevronLeft className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => scrollTeachers('next')}
                                                className={cn(facultyLayout.surfaces?.navButton)}
                                                aria-label={isZh ? '下一組師資' : 'Scroll next faculty cards'}
                                            >
                                                <ChevronRight className="size-4" />
                                            </button>
                                        </div>
                                    )}
                                    <Link
                                        href="/people"
                                        className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40"
                                    >
                                        {isZh ? '瀏覽全部師資' : 'Browse all faculty'}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div ref={teacherSliderRef} className={cn(facultyLayout.surfaces?.track)}>
                                    {teacherList.map((teacher) => {
                                        const name = pickLocale(localeKey, teacher.name, '');
                                        const title = pickLocale(localeKey, teacher.title, '');
                                        const expertise = pickLocale(localeKey, teacher.expertise, '');
                                        const hasExpertise = !isRichTextEmpty(expertise);
                                        const profileHref = teacher.slug ? `/people/${teacher.slug}` : '/people';

                                        return (
                                            <Link
                                                key={`${teacher.id}-${name}`}
                                                href={profileHref}
                                                data-teacher-card
                                                className={cn(
                                                    facultyLayout.surfaces?.card,
                                                    'group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                                                        {teacher.photo_url ? (
                                                            <img
                                                                src={teacher.photo_url}
                                                                alt={name}
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            name.charAt(0)
                                                        )}
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-semibold text-neutral-900">{name}</span>
                                                        {title && (
                                                            <span className="text-xs uppercase tracking-[0.25em] text-primary/70">{title}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {hasExpertise && (
                                                    <div
                                                        className="mt-4 line-clamp-3 text-sm text-neutral-600 [&>p]:m-0 [&>p]:leading-relaxed [&_ul]:my-1 [&_ul]:list-disc [&_ol]:my-1 [&_ol]:list-decimal [&_li]:ml-5 [&_a]:text-primary [&_a]:underline"
                                                        dangerouslySetInnerHTML={{ __html: expertise }}
                                                    />
                                                )}
                                                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                                    {isZh ? '詳細介紹' : 'View profile'}
                                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-white/70 p-12 text-center text-neutral-500">
                            {isZh ? '師資資料更新中。' : 'Faculty profiles will be updated soon.'}
                        </div>
                    )}
                </div>
            </section>

            {/* Projects / Partners */}
            <section id="partners" className={projectsLayout.section}>
                <div ref={projectsRef} className={cn(projectsLayout.container, 'space-y-10')}>
                    <SectionHeader
                        eyebrow={isZh ? '產學合作' : 'Partnerships'}
                        title={copy.projectsTitle}
                        description={copy.projectsDesc}
                    />
                    {activeProjects.length > 0 ? (
                        <div className={cn(projectsLayout.primary)}>
                            <ul className="divide-y divide-primary/10">
                                {activeProjects.map((project) => {
                                    const title = pickLocale(localeKey, project.title, project.code ?? '');
                                    const duration = project.start_date
                                        ? project.end_date
                                            ? `${formatDate(project.start_date)} - ${formatDate(project.end_date)}`
                                            : `${formatDate(project.start_date)} - ${isZh ? '進行中' : 'Ongoing'}`
                                        : undefined;
                                    const href = project.website_url ?? '#';
                                    const isExternal = project.website_url && project.website_url.startsWith('http');
                                    const sponsor = project.sponsor ?? (isZh ? '合作單位' : 'Partner');
                                    const body = (
                                        <div className={cn(projectsLayout.surfaces?.tableRow)}>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">{sponsor}</span>
                                                <h3 className="text-lg font-semibold text-neutral-900 md:text-xl">{title}</h3>
                                            </div>
                                            <div className="text-sm text-neutral-500">
                                                {duration ?? (isZh ? '期間資訊更新中' : 'Timeline coming soon')}
                                            </div>
                                            <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-primary">
                                                {isExternal ? (isZh ? '前往網站' : 'Visit site') : isZh ? '了解計畫' : 'View details'}
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    );

                                    return (
                                        <li key={project.id}>
                                            {isExternal ? (
                                                <a href={href} target="_blank" rel="noopener noreferrer">
                                                    {body}
                                                </a>
                                            ) : (
                                                <div>{body}</div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-white/70 p-12 text-center text-neutral-500">
                            {isZh ? '合作計畫更新中。' : 'Partnership updates coming soon.'}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className={contactLayout.section}>
                <div className={cn(contactLayout.container)}>
                    <div
                        ref={contactRef}
                        className={cn(
                            contactLayout.wrapper,
                            'card-elevated rounded-3xl p-10 shadow-2xl backdrop-blur md:grid-cols-[2fr,1fr] gap-8',
                        )}
                    >
                        <div className="flex flex-col gap-4">
                            <h2 className="text-3xl font-semibold text-neutral-900">{copy.contactTitle}</h2>
                            <p className="text-neutral-600">{copy.contactDesc}</p>
                            <div className="grid gap-4 text-sm text-neutral-700 md:grid-cols-2">
                                <a href="tel:+886-4-7232105" className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-primary">
                                    <Phone className="size-4" />
                                    <span>+886-4-723-2105</span>
                                </a>
                                <a href="mailto:csie@ncue.edu.tw" className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-primary">
                                    <Mail className="size-4" />
                                    <span>csie@ncue.edu.tw</span>
                                </a>
                                <div className="flex items-start gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-primary">
                                    <MapPin className="size-4" />
                                    <span>50074 彰化市進德路一段1號 理學院大樓</span>
                                </div>
                                <Link href="/people" className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-primary">
                                    <Users className="size-4" />
                                    <span>{isZh ? '聯繫單位分機列表' : 'Department contacts'}</span>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 rounded-3xl bg-primary text-primary-foreground p-8">
                            <div>
                                <span className="text-sm uppercase tracking-[0.35em] text-white/70">{copy.heroEyebrow}</span>
                                <h3 className="mt-3 text-2xl font-semibold">{isZh ? '安排校園參訪' : 'Schedule a campus tour'}</h3>
                                <p className="mt-2 text-sm text-white/80">
                                    {isZh
                                        ? '歡迎高中師生、企業夥伴與校友預約參訪，深入了解教學場域與研究成果。'
                                        : 'Educators, partners, and alumni are welcome to book a visit and experience our facilities.'}
                                </p>
                            </div>
                            <a
                                href="mailto:csie@ncue.edu.tw?subject=Campus%20Visit%20Request"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary hover:text-neutral-900"
                            >
                                {copy.contactCta}
                                <ArrowRight className="size-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
