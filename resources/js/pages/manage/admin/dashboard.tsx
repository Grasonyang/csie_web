import AdminDashboard from '@/components/admin/dashboard/admin-dashboard';
import ManageLayout from '@/layouts/manage/manage-layout';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function ManageAdminDashboard() {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const breadcrumbs = [
        { title: isZh ? '管理首頁' : 'Management', href: '/manage/dashboard' },
        { title: isZh ? '系統總覽' : 'System overview', href: '/manage/admin/dashboard' },
    ];

    return (
        <ManageLayout role="admin" breadcrumbs={breadcrumbs}>
            <AdminDashboard />
        </ManageLayout>
    );
}
