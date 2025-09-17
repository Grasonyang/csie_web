import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import type { InertiaFormProps } from '@inertiajs/react/types/useForm';
import { ArrowLeft } from 'lucide-react';
import PostForm, { type PostCategory, type PostFormValues, type StatusOption } from './components/post-form';

interface CreatePostProps {
    categories: PostCategory[];
}

export default function CreatePost({ categories }: CreatePostProps) {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    const initialValues: PostFormValues = {
        title: {
            'zh-TW': '',
            en: '',
        },
        content: {
            'zh-TW': '',
            en: '',
        },
        category_id: '',
        status: 'draft',
        pinned: false,
        publish_at: '',
        source_type: 'manual',
        source_url: '',
    };

    const statusOptions: StatusOption[] = [
        { value: 'draft', labelZh: '草稿', labelEn: 'Draft' },
        { value: 'published', labelZh: '已發布', labelEn: 'Published' },
    ];

    const handleSubmit = (form: InertiaFormProps<PostFormValues>) => {
        form.post(PostController.store().url, {
            onError: (formErrors) => {
                // 繫結表單錯誤以便開發時追蹤
                console.error('Form errors:', formErrors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={isZh ? '建立公告' : 'Create Post'} />

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
                                {isZh ? '建立公告' : 'Create Post'}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {isZh ? '建立新的公告或新聞' : 'Create a new announcement or news post'}
                            </p>
                        </div>
                    </div>

                    <PostForm
                        categories={categories}
                        cancelUrl={PostController.index().url}
                        mode="create"
                        initialValues={initialValues}
                        statusOptions={statusOptions}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
