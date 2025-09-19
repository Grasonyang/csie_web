import PublicLayout from '@/layouts/public-layout';
import SectionHeader from '@/components/public/section-header';
import useScrollReveal from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import { getPageLayout } from '@/styles/page-layouts';
import type { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Filter, Search } from 'lucide-react';

interface BulletinCategory {
    id: number;
    name: string;
    name_en: string;
    slug: string;
}

interface BulletinItem {
    id: number;
    slug: string;
    title: string;
    title_en?: string;
    summary?: string | null;
    summary_en?: string | null;
    publish_at?: string | null;
    pinned?: boolean;
    cover_image_url?: string | null;
    category?: {
        name: string;
        name_en: string;
        slug: string;
    } | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface BulletinsProps {
    posts: {
        data: BulletinItem[];
        links: PaginationLink[];
        meta?: {
            from?: number | null;
            to?: number | null;
            total?: number;
            current_page?: number;
            last_page?: number;
        };
    };
    categories: BulletinCategory[];
    filters: {
        cat?: string;
        q?: string;
    };
}

function sanitizeLabel(label: string): string {
    const html = label.replace(/<[^>]+>/g, '');
    return html
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&');
}

export default function BulletinIndex({ posts, categories, filters }: BulletinsProps) {
    const page = usePage<SharedData>();
    const locale = page.props.locale ?? 'zh-TW';
    const isZh = locale.toLowerCase() === 'zh-tw';

    const dateFormatter = new Intl.DateTimeFormat(isZh ? 'zh-TW' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    const formatDate = (value?: string | null) => (value ? dateFormatter.format(new Date(value)) : null);

    const [searchValue, setSearchValue] = useState(filters.q ?? '');

    const applyFilters = (overrides: Partial<{ cat?: string | null; q?: string | null }>) => {
        const query = {
            ...(filters.q ? { q: filters.q } : {}),
            ...(filters.cat ? { cat: filters.cat } : {}),
            ...overrides,
        };

        Object.keys(query).forEach((key) => {
            if (!query[key as keyof typeof query]) {
                delete query[key as keyof typeof query];
            }
        });

        router.get('/bulletins', query, {
            preserveScroll: true,
            replace: true,
        });
    };

    const onSubmitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        applyFilters({ q: searchValue || null });
    };

    const pinnedPosts = useMemo(() => posts.data.filter((item) => item.pinned).slice(0, 3), [posts.data]);

    const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const categoryRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
    const listRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
    const sidebarRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

    const layout = getPageLayout('bulletinsIndex');
    const heroLayout = layout.hero!;
    const categoriesLayout = layout.sections.categories;
    const listingLayout = layout.sections.listing;

    return (
        <PublicLayout>
            <Head title={isZh ? '系所公告' : 'Bulletins'} />

            <section className={heroLayout.section}>
                <div ref={heroRef} className={cn(heroLayout.container, heroLayout.wrapper)}>
                    <div className={cn(heroLayout.surfaces?.primary, heroLayout.primary)}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                            {isZh ? '公告' : 'Bulletin'}
                        </span>
                        <h1 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
                            {isZh ? '系所公告與最新快訊' : 'Department announcements and updates'}
                        </h1>
                        <p className="max-w-2xl text-neutral-600">
                            {isZh
                                ? '瀏覽系所招生、活動、行政與學術公告，掌握所有重要訊息。'
                                : 'Find the latest admission news, academic events, and administrative announcements in one place.'}
                        </p>
                    </div>
                    <form onSubmit={onSubmitSearch} className={cn(heroLayout.secondary, heroLayout.surfaces?.search)}>
                        <div className="flex w-full items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm">
                            <Search className="size-5 text-primary" />
                            <input
                                type="search"
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder={isZh ? '輸入關鍵字搜尋公告' : 'Search announcements'}
                                className="w-full bg-transparent text-sm outline-none"
                                aria-label={isZh ? '搜尋公告' : 'Search bulletins'}
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchValue('');
                                        applyFilters({ q: null });
                                    }}
                                    className="text-xs font-medium text-neutral-400 transition hover:text-primary"
                                >
                                    {isZh ? '清除' : 'Clear'}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <span>{isZh ? '支援標籤與全文搜尋' : 'Supports tags & full-text search'}</span>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                            {isZh ? '搜尋' : 'Search'}
                        </button>
                    </form>
                </div>
            </section>

