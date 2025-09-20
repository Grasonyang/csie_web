import { FormEvent, useEffect, useMemo, useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import AdminPageHeader from '@/components/admin/admin-page-header';
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
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Edit, Mail, Shield, Trash2, UserCircle2 } from 'lucide-react';

type Option = {
    value: string;
    label: string;
};

type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'user';
    status: 'active' | 'suspended';
    locale: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type FilterState = {
    search: string;
    role: string;
    status: string;
    per_page: string;
};

interface UsersIndexProps {
    users: {
        data: AdminUser[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta?: PaginationMeta;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
    filters?: {
        search?: string;
        role?: string;
        status?: string;
        per_page?: number;
    };
    roleOptions: Option[];
    statusOptions: Option[];
    perPageOptions?: number[];
}

const DEFAULT_PAGINATION_META: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
};

export default function UsersIndex({ users, filters = {}, roleOptions, statusOptions, perPageOptions = [] }: UsersIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    const { delete: destroy } = useForm();

    const usersData = users?.data ?? [];
    const paginationMeta: PaginationMeta = {
        current_page:
            users?.meta?.current_page ?? users?.current_page ?? DEFAULT_PAGINATION_META.current_page,
        last_page: users?.meta?.last_page ?? users?.last_page ?? DEFAULT_PAGINATION_META.last_page,
        per_page: users?.meta?.per_page ?? users?.per_page ?? DEFAULT_PAGINATION_META.per_page,
        total: users?.meta?.total ?? users?.total ?? DEFAULT_PAGINATION_META.total,
    };
    const paginationLinks = users?.links ?? [];

    const resolvedPerPageOptions = perPageOptions.length > 0 ? perPageOptions : [10, 20, 50];
    const initialPerPage = String(
        filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page
    );

    const [filterState, setFilterState] = useState<FilterState>({
        search: filters.search ?? '',
        role: filters.role ?? '',
        status: filters.status ?? '',
        per_page: initialPerPage,
    });

    useEffect(() => {
        setFilterState({
            search: filters.search ?? '',
            role: filters.role ?? '',
            status: filters.status ?? '',
            per_page: String(
                filters.per_page ?? paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page
            ),
        });
    }, [filters.search, filters.role, filters.status, filters.per_page, paginationMeta.per_page]);

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
        router.get(UserController.index().url, buildFilterQuery(), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const resetState: FilterState = {
            search: '',
            role: '',
            status: '',
            per_page: String(paginationMeta.per_page ?? DEFAULT_PAGINATION_META.per_page),
        };
        setFilterState(resetState);
        router.get(UserController.index().url, { per_page: resetState.per_page }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        const { search, role, status } = filterState;
        return [search, role, status].some((value) => value !== '');
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

    const paginationRangeStart = usersData.length === 0 ? 0 : (currentPage - 1) * perPageCount + 1;
    const paginationRangeEnd = usersData.length === 0 ? 0 : paginationRangeStart + usersData.length - 1;

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= lastPage;

    const goToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.get(UserController.index().url, buildFilterQuery({ page }), {
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

    const formatDate = (value: string | null) => {
        if (!value) {
            return isZh ? '未設定' : 'N/A';
        }

        return new Date(value).toLocaleString(isZh ? 'zh-TW' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRoleBadge = (role: AdminUser['role']) => {
        const labels: Record<AdminUser['role'], string> = {
            admin: isZh ? '管理者' : 'Admin',
            teacher: isZh ? '教師' : 'Teacher',
            user: isZh ? '一般使用者' : 'User',
        };

        const variants: Record<AdminUser['role'], 'default' | 'secondary' | 'outline'> = {
            admin: 'default',
            teacher: 'secondary',
            user: 'outline',
        };

        return <Badge variant={variants[role]}>{labels[role]}</Badge>;
    };

    const getStatusBadge = (status: AdminUser['status']) => {
        const labels: Record<AdminUser['status'], string> = {
            active: isZh ? '啟用中' : 'Active',
            suspended: isZh ? '已停用' : 'Suspended',
        };

        const variants: Record<AdminUser['status'], 'default' | 'secondary'> = {
            active: 'default',
            suspended: 'secondary',
        };

        return <Badge variant={variants[status]}>{labels[status]}</Badge>;
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

    return (
        <AppLayout>
            <Head title={isZh ? '使用者管理' : 'User Management'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <AdminPageHeader
                        title={isZh ? '使用者管理' : 'User Management'}
                        description={
                            isZh
                                ? '管理後台使用者角色與帳號狀態'
                                : 'Manage admin portal user roles and account status'
                        }
                        icon={UserCircle2}
                        actions={
                            auth.user?.role === 'admin' ? (
                                <Link href={UserController.create().url}>
                                    <Button className="bg-[#ffb401] text-[#151f54] hover:bg-[#e6a000]">
                                        {isZh ? '新增使用者' : 'Create User'}
                                    </Button>
                                </Link>
                            ) : null
                        }
                    />

                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <UserCircle2 className="h-5 w-5 text-blue-600" />
                                {isZh ? '使用者列表' : 'Users List'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={applyFilters} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                                <div className="xl:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="user-search">
                                        {isZh ? '搜尋使用者' : 'Search users'}
                                    </label>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <Input
                                            id="user-search"
                                            type="search"
                                            placeholder={isZh ? '輸入姓名或 Email' : 'Search by name or email'}
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
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="user-role">
                                        {isZh ? '角色' : 'Role'}
                                    </label>
                                    <Select
                                        id="user-role"
                                        value={filterState.role}
                                        onChange={(event) => handleFilterChange('role', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部角色' : 'All roles'}</option>
                                        {roleOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="user-status">
                                        {isZh ? '狀態' : 'Status'}
                                    </label>
                                    <Select
                                        id="user-status"
                                        value={filterState.status}
                                        onChange={(event) => handleFilterChange('status', event.target.value)}
                                    >
                                        <option value="">{isZh ? '全部狀態' : 'All statuses'}</option>
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="user-per-page">
                                        {isZh ? '每頁筆數' : 'Per page'}
                                    </label>
                                    <Select
                                        id="user-per-page"
                                        value={filterState.per_page}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            handleFilterChange('per_page', value);
                                            router.get(UserController.index().url, buildFilterQuery({ per_page: value }), {
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
                                        {usersData.length === 0
                                            ? isZh
                                                ? '目前查無符合條件的使用者'
                                                : 'No users match the current filters'
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
                                {hasActiveFilters && usersData.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-amber-700">
                                        {isZh ? '篩選中' : 'Filters active'}
                                    </span>
                                )}
                            </div>

                            {usersData.length === 0 ? (
                                <div className="py-12 text-center">
                                    <UserCircle2 className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                        {isZh ? '尚無使用者資料' : 'No users yet'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isZh ? '從新增使用者開始建立資料' : 'Create a user to populate this list'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {usersData.map((user) => {
                                        const isSelf = auth.user?.id === user.id;

                                        return (
                                            <div
                                                key={user.id}
                                                className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md md:p-6"
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0 flex-1 space-y-4">
                                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                            {getRoleBadge(user.role)}
                                                            {getStatusBadge(user.status)}
                                                            {user.email_verified_at ? (
                                                                <Badge variant="outline" className="flex items-center gap-1">
                                                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                                    {isZh ? '已驗證' : 'Verified'}
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="flex items-center gap-1 text-amber-700">
                                                                    <Mail className="h-3.5 w-3.5" />
                                                                    {isZh ? '未驗證' : 'Unverified'}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <h3 className="text-lg font-semibold leading-snug text-gray-900">{user.name}</h3>
                                                            <p className="truncate text-sm text-gray-500">{user.email}</p>
                                                        </div>

                                                        <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                                                            <p className="flex items-center gap-2">
                                                                <Shield className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {isZh ? '角色：' : 'Role: '}
                                                                    {user.role === 'admin'
                                                                        ? isZh ? '管理者' : 'Admin'
                                                                        : user.role === 'teacher'
                                                                            ? isZh ? '教師' : 'Teacher'
                                                                            : isZh ? '一般使用者' : 'User'}
                                                                </span>
                                                            </p>
                                                            <p className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {isZh ? '建立於：' : 'Created at: '} {formatDate(user.created_at)}
                                                                </span>
                                                            </p>
                                                            <p className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {isZh ? '更新於：' : 'Updated at: '} {formatDate(user.updated_at)}
                                                                </span>
                                                            </p>
                                                            <p className="flex items-center gap-2">
                                                                <UserCircle2 className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {isZh ? '語系：' : 'Locale: '}
                                                                    {user.locale ?? (isZh ? '未設定' : 'Unset')}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0 sm:ml-4 sm:self-start sm:border-l sm:border-gray-200 sm:pl-4">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link href={UserController.edit(user.id).url}>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-green-600 hover:text-green-800"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent>{isZh ? '編輯使用者' : 'Edit user'}</TooltipContent>
                                                        </Tooltip>

                                                        {!isSelf && (
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
                                                                                        ? `確定要刪除 ${user.name} 的帳號嗎？`
                                                                                        : `Are you sure you want to delete ${user.name}?`
                                                                                )
                                                                            ) {
                                                                                destroy(UserController.destroy(user.id).url);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{isZh ? '刪除使用者' : 'Delete user'}</TooltipContent>
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
