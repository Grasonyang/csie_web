// 編輯實驗室頁面
import LabController from '@/actions/App/Http/Controllers/Admin/LabController';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Lab {
    id: number;
    name: string;
    name_en?: string;
}

export default function LabEdit({ lab }: { lab: Lab }) {
    return (
        <AppLayout>
            <Head title="編輯實驗室" />
            <Form {...LabController.update.form({ lab: lab.id })} encType="multipart/form-data" className="space-y-4">
                {({ errors, processing }) => (
                    <>
                        {/* 多語欄位 */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">名稱</Label>
                            <Input id="name" name="name" defaultValue={lab.name} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name_en">名稱（英文）</Label>
                            <Input id="name_en" name="name_en" defaultValue={lab.name_en} />
                            <InputError message={errors.name_en} />
                        </div>
                        {/* 附件管理 */}
                        <div className="grid gap-2">
                            <Label htmlFor="cover_image">封面圖</Label>
                            <Input id="cover_image" type="file" name="cover_image" />
                            <InputError message={errors.cover_image} />
                        </div>
                        <Button disabled={processing}>更新</Button>
                        <Link href={LabController.index().url} className="ml-2">
                            取消
                        </Link>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
