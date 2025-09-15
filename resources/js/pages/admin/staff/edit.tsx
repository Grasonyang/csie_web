// 編輯職員頁面
import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Staff {
    id: number;
    name: string;
    name_en?: string;
    position?: string;
    position_en?: string;
}

export default function StaffEdit({ staff }: { staff: Staff }) {
    return (
        <AppLayout>
            <Head title="編輯職員" />
            <Form {...StaffController.update.form({ staff: staff.id })} encType="multipart/form-data" className="space-y-4">
                {({ errors, processing }) => (
                    <>
                        {/* 多語欄位 */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">姓名</Label>
                            <Input id="name" name="name" defaultValue={staff.name} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name_en">姓名（英文）</Label>
                            <Input id="name_en" name="name_en" defaultValue={staff.name_en} />
                            <InputError message={errors.name_en} />
                        </div>
                        {/* 職稱多語欄位 */}
                        <div className="grid gap-2">
                            <Label htmlFor="position">職稱</Label>
                            <Input id="position" name="position" defaultValue={staff.position} />
                            <InputError message={errors.position} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="position_en">職稱（英文）</Label>
                            <Input id="position_en" name="position_en" defaultValue={staff.position_en} />
                            <InputError message={errors.position_en} />
                        </div>
                        {/* 附件管理 */}
                        <div className="grid gap-2">
                            <Label htmlFor="photo">照片</Label>
                            <Input id="photo" type="file" name="photo" />
                            <InputError message={errors.photo} />
                        </div>
                        <Button disabled={processing}>更新</Button>
                        <Link href={StaffController.index().url} className="ml-2">
                            取消
                        </Link>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
