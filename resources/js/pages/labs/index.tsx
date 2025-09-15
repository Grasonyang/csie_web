import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

// 實驗室列表頁面
interface Teacher {
    id: number;
    name: string;
}

interface Lab {
    id: number;
    code: string;
    name: string;
    teachers: Teacher[];
}

export default function LabsIndex({ labs }: { labs: Lab[] }) {
    return (
        <PublicLayout>
            {/* 頁面標題 */}
            <Head title="實驗室" />
            <div className="container mx-auto space-y-6 py-8">
                {labs.map((lab) => (
                    <Card key={lab.id}>
                        <CardHeader>
                            {/* 實驗室名稱 */}
                            <CardTitle>
                                <Link href={`/labs/${lab.code}`}>{lab.name}</Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* 負責教師名單 */}
                            {lab.teachers.length > 0 && (
                                <p className="text-sm">
                                    負責教師：{lab.teachers.map((t) => t.name).join('、')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </PublicLayout>
    );
}
