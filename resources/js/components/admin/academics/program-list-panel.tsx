import { FormEvent, useEffect, useMemo, useState } from 'react';
import ProgramController from '@/actions/App/Http/Controllers/Admin/ProgramController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link, router, useForm } from '@inertiajs/react';
import {
    BookMarked,
    Edit,
    Eye,
    GraduationCap,
    Layers,
    LinkIcon,
    Trash2,
} from 'lucide-react';

interface ProgramDescription {
    ['zh-TW']?: string | null;
    en?: string | null;
}

interface ProgramItem {
    id: number;
    code: string | null;
    name: Record<string, string | null>;
    level: 'bachelor' | 'master' | 'ai_inservice' | 'dual';
    description: ProgramDescription | null;
    website_url: string | null;
    sort_order: number | null;
    visible: boolean;
    courses_count: number;
    updated_at: string;
    created_at: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProgramsPayload {
    data: ProgramItem[];
    meta?: PaginationMeta;
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    links: PaginatorLink[];
}

interface ProgramFiltersProps {
    search?: string | null;
    level?: string | null;
    visible?: string | null;
    per_page?: string | number | null;
}

interface ProgramListPanelProps {
    programs: ProgramsPayload;
    filters?: ProgramFiltersProps;
    perPageOptions?: number[];
    baseQuery?: Record<string, string>;
    isZh: boolean;
}

type FilterState = {
    search: string;
    level: string;
    visible: string;
    per_page: string;
};

type FilterOverride = Partial<FilterState> & { page?: number | string };

type PaginationSummary = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

const DEFAULT_META: PaginationSummary = {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
};

const LEVEL_LABELS: Record<ProgramItem['level'], { zh: string; en: string }> = {
    bachelor: { zh: '大學部', en: 'Bachelor' },
    master: { zh: '碩士班', en: 'Master' },
    ai_inservice: { zh: 'AI 在職專班', en: 'AI Executive' },
    dual: { zh: '雙學位學程', en: 'Dual Degree' },
};

export default function ProgramListPanel({
    programs,
    filters = {},
    perPageOptions = [],
    baseQuery = {},
    isZh,
}: ProgramListPanelProps) {
    const { delete: destroy } = useForm();

    const programsData = programs?.data ?? [];
    const paginationMeta: PaginationSummary = {
        current_page: programs?.meta?.current_page ?? programs?.current_page ?? DEFAULT_META.current_page,
        last_page: programs?.meta?.last_page ?? programs?.last_page ?? DEFAULT_META.last_page,
        per_page: programs?.meta?.per_page ?? programs?.per_page ?? DEFAULT_META.per_page,
        total: programs?.meta?.total ?? programs?.total ?? DEFAULT_META.total,
    };
    const paginationLinks = programs?.links ?? [];
    const resolvedPerPageOptions = perPageOptions.length > 0 ? perPageOptions : [10, 20, 50];

    const initialPerPage = String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_META.per_page);

    const [filterState, setFilterState] = useState<FilterState>({
        search: filters.search ?? '',
        level: filters.level ?? '',
        visible: filters.visible ?? '',
        per_page: initialPerPage,
    });

    useEffect(() => {
        setFilterState({
            search: filters.search ?? '',
            level: filters.level ?? '',
            visible: filters.visible ?? '',
            per_page: String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_META.per_page),
        });
    }, [filters.search, filters.level, filters.visible, filters.per_page, paginationMeta.per_page]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilterState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const buildQuery = (overrides: FilterOverride = {}, state: FilterState = filterState) => {
        const { page, ...restOverrides } = overrides;
        const mergedState: FilterState = { ...state, ...restOverrides };

        const query = Object.entries(baseQuery).reduce<Record<string, string>>((carry, [key, value]) => {
            if (!key.startsWith('program_') && value !== undefined && value !== null) {
                carry[key] = String(value);
            }

            return carry;
        }, {});

        (Object.keys(mergedState) as Array<keyof FilterState>).forEach((key) => {
            const value = mergedState[key];
            if (value !== '') {
                query[`program_${key}`] = value;
            }
        });

        if (page !== undefined) {
            const normalized = typeof page === 'number' ? String(page) : page;
            if (normalized && normalized !== '' && normalized !== '1') {
                query.program_page = normalized;
            }
        }

        query.tab = 'programs';

        return query;
    };

