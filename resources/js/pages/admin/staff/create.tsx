// 新增職員頁面
import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import StaffForm from '@/components/admin/staff-form';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function StaffCreate() {
    const submit = (form: any) => {
        form.post(StaffController.store().url);
    };

    return (
        <AppLayout>
            <Head title="新增職員" />
            <StaffForm initialValues={{}} onSubmit={submit} />
        </AppLayout>
    );
}
