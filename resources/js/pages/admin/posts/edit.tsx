import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface PostCategory {
    id: number;
    name: string;
    name_en: string;
    slug: string;
}

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
    fetched_html?: string | null;
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

    const { data, setData, put, processing, errors } = useForm({
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
        pinned: !!post.pinned,
        publish_at: formatPublishAt(post.publish_at),
        source_type: post.source_type ?? 'manual',
        source_url: post.source_url ?? '',
    });

    const [previewHtml, setPreviewHtml] = useState<string>(
        post.source_type === 'link' ? post.fetched_html ?? '' : ''
    );
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data.source_type === 'manual') {
            setPreviewHtml('');
            setPreviewError(null);
        }
    }, [data.source_type]);

    useEffect(() => {
        if (!data.source_url.trim()) {
            setPreviewHtml('');
        }
    }, [data.source_url]);

    const handleSourceTypeChange = (value: string) => {
        setData('source_type', value);

        if (value === 'manual') {
            setData('source_url', '');
            setPreviewHtml('');
            setPreviewError(null);
        } else {
            setData('content.zh-TW', '');
            setData('content.en', '');
        }
    };

    const handleFetchPreview = async () => {
        if (data.source_type !== 'link') {
            return;
        }

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;

        if (!csrfToken) {
            setPreviewError('無法取得安全性驗證資訊，請重新整理頁面後再試。');
            return;
        }

        if (!data.source_url.trim()) {
            setPreviewError('請先輸入完整的來源網址。');
            return;
        }

        setPreviewLoading(true);
        setPreviewError(null);

        try {
            const response = await fetch('/admin/posts/fetch-preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    source_url: data.source_url,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                const message =
                    result?.message ??
                    result?.errors?.source_url?.[0] ??
                    (isZh ? '抓取內容失敗，請稍後再試。' : 'Failed to fetch content.');

                throw new Error(message);
            }

            setPreviewHtml(result.html ?? '');
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : isZh
                        ? '抓取內容失敗，請稍後再試。'
                        : 'Failed to fetch remote content.';
            setPreviewError(message);
            setPreviewHtml('');
        } finally {
            setPreviewLoading(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(PostController.update(post.id).url, {
            onError: (formErrors) => {
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
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{isZh ? '編輯公告' : 'Edit Post'}</h1>
                            <p className="mt-2 text-gray-600">{isZh ? '調整公告內容與顯示設定' : 'Update the announcement details.'}</p>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <div className="space-y-8">
                            <Card className="bg-white shadow-sm border-gray-200">
                                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        {isZh ? '基本資訊' : 'Basic Information'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-8">
                                    <div className="space-y-4">
                                        <Label htmlFor="title-zh" className="text-sm font-medium text-gray-900">
                                            {isZh ? '標題 (中文)' : 'Title (Chinese)'}
                                        </Label>
                                        <Input
                                            id="title-zh"
                                            value={data.title['zh-TW']}
                                            onChange={(e) => setData('title.zh-TW', e.target.value)}
                                            placeholder={isZh ? '請輸入中文標題' : 'Enter Chinese title'}
                                        />
                                        <InputError message={errors['title.zh-TW']} />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="title-en" className="text-sm font-medium text-gray-900">
                                            {isZh ? '標題 (英文)' : 'Title (English)'}
                                        </Label>
                                        <Input
                                            id="title-en"
                                            value={data.title.en}
                                            onChange={(e) => setData('title.en', e.target.value)}
                                            placeholder={isZh ? '請輸入英文標題' : 'Enter English title'}
                                        />
                                        <InputError message={errors['title.en']} />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                                            {isZh ? '分類' : 'Category'}
                                        </Label>
                                        <Select
                                            id="category"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                        >
                                            <option value="">{isZh ? '請選擇分類' : 'Select category'}</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {isZh ? category.name : category.name_en}
                                                </option>
                                            ))}
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                                                {isZh ? '狀態' : 'Status'}
                                            </Label>
                                            <Select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                            >
                                                <option value="draft">{isZh ? '草稿' : 'Draft'}</option>
                                                <option value="published">{isZh ? '已發布' : 'Published'}</option>
                                                <option value="archived">{isZh ? '已封存' : 'Archived'}</option>
                                            </Select>
                                        </div>

                                        <div className="space-y-4">
                                            <Label htmlFor="publish_at" className="text-sm font-medium text-gray-900">
                                                {isZh ? '發布時間' : 'Publish Date'}
                                            </Label>
                                            <Input
                                                id="publish_at"
                                                type="datetime-local"
                                                value={data.publish_at}
                                                onChange={(e) => setData('publish_at', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <Checkbox
                                                id="pinned"
                                                checked={data.pinned}
                                                onCheckedChange={(checked) => setData('pinned', !!checked)}
                                            />
                                            <Label htmlFor="pinned" className="text-sm font-medium text-gray-900">
                                                {isZh ? '置頂公告' : 'Pin this post'}
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm border-gray-200">
                                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                                    <CardTitle className="text-gray-900">{isZh ? '內容' : 'Content'}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-8">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <Label htmlFor="source_type" className="text-sm font-medium text-gray-900">
                                                {isZh ? '輸入方式' : 'Input Source'}
                                            </Label>
                                            <Select
                                                id="source_type"
                                                value={data.source_type}
                                                onChange={(e) => handleSourceTypeChange(e.target.value)}
                                            >
                                                <option value="manual">{isZh ? '手動輸入' : 'Manual'}</option>
                                                <option value="link">{isZh ? '外部連結' : 'Link'}</option>
                                            </Select>
                                            <InputError message={errors.source_type} />
                                        </div>

                                        {data.source_type === 'link' && (
                                            <div className="space-y-4">
                                                <Label htmlFor="source_url" className="text-sm font-medium text-gray-900">
                                                    {isZh ? '來源網址' : 'Source URL'}
                                                </Label>
                                                <div className="flex flex-col gap-2 sm:flex-row">
                                                    <Input
                                                        id="source_url"
                                                        value={data.source_url}
                                                        onChange={(e) => setData('source_url', e.target.value)}
                                                        placeholder={isZh ? '請輸入外部連結' : 'Enter the external link'}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={handleFetchPreview}
                                                        disabled={previewLoading}
                                                    >
                                                        {previewLoading ? (
                                                            <span className="flex items-center gap-2">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                {isZh ? '抓取中' : 'Fetching'}
                                                            </span>
                                                        ) : (
                                                            isZh ? '抓取內容' : 'Fetch Content'
                                                        )}
                                                    </Button>
                                                </div>
                                                <InputError message={errors.source_url} />
                                                {previewError && <p className="text-sm text-red-600">{previewError}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {data.source_type === 'manual' ? (
                                        <>
                                            <div className="space-y-4">
                                                <Label htmlFor="content-zh" className="text-sm font-medium text-gray-900">
                                                    {isZh ? '內容 (中文)' : 'Content (Chinese)'}
                                                </Label>
                                                <Textarea
                                                    id="content-zh"
                                                    className="min-h-[200px]"
                                                    value={data.content['zh-TW']}
                                                    onChange={(e) => setData('content.zh-TW', e.target.value)}
                                                    placeholder={isZh ? '請輸入中文內容' : 'Enter Chinese content'}
                                                />
                                                <InputError message={errors['content.zh-TW']} />
                                            </div>

                                            <div className="space-y-4">
                                                <Label htmlFor="content-en" className="text-sm font-medium text-gray-900">
                                                    {isZh ? '內容 (英文)' : 'Content (English)'}
                                                </Label>
                                                <Textarea
                                                    id="content-en"
                                                    className="min-h-[200px]"
                                                    value={data.content.en}
                                                    onChange={(e) => setData('content.en', e.target.value)}
                                                    placeholder={isZh ? '請輸入英文內容' : 'Enter English content'}
                                                />
                                                <InputError message={errors['content.en']} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <Label className="text-sm font-medium text-gray-900">
                                                {isZh ? '抓取內容預覽' : 'Fetched Preview'}
                                            </Label>
                                            {previewHtml ? (
                                                <div
                                                    className="prose max-w-none rounded-lg border border-gray-200 bg-gray-50 p-4"
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewHtml) }}
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    {isZh
                                                        ? '輸入網址後點擊「抓取內容」即可預覽遠端內容，儲存時會同步寫入公告。'
                                                        : 'Provide the link and click “Fetch Content” to preview what will be saved.'}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-end space-x-4 rounded-lg border border-gray-200 bg-white p-6">
                                <Link href={PostController.index().url}>
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50"
                                    >
                                        {isZh ? '取消' : 'Cancel'}
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white transition-colors duration-200 shadow-sm hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? (isZh ? '更新中...' : 'Updating...') : isZh ? '更新公告' : 'Update Post'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
