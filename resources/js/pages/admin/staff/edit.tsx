// 編輯職員頁面
import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import StaffForm from '@/components/admin/staff-form';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

interface Staff {
    id: number;
    name: string;
    name_en?: string;
    position?: string;
    position_en?: string;
}

export default function StaffEdit({ staff }: { staff: Staff }) {
    const submit = (form: any) => {
        form.post(StaffController.update({ staff: staff.id }).url);
    };

    return (
        <AppLayout>
            <Head title="編輯職員" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardContent>
                        <StaffForm initialValues={staff} onSubmit={submit} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
