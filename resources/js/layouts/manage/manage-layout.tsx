import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import AdminManageSidebar from '@/components/manage/admin/sidebar';
import TeacherManageSidebar from '@/components/manage/teacher/sidebar';
import UserManageSidebar from '@/components/manage/user/sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminFooter from '@/components/admin-footer';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface ManageLayoutProps {
    role?: 'admin' | 'teacher' | 'user';
}

export default function ManageLayout({ children }: PropsWithChildren<ManageLayoutProps>) {
    const { locale, auth } = usePage<SharedData>().props;
    // Prefer explicit role from auth, fallback to user role
    const role = (auth?.user?.role as 'admin' | 'teacher' | 'user') ?? 'user';

    const Sidebar = role === 'admin' ? AdminManageSidebar : role === 'teacher' ? TeacherManageSidebar : UserManageSidebar;

    return (
        <AppShell variant="sidebar">
            <Sidebar />

            <AppContent variant="sidebar" className="relative overflow-x-hidden bg-white text-black">
                <div className="relative flex min-h-svh flex-col gap-6 pb-10">
                    <AppSidebarHeader />

                    <main className="flex flex-1 flex-col gap-8 px-4 pb-6 sm:px-6 md:px-8">
                        {children}
                    </main>

                    <footer className="mx-4 flex items-center justify-center gap-3 rounded-2xl bg-white/90 px-4 py-4 text-xs text-neutral-600 shadow-sm ring-1 ring-black/5 sm:mx-6 md:mx-8">
                        <AdminFooter />
                    </footer>
                </div>
            </AppContent>
        </AppShell>
    );
}
