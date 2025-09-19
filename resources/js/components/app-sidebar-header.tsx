import { GlassTile } from '@/components/glass';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <GlassTile
            as="header"
            shimmer
            spotlight
            className="flex h-16 shrink-0 items-center gap-3 border border-white/10 px-6 pr-8 text-sidebar-foreground/90 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6"
        >
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 glass-chip bg-white/10 text-white hover:bg-white/20" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </GlassTile>
    );
}