            <section className={categoriesLayout.section}>
                <div ref={categoryRef} className={cn(categoriesLayout.container, categoriesLayout.wrapper)}>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Filter className="size-4" />
                        <span>{isZh ? '公告分類' : 'Categories'}</span>
                    </div>
                    <div className={cn(categoriesLayout.primary)}>
                        <button
                            type="button"
                            onClick={() => applyFilters({ cat: null })}
                            className={cn(
                                !filters.cat ? categoriesLayout.surfaces?.pillActive : categoriesLayout.surfaces?.pill,
                            )}
                        >
                            {isZh ? '全部公告' : 'All'}
                        </button>
                        {categories.map((category) => (
                            <button
                                type="button"
                                key={category.id}
                                onClick={() => applyFilters({ cat: category.slug })}
                                className={cn(
                                    filters.cat === category.slug
                                        ? categoriesLayout.surfaces?.pillActive
                                        : categoriesLayout.surfaces?.pill,
                                )}
                            >
                                {isZh ? category.name : category.name_en}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className={listingLayout.section}>
                <div className={cn(listingLayout.container, listingLayout.wrapper)}>
                    <div ref={listRef} className={cn(listingLayout.primary, 'space-y-6')}>
                        <SectionHeader
                            eyebrow={isZh ? '最新' : 'Latest'}
                            title={isZh ? '最新公告' : 'Recent Bulletins'}
                            description={
                                filters.cat
                                    ? isZh
                                        ? `顯示「${
                                              categories.find((cat) => cat.slug === filters.cat)?.name ?? '全部'
                                          }」分類的公告。`
                                        : `Showing bulletins under “${
                                              categories.find((cat) => cat.slug === filters.cat)?.name_en ?? 'All'
                                          }”.`
                                    : isZh
                                    ? '顯示所有公告，依照最新發布時間排序。'
                                    : 'Showing all bulletins sorted by latest updates.'
                            }
                        />

                        {posts.data.length > 0 ? (
                            <div
                                className={cn(
                                    'overflow-hidden rounded-[2.5rem] border border-primary/12 bg-white/85 shadow-[0_28px_88px_-58px_rgba(18,35,90,0.3)]',
                                    listingLayout.surfaces?.card,
                                )}
                            >
                                <ul className="divide-y divide-primary/10">
                                    {posts.data.map((post) => {
                                        const title = isZh ? post.title : post.title_en ?? post.title;
                                        const summary = isZh ? post.summary ?? '' : post.summary_en ?? post.summary ?? '';
                                        const categoryLabel = post.category
                                            ? isZh
                                                ? post.category.name
                                                : post.category.name_en
                                            : undefined;
                                        const publishDate = formatDate(post.publish_at);

                                        return (
                                            <li key={post.id}>
                                                <Link
                                                    href={`/bulletins/${post.slug}`}
                                                    className="group grid gap-3 p-6 transition hover:bg-primary/5 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_auto] md:items-center"
                                                >
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                                        {categoryLabel && (
                                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
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
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-lg font-semibold text-neutral-900 md:text-xl">
                                                            {title}
                                                        </span>
                                                        {summary && <p className="text-sm text-neutral-600 line-clamp-2">{summary}</p>}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-primary md:justify-self-end">
                                                        {isZh ? '閱讀' : 'Read'}
                                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : (
                            <div className="rounded-[2.5rem] border border-dashed border-primary/20 bg-white/70 p-12 text-center text-neutral-500">
                                {isZh ? '查無符合條件的公告。' : 'No bulletins match your filters.'}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
                            <div>
                                {isZh
                                    ? `第 ${posts.meta?.from ?? 0}-${posts.meta?.to ?? 0} 筆，共 ${posts.meta?.total ?? posts.data.length} 筆`
                                    : `Showing ${posts.meta?.from ?? 0}-${posts.meta?.to ?? 0} of ${posts.meta?.total ?? posts.data.length}`}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {posts.links.map((link, index) => (
                                    <button
                                        key={`${link.label}-${index}`}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                        className={`min-w-[2.5rem] rounded-full px-3 py-1 text-sm font-medium transition ${
                                            link.active
                                                ? 'bg-primary text-white shadow'
                                                : link.url
                                                ? 'bg-surface-soft text-neutral-600 shadow hover:bg-primary/10 hover:text-primary'
                                                : 'bg-neutral-100 text-neutral-400'
                                        }`}
                                    >
                                        {sanitizeLabel(link.label)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside ref={sidebarRef} className={cn(listingLayout.secondary, 'space-y-6')}>
                        <div className={cn(listingLayout.surfaces?.sidebarCard)}>
                            <h3 className="text-lg font-semibold text-neutral-900">{isZh ? '置頂公告' : 'Pinned bulletins'}</h3>
                            <div className="mt-4 space-y-3">
                                {pinnedPosts.length ? (
                                    pinnedPosts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={`/bulletins/${post.slug}`}
                                            className="block rounded-2xl px-3 py-2 text-sm text-neutral-600 transition hover:bg-primary/5 hover:text-primary"
                                        >
                                            <span className="block font-medium text-neutral-900">
                                                {isZh ? post.title : post.title_en ?? post.title}
                                            </span>
                                            {post.publish_at && (
                                                <time className="text-xs text-neutral-500" dateTime={post.publish_at}>
                                                    {new Intl.DateTimeFormat(isZh ? 'zh-TW' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }).format(new Date(post.publish_at))}
                                                </time>
                                            )}
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-sm text-neutral-500">
                                        {isZh ? '目前沒有置頂公告。' : 'No pinned bulletins yet.'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={cn(listingLayout.surfaces?.sidebarCard)}>
                            <h3 className="text-lg font-semibold text-neutral-900">{isZh ? '分類總覽' : 'Categories'}</h3>
                            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                                {categories.map((category) => (
                                    <li key={category.id} className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => applyFilters({ cat: category.slug })}
                                            className={`text-left transition hover:text-primary ${
                                                filters.cat === category.slug ? 'text-primary font-semibold' : ''
                                            }`}
                                        >
                                            {isZh ? category.name : category.name_en}
                                        </button>
                                        <span className="text-xs text-neutral-400">{isZh ? '查看' : 'View'}</span>
                                    </li>
                                ))}
                                {categories.length === 0 && (
                                    <li className="text-neutral-400">{isZh ? '尚未設定分類。' : 'No categories yet.'}</li>
                                )}
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}
