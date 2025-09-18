import UserForm from '@/components/admin/user-form';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Option = {
    value: string;
    label: string;
};

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    locale: string | null;
    email_verified_at: string | null;
}

interface UserEditProps {
    user: AdminUser;
    roleOptions: Option[];
    statusOptions: Option[];
}

export default function UserEdit({ user, roleOptions, statusOptions }: UserEditProps) {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    return (
        <AppLayout>
            <Head title={isZh ? '編輯使用者' : 'Edit User'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {isZh ? '編輯使用者' : 'Edit User'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <UserForm
                                initialValues={user}
                                roleOptions={roleOptions}
                                statusOptions={statusOptions}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
