import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRightLeft, BadgeInfo, Mail, Phone, RotateCcw, Trash2, Users } from 'lucide-react';
import { type SharedData } from '@/types';

interface StaffMember {
    id: number;
    name: string;
    name_en?: string | null;
    position?: string | null;
    position_en?: string | null;
    email?: string | null;
    phone?: string | null;
    extension?: string | null;
    deleted_at?: string | null;
}

interface StaffIndexProps {
    staff: StaffMember[];
    trashedStaff?: StaffMember[];
}

export default function StaffIndex({ staff, trashedStaff = [] }: StaffIndexProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';
    const { delete: destroy, patch } = useForm();

    const formatPosition = (member: StaffMember) => {
        const primary = member.position ?? null;
        const secondary = member.position_en ?? null;
        if (isZh) {
            return primary ?? secondary ?? (member.extension ? `${isZh ? '分機' : 'EXT'} ${member.extension}` : null);
        }
        return secondary ?? primary ?? (member.extension ? `Ext. ${member.extension}` : null);
    };

    const formatDeletedAt = (value?: string | null) => {
        if (!value) return '';
        return new Date(value).toLocaleString(isZh ? 'zh-TW' : 'en-US');
    };

    const handleDelete = (member: StaffMember) => {
        if (
            confirm(
                isZh
                    ? `確定要將「${member.name}」移至刪除名單嗎？`
                    : `Move "${member.name}" to trash?`
            )
        ) {
            destroy(StaffController.destroy(member.id).url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const handleRestore = (member: StaffMember) => {
        patch(StaffController.restore(member.id).url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleForceDelete = (member: StaffMember) => {
        if (
            confirm(
                isZh
                    ? `確定要永久刪除「${member.name}」？此動作無法復原。`
                    : `Permanently remove "${member.name}"? This cannot be undone.`
            )
        ) {
            destroy(StaffController.forceDelete(member.id).url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title={isZh ? '職員管理' : 'Faculty Management'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {isZh ? '職員管理' : 'Faculty Directory'}
                            </h1>
                            <p className="mt-1 text-gray-600">
                                {isZh
                                    ? '管理系所行政與支援人員資訊'
                                    : 'Manage administrative and support staff details'}
                            </p>
                        </div>

                        {auth.user.role === 'admin' && (
                            <Link href={StaffController.create().url}>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                    {isZh ? '新增職員' : 'Add staff'}
                                </Button>
                            </Link>
                        )}
                    </div>

                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Users className="h-5 w-5 text-blue-600" />
                                {isZh ? '職員列表' : 'Staff List'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {staff.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Users className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                        {isZh ? '尚無職員資料' : 'No staff yet'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isZh ? '新增職員以建立名單' : 'Add your first staff member to populate this list'}
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {staff.map((member) => {
                                        const positionLabel = formatPosition(member);
                                        return (
                                            <li
                                                key={member.id}
                                                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-base font-semibold text-gray-900">
                                                        {member.name}
                                                        {member.name_en && (
                                                            <span className="ml-2 text-sm font-normal text-gray-500">
                                                                ({member.name_en})
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                        {positionLabel && <span>{positionLabel}</span>}
                                                        {member.email && (
                                                            <a
                                                                href={`mailto:${member.email}`}
                                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                                {member.email}
                                                            </a>
                                                        )}
                                                        {member.phone && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                {member.phone}
                                                            </span>
                                                        )}
                                                        {!positionLabel && !member.email && !member.phone && (
                                                            <span className="inline-flex items-center gap-1 text-gray-400">
                                                                <BadgeInfo className="h-4 w-4" />
                                                                {isZh ? '尚未提供詳細資訊' : 'No additional details provided'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {auth.user.role === 'admin' && (
                                                    <div className="flex items-center gap-2 sm:ml-4">
                                                        <Link href={StaffController.edit(member.id).url}>
                                                            <Button variant="outline" size="sm">
                                                                {isZh ? '編輯' : 'Edit'}
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleDelete(member)}
                                                        >
                                                            <Trash2 className="mr-1 h-4 w-4" />
                                                            {isZh ? '刪除' : 'Remove'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Trash2 className="h-5 w-5 text-red-600" />
                                {isZh ? '刪除名單' : 'Trash Bin'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {trashedStaff.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    {isZh
                                        ? '目前沒有待復原或永久刪除的職員資料。'
                                        : 'There are no archived staff members awaiting review.'}
                                </p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {trashedStaff.map((member) => (
                                        <li
                                            key={member.id}
                                            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-base font-semibold text-gray-900">
                                                    {member.name}
                                                    {member.name_en && (
                                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                                            ({member.name_en})
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                    <span className="inline-flex items-center gap-1">
                                                        <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                                                        {isZh ? '刪除於：' : 'Deleted at: '} {formatDeletedAt(member.deleted_at)}
                                                    </span>
                                                    {member.position && (
                                                        <span>{formatPosition(member)}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => handleRestore(member)}
                                                >
                                                    <RotateCcw className="mr-1 h-4 w-4" />
                                                    {isZh ? '復原' : 'Restore'}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleForceDelete(member)}
                                                >
                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                    {isZh ? '永久刪除' : 'Delete permanently'}
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
