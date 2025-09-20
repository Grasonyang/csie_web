import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    noDecor?: boolean;
}

export default function AuthSimpleLayout({ children, title, description, noDecor = false }: PropsWithChildren<AuthLayoutProps>) {
    const page = usePage<any>();
    const { locale, i18n } = page.props;

    const t = (key: string, fallback?: string) => {
        return key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;
    };

    return (
        <div className={"flex min-h-svh items-center justify-center px-6 py-10 md:px-12 " + (noDecor ? '' : 'bg-gradient-to-br from-slate-100 via-white to-slate-200')}>
            <div className={"w-full max-w-md space-y-10 rounded-3xl border border-slate-200 bg-white/95 p-10 text-center shadow-xl " + (noDecor ? '' : '')}>
                <Link href={home()} className="flex flex-col items-center gap-3 font-medium">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white">
                        <img
                            src="https://www.csie.ncue.edu.tw/csie/resources/images/ncue-csie-logo.png"
                            alt="NCUE CSIE Logo"
                            className="h-12 w-12 object-contain"
                        />
                    </div>
                    <div className="space-y-1 text-center">
                        <div className="text-base font-semibold text-slate-800">
                            {t('site.title_short', '資工系')}
                        </div>
                        <div className="text-sm text-slate-500">
                            {t('site.university', '國立彰化師範大學')}
                        </div>
                    </div>
                </Link>

                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <p className="text-sm leading-6 text-slate-600">{description}</p>
                </div>

                <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-8 py-8 text-left shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
