import { FormEvent, useEffect, useMemo, useState } from 'react';
import CourseController from '@/actions/App/Http/Controllers/Admin/CourseController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link, router, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    Edit,
    Eye,
    GraduationCap,
    School,
    Trash2,
} from 'lucide-react';

interface ProgramOption {
    id: number;
    name: string;
    name_en?: string | null;
}

interface Course {
    id: number;
    code: string;
    name: Record<string, string | null>;
    credit: number;
    hours: number | null;
    level: 'undergraduate' | 'graduate';
    semester: string | null;
    syllabus_url: string | null;
    program_id: number | null;
    program?: ProgramOption | null;
    visible: boolean;
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

interface CoursesPayload {
    data: Course[];
    meta?: PaginationMeta;
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    links: PaginatorLink[];
}

interface CourseFiltersProps {
    search?: string | null;
    program?: string | number | null;
    level?: string | null;
    visible?: string | null;
    per_page?: number | string | null;
}

interface CourseListPanelProps {
    courses: CoursesPayload;
    programOptions: ProgramOption[];
    filters?: CourseFiltersProps;
    perPageOptions?: number[];
    baseQuery?: Record<string, string>;
    isZh: boolean;
}

type FilterState = {
    search: string;
    program: string;
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

const LEVEL_LABELS: Record<Course['level'], { zh: string; en: string }> = {
    undergraduate: { zh: '學士班', en: 'Undergraduate' },
    graduate: { zh: '研究所', en: 'Graduate' },
};

export default function CourseListPanel({
    courses,
    programOptions,
    filters = {},
    perPageOptions = [],
    baseQuery = {},
    isZh,
}: CourseListPanelProps) {
    const { delete: destroy } = useForm();

    const coursesData = courses?.data ?? [];
    const paginationMeta: PaginationSummary = {
        current_page: courses?.meta?.current_page ?? courses?.current_page ?? DEFAULT_META.current_page,
        last_page: courses?.meta?.last_page ?? courses?.last_page ?? DEFAULT_META.last_page,
        per_page: courses?.meta?.per_page ?? courses?.per_page ?? DEFAULT_META.per_page,
        total: courses?.meta?.total ?? courses?.total ?? DEFAULT_META.total,
    };
    const paginationLinks = courses?.links ?? [];
    const resolvedPerPageOptions = perPageOptions.length > 0 ? perPageOptions : [10, 20, 50];

    const initialPerPage = String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_META.per_page);

    const [filterState, setFilterState] = useState<FilterState>({
        search: filters.search ?? '',
        program: filters.program ? String(filters.program) : '',
        level: filters.level ?? '',
        visible: filters.visible ?? '',
        per_page: initialPerPage,
    });

    useEffect(() => {
        setFilterState({
            search: filters.search ?? '',
            program: filters.program ? String(filters.program) : '',
            level: filters.level ?? '',
            visible: filters.visible ?? '',
            per_page: String(filters.per_page ?? paginationMeta.per_page ?? DEFAULT_META.per_page),
        });
    }, [
        filters.search,
        filters.program,
        filters.level,
        filters.visible,
        filters.per_page,
        paginationMeta.per_page,
    ]);

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
            if (!key.startsWith('course_') && value !== undefined && value !== null) {
                carry[key] = String(value);
            }

            return carry;
        }, {});

        (Object.keys(mergedState) as Array<keyof FilterState>).forEach((key) => {
            const value = mergedState[key];
            if (value !== '') {
                query[`course_${key}`] = value;
            }
        });

        if (page !== undefined) {
            const normalized = typeof page === 'number' ? String(page) : page;
            if (normalized && normalized !== '' && normalized !== '1') {
                query.course_page = normalized;
            }
        }

        query.tab = 'courses';

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
            program: '',
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
        const { search, program, level, visible } = filterState;
        return [search, program, level, visible].some((value) => value !== '');
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

    const paginationRangeStart = coursesData.length === 0 ? 0 : (currentPage - 1) * perPageCount + 1;
    const paginationRangeEnd = coursesData.length === 0 ? 0 : paginationRangeStart + coursesData.length - 1;

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

    const formatLevelLabel = (level: Course['level']) => {
        const labels = LEVEL_LABELS[level];
        return isZh ? labels.zh : labels.en;
    };

    const formatCourseName = (course: Course) => {
        const zh = course.name?.['zh-TW'];
        const en = course.name?.['en'];
        if (isZh) {
            return zh || en || course.code;
        }
        return en || zh || course.code;
    };

    const formatProgramName = (program: ProgramOption | null | undefined) => {
        if (!program) {
            return isZh ? '未指派學程' : 'No program assigned';
        }
        if (isZh) {
            return program.name ?? program.name_en ?? '';
        }
        return program.name_en ?? program.name ?? '';
    };

    const formatDateTime = (value: string) => new Date(value).toLocaleString(isZh ? 'zh-TW' : 'en-US');

    const levelOptions: Array<{ value: Course['level']; label: string }> = (
        Object.keys(LEVEL_LABELS) as Array<Course['level']>
    ).map((value) => ({
        value,
        label: formatLevelLabel(value),
    }));

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
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        {isZh ? '課程列表' : 'Courses List'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form
                        onSubmit={applyFilters}
                        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6"
                    >
                        <div className="xl:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="course-search">
                                {isZh ? '搜尋課程' : 'Search courses'}
                            </label>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <Input
                                    id="course-search"
                                    type="search"
                                    placeholder={isZh ? '輸入課程名稱或代碼' : 'Type a code or name'}
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
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="course-program">
                                {isZh ? '所屬學程' : 'Program'}
                            </label>
                            <Select
                                id="course-program"
                                value={filterState.program}
                                onChange={(event) => handleFilterChange('program', event.target.value)}
                            >
                                <option value="">{isZh ? '全部學程' : 'All programs'}</option>
                                {programOptions.map((program) => (
                                    <option key={program.id} value={program.id.toString()}>
                                        {isZh ? program.name ?? program.name_en ?? '' : program.name_en ?? program.name ?? ''}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="course-level">
                                {isZh ? '課程層級' : 'Level'}
                            </label>
                            <Select
                                id="course-level"
                                value={filterState.level}
                                onChange={(event) => handleFilterChange('level', event.target.value)}
                            >
                                <option value="">{isZh ? '全部層級' : 'All levels'}</option>
                                {levelOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="course-visible">
                                {isZh ? '顯示狀態' : 'Visibility'}
                            </label>
                            <Select
                                id="course-visible"
                                value={filterState.visible}
                                onChange={(event) => handleFilterChange('visible', event.target.value)}
                            >
                                <option value="">{isZh ? '全部狀態' : 'All statuses'}</option>
                                <option value="1">{isZh ? '顯示中' : 'Visible'}</option>
                                <option value="0">{isZh ? '隱藏中' : 'Hidden'}</option>
                            </Select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="course-per-page">
                                {isZh ? '每頁筆數' : 'Per page'}
                            </label>
                            <Select
                                id="course-per-page"
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

                        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end sm:justify-end sm:gap-3 xl:col-span-6">
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
                                {coursesData.length === 0
                                    ? isZh
                                        ? '目前查無符合條件的課程'
                                        : 'No courses match the current filters'
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
                        {hasActiveFilters && coursesData.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-amber-700">
                                {isZh ? '篩選中' : 'Filters active'}
                            </span>
                        )}
                    </div>

                    {coursesData.length === 0 ? (
                        <div className="py-12 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                {isZh ? '尚無課程資料' : 'No courses available'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {isZh ? '從新增課程開始建立資料' : 'Create a course to populate this list'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {coursesData.map((course) => (
                                <div
                                    key={course.id}
                                    className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md md:p-6"
                                >
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0 flex-1 space-y-3">
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                <Badge variant="outline">{course.code}</Badge>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                    {formatLevelLabel(course.level)}
                                                </Badge>
                                                <Badge
                                                    variant={course.visible ? 'default' : 'secondary'}
                                                    className={course.visible ? 'bg-green-600 hover:bg-green-700' : ''}
                                                >
                                                    {course.visible
                                                        ? isZh
                                                            ? '顯示中'
                                                            : 'Visible'
                                                        : isZh
                                                        ? '隱藏'
                                                        : 'Hidden'}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold leading-snug text-gray-900">
                                                    {formatCourseName(course)}
                                                </h3>
                                                <p className="flex items-center gap-2 text-sm text-gray-500">
                                                    <GraduationCap className="h-4 w-4 text-gray-400" />
                                                    <span>{formatProgramName(course.program)}</span>
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-2">
                                                    <School className="h-4 w-4 text-gray-400" />
                                                    {isZh ? `學分：${course.credit}` : `Credits: ${course.credit}`}
                                                </span>
                                                <span className="inline-flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    {course.hours === null
                                                        ? isZh
                                                            ? '時數未設定'
                                                            : 'Hours not set'
                                                        : isZh
                                                        ? `每週 ${course.hours} 小時`
                                                        : `${course.hours} hours per week`}
                                                </span>
                                                {course.semester && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-gray-400" />
                                                        {isZh
                                                            ? `開課學期：${course.semester}`
                                                            : `Semester: ${course.semester}`}
                                                    </span>
                                                )}
                                                {course.syllabus_url && (
                                                    <a
                                                        href={course.syllabus_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                                    >
                                                        {isZh ? '課綱連結' : 'Syllabus'}
                                                    </a>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {isZh ? '最後更新：' : 'Last updated: '} {formatDateTime(course.updated_at)}
                                            </div>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0 sm:ml-4 sm:self-start sm:border-l sm:border-gray-200 sm:pl-4">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={CourseController.show(course.id).url}>
                                                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>{isZh ? '檢視課程' : 'View course'}</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={CourseController.edit(course.id).url}>
                                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>{isZh ? '編輯課程' : 'Edit course'}</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-800"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    isZh
                                                                        ? `確定要刪除課程「${formatCourseName(course)}」嗎？`
                                                                        : `Delete course "${formatCourseName(course)}"?`
                                                                )
                                                            ) {
                                                                destroy(CourseController.destroy(course.id).url);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{isZh ? '刪除課程' : 'Delete course'}</TooltipContent>
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
