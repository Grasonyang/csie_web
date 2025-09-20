import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AdminDashboardData, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    Calendar,
    CheckCircle2,
    FileText,
    Inbox,
    LinkIcon,
    Megaphone,
    Paperclip,
    ShieldCheck,
    TrendingUp,
    Users,
} from 'lucide-react';
import type { ComponentType } from 'react';

interface HeroMetric {
    labelZh: string;
    labelEn: string;
    value: number;
    icon: ComponentType<{ className?: string }>;
}

const formatNumber = (value: number, locale: string) => new Intl.NumberFormat(locale).format(value);

const formatBytes = (bytes: number) => {
    if (!bytes || bytes <= 0) {
        return '-';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, exponent);

    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const formatDateTime = (value: string | null, locale: string) => {
    if (!value) {
        return locale.startsWith('zh') ? '未設定' : 'Not set';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const postStatusMeta = {
    draft: { labelZh: '草稿', labelEn: 'Draft', className: 'bg-neutral-200 text-neutral-700' },
    published: { labelZh: '發布', labelEn: 'Published', className: 'bg-emerald-100 text-emerald-700' },
    archived: { labelZh: '封存', labelEn: 'Archived', className: 'bg-amber-100 text-amber-700' },
} satisfies Record<AdminDashboardData['recentPosts'][number]['status'], { labelZh: string; labelEn: string; className: string }>;

const attachmentTypeMeta = {
    image: { labelZh: '圖片', labelEn: 'Image', className: 'bg-sky-100 text-sky-700' },
    document: { labelZh: '文件', labelEn: 'Document', className: 'bg-indigo-100 text-indigo-700' },
    link: { labelZh: '連結', labelEn: 'Link', className: 'bg-rose-100 text-rose-700' },
} satisfies Record<AdminDashboardData['recentAttachments'][number]['type'], { labelZh: string; labelEn: string; className: string }>;

export default function AdminDashboard() {
    const { locale: localeProp, adminDashboard } = usePage<SharedData>().props as SharedData & {
        adminDashboard?: AdminDashboardData | null;
    };

    const locale = (localeProp ?? 'zh-TW').toLowerCase();
    const displayLocale = locale.startsWith('zh') ? 'zh-TW' : 'en-US';
    const isZh = locale.startsWith('zh');

    if (!adminDashboard) {
        return (
            <section className="space-y-6">
                <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                    <CardContent className="px-6 py-6 text-sm text-neutral-600">
                        {isZh ? '目前沒有儀表板資料。' : 'No dashboard data available.'}
                    </CardContent>
                </Card>
            </section>
        );
    }

    const { metrics, attachments, contactMessages, recentPosts, recentAttachments, generatedAt } = adminDashboard;

    const heroMetrics: HeroMetric[] = [
        { labelZh: '公告總數', labelEn: 'Total posts', value: metrics.totalPosts, icon: Megaphone },
        { labelZh: '已發布', labelEn: 'Published', value: metrics.publishedPosts, icon: FileText },
        { labelZh: '附件數', labelEn: 'Attachments', value: attachments.total, icon: Paperclip },
        {
            labelZh: '待處理訊息',
            labelEn: 'Open messages',
            value: contactMessages.new + contactMessages.in_progress,
            icon: Inbox,
        },
    ];

    const statCards = [
        {
            title: isZh ? '草稿公告' : 'Draft posts',
            value: metrics.draftPosts,
            description: isZh ? '等待審核與排程' : 'Awaiting review and scheduling',
            icon: Calendar,
        },
        {
            title: isZh ? '封存公告' : 'Archived posts',
            value: metrics.archivedPosts,
            description: isZh ? '不再對外顯示' : 'No longer visible publicly',
            icon: ShieldCheck,
        },
        {
            title: isZh ? '置頂公告' : 'Pinned posts',
            value: metrics.pinnedPosts,
            description: isZh ? '頁面優先顯示項目' : 'Highlighted on bulletin page',
            icon: TrendingUp,
        },
        {
            title: isZh ? '系統使用者' : 'System users',
            value: metrics.totalUsers,
            description: isZh ? '具備登入與管理權限' : 'Active authenticated accounts',
            icon: Users,
        },
    ];

    const contactEntries = [
        {
            key: 'new',
            label: isZh ? '新進' : 'New',
            value: contactMessages.new,
            icon: AlertCircle,
            tone: 'text-rose-600',
        },
        {
            key: 'in_progress',
            label: isZh ? '處理中' : 'In progress',
            value: contactMessages.in_progress,
            icon: BarChart3,
            tone: 'text-amber-600',
        },
        {
            key: 'resolved',
            label: isZh ? '已結案' : 'Resolved',
            value: contactMessages.resolved,
            icon: CheckCircle2,
            tone: 'text-emerald-600',
        },
        {
            key: 'spam',
            label: isZh ? '垃圾訊息' : 'Spam',
            value: contactMessages.spam,
            icon: AlertCircle,
            tone: 'text-neutral-500',
        },
    ];

    const formatStatus = (status: AdminDashboardData['recentPosts'][number]['status']) => {
        const meta = postStatusMeta[status];
        return (
            <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium', meta.className)}>
                {isZh ? meta.labelZh : meta.labelEn}
            </span>
        );
    };

    const formatAttachmentType = (type: AdminDashboardData['recentAttachments'][number]['type']) => {
        const meta = attachmentTypeMeta[type];
        return (
            <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium', meta.className)}>
                {isZh ? meta.labelZh : meta.labelEn}
            </span>
        );
    };

    return (
        <>
            <Head title={isZh ? '系統總覽' : 'System overview'} />

            <section className="space-y-6">
                <div className="rounded-3xl bg-white px-6 py-8 shadow-sm ring-1 ring-black/5">
                    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                        <div className="space-y-5">
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#151f54]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#151f54]">
                                NCUE CSIE
                            </span>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-semibold text-[#151f54] md:text-4xl">
                                    {isZh ? '系統管理總覽' : 'Administrative overview'}
                                </h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    {isZh
                                        ? '掌握公告、附件與訊息處理狀態，快速前往常用操作。'
                                        : 'Track announcements, attachments, and message queues with quick access to core tools.'}
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {heroMetrics.map(({ labelZh, labelEn, value, icon: Icon }) => (
                                    <div
                                        key={labelEn}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-[#d5dcf8] bg-[#f7f8fc] px-5 py-4 text-sm text-[#151f54] shadow-sm"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-[#4c558c]">{isZh ? labelZh : labelEn}</p>
                                            <p className="text-xl font-semibold text-[#151f54]">
                                                {formatNumber(value, displayLocale)}
                                            </p>
                                        </div>
                                        <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-[#151f54] shadow-sm">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:w-56">
                            <Button asChild className="rounded-full bg-[#151f54] text-white shadow-sm hover:bg-[#1f2a6d]">
                                <Link href="/manage/admin/posts/create">{isZh ? '新增公告' : 'Create bulletin'}</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-[#151f54]/30 text-[#151f54] hover:bg-[#f4f6ff]"
                            >
                                <Link href="/manage/admin/attachments">{isZh ? '附件庫' : 'Attachment library'}</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-[#151f54]/30 text-[#151f54] hover:bg-[#f4f6ff]"
                            >
                                <Link href="/manage/admin/contact-messages">{isZh ? '訊息收件匣' : 'Message inbox'}</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(({ title, value, description, icon: Icon }) => (
                        <Card key={title} className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                            <CardContent className="flex items-start justify-between gap-3 px-6 py-5">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{title}</p>
                                    <p className="text-2xl font-semibold text-[#151f54]">
                                        {formatNumber(value, displayLocale)}
                                    </p>
                                    <p className="text-xs text-neutral-500">{description}</p>
                                </div>
                                <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#151f54]/10 text-[#151f54]">
                                    <Icon className="h-5 w-5" />
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-[#151f54]">
                                {isZh ? '近期公告' : 'Recent announcements'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                                    <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">{isZh ? '標題' : 'Title'}</th>
                                            <th className="px-4 py-3 font-medium">{isZh ? '狀態' : 'Status'}</th>
                                            <th className="px-4 py-3 font-medium">{isZh ? '發布時間' : 'Published at'}</th>
                                            <th className="px-4 py-3 font-medium">{isZh ? '附件' : 'Attachments'}</th>
                                            <th className="px-4 py-3 font-medium text-right">{isZh ? '操作' : 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {recentPosts.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-500">
                                                    {isZh ? '目前沒有公告資料' : 'No announcements available yet.'}
                                                </td>
                                            </tr>
                                        )}
                                        {recentPosts.map((post) => (
                                            <tr key={post.id} className="hover:bg-[#f7f8fc]">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <Link
                                                            href={`/manage/admin/posts/${post.id}`}
                                                            className="text-sm font-semibold text-[#151f54] hover:text-[#8a6300]"
                                                        >
                                                            {isZh ? post.title : post.title_en || post.title}
                                                        </Link>
                                                        <span className="text-xs text-neutral-500">
                                                            {post.category ? (isZh ? post.category.name : post.category.name_en) : isZh ? '未分類' : 'Uncategorised'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">{formatStatus(post.status)}</td>
                                                <td className="px-4 py-4 text-sm text-neutral-600">
                                                    {formatDateTime(post.publish_at, displayLocale)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-neutral-600">
                                                    {isZh
                                                        ? `${post.attachments_count} 筆`
                                                        : `${post.attachments_count} item${post.attachments_count === 1 ? '' : 's'}`}
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm">
                                                    <Link
                                                        href={`/manage/admin/posts/${post.id}/edit`}
                                                        className="inline-flex items-center gap-1 text-[#151f54] hover:text-[#8a6300]"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        {isZh ? '編輯' : 'Edit'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-[#151f54]">
                                    {isZh ? '附件概況' : 'Attachment summary'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-2xl bg-[#f7f8fc] px-4 py-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                                            {isZh ? '容量使用' : 'Storage used'}
                                        </p>
                                        <p className="text-lg font-semibold text-[#151f54]">{formatBytes(attachments.totalSize)}</p>
                                    </div>
                                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-[#151f54] shadow-sm">
                                        <Paperclip className="h-5 w-5" />
                                    </span>
                                </div>
                                <ul className="space-y-3 text-sm text-neutral-600">
                                    <li className="flex items-center justify-between">
                                        <span>{isZh ? '圖片' : 'Images'}</span>
                                        <span className="font-medium text-[#151f54]">
                                            {formatNumber(attachments.images, displayLocale)}
                                        </span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>{isZh ? '文件' : 'Documents'}</span>
                                        <span className="font-medium text-[#151f54]">
                                            {formatNumber(attachments.documents, displayLocale)}
                                        </span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>{isZh ? '連結' : 'Links'}</span>
                                        <span className="font-medium text-[#151f54]">
                                            {formatNumber(attachments.links, displayLocale)}
                                        </span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>{isZh ? '已刪除' : 'Trashed'}</span>
                                        <span className="font-medium text-[#151f54]">
                                            {formatNumber(attachments.trashed, displayLocale)}
                                        </span>
                                    </li>
                                </ul>
                                <Link
                                    href="/manage/admin/attachments"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#151f54] hover:text-[#8a6300]"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                    {isZh ? '檢視全部附件' : 'View attachment library'}
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-[#151f54]">
                                    {isZh ? '聯絡訊息' : 'Contact messages'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {contactEntries.map(({ key, label, value, icon: Icon, tone }) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between rounded-2xl border border-neutral-200/70 px-4 py-3"
                                    >
                                        <span className="inline-flex items-center gap-2 text-sm text-neutral-600">
                                            <Icon className={cn('h-4 w-4', tone)} />
                                            {label}
                                        </span>
                                        <span className="text-sm font-semibold text-[#151f54]">
                                            {formatNumber(value, displayLocale)}
                                        </span>
                                    </div>
                                ))}
                                <Link
                                    href="/manage/admin/contact-messages"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#151f54] hover:text-[#8a6300]"
                                >
                                    <Inbox className="h-4 w-4" />
                                    {isZh ? '開啟收件匣' : 'Open inbox'}
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="border-0 bg-white shadow-sm ring-1 ring-black/5">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-[#151f54]">
                            {isZh ? '最新附件' : 'Latest attachments'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-200 text-sm">
                                <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">{isZh ? '名稱' : 'Title'}</th>
                                        <th className="px-4 py-3 font-medium">{isZh ? '類型' : 'Type'}</th>
                                        <th className="px-4 py-3 font-medium">{isZh ? '來源' : 'Source'}</th>
                                        <th className="px-4 py-3 font-medium">{isZh ? '大小' : 'Size'}</th>
                                        <th className="px-4 py-3 font-medium">{isZh ? '建立時間' : 'Created at'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {recentAttachments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-500">
                                                {isZh ? '目前沒有附件資料' : 'No attachments uploaded yet.'}
                                            </td>
                                        </tr>
                                    )}
                                    {recentAttachments.map((attachment) => (
                                        <tr key={attachment.id} className="hover:bg-[#f7f8fc]">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold text-[#151f54]">
                                                        {attachment.title ?? `#${attachment.id}`}
                                                    </span>
                                                    {attachment.attachable?.label && (
                                                        <span className="text-xs text-neutral-500">
                                                            {attachment.attachable.label}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">{formatAttachmentType(attachment.type)}</td>
                                            <td className="px-4 py-4 text-sm text-neutral-600">
                                                {attachment.attachable?.type ?? (isZh ? '未指定' : 'Unassigned')}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-neutral-600">
                                                {formatBytes(attachment.file_size ?? 0)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-neutral-600">
                                                {formatDateTime(attachment.created_at, displayLocale)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-xs text-neutral-500">
                    {isZh ? '資料更新時間：' : 'Data generated at: '}
                    {formatDateTime(generatedAt, displayLocale)}
                </p>
            </section>
        </>
    );
}
