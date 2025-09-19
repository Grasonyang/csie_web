import { FormEvent, useEffect, useMemo, useState } from 'react';
import ContactMessageController from '@/actions/App/Http/Controllers/Admin/ContactMessageController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AdminPageHeader from '@/components/admin/admin-page-header';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Eye,
    Inbox,
    Mail,
    PhoneCall,
    Trash2,
    User,
} from 'lucide-react';

interface ContactMessage {
    id: number;
    locale: string | null;
    name: string;
    email: string;
    subject: string;
    message: string;
    file_url: string | null;
    status: 'new' | 'in_progress' | 'resolved' | 'spam';
    processed_by: number | null;
    processed_at: string | null;
    processor?: {
        id: number;
        name: string;
        email: string;
    } | null;
    created_at: string;
    updated_at: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ContactMessagesIndexProps {
    messages: {
        data: ContactMessage[];
        meta?: PaginationMeta;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters?: {
        search?: string;
        status?: string;
        per_page?: number;
    };
    statusOptions?: Record<string, string>;
    perPageOptions?: number[];
}

type FilterState = {
    search: string;
    status: string;
    per_page: string;
};

const DEFAULT_PAGINATION_META: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
};

const STATUS_METADATA: Record<ContactMessage['status'], { zh: string; en: string; variant: 'default' | 'secondary' | 'outline'; colorClass: string }> = {
    new: { zh: '新的', en: 'New', variant: 'default', colorClass: 'bg-blue-600 hover:bg-blue-700' },
    in_progress: { zh: '處理中', en: 'In progress', variant: 'default', colorClass: 'bg-amber-600 hover:bg-amber-700' },
    resolved: { zh: '已處理', en: 'Resolved', variant: 'secondary', colorClass: '' },
    spam: { zh: '垃圾', en: 'Spam', variant: 'outline', colorClass: 'border-red-300 text-red-600' },
};

export default function ContactMessagesIndex({ messages, filters = {}, perPageOptions = [] }: ContactMessagesIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';
    const { delete: destroy, patch } = useForm();

    const messagesData = messages?.data ?? [];
    const paginationMeta: PaginationMeta = {
        current_page: messages?.meta?.current_page ?? messages?.current_page ?? DEFAULT_PAGINATION_META.current_page,
        last_page: messages?.meta?.last_page ?? messages?.last_page ?? DEFAULT_PAGINATION_META.last_page,
        per_page: messages?.meta?.per_page ?? messages?.per_page ?? DEFAULT_PAGINATION_META.per_page,
        total: messages?.meta?.total ?? messages?.total ?? DEFAULT_PAGINATION_META.total,
    };
    const paginationLinks = messages?.links ?? [];
    const resolvedPerPageOptions = perPageOptions.length > 0 ? perPageOptions : [10, 20, 50];

    const initialPerPage = String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page);

    const [filterState, setFilterState] = useState<FilterState>({
        search: filters.search ?? '',
        status: filters.status ?? '',
        per_page: initialPerPage,
    });

