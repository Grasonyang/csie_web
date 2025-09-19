import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import * as TeacherController from '@/actions/App/Http/Controllers/Admin/TeacherController';
import AdminPageHeader from '@/components/admin/admin-page-header';
import StaffList, { type StaffListItem } from '@/components/admin/staff-list';
import TeacherList, { type TeacherListProps } from '@/components/admin/teacher-list';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type TabKey = 'teachers' | 'staff';

interface StaffIndexProps {
    initialTab: TabKey;
    staff: {
        active: StaffListItem[];
        trashed: StaffListItem[];
    };
    teachers: TeacherListProps['teachers'];
}

export default function StaffIndex({ initialTab, staff, teachers }: StaffIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';
    const role = auth.user.role;
    const isTeacher = role === 'teacher';
    const canCreate = role === 'admin';
    const userId = auth.user.id;
    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const tabCopy = useMemo(() => {
        return {
            teachers: {
                label: isZh ? '師資' : 'Faculty',
                description: isZh
                    ? '管理教師資訊與公開狀態。'
                    : 'Manage faculty profiles and visibility.',
            },
            staff: {
                label: isZh ? '職員' : 'Staff',
                description: isZh
                    ? '管理行政與支援人員資訊。'
                    : 'Maintain administrative and support staff records.',
            },
        } satisfies Record<TabKey, { label: string; description: string }>;
    }, [isZh]);

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tab);
            if (tab === 'staff') {
                url.searchParams.delete('page');
            }
            window.history.replaceState({}, '', `${url.pathname}${url.search}`);
        }
    };

    const filteredTeachers = useMemo<TeacherListProps['teachers']>(() => {
        if (!isTeacher) {
            return teachers;
        }

        const ownTeachers = teachers.data.filter((teacher) => teacher.user?.id === userId);

        return {
            ...teachers,
            data: ownTeachers,
            meta: {
                ...teachers.meta,
                total: ownTeachers.length,
            },
            links: [],
        };
    }, [teachers, isTeacher, userId]);

    return (
        <AppLayout>
            <Head title={isZh ? '師資與職員管理' : 'Faculty & Staff Management'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <AdminPageHeader
                        title={isZh ? '師資與職員管理' : 'Faculty & Staff Management'}
                        description={
                            isZh
                                ? '集中維護教師與行政職員資料，並掌握公開狀態。'
                                : 'Keep faculty and staff information in one place with consistent visibility controls.'
                        }
                        icon={Users}
                        actions={
                            canCreate ? (
                                <Link
                                    href={
                                        activeTab === 'teachers'
                                            ? TeacherController.create().url
                                            : StaffController.create().url
                                    }
                                >
                                    <Button className="bg-[#ffb401] text-[#151f54] hover:bg-[#e6a000]">
                                        {activeTab === 'teachers'
                                            ? isZh
                                                ? '新增教師'
                                                : 'Add Teacher'
                                            : isZh
                                            ? '新增職員'
                                            : 'Add Staff'}
                                    </Button>
                                </Link>
                            )
                            : undefined
                        }
                    />

                    {isTeacher && (
                        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                            {isZh
                                ? '您僅能編輯自己的師資資料，其他紀錄維持唯讀。'
                                : 'You can edit your own faculty profile while other records remain read-only.'}
                        </div>
                    )}

                    <div className="space-y-3 rounded-xl bg-white/60 p-4 shadow-sm ring-1 ring-gray-200 backdrop-blur">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                                {(Object.keys(tabCopy) as TabKey[]).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleTabChange(key)}
                                        className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                                            activeTab === key
                                                ? 'bg-white text-blue-700 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tabCopy[key].label}
                                    </button>
                                ))}
                            </div>

                            {canCreate && (
                                <Link
                                    href={
                                        activeTab === 'teachers'
                                            ? TeacherController.create().url
                                            : StaffController.create().url
                                    }
                                >
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                        {activeTab === 'teachers'
                                            ? isZh
                                                ? '新增教師'
                                                : 'Add Teacher'
                                            : isZh
                                            ? '新增職員'
                                            : 'Add Staff'}
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <p className="text-sm text-gray-500">{tabCopy[activeTab].description}</p>
                    </div>

                    {activeTab === 'teachers' ? (
                        <TeacherList teachers={filteredTeachers} />
                    ) : (
                        <StaffList staff={staff.active} trashed={staff.trashed} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
