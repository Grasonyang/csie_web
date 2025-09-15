import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { SharedData } from '@/types';

interface Props {
    posts: any;
    categories: any[];
    filters: { cat?: string; q?: string };
}

export default function BulletinIndex({ posts, categories, filters }: Props) {
    const page = usePage<SharedData & { i18n: any }>();
    const { i18n } = page.props;
    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;

    // 搜尋字串狀態
    const [search, setSearch] = useState(filters.q || '');

    // 提交搜尋
    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/bulletins', { ...filters, q: search }, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout>
            <Head title={t('bulletin.title', 'Bulletins')} />
            <section className="mx-auto max-w-4xl space-y-4 p-4">
                {/* 公告分類選單 */}
                <div className="flex flex-wrap gap-2">
                    <Link href="/bulletins" className={!filters.cat ? 'font-bold' : ''}>
                        {t('bulletin.all', 'All')}
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/bulletins?cat=${cat.slug}${filters.q ? `&q=${filters.q}` : ''}`}
                            className={filters.cat === cat.slug ? 'font-bold' : ''}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* 搜尋表單 */}
                <form onSubmit={submitSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('search', 'Search')}
                        className="flex-grow rounded border px-2 py-1"
                    />
                    <button type="submit" className="rounded border px-3 py-1">
                        {t('search', 'Search')}
                    </button>
                </form>

                {/* 公告列表 */}
                <ul className="space-y-4">
                    {posts.data.map((post: any) => (
                        <li key={post.id}>
                            <Link href={`/bulletins/${post.slug}`} className="text-blue-600 hover:underline">
                                {post.title}
                            </Link>
                            {post.summary && <div className="text-sm text-gray-500">{post.summary}</div>}
                        </li>
                    ))}
                </ul>
            </section>
        </PublicLayout>
    );
}

