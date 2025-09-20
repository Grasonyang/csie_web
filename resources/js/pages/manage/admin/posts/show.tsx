import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManageLayout from '@/layouts/manage/manage-layout';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
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
    published: { zh: '發布', en: 'Publish' },
    archived: { zh: '已封存', en: 'Archived' },
};

const formatDateTime = (value: any, locale?: string) => {
    if (!value) {
        return locale?.toLowerCase() === 'zh-tw' ? '未設定' : 'Not set';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const lang = locale?.toLowerCase() === 'zh-tw' ? 'zh-TW' : 'en-US';
    return date.toLocaleString(lang, {
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
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const postsIndexUrl = '/manage/admin/posts';
    const attachmentsIndexUrl = '/manage/admin/attachments';
    const attachmentManagerLink = `${attachmentsIndexUrl}?${new URLSearchParams({
        attachable_type: 'App\\Models\\Post',
        attachable_id: String(post.id),
    }).toString()}`;
    const breadcrumbs = [
        { title: isZh ? '管理首頁' : 'Management', href: '/manage/dashboard' },
        { title: isZh ? '公告管理' : 'Announcements', href: postsIndexUrl },
        { title: isZh ? '公告詳情' : 'Details', href: `/manage/admin/posts/${post.id}` },
    ];

    const statusBadge = (
        <Badge variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'outline'}>
            {isZh ? statusLabels[post.status].zh : statusLabels[post.status].en}
        </Badge>
    );

    const hasRemoteContent = post.source_type === 'link' && Boolean(post.source_url);
    const hasZhContent = Boolean(post.content && post.content.trim().length > 0);
    const hasEnContent = Boolean(post.content_en && post.content_en.trim().length > 0);

    return (
        <ManageLayout role="admin" breadcrumbs={breadcrumbs}>
            <Head title={isZh ? '公告詳情' : 'Bulletin detail'} />

            <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-0">
                <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                    <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold text-[#151f54]">
                                {isZh ? post.title : post.title_en || post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {isZh ? '發布' : 'Published'}: {formatDateTime(post.publish_at, locale)}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {post.creator?.name ?? (isZh ? '系統' : 'System')}
                                </span>
                                {statusBadge}
                                {post.pinned && (
                                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                                        {isZh ? '置頂' : 'Pinned'}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Button asChild variant="outline" className="rounded-full border-[#151f54]/30">
                            <Link href={postsIndexUrl}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {isZh ? '返回列表' : 'Back to list'}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                    <CardHeader className="border-b border-neutral-200 bg-neutral-50/60">
                        <CardTitle className="flex items-center gap-2 text-[#151f54]">
                            <Clock className="h-5 w-5" />
                            {isZh ? '基本資訊' : 'Overview'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">{isZh ? '分類' : 'Category'}</p>
                            <p className="mt-1 text-base text-neutral-900">
                                {isZh ? post.category?.name : post.category?.name_en}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">{isZh ? '英文標題' : 'English title'}</p>
                            <p className="mt-1 text-base text-neutral-900">{post.title_en || '—'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">{isZh ? '來源類型' : 'Source type'}</p>
                            <p className="mt-1 text-base text-neutral-900">
                                {post.source_type === 'link'
                                    ? isZh
                                        ? '外部連結'
                                        : 'External link'
                                    : isZh
                                        ? '手動輸入'
                                        : 'Manual input'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">{isZh ? '來源網址' : 'Source URL'}</p>
                            {post.source_url ? (
                                <a
                                    href={post.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center gap-1 text-sm text-[#151f54] hover:underline"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                    {post.source_url}
                                </a>
                            ) : (
                                <p className="mt-1 text-base text-neutral-900">—</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">{isZh ? '建立時間' : 'Created at'}</p>
                            <p className="mt-1 text-base text-neutral-900">{formatDateTime(post.created_at, locale)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">{isZh ? '最後更新' : 'Last updated'}</p>
                            <p className="mt-1 text-base text-neutral-900">{formatDateTime(post.updated_at, locale)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                    <CardHeader className="border-b border-neutral-200 bg-neutral-50/60">
                        <CardTitle className="flex items-center gap-2 text-[#151f54]">
                            <ExternalLink className="h-5 w-5" />
                            {isZh ? '公告內容' : 'Content'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        {hasRemoteContent ? (
                            <div className="space-y-4">
                                {post.source_url && (
                                    <a
                                        href={post.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-[#151f54] hover:underline"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        {isZh ? '前往來源' : 'Open source'}
                                    </a>
                                )}
                                <p className="text-sm text-slate-500">
                                    {isZh
                                        ? '系統不再儲存外部 HTML，請點擊來源連結查看完整內容。'
                                        : 'External HTML is no longer stored. Use the source link to view the original content.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">{isZh ? '中文內容' : 'Chinese content'}</p>
                                    {hasZhContent ? (
                                        <div className="mt-2 whitespace-pre-line rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-neutral-800">
                                            {post.content}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-neutral-500">
                                            {isZh ? '尚未填寫中文內容。' : 'No Chinese content provided.'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">{isZh ? '英文內容' : 'English content'}</p>
                                    {hasEnContent ? (
                                        <div className="mt-2 whitespace-pre-line rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-neutral-800">
                                            {post.content_en}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-neutral-500">
                                            {isZh ? '尚未填寫英文內容。' : 'No English content provided.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                    <CardHeader className="border-b border-neutral-200 bg-neutral-50/60">
                        <CardTitle className="flex items-center gap-2 text-[#151f54]">
                            <Paperclip className="h-5 w-5" />
                            {isZh ? '附件' : 'Attachments'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        {post.attachments && post.attachments.length > 0 ? (
                            <div className="space-y-3">
                                {post.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-neutral-900">
                                                {attachment.title || `${isZh ? '附件' : 'Attachment'} #${attachment.id}`}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                                {attachment.mime_type && <Badge variant="outline">{attachment.mime_type}</Badge>}
                                                <span>{formatFileSize(attachment.file_size)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <a
                                                href={buildAttachmentViewUrl(attachment)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1 text-sm text-neutral-700 transition hover:border-neutral-400 hover:bg-white"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                {isZh ? '檢視' : 'View'}
                                            </a>
                                            <a
                                                href={buildAttachmentDownloadUrl(attachment)}
                                                className="inline-flex items-center gap-2 rounded-md bg-[#151f54] px-3 py-1 text-sm text-white transition hover:bg-[#1f2a6d]"
                                            >
                                                <Download className="h-4 w-4" />
                                                {isZh ? '下載' : 'Download'}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">
                                {isZh ? '此公告目前沒有附件。' : 'No attachments have been uploaded for this bulletin.'}
                            </p>
                        )}
                        <div>
                            <Button asChild variant="secondary" className="rounded-full border-[#151f54]/20">
                                <Link href={attachmentManagerLink}>
                                    {isZh ? '前往附件管理' : 'Open attachment manager'}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </ManageLayout>
    );
}
