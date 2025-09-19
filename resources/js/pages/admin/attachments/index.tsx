import { FormEvent, useEffect, useMemo, useState } from 'react';
import AttachmentController from '@/actions/App/Http/Controllers/Admin/AttachmentController';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import AttachmentDownloadController from '@/actions/App/Http/Controllers/AttachmentDownloadController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowDownToLine,
    FileText,
    Image as ImageIcon,
    LinkIcon,
    RotateCcw,
    Trash2,
} from 'lucide-react';

interface Attachment {
    id: number;
    attachable_type: string | null;
    attachable_id: number | null;
    type: 'image' | 'document' | 'link';
    title: string | null;
    file_url: string | null;
    external_url: string | null;
    mime_type: string | null;
    file_size: number | null;
    alt_text: string | null;
    alt_text_en: string | null;
    sort_order: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    attachable?: Record<string, any> | null;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AttachmentsIndexProps {
    attachments: {
        data: Attachment[];
        meta?: PaginationMeta;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters?: {
        search?: string;
        type?: string;
        attachable_type?: string;
        attachable_id?: string | number;
        trashed?: string;
        per_page?: number;
    };
    typeOptions?: string[];
    attachableTypeOptions?: string[];
    perPageOptions?: number[];
}

type FilterState = {
    search: string;
    type: string;
    attachable_type: string;
    attachable_id: string;
    trashed: string;
    per_page: string;
};

const DEFAULT_PAGINATION_META: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
};

const TYPE_INFO: Record<Attachment['type'], { zh: string; en: string; icon: React.ComponentType<{ className?: string }> }> = {
    image: { zh: '圖片', en: 'Image', icon: ImageIcon },
    document: { zh: '文件', en: 'Document', icon: FileText },
    link: { zh: '連結', en: 'Link', icon: LinkIcon },
};

const TRASHED_OPTIONS = [
    { value: '', zh: '僅顯示現存', en: 'Active only' },
    { value: 'with', zh: '含已刪除', en: 'Include deleted' },
    { value: 'only', zh: '僅已刪除', en: 'Only deleted' },
];

const formatBytes = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
};

const sanitizeLabel = (label: string) =>
    label
        .replace(/<[^>]+>/g, '')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&nbsp;/g, ' ');

