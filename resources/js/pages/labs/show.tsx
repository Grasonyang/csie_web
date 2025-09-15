import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

// 實驗室詳細頁面
interface Teacher {
    id: number;
    name: string;
}

interface Lab {
    id: number;
    name: string;
    description?: string;
    teachers: Teacher[];
}

export default function LabShow({ lab }: { lab: Lab }) {
    return (
        <PublicLayout>
            {/* 使用實驗室名稱作為標題 */}
            <Head title={lab.name} />
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        {/* 實驗室名稱 */}
                        <CardTitle>{lab.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* 實驗室介紹 */}
                        {lab.description && <p>{lab.description}</p>}
                        {/* 負責教師名單 */}
                        {lab.teachers.length > 0 && (
                            <p className="text-sm">
                                負責教師：{lab.teachers.map((t) => t.name).join('、')}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
