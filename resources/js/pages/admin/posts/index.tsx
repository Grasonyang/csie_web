import { FormEvent, useEffect, useMemo, useState } from 'react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
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
import { Calendar, ChevronLeft, ChevronRight, Edit, Eye, Pin, Trash2, User } from 'lucide-react';

interface PostCategory {
    id: number;
    name: string;
    name_en: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Post {
    id: number;
    title: string;
    title_en: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    publish_at: string | null;
    pinned: boolean;
    category: PostCategory;
    creator: User;
    created_at: string;
    updated_at: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PostsIndexProps {
    posts: {
        data: Post[];
        links: any[];
        meta?: PaginationMeta;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
    categories: PostCategory[];
    filters?: {
        search?: string;
        category?: string | number;
        status?: string;
        pinned?: string;
        per_page?: number;
    };
    perPageOptions?: number[];
}

type FilterState = {
    search: string;
    category: string;
    status: string;
    pinned: string;
    per_page: string;
};

const DEFAULT_PAGINATION_META: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
};

export default function PostsIndex({ posts, categories, filters = {}, perPageOptions = [] }: PostsIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    // 使用 Inertia 的 useForm 來處理刪除請求
    const { delete: destroy } = useForm();

    // 添加安全檢查
    const postsData = posts?.data || [];
    // Laravel 預設分頁回應會將 current_page 等欄位平鋪在最外層，當 meta 缺席時需改用外層欄位作為備援
    const paginationMeta: PaginationMeta = {
        current_page:
            posts?.meta?.current_page ?? posts?.current_page ?? DEFAULT_PAGINATION_META.current_page,
        last_page: posts?.meta?.last_page ?? posts?.last_page ?? DEFAULT_PAGINATION_META.last_page,
        per_page: posts?.meta?.per_page ?? posts?.per_page ?? DEFAULT_PAGINATION_META.per_page,
        total: posts?.meta?.total ?? posts?.total ?? DEFAULT_PAGINATION_META.total,
    };
    const paginationLinks = posts?.links || [];
    const resolvedPerPageOptions = perPageOptions.length > 0 ? perPageOptions : [10, 20, 50];

    const initialPerPage = String(
        filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page
    );
    const [filterState, setFilterState] = useState<FilterState>({
        search: filters.search ?? '',
        category: filters.category ? String(filters.category) : '',
        status: filters.status ?? '',
        pinned: filters.pinned ?? '',
        per_page: initialPerPage,
    });

    useEffect(() => {
        setFilterState({
            search: filters.search ?? '',
            category: filters.category ? String(filters.category) : '',
            status: filters.status ?? '',
            pinned: filters.pinned ?? '',
            per_page: String(
                filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page
            ),
        });
    }, [
        filters.search,
        filters.category,
        filters.status,
        filters.pinned,
        filters.per_page,
        paginationMeta.per_page,
    ]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilterState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const applyFilters = (event?: FormEvent) => {
        event?.preventDefault();
        const query = Object.fromEntries(
            Object.entries(filterState).filter(([_, value]) => value !== '')
        );

        router.get(PostController.index().url, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const resetState: FilterState = {
            search: '',
            category: '',
            status: '',
            pinned: '',
            per_page: String(paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page),
        };
        setFilterState(resetState);
        router.get(PostController.index().url, { per_page: resetState.per_page }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        const { search, category, status, pinned } = filterState;
        return [search, category, status, pinned].some((value) => value !== '');
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

    const paginationRangeStart = postsData.length === 0 ? 0 : (currentPage - 1) * perPageCount + 1;
    const paginationRangeEnd = postsData.length === 0 ? 0 : paginationRangeStart + postsData.length - 1;

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

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= lastPage;

    const goToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.get(PostController.index().url, buildFilterQuery({ page }), {
            preserveState: true,
            preserveScroll: true,
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

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: 'secondary',
            published: 'default',
            archived: 'outline',
        } as const;

        const labels = {
            draft: isZh ? '草稿' : 'Draft',
            published: isZh ? '已發布' : 'Published',
            archived: isZh ? '已封存' : 'Archived',
        };

        return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(isZh ? 'zh-TW' : 'en-US');
    };

    // 將分頁標籤中的 HTML 實體轉換為純文字
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

    return (
        <AppLayout>
            <Head title={isZh ? '公告管理' : 'Posts Management'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{isZh ? '公告管理' : 'Posts Management'}</h1>
                            <p className="mt-2 text-gray-600">{isZh ? '管理系統公告與新聞' : 'Manage system announcements and news'}</p>
                        </div>

                        {auth.user && (
                            <Link href={PostController.create().url}>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700">{isZh ? '新增公告' : 'Create Post'}</Button>
                            </Link>
                        )}
                    </div>

                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                {isZh ? '公告列表' : 'Posts List'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={applyFilters} className="mb-6 grid gap-4 md:grid-cols-6">
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="post-search">
                                        {isZh ? '搜尋公告' : 'Search posts'}
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="post-search"
                                            type="search"
                                            placeholder={isZh ? '輸入標題或內容關鍵字' : 'Type a keyword'}
                                            value={filterState.search}
                                            onChange={(event) => handleFilterChange('search', event.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="submit" variant="secondary" className="shrink-0">
                                            {isZh ? '搜尋' : 'Search'}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="post-category">
                                        {isZh ? '分類' : 'Category'}
                                    </label>
                                    <Select
                                        id="post-category"
                                        value={filterState.category}
                                        onChange={(event) => handleFilterChange('category', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部分類' : 'All categories'}</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id.toString()}>
                                                {isZh ? category.name : category.name_en}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="post-status">
                                        {isZh ? '狀態' : 'Status'}
                                    </label>
                                    <Select
                                        id="post-status"
                                        value={filterState.status}
                                        onChange={(event) => handleFilterChange('status', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部狀態' : 'All statuses'}</option>
                                        <option value="draft">{isZh ? '草稿' : 'Draft'}</option>
                                        <option value="published">{isZh ? '已發布' : 'Published'}</option>
                                        <option value="archived">{isZh ? '已封存' : 'Archived'}</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="post-pinned">
                                        {isZh ? '置頂' : 'Pinned'}
                                    </label>
                                    <Select
                                        id="post-pinned"
                                        value={filterState.pinned}
                                        onChange={(event) => handleFilterChange('pinned', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部' : 'All'}</option>
                                        <option value="1">{isZh ? '已置頂' : 'Pinned only'}</option>
                                        <option value="0">{isZh ? '未置頂' : 'Not pinned'}</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="post-per-page">
                                        {isZh ? '每頁筆數' : 'Per page'}
                                    </label>
                                    <Select
                                        id="post-per-page"
                                        value={filterState.per_page}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            handleFilterChange('per_page', value);
                                            router.get(PostController.index().url, buildFilterQuery({ per_page: value }), {
                                                preserveState: true,
                                                preserveScroll: true,
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

                                <div className="flex items-end gap-2 md:col-span-6 md:justify-end">
                                    {hasActiveFilters && (
                                        <Button type="button" variant="ghost" onClick={resetFilters}>
                                            {isZh ? '清除篩選' : 'Reset filters'}
                                        </Button>
                                    )}
                                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                                        {isZh ? '套用篩選' : 'Apply filters'}
                                    </Button>
                                </div>
                            </form>

                            <div className="mb-4 flex flex-col gap-2 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-2">
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
                                    <span className="mx-4 px-3 py-1 rounded-md bg-gray-50 border border-gray-200 text-sm font-medium text-gray-900 select-none z-10">
                                        {postsData.length === 0
                                            ? isZh ? '目前查無符合條件的公告' : 'No posts match the current filters'
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
                                {hasActiveFilters && postsData.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-amber-700">
                                        {isZh ? '篩選中' : 'Filters active'}
                                    </span>
                                )}
                            </div>

                            {postsData.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{isZh ? '尚無公告' : 'No posts'}</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isZh ? '開始建立第一個公告吧' : 'Get started by creating a new post'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {postsData.map((post) => (
                                        <div
                                            key={post.id}
                                            className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        {post.pinned && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="inline-flex">
                                                                        <Pin className="h-4 w-4 flex-shrink-0 text-amber-500" />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '已置頂公告' : 'Pinned post'}</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        <h3 className="truncate text-lg font-semibold text-gray-900">
                                                            {isZh ? post.title : post.title_en}
                                                        </h3>
                                                        {getStatusBadge(post.status)}
                                                    </div>

                                                    <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <Badge
                                                                variant="outline"
                                                                className="border-blue-300 bg-blue-100 text-xs font-semibold text-blue-800"
                                                            >
                                                                {isZh ? post.category.name : post.category.name_en}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            <span>{post.creator.name}</span>
                                                        </div>

                                                        {post.publish_at && (
                                                            <div>
                                                                {isZh ? '發布時間' : 'Published'}: {formatDate(post.publish_at)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="text-sm text-gray-600">
                                                        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">{post.slug}</span>
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={PostController.show(post.id).url}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{isZh ? '檢視公告' : 'View post'}</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={PostController.edit(post.id).url}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-green-600 hover:text-green-800"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{isZh ? '編輯公告' : 'Edit post'}</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                onClick={() => {
                                                                    if (confirm(isZh ? '確定要刪除嗎？' : 'Are you sure you want to delete this post?')) {
                                                                        destroy(PostController.destroy(post.id).url);
                                                                    }
                                                                }}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{isZh ? '刪除公告' : 'Delete post'}</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {paginationMeta.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-2 py-4">
                            {paginationLinks.map((link, index) => {
                                const sanitizedLabel = sanitizeLabel(link.label);

                                if (!link.url) {
                                    return (
                                        <span
                                            key={index}
                                            className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium border border-input text-gray-400"
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
                                            router.visit(link.url, {
                                                preserveState: true,
                                                preserveScroll: true,
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
