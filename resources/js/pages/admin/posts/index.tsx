import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

// 文章列表頁
export default function PostIndex({ posts }: { posts: any[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: '文章管理', href: '/admin/posts' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="文章管理" />
            <div className="space-y-4">
                <Link href="/admin/posts/create" className="text-blue-500">
                    新增文章
                </Link>
                <ul className="list-disc pl-4">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/admin/posts/${post.id}/edit`} className="underline">
                                {post.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
