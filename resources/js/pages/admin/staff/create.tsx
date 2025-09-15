// 新增職員頁面
import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import StaffForm from '@/components/admin/staff-form';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

export default function StaffCreate() {
    const submit = (form: any) => {
        form.post(StaffController.store().url);
    };

    return (
        <AppLayout>
            <Head title="新增職員" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardContent>
                        <StaffForm initialValues={{}} onSubmit={submit} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
