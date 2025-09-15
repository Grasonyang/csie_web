// 新增職員頁面
import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, Link } from '@inertiajs/react';

export default function StaffCreate() {
    return (
        <AppLayout>
            <Head title="新增職員" />
            <Form {...StaffController.store.form()} encType="multipart/form-data" className="space-y-4">
                {({ errors, processing }) => (
                    <>
                        {/* 多語欄位 */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">姓名</Label>
                            <Input id="name" name="name" />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name_en">姓名（英文）</Label>
                            <Input id="name_en" name="name_en" />
                            <InputError message={errors.name_en} />
                        </div>
                        {/* 職稱多語欄位 */}
                        <div className="grid gap-2">
                            <Label htmlFor="position">職稱</Label>
                            <Input id="position" name="position" />
                            <InputError message={errors.position} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="position_en">職稱（英文）</Label>
                            <Input id="position_en" name="position_en" />
                            <InputError message={errors.position_en} />
                        </div>
                        {/* 附件管理 */}
                        <div className="grid gap-2">
                            <Label htmlFor="photo">照片</Label>
                            <Input id="photo" type="file" name="photo" />
                            <InputError message={errors.photo} />
                        </div>
                        <Button disabled={processing}>儲存</Button>
                        <Link href={StaffController.index().url}>
                            {/* 取消按鈕 */}
                            <Button variant="outline" className="ml-2">
                                取消
                            </Button>
                        </Link>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
