import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { Calendar, Loader2 } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';

export interface PostCategory {
    id: number;
    name: string;
    name_en: string;
    slug: string;
}

export interface PostFormValues {
    title: {
        'zh-TW': string;
        en: string;
    };

    content: {
        'zh-TW': string;
        en: string;
    };
    category_id: string;
    status: 'draft' | 'published' | 'archived';
    pinned: boolean;
    publish_at: string;
    source_type: 'manual' | 'link';
    source_url: string;
}

export interface StatusOption {
    value: 'draft' | 'published' | 'archived';
    labelZh: string;
    labelEn: string;
}

interface PostFormProps {
    categories: PostCategory[];
    cancelUrl: string;
    mode: 'create' | 'edit';
    initialValues: PostFormValues;
    statusOptions: StatusOption[];
    initialPreviewHtml?: string;
    onSubmit: (form: any) => void;
}

const emptyContent = {
    'zh-TW': '',
    en: '',
};

const getSubmitLabels = (isZh: boolean, mode: 'create' | 'edit') => {
    if (mode === 'create') {
        return {
            idle: isZh ? '建立公告' : 'Create Post',
            processing: isZh ? '建立中...' : 'Creating...'
        };
    }

    return {
        idle: isZh ? '更新公告' : 'Update Post',
        processing: isZh ? '更新中...' : 'Updating...'
    };
};

