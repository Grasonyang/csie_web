import * as TeacherController from '@/actions/App/Http/Controllers/Admin/TeacherController';
import TeacherList, { type TeacherListProps } from '@/components/admin/teacher-list';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function TeachersIndex({ teachers }: TeacherListProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    return (
        <AppLayout>
            <Head title={isZh ? '師資管理' : 'Faculty Management'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {isZh ? '師資管理' : 'Faculty Management'}
                            </h1>
                            <p className="mt-1 text-gray-600">
                                {isZh
                                    ? '此頁面內容已整合至「師資與職員管理」，未來請改用新介面。'
                                    : 'This view has been consolidated into the Faculty & Staff management workspace.'}
                            </p>
                        </div>

                        {auth.user.role === 'admin' && (
                            <Link href={TeacherController.create().url}>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                    {isZh ? '新增教師' : 'Add Teacher'}
                                </Button>
                            </Link>
                        )}
                    </div>

                    <TeacherList teachers={teachers} />
                </div>
            </div>
        </AppLayout>
    );
}
