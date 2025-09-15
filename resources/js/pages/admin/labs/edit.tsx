// 編輯實驗室頁面
import LabController from '@/actions/App/Http/Controllers/Admin/LabController';
import LabForm from '@/components/admin/lab-form';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Lab {
    id: number;
    name: string;
    name_en?: string;
}

export default function LabEdit({ lab }: { lab: Lab }) {
    const submit = (form: any) => {
        form.post(LabController.update({ lab: lab.id }).url);
    };

    return (
        <AppLayout>
            <Head title="編輯實驗室" />
            <LabForm initialValues={lab} onSubmit={submit} />
        </AppLayout>
    );
}
