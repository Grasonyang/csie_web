import * as TeacherController from '@/actions/App/Http/Controllers/Admin/TeacherController';
import TeacherForm from '@/components/admin/teacher-form';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Teacher {
    id: number;
    user_id?: number | null;
    name: string;
    name_en?: string;
    title: string;
    title_en?: string;
    email?: string;
    phone?: string;
    office?: string;
    job_title?: string;
    photo_url?: string;
    bio?: string;
    bio_en?: string;
    expertise?: string;
    expertise_en?: string;
    education?: string;
    education_en?: string;
    sort_order: number;
    visible: boolean;
    user?: User;
    links?: Array<{
        id: number;
        type: string;
        label?: string;
        url: string;
        sort_order: number;
    }>;
}

interface EditTeacherProps {
    teacher: Teacher;
    users: User[];
}

export default function EditTeacher({ teacher, users }: EditTeacherProps) {
    const handleSubmit = (form: any) => {
        form.post(TeacherController.update(teacher.id).url);
    };

    return (
        <AppLayout>
            <Head title={`編輯教師 - ${teacher.name}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* 頁首 */}
                    <div className="mb-6">
                        <Link
                            href={TeacherController.index().url}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            返回師資列表
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                            編輯教師 - {teacher.name}
                        </h1>
                        <p className="mt-1 text-gray-600">
                            修改教師資料和個人資訊
                        </p>
                    </div>

                    {/* 表單 */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="p-6">
                            <TeacherForm teacher={teacher} users={users} onSubmit={handleSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
