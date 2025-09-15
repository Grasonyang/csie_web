import PublicLayout from '@/layouts/public-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

interface Props {
    post: any;
}

export default function BulletinShow({ post }: Props) {
    const page = usePage<SharedData & { i18n: any }>();
    const { i18n } = page.props;
    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;

    return (
        <PublicLayout>
            <Head title={post.title} />
            <section className="mx-auto max-w-4xl space-y-4 p-4">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                {/* 顯示公告內容 */}
                {post.content && (
                    <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
                <Link href="/bulletins" className="text-blue-600 hover:underline">
                    {t('bulletin.back', 'Back')}
                </Link>
            </section>
        </PublicLayout>
    );
}