export default function PostForm({
    categories,
    cancelUrl,
    mode,
    initialValues,
    statusOptions,
    initialPreviewHtml = '',
    onSubmit,
}: PostFormProps) {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    const form = useForm<PostFormValues>({
        title: {
            'zh-TW': initialValues.title['zh-TW'],
            en: initialValues.title.en,
        },
        content: {
            'zh-TW': initialValues.content['zh-TW'],
            en: initialValues.content.en,
        },
        category_id: initialValues.category_id,
        status: initialValues.status,
        pinned: initialValues.pinned,
        publish_at: initialValues.publish_at,
        source_type: initialValues.source_type,
        source_url: initialValues.source_url,
    });

    const { data, setData, errors, processing, setError, clearErrors } = form;

    const [autoSyncTitleEn, setAutoSyncTitleEn] = useState(
        () => initialValues.title.en.trim() === '' || initialValues.title.en === initialValues.title['zh-TW']
    );
    const [autoSyncContentEn, setAutoSyncContentEn] = useState(
        () =>
            initialValues.source_type === 'manual' &&
            (initialValues.content.en.trim() === '' || initialValues.content.en === initialValues.content['zh-TW'])
    );

    const [previewHtml, setPreviewHtml] = useState<string>(initialPreviewHtml);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState<boolean>(false);
    const [previewEmbeddable, setPreviewEmbeddable] = useState<boolean>(true);
    const [previewSource, setPreviewSource] = useState<string>('');
    const publishRef = useRef<HTMLInputElement | null>(null);
    const [publishEl, setPublishEl] = useState<HTMLInputElement | null>(null);
    const publishCallbackRef = useCallback((el: HTMLInputElement | null) => {
        publishRef.current = el;
        setPublishEl(el);
    }, []);

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

    const handleTitleZhChange = (value: string) => {
        const shouldSync = autoSyncTitleEn || data.title.en.trim() === '';
        setData('title', {
            'zh-TW': value,
            en: shouldSync ? value : data.title.en,
        });
        if (autoSyncTitleEn !== shouldSync) {
            setAutoSyncTitleEn(shouldSync);
        }
        if (errors['title.zh-TW']) {
            clearErrors('title.zh-TW');
        }
    };

    const handleTitleEnChange = (value: string) => {
        setData('title', {
            ...data.title,
            en: value,
        });
        const shouldSync = value.trim() === '' || value === data.title['zh-TW'];
        setAutoSyncTitleEn(shouldSync);
    };

    const handleContentZhChange = (value: string) => {
        if (data.source_type !== 'manual') {
            setData('content', {
                ...data.content,
                'zh-TW': value,
            });
            return;
        }

        const shouldSync = autoSyncContentEn || data.content.en.trim() === '';
        setData('content', {
            'zh-TW': value,
            en: shouldSync ? value : data.content.en,
        });
        if (autoSyncContentEn !== shouldSync) {
            setAutoSyncContentEn(shouldSync);
        }
    };

    const handleContentEnChange = (value: string) => {
        setData('content', {
            ...data.content,
            en: value,
        });
        const shouldSync = value.trim() === '' || value === data.content['zh-TW'];
        setAutoSyncContentEn(shouldSync);
    };

    const handleSourceTypeChange = (value: string) => {
        const newValue = value === 'link' ? 'link' : 'manual';

        setData('source_type', newValue);

        if (newValue === 'manual') {
            setData('source_url', '');
            setPreviewHtml('');
            setPreviewError(null);
            setAutoSyncContentEn(true);
        } else {
            setData('content', { ...emptyContent });
            setAutoSyncContentEn(false);
        }
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        const titleZh = data.title['zh-TW'].trim();
        if (titleZh === '') {
            setError('title.zh-TW', isZh ? '請輸入中文標題。' : 'Please enter the Chinese title.');
            return;
        }

        clearErrors('title.zh-TW');

        const transformedForm = form.transform((payload) => {
            const payloadTitleZh = payload.title['zh-TW'].trim();
            const payloadTitleEn = payload.title.en.trim() === '' ? payloadTitleZh : payload.title.en;

            if (payload.source_type === 'manual') {
                const payloadContentZh = payload.content['zh-TW'];
                const payloadContentEn = payload.content.en.trim() === '' ? payloadContentZh : payload.content.en;

                return {
                    ...payload,
                    title: {
                        'zh-TW': payloadTitleZh,
                        en: payloadTitleEn,
                    },
                    content: {
                        'zh-TW': payloadContentZh,
                        en: payloadContentEn,
                    },
                };
            }

            return {
                ...payload,
                title: {
                    'zh-TW': payloadTitleZh,
                    en: payloadTitleEn,
                },
                content: {
                    'zh-TW': '',
                    en: '',
                },
            };
        });

        onSubmit(transformedForm);
    };

    const handleFetchPreview = () => {
        if (data.source_type !== 'link') return;

        if (!data.source_url.trim()) {
            setPreviewError(isZh ? '請先輸入完整的來源網址。' : 'Please provide a source URL first.');
            return;
        }

        // Reset preview state and open original in new tab
        setPreviewHtml('');
        setPreviewEmbeddable(false);
        setPreviewSource(data.source_url);
        setPreviewError(isZh ? '已在新分頁開啟來源頁面。' : 'Opened source in a new tab.');
        window.open(data.source_url, '_blank');
    };

    // Bind showPicker on publishEl using useEffect and cleanup when element changes
    useEffect(() => {
        const el = publishEl;
        if (!el) return;

        const tryShow = () => {
            // @ts-ignore
            if (typeof el.showPicker === 'function') {
                try {
                    // @ts-ignore
                    el.showPicker();
                } catch (e) {
                    // ignore
                }
            }
        };

        el.addEventListener('focus', tryShow);
        el.addEventListener('click', tryShow);

        return () => {
            el.removeEventListener('focus', tryShow);
            el.removeEventListener('click', tryShow);
        };
    }, [publishEl]);

    const submitLabels = useMemo(() => getSubmitLabels(isZh, mode), [isZh, mode]);

    return (
        <form onSubmit={submit}>
            <div className="space-y-8">
                <Card className="border-gray-200 bg-white shadow-sm">
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
                                onChange={(event) => handleTitleZhChange(event.target.value)}
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
                                onChange={(event) => handleTitleEnChange(event.target.value)}
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
                                onChange={(event) => setData('category_id', event.target.value)}
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
                                    onChange={(event) => setData('status', event.target.value as PostFormValues['status'])}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {isZh ? option.labelZh : option.labelEn}
                                        </option>
                                    ))}
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
                                    onChange={(event) => setData('publish_at', event.target.value)}
                                    ref={publishCallbackRef}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <Checkbox
                                    id="pinned"
                                    checked={data.pinned}
                                    onCheckedChange={(checked) => setData('pinned', Boolean(checked))}
                                />
                                <Label htmlFor="pinned" className="text-sm font-medium text-gray-900">
                                    {isZh ? '置頂公告' : 'Pin this post'}
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white shadow-sm">
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
                                    onChange={(event) => handleSourceTypeChange(event.target.value)}
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
                                            onChange={(event) => setData('source_url', event.target.value)}
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
                                                    {isZh ? '開啟中' : 'Opening'}
                                                </span>
                                            ) : (
                                                isZh ? '檢視' : 'View'
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
                                        onChange={(event) => handleContentZhChange(event.target.value)}
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
                                        onChange={(event) => handleContentEnChange(event.target.value)}
                                        placeholder={isZh ? '請輸入英文內容' : 'Enter English content'}
                                    />
                                    <InputError message={errors['content.en']} />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <Label className="text-sm font-medium text-gray-900">
                                    {isZh ? '內容' : 'Content Preview'}
                                </Label>
                                <p className="text-sm text-gray-500">
                                    {isZh
                                        ? '輸入網址後按「檢視」會在新分頁開啟來源，系統不再儲存外部 HTML。'
                                        : 'Enter the source URL and click "View" to open it in a new tab. The server no longer stores fetched HTML.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end space-x-4 rounded-lg border border-gray-200 bg-white p-6">
                    <Link href={cancelUrl}>
                        <Button type="button" variant="secondary">
                            {isZh ? '取消' : 'Cancel'}
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white transition-colors duration-200 shadow-sm hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? submitLabels.processing : submitLabels.idle}
                    </Button>
                </div>
            </div>
        </form>
    );
}
