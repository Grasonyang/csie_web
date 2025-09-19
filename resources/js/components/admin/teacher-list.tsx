import * as TeacherController from '@/actions/App/Http/Controllers/Admin/TeacherController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Edit, EyeOff, Mail, MapPin, Phone, Trash2, Users } from 'lucide-react';

export interface TeacherListItem {
    id: number;
    name: string;
    name_en?: string | null;
    title: string;
    title_en?: string | null;
    email?: string | null;
    phone?: string | null;
    office?: string | null;
    job_title?: string | null;
    photo_url?: string | null;
    bio?: string | null;
    bio_en?: string | null;
    expertise?: string | null;
    expertise_en?: string | null;
    education?: string | null;
    education_en?: string | null;
    sort_order: number;
    visible: boolean;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
    labs?: Array<{
        id: number;
        name: string;
        name_en?: string | null;
    }>;
}

export interface TeacherListPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface TeacherListPaginationMeta {
    total: number;
    [key: string]: unknown;
}

export interface TeacherListProps {
    teachers: {
        data: TeacherListItem[];
        links?: TeacherListPaginationLink[];
        meta: TeacherListPaginationMeta;
    };
}

export default function TeacherList({ teachers }: TeacherListProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';
    const { delete: destroy } = useForm();

    const getName = (teacher: TeacherListItem) => {
        return isZh ? teacher.name : teacher.name_en || teacher.name;
    };

    const getTitle = (teacher: TeacherListItem) => {
        return isZh ? teacher.title : teacher.title_en || teacher.title;
    };

    const handleDelete = (teacher: TeacherListItem) => {
        if (
            confirm(
                isZh
                    ? `確定要刪除教師「${getName(teacher)}」嗎？`
                    : `Delete teacher "${getName(teacher)}"?`
            )
        ) {
            destroy(TeacherController.destroy(teacher.id).url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    return (
        <Card className="bg-white shadow-sm">
            <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Users className="h-5 w-5 text-blue-600" />
                    {isZh ? '教師列表' : 'Faculty List'}
                    <Badge variant="secondary" className="ml-2">
                        {teachers.meta.total} {isZh ? '位教師' : 'teachers'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {teachers.data.length === 0 ? (
                    <div className="py-12 text-center">
                        <Users className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">
                            {isZh ? '尚無教師資料' : 'No teachers yet'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {isZh ? '新增教師以建立名單' : 'Add your first teacher to populate this list'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {teachers.data.map((teacher) => {
                            const bioHtml = isZh ? teacher.bio : teacher.bio_en || teacher.bio;

                            return (
                                <div
                                    key={teacher.id}
                                    className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-start"
                                >
                                <div className="flex-shrink-0">
                                    {teacher.photo_url ? (
                                        <img
                                            src={teacher.photo_url}
                                            alt={getName(teacher)}
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {getName(teacher)}
                                                {!teacher.visible && (
                                                    <EyeOff className="ml-2 inline h-4 w-4 text-gray-400" />
                                                )}
                                            </h3>
                                            <p className="text-sm font-medium text-blue-600">
                                                {getTitle(teacher)}
                                            </p>
                                            {teacher.job_title && (
                                                <p className="text-sm text-gray-500">{teacher.job_title}</p>
                                            )}
                                        </div>
                                        <Badge variant={teacher.visible ? 'default' : 'secondary'}>
                                            {teacher.visible
                                                ? isZh
                                                    ? '公開'
                                                    : 'Visible'
                                                : isZh
                                                ? '隱藏'
                                                : 'Hidden'}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        {teacher.email && (
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                <a href={`mailto:${teacher.email}`} className="hover:text-blue-600">
                                                    {teacher.email}
                                                </a>
                                            </div>
                                        )}
                                        {teacher.phone && (
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                {teacher.phone}
                                            </div>
                                        )}
                                        {teacher.office && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {teacher.office}
                                            </div>
                                        )}
                                    </div>

                                    {bioHtml && (
                                        <div
                                            className="line-clamp-3 text-sm text-gray-600 [&>p]:m-0 [&>p]:leading-relaxed [&_ul]:my-1 [&_ul]:list-disc [&_ol]:my-1 [&_ol]:list-decimal [&_li]:ml-5 [&_a]:text-blue-600 [&_a]:underline"
                                            dangerouslySetInnerHTML={{ __html: bioHtml }}
                                        />
                                    )}

                                    {teacher.labs && teacher.labs.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.labs.map((lab) => (
                                                <Badge key={lab.id} variant="outline" className="text-xs">
                                                    {isZh ? lab.name : lab.name_en || lab.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 sm:ml-4">
                                    <Link href={TeacherController.edit(teacher.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-1 h-4 w-4" />
                                            {isZh ? '編輯' : 'Edit'}
                                        </Button>
                                    </Link>
                                    {auth.user.role === 'admin' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => handleDelete(teacher)}
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            {isZh ? '刪除' : 'Delete'}
                                        </Button>
                                    )}
                                </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {teachers.links && teachers.links.length > 3 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center gap-1">
                            {teachers.links.map((link, index) => (
                                <div key={index}>
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            className={`px-3 py-1 text-sm ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            } rounded`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            className="px-3 py-1 text-sm text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
