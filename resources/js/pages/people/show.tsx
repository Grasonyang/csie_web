import PublicLayout from '@/layouts/public-layout';
import { Head, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

interface Person {
    slug: string;
    name: Record<string, string>;
    role: string;
    bio?: Record<string, string>;
}

export default function PeopleShow() {
    const { person, locale, i18n } = usePage<SharedData & { person: Person; i18n: any }>().props;
    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    return (
        <PublicLayout>
            <Head title={person.name[isZh ? 'zh-TW' : 'en']} />
            <div className="mx-auto max-w-3xl p-6 space-y-4">
                {/* 姓名 */}
                <h1 className="text-2xl font-bold">{person.name[isZh ? 'zh-TW' : 'en']}</h1>
                {/* 角色顯示 */}
                <p className="text-sm text-neutral-600">{t(`people.${person.role}`, person.role)}</p>
                {/* 簡介 */}
                {person.bio && <p>{person.bio[isZh ? 'zh-TW' : 'en']}</p>}
            </div>
        </PublicLayout>
    );
}
