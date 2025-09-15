import PublicLayout from '@/layouts/public-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { SharedData } from '@/types';

interface Person {
    slug: string;
    name: Record<string, string>;
    role: string;
}

export default function PeopleIndex() {
    const { people = [], role = 'all', locale, i18n } = usePage<SharedData & { people: Person[]; role?: string; i18n: any }>().props;
    const t = (key: string, fallback?: string) =>
        key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;

    // 角色篩選狀態
    const [selectedRole, setSelectedRole] = useState<string>(role || 'all');
    const isZh = locale?.toLowerCase() === 'zh-tw';
    const filtered = selectedRole === 'all' ? people : people.filter((p) => p.role === selectedRole);

    return (
        <PublicLayout>
            <Head title={t('nav.people', 'People')} />
            <div className="mx-auto max-w-7xl p-6">
                {/* 篩選按鈕 */}
                <div className="mb-4 flex gap-2">
                    <button
                        className={`border px-3 py-1 ${selectedRole === 'all' ? 'bg-neutral-200' : ''}`}
                        onClick={() => setSelectedRole('all')}
                    >
                        全部
                    </button>
                    <button
                        className={`border px-3 py-1 ${selectedRole === 'faculty' ? 'bg-neutral-200' : ''}`}
                        onClick={() => setSelectedRole('faculty')}
                    >
                        {t('people.faculty', 'Faculty')}
                    </button>
                    <button
                        className={`border px-3 py-1 ${selectedRole === 'staff' ? 'bg-neutral-200' : ''}`}
                        onClick={() => setSelectedRole('staff')}
                    >
                        {t('people.staff', 'Staff')}
                    </button>
                </div>

                {/* 列表 */}
                <ul className="space-y-2">
                    {filtered.map((person) => (
                        <li key={person.slug}>
                            <Link href={`/people/${person.slug}`} className="text-blue-600 hover:underline">
                                {person.name[isZh ? 'zh-TW' : 'en']}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </PublicLayout>
    );
}
