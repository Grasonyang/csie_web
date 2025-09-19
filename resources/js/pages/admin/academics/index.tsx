import { useEffect, useMemo, useState } from 'react';
import CourseController from '@/actions/App/Http/Controllers/Admin/CourseController';
import ProgramController from '@/actions/App/Http/Controllers/Admin/ProgramController';
import CourseListPanel from '@/components/admin/academics/course-list-panel';
import ProgramListPanel from '@/components/admin/academics/program-list-panel';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap } from 'lucide-react';

type CourseLevel = 'undergraduate' | 'graduate';

type ProgramLevel = 'bachelor' | 'master' | 'ai_inservice' | 'dual';

interface ProgramOption {
    id: number;
    name: string;
    name_en?: string | null;
}

interface CourseFiltersProps {
    search?: string | null;
    program?: string | number | null;
    level?: CourseLevel | string | null;
    visible?: string | null;
    per_page?: number | string | null;
}

interface CourseRecord {
    id: number;
    code: string;
    name: Record<string, string | null>;
    credit: number;
    hours: number | null;
    level: CourseLevel;
    semester: string | null;
    syllabus_url: string | null;
    program_id: number | null;
    visible: boolean;
    updated_at: string;
    created_at: string;
    program?: ProgramOption | null;
}

interface ProgramDescription {
    ['zh-TW']?: string | null;
    en?: string | null;
}

interface ProgramRecord {
    id: number;
    code: string | null;
    name: Record<string, string | null>;
    level: ProgramLevel;
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

interface CoursesPayload {
    data: CourseRecord[];
    meta?: PaginationMeta;
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    links: PaginatorLink[];
}

interface ProgramsPayload {
    data: ProgramRecord[];
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

interface AcademicsIndexProps {
    courses: CoursesPayload;
    courseProgramOptions: ProgramOption[];
    courseFilters?: CourseFiltersProps;
    coursePerPageOptions?: number[];
    programs: ProgramsPayload;
    programFilters?: ProgramFiltersProps;
    programPerPageOptions?: number[];
    activeTab?: 'courses' | 'programs';
    query?: Record<string, string>;
}

type ActiveTab = 'courses' | 'programs';

const TAB_ITEMS: Array<{
    value: ActiveTab;
    icon: typeof BookOpen;
    zh: string;
    en: string;
}> = [
    { value: 'courses', icon: BookOpen, zh: '課程列表', en: 'Courses' },
    { value: 'programs', icon: GraduationCap, zh: '學程列表', en: 'Programs' },
];

const resolveTab = (value?: string | null): ActiveTab =>
    value === 'programs' ? 'programs' : 'courses';

export default function AcademicsIndex({
    courses,
    courseProgramOptions,
    courseFilters,
    coursePerPageOptions,
    programs,
    programFilters,
    programPerPageOptions,
    activeTab,
    query = {},
}: AcademicsIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';
    const isAdmin = auth.user?.role === 'admin';

    const initialTab = resolveTab(activeTab);
    const [currentTab, setCurrentTab] = useState<ActiveTab>(initialTab);

    useEffect(() => {
        setCurrentTab(resolveTab(activeTab));
    }, [activeTab]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('tab', currentTab);
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }, [currentTab]);

    const handleTabChange = (next: ActiveTab) => {
        if (next === currentTab) {
            return;
        }
        setCurrentTab(next);
    };

    const coursesTotal = useMemo(() => {
        return courses?.meta?.total ?? courses?.total ?? courses?.data?.length ?? 0;
    }, [courses]);

    const programsTotal = useMemo(() => {
        return programs?.meta?.total ?? programs?.total ?? programs?.data?.length ?? 0;
    }, [programs]);

    const tabCounts: Record<ActiveTab, number> = {
        courses: coursesTotal,
        programs: programsTotal,
    };

    const stringifiedQuery = useMemo(() => {
        const result: Record<string, string> = {};
        Object.entries(query ?? {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                result[key] = String(value);
            }
        });
        return result;
    }, [query]);

    const panelId = (tab: ActiveTab) => `academics-${tab}-panel`;
    const tabId = (tab: ActiveTab) => `academics-${tab}-tab`;

    const pageTitle = isZh ? '課程與學程管理' : 'Courses & Programs';
    const pageDescription = isZh
        ? '集中管理課程與學程，統一掌握篩選條件與資料狀態'
        : 'Manage courses and academic programs together with consistent filters and states.';

    const actionButton = () => {
        if (!isAdmin) {
            return null;
        }

        if (currentTab === 'courses') {
            return (
                <Link href={CourseController.create().url}>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        {isZh ? '新增課程' : 'Create Course'}
                    </Button>
                </Link>
            );
        }

        return (
            <Link href={ProgramController.create().url}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    {isZh ? '新增學程' : 'Create Program'}
                </Button>
            </Link>
        );
    };

    return (
        <AppLayout>
            <Head title={pageTitle} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pageTitle}</h1>
                            <p className="mt-1 text-gray-600">{pageDescription}</p>
                        </div>
                        {actionButton()}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200">
                            {TAB_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentTab === item.value;
                                const count = tabCounts[item.value];
                                return (
                                    <button
                                        key={item.value}
                                        id={tabId(item.value)}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-controls={panelId(item.value)}
                                        tabIndex={isActive ? 0 : -1}
                                        onClick={() => handleTabChange(item.value)}
                                        className={cn(
                                            'inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-6',
                                            isActive
                                                ? 'border-amber-600 text-amber-700'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{isZh ? item.zh : item.en}</span>
                                        <span className="rounded-full bg-gray-100 px-2 text-xs text-gray-600">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div
                            id={panelId('courses')}
                            role="tabpanel"
                            aria-labelledby={tabId('courses')}
                            hidden={currentTab !== 'courses'}
                        >
                            <CourseListPanel
                                courses={courses}
                                programOptions={courseProgramOptions}
                                filters={courseFilters}
                                perPageOptions={coursePerPageOptions}
                                baseQuery={stringifiedQuery}
                                isZh={isZh}
                            />
                        </div>

                        <div
                            id={panelId('programs')}
                            role="tabpanel"
                            aria-labelledby={tabId('programs')}
                            hidden={currentTab !== 'programs'}
                        >
                            <ProgramListPanel
                                programs={programs}
                                filters={programFilters}
                                perPageOptions={programPerPageOptions}
                                baseQuery={stringifiedQuery}
                                isZh={isZh}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
