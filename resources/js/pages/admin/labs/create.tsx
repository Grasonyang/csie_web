// 新增實驗室頁面
import LabController from '@/actions/App/Http/Controllers/Admin/LabController';
import LabForm from '@/components/admin/lab-form';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function LabCreate() {
    const submit = (form: any) => {
        form.post(LabController.store().url);
    };

    return (
        <AppLayout>
            <Head title="新增實驗室" />
            <LabForm initialValues={{}} onSubmit={submit} />
        </AppLayout>
    );
}
