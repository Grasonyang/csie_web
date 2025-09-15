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
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-blue-50 to-amber-50 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-lg border border-blue-100">
                                {/* 資工系 LOGO */}
                                <img
                                    src="https://www.csie.ncue.edu.tw/csie/resources/images/ncue-csie-logo.png"
                                    alt="NCUE CSIE Logo"
                                    className="h-10 w-10 object-contain"
                                />
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-semibold text-[#151f54]">
                                    {t('site.title_short', '資工系')}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {t('site.university', '國立彰化師範大學')}
                                </div>
                            </div>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold text-[#151f54]">{title}</h1>
                            <p className="text-center text-sm text-gray-600">{description}</p>
                        </div>
                    </div>

                    {/* 認證表單容器 */}
                    <div className="rounded-lg bg-white p-6 shadow-lg border border-gray-100">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
