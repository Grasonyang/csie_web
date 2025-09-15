import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Calendar, Pin, User, Eye, Edit, Trash2 } from 'lucide-react';

interface PostCategory {
    id: number;
    name: string;
    name_en: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Post {
    id: number;
    title: string;
    title_en: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    publish_at: string | null;
    pinned: boolean;
    category: PostCategory;
    creator: User;
    created_at: string;
    updated_at: string;
}

interface PostsIndexProps {
    posts: {
        data: Post[];
        links: any[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    categories: PostCategory[];
}

export default function PostsIndex({ posts, categories }: PostsIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    // 使用 Inertia 的 useForm 來處理刪除請求
    const { delete: destroy } = useForm();

    // 添加安全檢查
    const postsData = posts?.data || [];
    const paginationMeta = posts?.meta || { last_page: 1, current_page: 1, per_page: 20, total: 0 };
    const paginationLinks = posts?.links || [];

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: 'secondary',
            published: 'default',
            archived: 'outline',
        } as const;

        const labels = {
            draft: isZh ? '草稿' : 'Draft',
            published: isZh ? '已發布' : 'Published',
            archived: isZh ? '已封存' : 'Archived',
        };

        return (
            <Badge variant={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(isZh ? 'zh-TW' : 'en-US');
    };

    return (
        <AppLayout>
            <Head title={isZh ? "公告管理" : "Posts Management"} />

            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    {isZh ? "公告管理" : "Posts Management"}
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    {isZh ? "管理系統公告與新聞" : "Manage system announcements and news"}
                                </p>
                            </div>

                            {auth.user && (
                                <Link href={PostController.create().url}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        {isZh ? "新增公告" : "Create Post"}
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <Card className="bg-white shadow-sm">
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    {isZh ? "公告列表" : "Posts List"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {postsData.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                            {isZh ? "尚無公告" : "No posts"}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {isZh ? "開始建立第一個公告吧" : "Get started by creating a new post"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {postsData.map((post) => (
                                            <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {post.pinned && (
                                                                <Pin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                                            )}
                                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                                {isZh ? post.title : post.title_en}
                                                            </h3>
                                                            {getStatusBadge(post.status)}
                                                        </div>

                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                <Badge variant="outline" className="text-xs">
                                                                    {isZh ? post.category.name : post.category.name_en}
                                                                </Badge>
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                <User className="h-4 w-4" />
                                                                <span>{post.creator.name}</span>
                                                            </div>

                                                            {post.publish_at && (
                                                                <div>
                                                                    {isZh ? "發布時間" : "Published"}: {formatDate(post.publish_at)}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                                {post.slug}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Link href={PostController.show(post.id).url}>
                                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={PostController.edit(post.id).url}>
                                                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            // 點擊後先確認是否刪除
                                                            onClick={() => {
                                                                if (confirm('確定要刪除嗎？')) {
                                                                    // 送出刪除請求
                                                                    destroy(PostController.destroy(post.id).url);
                                                                }
                                                            }}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {paginationMeta.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-2 py-4">
                                {paginationLinks.map((link, index) => (
                                    <div key={index}>
                                        {link.url ? (
                                            <Link href={link.url}>
                                                <Button
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    className={link.active ? "bg-blue-600 hover:bg-blue-700" : ""}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </Link>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
        </AppLayout>
    );
}