    useEffect(() => {
        setFilterState({
            search: filters.search ?? '',
            status: filters.status ?? '',
            per_page: String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page),
        });
    }, [filters.search, filters.status, filters.per_page, paginationMeta.per_page]);

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
        router.get(ContactMessageController.index().url, buildFilterQuery(), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const resetState: FilterState = {
            search: '',
            status: '',
            per_page: String(paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page),
        };
        setFilterState(resetState);
        router.get(ContactMessageController.index().url, { per_page: resetState.per_page }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        const { search, status } = filterState;
        return [search, status].some((value) => value !== '');
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

    const paginationRangeStart = messagesData.length === 0 ? 0 : (currentPage - 1) * perPageCount + 1;
    const paginationRangeEnd = messagesData.length === 0 ? 0 : paginationRangeStart + messagesData.length - 1;

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= lastPage;

    const goToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.get(ContactMessageController.index().url, buildFilterQuery({ page }), {
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

    const formatDateTime = (value: string) => new Date(value).toLocaleString(isZh ? 'zh-TW' : 'en-US');

    const getStatusBadge = (status: ContactMessage['status']) => {
        const meta = STATUS_METADATA[status];
        return (
            <Badge
                variant={meta.variant}
                className={cn('capitalize', meta.colorClass)}
            >
                {isZh ? meta.zh : meta.en}
            </Badge>
        );
    };

    const sanitizeLabel = (label: string) =>
        label
            .replace(/<[^>]+>/g, '')
            .replace(/&laquo;/g, '«')
            .replace(/&raquo;/g, '»')
            .replace(/&nbsp;/g, ' ');

    const statusFilters = (
        Object.keys(STATUS_METADATA) as Array<ContactMessage['status']>
    ).map((value) => ({
        value,
        label: isZh ? STATUS_METADATA[value].zh : STATUS_METADATA[value].en,
    }));

    const handleStatusUpdate = (message: ContactMessage, target: 'resolved' | 'spam') => {
        const action = target === 'resolved' ? ContactMessageController.markAsResolved : ContactMessageController.markAsSpam;
        const confirmMessage =
            target === 'resolved'
                ? isZh
                    ? '確認將此訊息標記為已處理？'
                    : 'Mark this message as resolved?'
                : isZh
                    ? '確認將此訊息標記為垃圾郵件？'
                    : 'Mark this message as spam?';

        if (confirm(confirmMessage)) {
            patch(action({ contactMessage: message.id }).url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const handleDelete = (message: ContactMessage) => {
        if (
            confirm(
                isZh
                    ? `確定要刪除「${message.subject}」的聯絡訊息嗎？`
                    : `Delete the contact message "${message.subject}"?`
            )
        ) {
            destroy(ContactMessageController.destroy(message.id).url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title={isZh ? '聯絡訊息' : 'Contact Messages'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <AdminPageHeader
                        title={isZh ? '聯絡訊息' : 'Contact Messages'}
                        description={
                            isZh
                                ? '集中處理來自聯絡表單的詢問與回覆狀態'
                                : 'Track and respond to contact form submissions efficiently'
                        }
                        icon={Inbox}
                    />

                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Inbox className="h-5 w-5 text-blue-600" />
                                {isZh ? '訊息列表' : 'Messages List'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={applyFilters} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                                <div className="xl:col-span-3">
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="message-search">
                                        {isZh ? '搜尋訊息' : 'Search messages'}
                                    </label>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <Input
                                            id="message-search"
                                            type="search"
                                            placeholder={isZh ? '輸入姓名、Email 或主旨' : 'Type name, email, or subject'}
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
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="message-status">
                                        {isZh ? '狀態' : 'Status'}
                                    </label>
                                    <Select
                                        id="message-status"
                                        value={filterState.status}
                                        onChange={(event) => handleFilterChange('status', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部狀態' : 'All statuses'}</option>
                                        {statusFilters.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="message-per-page">
                                        {isZh ? '每頁筆數' : 'Per page'}
                                    </label>
                                    <Select
                                        id="message-per-page"
                                        value={filterState.per_page}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            handleFilterChange('per_page', value);
                                            router.get(ContactMessageController.index().url, buildFilterQuery({ per_page: value }), {
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

                                <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end sm:justify-end sm:gap-3 xl:col-span-5">
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
                                        {messagesData.length === 0
                                            ? isZh
                                                ? '目前查無符合條件的訊息'
                                                : 'No messages match the current filters'
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
                                {hasActiveFilters && messagesData.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-amber-700">
                                        {isZh ? '篩選中' : 'Filters active'}
                                    </span>
                                )}
                            </div>

                            {messagesData.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Mail className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                        {isZh ? '尚無聯絡訊息' : 'No messages yet'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isZh ? '等待使用者透過聯絡表單送出訊息' : 'Messages from the contact form will appear here'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messagesData.map((message) => (
                                        <div
                                            key={message.id}
                                            className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md md:p-6"
                                        >
                                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0 flex-1 space-y-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {getStatusBadge(message.status)}
                                                        <h3 className="text-lg font-semibold leading-snug text-gray-900">
                                                            {message.subject || (isZh ? '未填寫主旨' : 'No subject provided')}
                                                        </h3>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                                                        <span className="inline-flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            {message.name}
                                                        </span>
                                                        <a
                                                            href={`mailto:${message.email}`}
                                                            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            {message.email}
                                                        </a>
                                                        {message.file_url && (
                                                            <a
                                                                href={message.file_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                                                            >
                                                                <PhoneCall className="h-4 w-4" />
                                                                {isZh ? '附件' : 'Attachment'}
                                                            </a>
                                                        )}
                                                    </div>

                                                    <p className="whitespace-pre-line break-words text-sm text-gray-600">
                                                        {message.message.length > 220
                                                            ? `${message.message.slice(0, 220)}…`
                                                            : message.message}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                        <span>
                                                            {isZh ? '送出時間：' : 'Submitted at: '} {formatDateTime(message.created_at)}
                                                        </span>
                                                        {message.processor && (
                                                            <span>
                                                                {isZh ? '處理者：' : 'Handled by: '} {message.processor.name}
                                                            </span>
                                                        )}
                                                        {message.processed_at && (
                                                            <span>
                                                                {isZh ? '更新時間：' : 'Updated at: '} {formatDateTime(message.processed_at)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0 sm:ml-4 sm:self-start sm:border-l sm:border-gray-200 sm:pl-4">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={ContactMessageController.show(message.id).url}>
                                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{isZh ? '檢視訊息' : 'View message'}</TooltipContent>
                                                    </Tooltip>
                                                    {message.status !== 'resolved' && message.status !== 'spam' && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-green-600 hover:text-green-800"
                                                                    onClick={() => handleStatusUpdate(message, 'resolved')}
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>{isZh ? '標記為已處理' : 'Mark as resolved'}</TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {message.status !== 'spam' && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-amber-600 hover:text-amber-800"
                                                                    onClick={() => handleStatusUpdate(message, 'spam')}
                                                                >
                                                                    <AlertTriangle className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>{isZh ? '標記為垃圾訊息' : 'Mark as spam'}</TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-800"
                                                                onClick={() => handleDelete(message)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{isZh ? '刪除訊息' : 'Delete message'}</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
