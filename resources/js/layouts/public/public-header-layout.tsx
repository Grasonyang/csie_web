import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import type { PropsWithChildren } from 'react';

export default function PublicHeaderLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    );
}

