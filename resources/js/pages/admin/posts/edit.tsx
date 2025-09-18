import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PostForm, { type ExistingAttachment, type PostCategory, type PostFormValues, type StatusOption } from './components/post-form';

interface AdminPost {
    id: number;
    category_id: number;
    status: 'draft' | 'published' | 'archived';
    publish_at: string | null;
    pinned: boolean;
    title: string;
    title_en: string;
    content: string;
    content_en: string;
    source_type?: 'manual' | 'link';
    source_url?: string | null;
    attachments?: ExistingAttachment[];
}

interface EditPostProps {
    post: AdminPost;
    categories: PostCategory[];
}

const formatPublishAt = (value: string | null): string => {
    if (!value) {
        return '';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value.slice(0, 16);
    }

    const offset = parsed.getTimezoneOffset() * 60000;
    return new Date(parsed.getTime() - offset).toISOString().slice(0, 16);
};

export default function EditPost({ post, categories }: EditPostProps) {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    const initialValues: PostFormValues = {
        title: {
            'zh-TW': post.title ?? '',
            en: post.title_en ?? '',
        },
        content: {
            'zh-TW': post.content ?? '',
            en: post.content_en ?? '',
        },
        category_id: String(post.category_id ?? ''),
        status: post.status ?? 'draft',
        pinned: Boolean(post.pinned),
        publish_at: formatPublishAt(post.publish_at),
        source_type: (post.source_type ?? 'manual') as 'manual' | 'link',
        source_url: post.source_url ?? '',
        attachments_files: [],
        attachments_links: [],
        attachments_remove: [],
    };

    const initialPreviewHtml = '';

    const statusOptions: StatusOption[] = [
        { value: 'draft', labelZh: '草稿', labelEn: 'Draft' },
        { value: 'published', labelZh: '發布', labelEn: 'Publish' },
        { value: 'archived', labelZh: '封存', labelEn: 'Archive' },
    ];

    const handleSubmit = (form: any) => {
        form.put(PostController.update(post.id).url, {
            onError: (formErrors: any) => {
                // 繫結表單錯誤以便開發時追蹤
                console.error('Form errors:', formErrors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={isZh ? '編輯公告' : 'Edit Post'} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href={PostController.index().url}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {isZh ? '編輯公告' : 'Edit Post'}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {isZh ? '調整公告內容與顯示設定' : 'Update the announcement details.'}
                            </p>
                        </div>
                    </div>

                    <PostForm
                        categories={categories}
                        cancelUrl={PostController.index().url}
                        mode="edit"
                        initialValues={initialValues}
                        initialPreviewHtml={initialPreviewHtml}
                        statusOptions={statusOptions}
                        existingAttachments={post.attachments ?? []}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