    const applyFilters = (event?: FormEvent) => {
        event?.preventDefault();
        router.get('/admin/academics', buildQuery(), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const resetState: FilterState = {
            search: '',
            level: '',
            visible: '',
            per_page: String(paginationMeta.per_page ?? DEFAULT_META.per_page),
        };
        setFilterState(resetState);
        router.get('/admin/academics', buildQuery({}, resetState), {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        const { search, level, visible } = filterState;
        return [search, level, visible].some((value) => value !== '');
    }, [filterState]);

    const parseNumber = (value: unknown, fallback: number) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const currentPage = parseNumber(paginationMeta.current_page, DEFAULT_META.current_page);
    const lastPage = parseNumber(paginationMeta.last_page, DEFAULT_META.last_page);
    const perPageCount = parseNumber(
        paginationMeta.per_page,
        parseNumber(filterState.per_page, DEFAULT_META.per_page)
    );

    const paginationRangeStart = programsData.length === 0 ? 0 : (currentPage - 1) * perPageCount + 1;
    const paginationRangeEnd = programsData.length === 0 ? 0 : paginationRangeStart + programsData.length - 1;

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= lastPage;

    const goToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.get('/admin/academics', buildQuery({ page }), {
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

    const formatLevelLabel = (level: ProgramItem['level']) => {
        const labels = LEVEL_LABELS[level];
        return isZh ? labels.zh : labels.en;
    };

    const formatProgramName = (program: ProgramItem) => {
        const zh = program.name?.['zh-TW'];
        const en = program.name?.['en'];
        if (isZh) {
            return zh || en || program.code || '';
        }
        return en || zh || program.code || '';
    };

    const formatDescription = (program: ProgramItem) => {
        const zh = program.description?.['zh-TW'];
        const en = program.description?.en;
        const content = isZh ? zh ?? en : en ?? zh;
        if (!content) {
            return isZh ? '尚未提供描述。' : 'No description available.';
        }
        return content.length > 140 ? `${content.slice(0, 140)}…` : content;
    };

    const formatDateTime = (value: string) => new Date(value).toLocaleString(isZh ? 'zh-TW' : 'en-US');

    const sanitizeLabel = (label: string) =>
        label
            .replace(/<[^>]+>/g, '')
            .replace(/&laquo;/g, '«')
            .replace(/&raquo;/g, '»')
            .replace(/&nbsp;/g, ' ');

    return (
        <div className="space-y-6">
            <Card className="bg-white shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        {isZh ? '學程列表' : 'Programs List'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form
                        onSubmit={applyFilters}
                        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
                    >
                        <div className="xl:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="program-search">
                                {isZh ? '搜尋學程' : 'Search programs'}
                            </label>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <Input
                                    id="program-search"
                                    type="search"
                                    placeholder={isZh ? '輸入名稱或代碼' : 'Type a name or code'}
                                    value={filterState.search}
                                    onChange={(event) => handleFilterChange('search', event.target.value)}
                                    className="w-full sm:flex-1"
                                />
                                <Button type="submit" variant="secondary" className="w-full shrink-0 sm:w-auto">
                                    {isZh ? '搜尋' : 'Search'}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="program-level">
                                {isZh ? '學程層級' : 'Level'}
                            </label>
                            <Select
                                id="program-level"
                                value={filterState.level}
                                onChange={(event) => handleFilterChange('level', event.target.value)}
                            >
                                <option value="">{isZh ? '全部層級' : 'All levels'}</option>
                                {(Object.keys(LEVEL_LABELS) as Array<ProgramItem['level']>).map((key) => (
                                    <option key={key} value={key}>
                                        {formatLevelLabel(key)}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="program-visible">
                                {isZh ? '顯示狀態' : 'Visibility'}
                            </label>
                            <Select
                                id="program-visible"
                                value={filterState.visible}
                                onChange={(event) => handleFilterChange('visible', event.target.value)}
                            >
                                <option value="">{isZh ? '全部狀態' : 'All statuses'}</option>
                                <option value="1">{isZh ? '顯示中' : 'Visible'}</option>
                                <option value="0">{isZh ? '隱藏中' : 'Hidden'}</option>
                            </Select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="program-per-page">
                                {isZh ? '每頁筆數' : 'Per page'}
                            </label>
                            <Select
                                id="program-per-page"
                                value={filterState.per_page}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    handleFilterChange('per_page', value);
                                    router.get('/admin/academics', buildQuery({ per_page: value }), {
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
                                <Button type="button" variant="ghost" onClick={resetFilters} className="w-full md:w-auto">
                                    {isZh ? '清除篩選' : 'Reset filters'}
                                </Button>
                            )}
                            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto">
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
                                {programsData.length === 0
                                    ? isZh
                                        ? '目前查無符合條件的學程'
                                        : 'No programs match the current filters'
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
                        {hasActiveFilters && programsData.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-amber-700">
                                {isZh ? '篩選中' : 'Filters active'}
                            </span>
                        )}
                    </div>

                    {programsData.length === 0 ? (
                        <div className="py-12 text-center">
                            <Layers className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                {isZh ? '尚無學程資料' : 'No programs available'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {isZh ? '新增學程以建立列表' : 'Create a program to populate this list'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {programsData.map((program) => {
                                const canDelete = program.courses_count === 0;
                                return (
                                    <div
                                        key={program.id}
                                        className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md md:p-6"
                                    >
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1 space-y-3">
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                    {program.code && <Badge variant="outline">{program.code}</Badge>}
                                                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                                        {formatLevelLabel(program.level)}
                                                    </Badge>
                                                    <Badge
                                                        variant={program.visible ? 'default' : 'secondary'}
                                                        className={program.visible ? 'bg-green-600 hover:bg-green-700' : ''}
                                                    >
                                                        {program.visible
                                                            ? isZh
                                                                ? '顯示中'
                                                                : 'Visible'
                                                            : isZh
                                                            ? '隱藏'
                                                            : 'Hidden'}
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <BookMarked className="h-3.5 w-3.5" />
                                                        {isZh ? `課程 ${program.courses_count} 門` : `${program.courses_count} courses`}
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Layers className="h-3.5 w-3.5" />
                                                        {isZh
                                                            ? `排序 ${program.sort_order ?? '-'}`
                                                            : `Order ${program.sort_order ?? '-'}`}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-semibold leading-snug text-gray-900">
                                                        {formatProgramName(program)}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{formatDescription(program)}</p>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-sm text-blue-600">
                                                    {program.website_url && (
                                                        <a
                                                            href={program.website_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 hover:underline"
                                                        >
                                                            <LinkIcon className="h-4 w-4" />
                                                            {isZh ? '官方網站' : 'Website'}
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {isZh ? '最後更新：' : 'Last updated: '} {formatDateTime(program.updated_at)}
                                                </div>
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0 sm:ml-4 sm:self-start sm:border-l sm:border-gray-200 sm:pl-4">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link href={ProgramController.show(program.id).url}>
                                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{isZh ? '檢視學程' : 'View program'}</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link href={ProgramController.edit(program.id).url}>
                                                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{isZh ? '編輯學程' : 'Edit program'}</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={!canDelete}
                                                                className={cn(
                                                                    'text-red-600 hover:text-red-800',
                                                                    !canDelete && 'cursor-not-allowed opacity-40'
                                                                )}
                                                                onClick={() => {
                                                                    if (!canDelete) {
                                                                        alert(
                                                                            isZh
                                                                                ? '此學程仍有課程，請先移除所有課程後再刪除。'
                                                                                : 'This program still has courses assigned. Remove them before deleting.'
                                                                        );
                                                                        return;
                                                                    }

                                                                    if (
                                                                        confirm(
                                                                            isZh
                                                                                ? `確定要刪除學程「${formatProgramName(program)}」嗎？`
                                                                                : `Delete program "${formatProgramName(program)}"?`
                                                                        )
                                                                    ) {
                                                                        destroy(ProgramController.destroy(program.id).url);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{isZh ? '刪除學程' : 'Delete program'}</TooltipContent>
                                                </Tooltip>
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
                                className={cn(
                                    'inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400',
                                    link.active
                                        ? 'bg-amber-800 text-white shadow-md hover:bg-amber-900'
                                        : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                                )}
                                aria-current={link.active ? 'page' : undefined}
                            >
                                {sanitizedLabel}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
