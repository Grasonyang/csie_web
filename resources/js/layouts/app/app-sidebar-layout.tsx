import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import AdminFooter from '@/components/admin-footer';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="relative overflow-x-hidden bg-neutral-100 text-black">
                <div className="relative flex min-h-svh flex-col gap-6 pb-10">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />

                    <section className="mx-6 flex flex-1 flex-col gap-8 rounded-xl bg-white px-0 py-0 shadow-sm md:mx-8">
                        <div className="flex flex-1 flex-col gap-8 px-6 py-6 md:px-8">
                            {children}
                        </div>
                    </section>

                    <footer className="mx-6 flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-xs text-neutral-600 shadow-sm md:mx-8">
                        <AdminFooter />
                    </footer>
                </div>
            </AppContent>
        </AppShell>
    );
}
