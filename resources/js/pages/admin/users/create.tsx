import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import UserForm from '@/components/admin/user-form';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Option = {
    value: string;
    label: string;
};

interface UserCreateProps {
    roleOptions: Option[];
    statusOptions: Option[];
}

export default function UserCreate({ roleOptions, statusOptions }: UserCreateProps) {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    return (
        <AppLayout>
            <Head title={isZh ? '新增使用者' : 'Create User'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {isZh ? '新增使用者' : 'Create User'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <UserForm roleOptions={roleOptions} statusOptions={statusOptions} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
