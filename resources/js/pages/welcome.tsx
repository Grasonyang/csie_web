import PublicLayout from '@/layouts/public-layout';
import SectionHeader from '@/components/public/section-header';
import { QuickLinkCard } from '@/components/public/quick-link-card';
import TopCarousel from '@/components/top-carousel';
import useScrollReveal from '@/hooks/use-scroll-reveal';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, MapPin, Mail, Phone, Users } from 'lucide-react';

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
}

interface LabSummary {
    id: number;
    code: string | null;
    name: LocaleRecord;
    cover_image_url?: string | null;
    description: LocaleRecord;
    teachers_count: number;
}

interface TeacherSummary {
    id: number;
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
            <section id="about" className="section-padding">
                <div className="content-container grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)] lg:items-center">
                    <div ref={heroInfoRef} className="flex flex-col gap-6">
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
                    <div
                        ref={heroCarouselRef}
                        className="relative h-[360px] overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-primary/10 md:h-[440px]"
                    >
                        <TopCarousel className="h-full" items={heroItems} />
                    </div>
                </div>
            </section>

            {/* Latest bulletins */}
            <section id="highlights" className="section-padding">
                <div ref={highlightsRef} className="content-container space-y-10">
                    <SectionHeader
                        eyebrow={isZh ? '最新訊息' : 'Highlights'}
                        title={copy.highlightsTitle}
                        description={copy.highlightsDesc}
                    />
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {latestPosts.map((post) => {
                            const title = pickLocale(localeKey, post.title, post.slug);
                            const summary = pickLocale(localeKey, post.summary);
                            const categoryLabel = post.category ? (isZh ? post.category.name : post.category.name_en) : undefined;
                            const publishDate = post.publish_at ? dateFormatter.format(new Date(post.publish_at)) : null;

                            return (
                                <Link
                                    key={post.id}
                                    href={`/bulletins/${post.slug}`}
                                    className="card-elevated group flex h-full flex-col gap-4 overflow-hidden p-6"
                                >
                                    {post.cover_image_url && (
                                        <div className="relative overflow-hidden rounded-2xl">
                                            <img
                                                src={post.cover_image_url}
                                                alt={title}
                                                className="h-44 w-full rounded-2xl object-cover transition duration-700 group-hover:scale-[1.05]"
                                            />
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent" />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                                            {categoryLabel && (
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                                                    {categoryLabel}
                                                </span>
                                            )}
                                            {publishDate && <span>{publishDate}</span>}
                                        </div>
                                        <h3 className="text-xl font-semibold text-neutral-900 transition group-hover:text-primary">
                                            {title}
                                        </h3>
                                        {summary && <p className="text-sm text-neutral-600">{summary}</p>}
                                    </div>
                                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary/80">
                                        {isZh ? '閱讀更多' : 'Read more'}
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            );
                        })}
                        {latestPosts.length === 0 && (
                            <div className="card-elevated flex flex-col items-center justify-center gap-3 p-8 text-center text-neutral-500">
                                <p>{isZh ? '目前沒有公告，敬請期待。' : 'No announcements available at the moment.'}</p>
                                <Link href="/bulletins" className="text-primary underline">
                                    {isZh ? '查看公告列表' : 'View all bulletins'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick links */}
            <section className="section-padding bg-[var(--surface-muted)]">
                <div ref={quickLinksRef} className="content-container space-y-10">
                    <SectionHeader
                        eyebrow={isZh ? '快速入口' : 'Shortcuts'}
                        title={copy.quickLinksTitle}
                        description={copy.quickLinksDesc}
                    />
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {quickLinks.map((link) => (
                            <QuickLinkCard
                                key={link.href}
                                href={link.href}
                                title={pickLocale(localeKey, link.title, link.href)}
                                description={pickLocale(localeKey, link.description)}
                                ctaLabel={isZh ? '前往' : 'Explore'}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Labs */}
            <section id="labs" className="section-padding">
                <div ref={labsRef} className="content-container space-y-10">
                    <SectionHeader
                        eyebrow={isZh ? '研究亮點' : 'Research'}
                        title={copy.labsTitle}
                        description={copy.labsDesc}
                    />
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {featuredLabs.map((lab) => {
                            const name = pickLocale(localeKey, lab.name, `Lab ${lab.id}`);
                            const description = pickLocale(localeKey, lab.description, '');
                            const href = lab.code ? `/labs/${lab.code}` : '/labs';
                            return (
                                <Link key={lab.id} href={href} className="card-elevated group flex h-full flex-col overflow-hidden">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={lab.cover_image_url ?? '/images/banner/banner2.png'}
                                            alt={name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900">
                                            {isZh ? `${lab.teachers_count} 位指導教授` : `${lab.teachers_count} faculty`}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col gap-3 p-6">
                                        <h3 className="text-lg font-semibold text-neutral-900 transition group-hover:text-primary">{name}</h3>
                                        {description && <p className="text-sm text-neutral-600 line-clamp-3">{description}</p>}
                                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary/80">
                                            {isZh ? '深入了解' : 'Discover more'}
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                        {featuredLabs.length === 0 && (
                            <div className="card-elevated flex items-center justify-center p-8 text-neutral-500">
                                {isZh ? '實驗室資訊更新中，敬請期待。' : 'Lab information is coming soon.'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Faculty spotlight */}
            <section id="faculty" className="section-padding bg-[var(--surface-muted)]">
                <div ref={facultyRef} className="content-container space-y-10">
                    <SectionHeader
                        eyebrow={isZh ? '教學團隊' : 'Faculty'}
                        title={copy.teachersTitle}
                        description={copy.teachersDesc}
                    />
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {spotlightTeachers.map((teacher) => {
                            const name = pickLocale(localeKey, teacher.name, '');
                            const title = pickLocale(localeKey, teacher.title, '');
                            const expertise = pickLocale(localeKey, teacher.expertise, '');
                            return (
                                <div key={teacher.id} className="card-elevated flex h-full flex-col overflow-hidden">
                                    <div className="relative h-48 overflow-hidden bg-primary/10">
                                        <img
                                            src={teacher.photo_url ?? '/images/placeholder/faculty.png'}
                                            alt={name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-3 p-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
                                            <p className="text-sm text-neutral-500">{title}</p>
                                        </div>
                                        {expertise && <p className="text-sm text-neutral-600 line-clamp-3">{expertise}</p>}
                                        <Link
                                            href="/people"
                                            className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary/80"
                                        >
                                            {isZh ? '查看師資' : 'View all faculty'}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                        {spotlightTeachers.length === 0 && (
                            <div className="card-elevated flex items-center justify-center p-8 text-neutral-500">
                                {isZh ? '師資資料更新中。' : 'Faculty spotlight will be updated soon.'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Projects / Partners */}
            <section id="partners" className="section-padding">
                <div ref={projectsRef} className="content-container space-y-10">
                    <SectionHeader
                        eyebrow={isZh ? '產學合作' : 'Partnerships'}
                        title={copy.projectsTitle}
                        description={copy.projectsDesc}
                    />
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {activeProjects.map((project) => {
                            const title = pickLocale(localeKey, project.title, project.code ?? '');
                            const duration = project.start_date
                                ? project.end_date
                                    ? `${dateFormatter.format(new Date(project.start_date))} - ${dateFormatter.format(new Date(project.end_date))}`
                                    : `${dateFormatter.format(new Date(project.start_date))} - ${isZh ? '進行中' : 'Ongoing'}`
                                : undefined;
                            const href = project.website_url ?? '#';
                            const isExternal = project.website_url && project.website_url.startsWith('http');
                            const content = (
                                <div className="card-soft flex h-full flex-col gap-4 rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-lg">
                                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">
                                        {project.sponsor ?? (isZh ? '合作單位' : 'Partner')}
                                    </span>
                                    <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                                    {duration && <p className="text-xs text-neutral-500">{duration}</p>}
                                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary/80">
                                        {isZh ? '瞭解計畫' : 'Explore project'}
                                        <ArrowRight className="size-4" />
                                    </span>
                                </div>
                            );

                            return isExternal ? (
                                <a key={project.id} href={href} target="_blank" rel="noopener noreferrer">
                                    {content}
                                </a>
                            ) : (
                                <div key={project.id}>{content}</div>
                            );
                        })}
                        {activeProjects.length === 0 && (
                            <div className="card-elevated flex items-center justify-center p-8 text-neutral-500">
                                {isZh ? '合作計畫更新中。' : 'Partnership updates coming soon.'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="section-padding bg-gradient-to-r from-primary/10 via-transparent to-secondary/20">
                <div className="content-container">
                    <div
                        ref={contactRef}
                        className="card-elevated grid gap-8 rounded-3xl p-10 shadow-2xl backdrop-blur md:grid-cols-[2fr,1fr]"
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
