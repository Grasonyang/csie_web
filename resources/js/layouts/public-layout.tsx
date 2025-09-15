import PublicLayoutTemplate from '@/layouts/public/public-header-layout';
import type { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return <PublicLayoutTemplate>{children}</PublicLayoutTemplate>;
}

