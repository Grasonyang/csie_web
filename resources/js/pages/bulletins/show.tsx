import PublicLayout from '@/layouts/public-layout';
import { Head, Link, usePage } from '@inertiajs/react';
// DOMPurify removed: external HTML is no longer stored server-side.
import type { SharedData } from '@/types';

interface Props {
    post: any;
}

export default function BulletinShow({ post }: Props) {
    const page = usePage<SharedData & { i18n: any }>();
    const { i18n } = page.props;
    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;

    const rawHtml = post.content ?? '';
    const hasContent = rawHtml.trim().length > 0 || (post.source_type === 'link' && Boolean(post.source_url));

    return (
        <PublicLayout>
            <Head title={post.title} />
            <section className="mx-auto max-w-4xl space-y-4 p-4">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                {/* 依來源顯示內容並進行 HTML 消毒 */}
                {hasContent ? (
                    post.source_type === 'link' && post.source_url ? (
                        <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{post.source_url}</a>
                    ) : (
                        <div className="prose max-w-none whitespace-pre-line">{rawHtml}</div>
                    )
                ) : (
                    <p className="text-sm text-gray-500">{t('bulletin.empty', 'This bulletin has no visible content.')}</p>
                )}
                <Link href="/bulletins" className="text-blue-600 hover:underline">
                    {t('bulletin.back', 'Back')}
                </Link>
            </section>
        </PublicLayout>
    );
}

