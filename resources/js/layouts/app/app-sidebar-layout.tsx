import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { GlassPanel, GlassSurface } from '@/components/glass';
import { type BreadcrumbItem } from '@/types';
import AdminFooter from '@/components/admin-footer';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="relative overflow-x-hidden bg-[var(--surface-base)]/80 text-black transition-colors duration-300"
            >
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden />
                    <div className="absolute left-[-20%] top-1/3 h-80 w-80 rotate-12 rounded-full bg-[#4dd5c8]/10 blur-[140px]" aria-hidden />
                    <div className="absolute -bottom-24 right-24 h-72 w-72 rounded-full bg-[#fca311]/12 blur-[120px]" aria-hidden />
                </div>

                <div className="relative flex min-h-svh flex-col gap-6 pb-10">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />

                    <GlassSurface
                        as="section"
                        shimmer
                        spotlight
                        bleedShadow
                        className="mx-6 flex flex-1 flex-col gap-8 border border-white/10 px-0 py-0 md:mx-8"
                    >
                        <div className="flex flex-1 flex-col gap-8 px-6 py-6 md:px-8">
                            {children}
                        </div>
                    </GlassSurface>

                    <GlassPanel
                        as="footer"
                        shimmer
                        interactive={false}
                        className="mx-6 flex items-center justify-center gap-3 border border-white/15 px-6 py-4 text-xs text-neutral-600 md:mx-8"
                    >
                        <AdminFooter />
                    </GlassPanel>
                </div>
            </AppContent>
        </AppShell>
    );
}
