import { FormEvent, useEffect, useMemo, useState } from 'react';
import LabController from '@/actions/App/Http/Controllers/Admin/LabController';
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
    Calendar,
    ChevronLeft,
    ChevronRight,
    Edit,
    ExternalLink,
    FlaskConical,
    ImageOff,
    Trash2,
    Users,
} from 'lucide-react';

type Teacher = {
    id: number;
    name: string;
    name_en: string;
};

type Lab = {
    id: number;
    code: string | null;
    name: string;
    name_en: string;
    website_url: string | null;
    cover_image_url: string | null;
    visible: boolean;
    sort_order: number;
    updated_at: string;
    teachers?: Teacher[];
};

type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type LabsIndexProps = {
    labs: {
        data: Lab[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta?: PaginationMeta;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
    teachers: Teacher[];
    filters?: {
        search?: string;
        teacher?: string | number;
        visible?: string;
        per_page?: number;
    };
    perPageOptions?: number[];
};

type FilterState = {
    search: string;
    teacher: string;
    visible: string;
    per_page: string;
};

const DEFAULT_PAGINATION_META: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
};

export default function LabsIndex({ labs, teachers, filters = {}, perPageOptions = [] }: LabsIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    const { delete: destroy } = useForm();

    const labsData = labs?.data ?? [];
    const paginationMeta: PaginationMeta = {
        current_page:
            labs?.meta?.current_page ?? labs?.current_page ?? DEFAULT_PAGINATION_META.current_page,
        last_page: labs?.meta?.last_page ?? labs?.last_page ?? DEFAULT_PAGINATION_META.last_page,
        per_page: labs?.meta?.per_page ?? labs?.per_page ?? DEFAULT_PAGINATION_META.per_page,
        total: labs?.meta?.total ?? labs?.total ?? DEFAULT_PAGINATION_META.total,
    };
    const paginationLinks = labs?.links ?? [];

    const resolvedPerPageOptions = perPageOptions.length > 0 ? perPageOptions : [10, 20, 50];
    const initialPerPage = String(
        filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page
    );

    const [filterState, setFilterState] = useState<FilterState>({
        search: filters.search ?? '',
        teacher: filters.teacher ? String(filters.teacher) : '',
        visible: filters.visible ?? '',
        per_page: initialPerPage,
    });

    useEffect(() => {
        setFilterState({
            search: filters.search ?? '',
            teacher: filters.teacher ? String(filters.teacher) : '',
            visible: filters.visible ?? '',
            per_page: String(
                filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page
            ),
        });
    }, [filters.search, filters.teacher, filters.visible, filters.per_page, paginationMeta.per_page]);

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
        router.get(LabController.index().url, buildFilterQuery(), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const resetState: FilterState = {
            search: '',
            teacher: '',
            visible: '',
            per_page: String(paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page),
        };
        setFilterState(resetState);
        router.get(LabController.index().url, { per_page: resetState.per_page }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        const { search, teacher, visible } = filterState;
        return [search, teacher, visible].some((value) => value !== '');
    }, [filterState]);

    const parseNumber = (value: unknown, fallback: number) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const currentPage = parseNumber(
        paginationMeta.current_page,
        DEFAULT_PAGINATION_META.current_page
    );
    const lastPage = parseNumber(paginationMeta.last_page, DEFAULT_PAGINATION_META.last_page);
    const perPageCount = parseNumber(
        paginationMeta.per_page,
        parseNumber(filterState.per_page, DEFAULT_PAGINATION_META.per_page)
    );

    const paginationRangeStart = labsData.length === 0 ? 0 : (currentPage - 1) * perPageCount + 1;
    const paginationRangeEnd = labsData.length === 0 ? 0 : paginationRangeStart + labsData.length - 1;

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= lastPage;

    const goToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.get(LabController.index().url, buildFilterQuery({ page }), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const paginationButtonClass = (disabled: boolean) =>
        cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
            disabled
                ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-500'
                : 'border-transparent bg-amber-700 text-white shadow-sm hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-400'
        );

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return isZh ? '未提供' : 'N/A';
        }

        return new Date(dateString).toLocaleString(isZh ? 'zh-TW' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const getVisibilityBadge = (visible: boolean) => {
        const label = visible ? (isZh ? '啟用中' : 'Active') : (isZh ? '停用' : 'Disabled');
        const variant = visible ? 'default' : 'secondary';
        return <Badge variant={variant}>{label}</Badge>;
    };

    const sanitizeLabel = (label: string) => {
        const entities: Record<string, string> = {
            '&laquo;': '«',
            '&raquo;': '»',
            '&nbsp;': ' ',
            '&amp;': '&',
        };

        return label
            .replace(/<[^>]+>/g, '')
            .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
            .replace(/&[a-zA-Z]+;/g, (entity) => entities[entity] ?? entity);
    };

    const getLabDisplayName = (lab: Lab) => {
        const primary = lab.name?.trim() ?? '';
        const secondary = lab.name_en?.trim() ?? '';
        if (isZh) {
            return primary || secondary;
        }

        return secondary || primary;
    };

    const getTeacherDisplayName = (teacher: Teacher) => {
        const primary = teacher.name?.trim() ?? '';
        const secondary = teacher.name_en?.trim() ?? '';
        if (isZh) {
            return primary || secondary;
        }

        return secondary || primary;
    };

    return (
        <AppLayout>
            <Head title={isZh ? '實驗室管理' : 'Labs Management'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <AdminPageHeader
                        title={isZh ? '實驗室管理' : 'Labs Management'}
                        description={
                            isZh
                                ? '管理所有系上實驗室資料與顯示狀態'
                                : 'Manage department labs, visibility, and key contacts'
                        }
                        icon={FlaskConical}
                        actions={
                            auth.user?.role === 'admin'
                                ? (
                                      <Link href={LabController.create().url}>
                                          <Button className="bg-[#ffb401] text-[#151f54] hover:bg-[#e6a000]">
                                              {isZh ? '新增實驗室' : 'Create Lab'}
                                          </Button>
                                      </Link>
                                  )
                                : undefined
                        }
                    />

                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <FlaskConical className="h-5 w-5 text-blue-600" />
                                {isZh ? '實驗室列表' : 'Labs List'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={applyFilters} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                                <div className="xl:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="lab-search">
                                        {isZh ? '搜尋實驗室' : 'Search labs'}
                                    </label>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <Input
                                            id="lab-search"
                                            type="search"
                                            placeholder={isZh ? '輸入名稱或代碼' : 'Search by name or code'}
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
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="lab-teacher">
                                        {isZh ? '主持人 / 成員' : 'PI / Member'}
                                    </label>
                                    <Select
                                        id="lab-teacher"
                                        value={filterState.teacher}
                                        onChange={(event) => handleFilterChange('teacher', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部成員' : 'All members'}</option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {getTeacherDisplayName(teacher)}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="lab-visible">
                                        {isZh ? '狀態' : 'Status'}
                                    </label>
                                    <Select
                                        id="lab-visible"
                                        value={filterState.visible}
                                        onChange={(event) => handleFilterChange('visible', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部狀態' : 'All statuses'}</option>
                                        <option value="1">{isZh ? '啟用中' : 'Active'}</option>
                                        <option value="0">{isZh ? '停用' : 'Disabled'}</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="lab-per-page">
                                        {isZh ? '每頁筆數' : 'Per page'}
                                    </label>
                                    <Select
                                        id="lab-per-page"
                                        value={filterState.per_page}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            handleFilterChange('per_page', value);
                                            router.get(LabController.index().url, buildFilterQuery({ per_page: value }), {
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
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="flex-1 select-none rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-center text-sm font-medium text-gray-900 sm:min-w-[14rem] sm:text-left">
                                        {labsData.length === 0
                                            ? isZh
                                                ? '目前查無符合條件的實驗室'
                                                : 'No labs match the current filters'
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
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                {hasActiveFilters && labsData.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-amber-700">
                                        {isZh ? '篩選中' : 'Filters active'}
                                    </span>
                                )}
                            </div>

                            {labsData.length === 0 ? (
                                <div className="py-12 text-center">
                                    <FlaskConical className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                        {isZh ? '尚無實驗室資料' : 'No labs yet'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isZh ? '從新增實驗室開始建立資料' : 'Create a lab to populate this list'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {labsData.map((lab) => {
                                        const displayName = getLabDisplayName(lab);
                                        const teacherNames = (lab.teachers ?? []).map(getTeacherDisplayName);

                                        return (
                                            <div
                                                key={lab.id}
                                                className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md md:p-6"
                                            >
                                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4 lg:w-1/3">
                                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                                            {lab.cover_image_url ? (
                                                                <img
                                                                    src={lab.cover_image_url}
                                                                    alt={displayName}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                                                                    <ImageOff className="h-8 w-8" />
                                                                    <span className="mt-1 text-xs">{isZh ? '尚未上傳' : 'No image'}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1 space-y-3">
                                                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                                <Badge variant="outline">#{lab.sort_order ?? 0}</Badge>
                                                                {getVisibilityBadge(lab.visible)}
                                                            </div>
                                                            <h3 className="text-lg font-semibold leading-snug text-gray-900">{displayName}</h3>
                                                            <div className="space-y-2 text-sm text-gray-500">
                                                                <p className="truncate">
                                                                    {lab.code
                                                                        ? `${isZh ? '代碼' : 'Code'}：${lab.code}`
                                                                        : isZh
                                                                            ? '未設定代碼'
                                                                            : 'Code not set'}
                                                                </p>
                                                                <p className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4 text-gray-400" />
                                                                    <span className="truncate">
                                                                        {teacherNames.length > 0
                                                                            ? teacherNames.join(isZh ? '、' : ', ')
                                                                            : isZh
                                                                                ? '尚未設定成員'
                                                                                : 'No members assigned'}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-1 flex-col gap-4">
                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <p className="flex items-center gap-2 truncate">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {isZh ? '最後更新：' : 'Last updated: '} {formatDate(lab.updated_at)}
                                                                </span>
                                                            </p>
                                                            <p className="flex items-center gap-2 truncate">
                                                                <ExternalLink className="h-4 w-4 text-gray-400" />
                                                                {lab.website_url ? (
                                                                    <a
                                                                        href={lab.website_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="truncate text-blue-600 hover:underline"
                                                                    >
                                                                        {lab.website_url}
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-gray-500">
                                                                        {isZh ? '尚未設定外部網站' : 'Website not provided'}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0 sm:justify-end sm:border-l sm:border-gray-200 sm:pl-4">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link href={LabController.edit(lab.id).url}>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-green-600 hover:text-green-800"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '編輯實驗室' : 'Edit lab'}</TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        onClick={() => {
                                                                            if (
                                                                                confirm(
                                                                                    isZh
                                                                                        ? '確定要刪除這個實驗室嗎？'
                                                                                        : 'Are you sure you want to delete this lab?'
                                                                                )
                                                                            ) {
                                                                                destroy(LabController.destroy(lab.id).url);
                                                                            }
                                                                        }}
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-600 hover:text-red-800"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '刪除實驗室' : 'Delete lab'}</TooltipContent>
                                                            </Tooltip>
                                                            {lab.code && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <a
                                                                            href={`/labs/${lab.code}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            <Button variant="ghost" size="sm">
                                                                                <ExternalLink className="h-4 w-4" />
                                                                            </Button>
                                                                        </a>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>{isZh ? '前台預覽' : 'Preview front site'}</TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
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
                                                preserveScroll: true,
                                                preserveState: true,
                                                replace: true,
                                            });
                                        }}
                                        className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${link.active ? 'bg-amber-800 text-white shadow-md hover:bg-amber-900' : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'}`}
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
