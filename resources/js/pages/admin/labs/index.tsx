// 實驗室列表頁面
import LabController from '@/actions/App/Http/Controllers/Admin/LabController';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Lab {
    id: number;
    name: string;
}

export default function LabIndex({ labs }: { labs: Lab[] }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="實驗室列表" />
            <div className="space-y-4">
                {auth.user.role === 'admin' && (
                    <Link href={LabController.create().url}>
                        <Button>新增實驗室</Button>
                    </Link>
                )}
                <ul className="list-disc pl-4">
                    {labs.map((l) => (
                        <li key={l.id}>{l.name}</li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
