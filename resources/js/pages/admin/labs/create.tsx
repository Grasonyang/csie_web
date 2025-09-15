// 新增實驗室頁面
import LabController from '@/actions/App/Http/Controllers/Admin/LabController';
import LabForm from '@/components/admin/lab-form';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

export default function LabCreate() {
    const submit = (form: any) => {
        form.post(LabController.store().url);
    };

    return (
        <AppLayout>
            <Head title="新增實驗室" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardContent>
                        <LabForm initialValues={{}} onSubmit={submit} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
