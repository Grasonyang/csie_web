// 職員列表頁面
import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Staff {
    id: number;
    name: string;
}

export default function StaffIndex({ staff }: { staff: Staff[] }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="職員列表" />
            <div className="space-y-4">
                {auth.user.role === 'admin' && (
                    <Link href={StaffController.create().url}>
                        <Button>新增職員</Button>
                    </Link>
                )}
                <ul className="list-disc pl-4">
                    {staff.map((s) => (
                        <li key={s.id}>{s.name}</li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
