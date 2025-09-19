import { GlassPanel, GlassTile } from '@/components/glass';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const page = usePage<any>();
    const { locale, i18n } = page.props;

    const t = (key: string, fallback?: string) => {
        return key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;
    };

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[var(--surface-base)] px-6 py-10 md:px-12">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1d3bb8]/18 blur-3xl" aria-hidden />
                <div className="absolute bottom-0 left-8 h-80 w-80 rounded-full bg-[#4dd5c8]/18 blur-[140px]" aria-hidden />
                <div className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-[#fca311]/15 blur-[150px]" aria-hidden />
            </div>

            <GlassPanel
                shimmer
                bleedShadow
                interactive={false}
                className="w-full max-w-md space-y-8 bg-white/65 px-8 py-8 text-center shadow-[0_45px_140px_-70px_rgba(15,23,42,0.45)]"
            >
                <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                    <GlassTile className="glass-chip flex h-12 w-12 items-center justify-center bg-white/75 p-0">
                        <img
                            src="https://www.csie.ncue.edu.tw/csie/resources/images/ncue-csie-logo.png"
                            alt="NCUE CSIE Logo"
                            className="h-10 w-10 object-contain"
                        />
                    </GlassTile>
                    <div className="text-center">
                        <div className="text-sm font-semibold text-[#151f54]">
                            {t('site.title_short', '資工系')}
                        </div>
                        <div className="text-xs text-neutral-500">
                            {t('site.university', '國立彰化師範大學')}
                        </div>
                    </div>
                </Link>

                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-[#151f54]">{title}</h1>
                    <p className="text-sm text-neutral-600">{description}</p>
                </div>

                <GlassPanel shimmer interactive={false} className="space-y-6 bg-white/80 px-6 py-6 text-left">
                    {children}
                </GlassPanel>
            </GlassPanel>
        </div>
    );
}
