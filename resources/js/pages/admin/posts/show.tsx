import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { ArrowLeft, Calendar, Clock, Download, ExternalLink, LinkIcon, Paperclip, User } from 'lucide-react';

interface Attachment {
    id: number;
    title?: string | null;
    file_url?: string | null;
    external_url?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
}

interface PostCategory {
    id: number;
    name: string;
    name_en: string;
}

interface Creator {
    id: number;
    name: string;
    email?: string | null;
}

interface AdminPostDetail {
    id: number;
    title: string;
    title_en: string;
    status: 'draft' | 'published' | 'archived';
    publish_at: string | null;
    pinned: boolean;
    category: PostCategory;
    creator?: Creator | null;
    content?: string | null;
    content_en?: string | null;
    source_type?: 'manual' | 'link';
    source_url?: string | null;
    fetched_html?: string | null;
    attachments: Attachment[];
    created_at?: string | null;
    updated_at?: string | null;
}

interface ShowPostProps {
    post: AdminPostDetail;
}

const statusLabels: Record<AdminPostDetail['status'], { zh: string; en: string }> = {
    draft: { zh: '草稿', en: 'Draft' },
    published: { zh: '已發布', en: 'Published' },
    archived: { zh: '已封存', en: 'Archived' },
};

const formatDateTime = (value: string | null, locale: string) => {
    if (!value) {
        return locale === 'zh-TW' ? '未設定' : 'Not set';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(locale === 'zh-TW' ? 'zh-TW' : 'en-US', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatFileSize = (bytes?: number | null) => {
    if (!bytes || bytes <= 0) {
        return '-';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, exponent);
    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const buildAttachmentViewUrl = (attachment: Attachment) => `/attachments/${attachment.id}`;
const buildAttachmentDownloadUrl = (attachment: Attachment) => `/attachments/${attachment.id}/download`;

export default function ShowPost({ post }: ShowPostProps) {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    const statusBadge = (
        <Badge variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'outline'}>
            {isZh ? statusLabels[post.status].zh : statusLabels[post.status].en}
        </Badge>
    );

    const sanitizedHtml = DOMPurify.sanitize(post.fetched_html ?? '');
    const hasRemoteContent = post.source_type === 'link';

    const hasZhContent = Boolean(post.content && post.content.trim().length > 0);
    const hasEnContent = Boolean(post.content_en && post.content_en.trim().length > 0);

    return (
        <AppLayout>
            <Head title={isZh ? '公告詳情' : 'Post Detail'} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
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
                                {isZh ? post.title : post.title_en || post.title}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {isZh ? '發布時間' : 'Published at'}: {formatDateTime(post.publish_at, locale)}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {post.creator?.name ?? (isZh ? '系統' : 'System')}
                                </span>
                                <span>{statusBadge}</span>
                                {post.pinned && (
                                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                                        {isZh ? '置頂' : 'Pinned'}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <Card className="border-gray-200 bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Clock className="h-5 w-5 text-blue-600" />
                                {isZh ? '基本資訊' : 'Basic Information'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-8 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{isZh ? '分類' : 'Category'}</p>
                                <p className="mt-1 text-base text-gray-900">
                                    {isZh ? post.category?.name : post.category?.name_en}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{isZh ? '英文標題' : 'English Title'}</p>
                                <p className="mt-1 text-base text-gray-900">{post.title_en || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{isZh ? '來源類型' : 'Source Type'}</p>
                                <p className="mt-1 text-base text-gray-900">
                                    {post.source_type === 'link'
                                        ? isZh
                                            ? '外部連結'
                                            : 'Link'
                                        : isZh
                                            ? '手動輸入'
                                            : 'Manual'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{isZh ? '來源網址' : 'Source URL'}</p>
                                {post.source_url ? (
                                    <a
                                        href={post.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-flex items-center gap-1 text-blue-600 hover:underline"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        {post.source_url}
                                    </a>
                                ) : (
                                    <p className="mt-1 text-base text-gray-900">—</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{isZh ? '建立時間' : 'Created at'}</p>
                                <p className="mt-1 text-base text-gray-900">
                                    {formatDateTime(post.created_at ?? null, locale)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{isZh ? '最後更新' : 'Last Updated'}</p>
                                <p className="mt-1 text-base text-gray-900">
                                    {formatDateTime(post.updated_at ?? null, locale)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <ExternalLink className="h-5 w-5 text-blue-600" />
                                {isZh ? '公告內容' : 'Post Content'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-8">
                            {hasRemoteContent ? (
                                <div className="space-y-4">
                                    {post.source_url && (
                                        <a
                                            href={post.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                            {isZh ? '前往來源' : 'Open Source'}
                                        </a>
                                    )}
                                    {sanitizedHtml ? (
                                        <div
                                            className="prose max-w-none rounded-lg border border-gray-200 bg-gray-50 p-4"
                                            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {isZh ? '目前沒有可供預覽的遠端內容。' : 'No remote content available for preview.'}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{isZh ? '中文內容' : 'Chinese Content'}</p>
                                        {hasZhContent ? (
                                            <div className="mt-2 whitespace-pre-line rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-800">
                                                {post.content}
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-sm text-gray-500">
                                                {isZh ? '尚未填寫中文內容。' : 'No Chinese content provided.'}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{isZh ? '英文內容' : 'English Content'}</p>
                                        {hasEnContent ? (
                                            <div className="mt-2 whitespace-pre-line rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-800">
                                                {post.content_en}
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-sm text-gray-500">
                                                {isZh ? '尚未填寫英文內容。' : 'No English content provided.'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Paperclip className="h-5 w-5 text-blue-600" />
                                {isZh ? '附件' : 'Attachments'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-8">
                            {post.attachments && post.attachments.length > 0 ? (
                                <div className="space-y-3">
                                    {post.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {attachment.title || `${isZh ? '附件' : 'Attachment'} #${attachment.id}`}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                    {attachment.mime_type && <Badge variant="outline">{attachment.mime_type}</Badge>}
                                                    <span>{formatFileSize(attachment.file_size)}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <a
                                                    href={buildAttachmentViewUrl(attachment)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 transition hover:border-gray-400 hover:bg-white"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    {isZh ? '檢視' : 'View'}
                                                </a>
                                                <a
                                                    href={buildAttachmentDownloadUrl(attachment)}
                                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    {isZh ? '下載' : 'Download'}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    {isZh ? '此公告目前沒有附件。' : 'No attachments have been uploaded for this post.'}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