export default function AttachmentsIndex({
    attachments,
    filters = {},
    typeOptions = ['image', 'document', 'link'],
    attachableTypeOptions = [],
    perPageOptions = [],
}: AttachmentsIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';
    const { delete: destroy, patch } = useForm();

    const attachmentsData = attachments?.data ?? [];
    const paginationMeta: PaginationMeta = {
        current_page: attachments?.meta?.current_page ?? attachments?.current_page ?? DEFAULT_PAGINATION_META.current_page,
        last_page: attachments?.meta?.last_page ?? attachments?.last_page ?? DEFAULT_PAGINATION_META.last_page,
        per_page: attachments?.meta?.per_page ?? attachments?.per_page ?? DEFAULT_PAGINATION_META.per_page,
        total: attachments?.meta?.total ?? attachments?.total ?? DEFAULT_PAGINATION_META.total,
    };
    const paginationLinks = attachments?.links ?? [];
    const resolvedPerPageOptions = perPageOptions.length > 0 ? perPageOptions : [10, 20, 50];

    const initialPerPage = String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page);

    const [filterState, setFilterState] = useState<FilterState>({
        search: filters.search ?? '',
        type: filters.type ?? '',
        attachable_type: filters.attachable_type ?? '',
        attachable_id: filters.attachable_id ? String(filters.attachable_id) : '',
        trashed: filters.trashed ?? '',
        per_page: initialPerPage,
    });

    useEffect(() => {
        setFilterState({
            search: filters.search ?? '',
            type: filters.type ?? '',
            attachable_type: filters.attachable_type ?? '',
            attachable_id: filters.attachable_id ? String(filters.attachable_id) : '',
            trashed: filters.trashed ?? '',
            per_page: String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page),
        });
    }, [
        filters.search,
        filters.type,
        filters.attachable_type,
        filters.attachable_id,
        filters.trashed,
        filters.per_page,
        paginationMeta.per_page,
    ]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilterState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const buildFilterQuery = (overrides: Record<string, string | number> = {}) => {
        const query: Record<string, string | number> = {};

        for (const [key, value] of Object.entries(filterState)) {
            if (value !== '') {
                query[key] = value;
            }
        }

        for (const [key, value] of Object.entries(overrides)) {
            if (value !== '' && value !== undefined && value !== null) {
                query[key] = value;
            }
        }

        return query;
    };

    const applyFilters = (event?: FormEvent) => {
        event?.preventDefault();
        router.get(AttachmentController.index().url, buildFilterQuery(), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const resetState: FilterState = {
            search: '',
            type: '',
            attachable_type: '',
            attachable_id: '',
            trashed: '',
            per_page: String(paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page),
        };
        setFilterState(resetState);
        router.get(AttachmentController.index().url, { per_page: resetState.per_page }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        const { search, type, attachable_type, attachable_id, trashed } = filterState;
        return [search, type, attachable_type, attachable_id, trashed].some((value) => value !== '');
    }, [filterState]);

    const parseNumber = (value: unknown, fallback: number) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const currentPage = parseNumber(paginationMeta.current_page, DEFAULT_PAGINATION_META.current_page);
    const lastPage = parseNumber(paginationMeta.last_page, DEFAULT_PAGINATION_META.last_page);
    const perPageCount = parseNumber(
        paginationMeta.per_page,
        parseNumber(filterState.per_page, DEFAULT_PAGINATION_META.per_page)
    );

    const paginationRangeStart = attachmentsData.length === 0 ? 0 : (currentPage - 1) * perPageCount + 1;
    const paginationRangeEnd = attachmentsData.length === 0 ? 0 : paginationRangeStart + attachmentsData.length - 1;

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= lastPage;

    const goToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.get(AttachmentController.index().url, buildFilterQuery({ page }), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const paginationButtonClass = (disabled: boolean) =>
        cn(
            'h-8 w-8 border transition-colors inline-flex items-center justify-center rounded-md',
            disabled
                ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-500'
                : 'border-transparent bg-amber-700 text-white shadow-sm hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-400'
        );

    const formatTypeLabel = (type: Attachment['type']) => {
        const meta = TYPE_INFO[type];
        return isZh ? meta.zh : meta.en;
    };

    const describeFilterAttachableType = (type: string) => {
        if (type === '') {
            return '';
        }

        if (type.includes('Post')) {
            const base = isZh ? '公告' : 'Post';
            return `${base} (${type})`;
        }

        const segment = type.split('\\').pop();
        if (!segment) {
            return type;
        }

        if (segment === type) {
            return segment;
        }

        return `${segment} (${type})`;
    };

    const sourceInfoParts: string[] = [];
    const filterTypeLabel = describeFilterAttachableType(filterState.attachable_type);
    if (filterTypeLabel !== '') {
        sourceInfoParts.push(filterTypeLabel);
    }
    if (filterState.attachable_id !== '') {
        sourceInfoParts.push(`#${filterState.attachable_id}`);
    }

    const hasSourceFilter = sourceInfoParts.length > 0;
    const sourceDisplay = sourceInfoParts.join(' · ');
    const emptyStateTitle = hasSourceFilter
        ? isZh
            ? '找不到對應的附件'
            : 'No related attachments'
        : isZh
            ? '尚無附件'
            : 'No attachments';
    const emptyStateDescription = hasSourceFilter
        ? isZh
            ? `來源 ${sourceDisplay} 暫無附件紀錄，請確認來源資料是否已建立附件。`
            : `No attachments were found for source ${sourceDisplay}. Please verify the record or try again later.`
        : isZh
            ? '目前查無符合條件的附件'
            : 'No attachments match the current filters.';

    const formatAttachableLabel = (attachment: Attachment) => {
        if (!attachment.attachable_type) {
            return isZh ? '未關聯' : 'Unassigned';
        }

        const baseType = attachment.attachable_type.split('\\').pop() ?? attachment.attachable_type;

        const idLabel = attachment.attachable_id ?? '?';

        if (attachment.attachable_type.includes('Post')) {
            const title = attachment.attachable?.title ?? attachment.attachable?.name ?? `#${idLabel}`;
            return `${isZh ? '公告' : 'Post'} · ${title}`;
        }

        const identifier = attachment.attachable?.title ?? attachment.attachable?.name ?? attachment.attachable?.slug;
        return identifier ? `${baseType} · ${identifier}` : `${baseType} #${idLabel}`;
    };

    const formatDateTime = (value: string) => new Date(value).toLocaleString(isZh ? 'zh-TW' : 'en-US');

    const handleSoftDelete = (attachment: Attachment) => {
        if (
            confirm(
                isZh
                    ? `確定要移除附件「${attachment.title ?? attachment.file_url ?? attachment.external_url ?? attachment.id}」嗎？`
                    : `Delete attachment "${attachment.title ?? attachment.file_url ?? attachment.external_url ?? attachment.id}"?`
            )
        ) {
            destroy(AttachmentController.destroy(attachment.id).url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const handleRestore = (attachment: Attachment) => {
        patch(AttachmentController.restore(attachment.id).url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleForceDelete = (attachment: Attachment) => {
        if (
            confirm(
                isZh
                    ? '確定要永久刪除此附件？此動作無法復原。'
                    : 'Permanently delete this attachment? This action cannot be undone.'
            )
        ) {
            destroy(AttachmentController.forceDelete(attachment.id).url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title={isZh ? '附件管理' : 'Attachment Library'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {isZh ? '附件管理' : 'Attachment Library'}
                            </h1>
                            <p className="mt-1 text-gray-600">
                                {isZh
                                    ? '集中管理公告與頁面所使用的檔案資源'
                                    : 'Centralize files and links referenced across the site'}
                            </p>
                        </div>
                    </div>

                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <FileText className="h-5 w-5 text-blue-600" />
                                {isZh ? '附件列表' : 'Attachments List'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={applyFilters} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                                <div className="xl:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="attachment-search">
                                        {isZh ? '搜尋附件' : 'Search attachments'}
                                    </label>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <Input
                                            id="attachment-search"
                                            type="search"
                                            placeholder={isZh ? '輸入標題、檔名或 MIME' : 'Title, file name, or mime type'}
                                            value={filterState.search}
                                            onChange={(event) => handleFilterChange('search', event.target.value)}
                                            className="w-full sm:flex-1"
                                        />
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            className="w-full shrink-0 sm:w-auto"
                                        >
                                            {isZh ? '搜尋' : 'Search'}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="attachment-type">
                                        {isZh ? '附件類型' : 'Type'}
                                    </label>
                                    <Select
                                        id="attachment-type"
                                        value={filterState.type}
                                        onChange={(event) => handleFilterChange('type', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部類型' : 'All types'}</option>
                                        {typeOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {formatTypeLabel(option as Attachment['type'])}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="attachment-attachable">
                                        {isZh ? '資料來源' : 'Attachable'}
                                    </label>
                                    <Select
                                        id="attachment-attachable"
                                        value={filterState.attachable_type}
                                        onChange={(event) => handleFilterChange('attachable_type', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部來源' : 'All sources'}</option>
                                        {attachableTypeOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="attachment-source-id">
                                        {isZh ? '來源 ID' : 'Source ID'}
                                    </label>
                                    <Input
                                        id="attachment-source-id"
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        placeholder={isZh ? '輸入來源資料 ID' : 'Enter source record ID'}
                                        value={filterState.attachable_id}
                                        onChange={(event) => handleFilterChange('attachable_id', event.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="attachment-trashed">
                                        {isZh ? '刪除範圍' : 'Trashed filter'}
                                    </label>
                                    <Select
                                        id="attachment-trashed"
                                        value={filterState.trashed}
                                        onChange={(event) => handleFilterChange('trashed', event.target.value)}
                                    >
                                        {TRASHED_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {isZh ? option.zh : option.en}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="attachment-per-page">
                                        {isZh ? '每頁筆數' : 'Per page'}
                                    </label>
                                    <Select
                                        id="attachment-per-page"
                                        value={filterState.per_page}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            handleFilterChange('per_page', value);
                                            router.get(AttachmentController.index().url, buildFilterQuery({ per_page: value }), {
                                                preserveScroll: true,
                                                preserveState: true,
                                                replace: true,
                                            });
                                        }}
                                    >
                                        {resolvedPerPageOptions.map((option) => (
                                            <option key={option} value={option.toString()}>
                                                {option}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end sm:justify-end sm:gap-3 xl:col-span-6">
                                    {hasActiveFilters && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={resetFilters}
                                            className="w-full md:w-auto"
                                        >
                                            {isZh ? '清除篩選' : 'Reset filters'}
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto"
                                    >
                                        {isZh ? '套用篩選' : 'Apply filters'}
                                    </Button>
                                </div>
                            </form>

                            <div className="mb-4 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-disabled={isPrevDisabled}
                                        onClick={() => {
                                            if (!isPrevDisabled) {
                                                goToPage(currentPage - 1);
                                            }
                                        }}
                                        aria-label={isZh ? '上一頁' : 'Previous page'}
                                        className={paginationButtonClass(isPrevDisabled)}
                                    >
                                        <span aria-hidden>‹</span>
                                    </Button>
                                    <span className="flex-1 select-none rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-center text-sm font-medium text-gray-900 sm:min-w-[14rem] sm:text-left">
                                        {attachmentsData.length === 0
                                            ? emptyStateDescription
                                            : isZh
                                                ? `顯示第 ${paginationRangeStart} - ${paginationRangeEnd} 筆，共 ${paginationMeta.total} 筆`
                                                : `Showing ${paginationRangeStart}-${paginationRangeEnd} of ${paginationMeta.total}`}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-disabled={isNextDisabled}
                                        onClick={() => {
                                            if (!isNextDisabled) {
                                                goToPage(currentPage + 1);
                                            }
                                        }}
                                        aria-label={isZh ? '下一頁' : 'Next page'}
                                        className={paginationButtonClass(isNextDisabled)}
                                    >
                                        <span aria-hidden>›</span>
                                    </Button>
                                </div>
                                {hasActiveFilters && attachmentsData.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-amber-700">
                                        {isZh ? '篩選中' : 'Filters active'}
                                    </span>
                                )}
                            </div>

                            {attachmentsData.length === 0 ? (
                                <div className="py-12 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{emptyStateTitle}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{emptyStateDescription}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {attachmentsData.map((attachment) => {
                                        const typeMeta = TYPE_INFO[attachment.type];
                                        const TypeIcon = typeMeta.icon;
                                        const isDeleted = Boolean(attachment.deleted_at);
                                        const matchesSourceFilter =
                                            filterState.attachable_id !== '' &&
                                            String(attachment.attachable_id ?? '') === filterState.attachable_id;

                                        return (
                                            <div
                                                key={attachment.id}
                                                className={cn(
                                                    'rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md md:p-6',
                                                    isDeleted && 'border-red-200 bg-red-50'
                                                )}
                                            >
                                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0 flex-1 space-y-3">
                                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                            <Badge variant="outline" className="flex items-center gap-1">
                                                                <TypeIcon className="h-3.5 w-3.5" />
                                                                {formatTypeLabel(attachment.type)}
                                                            </Badge>
                                                            <Badge variant="outline">#{attachment.id}</Badge>
                                                            <Badge variant="outline">{formatAttachableLabel(attachment)}</Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    'flex items-center gap-1',
                                                                    matchesSourceFilter &&
                                                                        'border-amber-300 bg-amber-50 text-amber-700'
                                                                )}
                                                            >
                                                                {isZh ? '來源 ID' : 'Source ID'}：
                                                                {attachment.attachable_id ?? '—'}
                                                            </Badge>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <h3 className="text-lg font-semibold leading-snug text-gray-900">
                                                                {attachment.title || attachment.file_url || attachment.external_url || `#${attachment.id}`}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {attachment.alt_text || attachment.alt_text_en || (isZh ? '未提供替代文字' : 'No alt text provided')}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                            <span>{isZh ? '大小：' : 'Size: '}{formatBytes(attachment.file_size)}</span>
                                                            {attachment.mime_type && <span>{attachment.mime_type}</span>}
                                                            <span>
                                                                {isZh ? '建立：' : 'Created: '} {formatDateTime(attachment.created_at)}
                                                            </span>
                                                            <span>
                                                                {isZh ? '更新：' : 'Updated: '} {formatDateTime(attachment.updated_at)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0 sm:ml-4 sm:self-start sm:border-l sm:border-gray-200 sm:pl-4">
                                                        {attachment.attachable_type?.includes('Post') && attachment.attachable_id && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link href={PostController.edit(attachment.attachable_id).url}>
                                                                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800">
                                                                            <LinkIcon className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '前往公告' : 'Open post'}</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {attachment.file_url && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link href={AttachmentDownloadController.redirect(attachment.id).url}>
                                                                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                                            <TypeIcon className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '預覽附件' : 'View attachment'}</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {attachment.external_url && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <a
                                                                        href={attachment.external_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                                            <LinkIcon className="h-4 w-4" />
                                                                        </Button>
                                                                    </a>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '開啟外部連結' : 'Open external link'}</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {attachment.file_url && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link href={AttachmentDownloadController.download(attachment.id).url}>
                                                                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-800">
                                                                            <ArrowDownToLine className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '下載附件' : 'Download attachment'}</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {isDeleted ? (
                                                            <>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-blue-600 hover:text-blue-800"
                                                                            onClick={() => handleRestore(attachment)}
                                                                        >
                                                                            <RotateCcw className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>{isZh ? '還原附件' : 'Restore attachment'}</TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-red-600 hover:text-red-800"
                                                                            onClick={() => handleForceDelete(attachment)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>{isZh ? '永久刪除' : 'Permanently delete'}</TooltipContent>
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-600 hover:text-red-800"
                                                                        onClick={() => handleSoftDelete(attachment)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '刪除附件' : 'Delete attachment'}</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {paginationMeta.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-2 py-4">
                            {paginationLinks.map((link, index) => {
                                const sanitizedLabel = sanitizeLabel(link.label);

                                if (!link.url) {
                                    return (
                                        <span
                                            key={index}
                                            className="inline-flex items-center justify-center rounded-md border border-input px-3 py-1 text-sm font-medium text-gray-400"
                                        >
                                            {sanitizedLabel}
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => {
                                            router.visit(link.url as string, {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            });
                                        }}
                                        className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                                            link.active
                                                ? 'bg-amber-800 text-white shadow-md hover:bg-amber-900'
                                                : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                                        }`}
                                        aria-current={link.active ? 'page' : undefined}
                                    >
                                        {sanitizedLabel}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
