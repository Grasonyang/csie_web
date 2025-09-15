import StaffController from '@/actions/App/Http/Controllers/Admin/StaffController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export interface StaffFormData {
    name: string;
    name_en?: string;
    position?: string;
    position_en?: string;
    photo: File | null;
    _method?: string;
}

interface StaffFormProps {
    initialValues?: {
        id?: number;
        name?: string;
        name_en?: string;
        position?: string;
        position_en?: string;
    };
    onSubmit: (form: any) => void;
}

export default function StaffForm({ initialValues, onSubmit }: StaffFormProps) {
    const form = useForm<StaffFormData>({
        name: initialValues?.name ?? '',
        name_en: initialValues?.name_en ?? '',
        position: initialValues?.position ?? '',
        position_en: initialValues?.position_en ?? '',
        photo: null,
        ...(initialValues?.id ? { _method: 'put' } : {}),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={submit} encType="multipart/form-data" className="space-y-4">
            {/* 多語欄位 */}
            <div className="grid gap-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                />
                <InputError message={form.errors.name} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name_en">姓名（英文）</Label>
                <Input
                    id="name_en"
                    name="name_en"
                    value={form.data.name_en}
                    onChange={(e) => form.setData('name_en', e.target.value)}
                />
                <InputError message={form.errors.name_en} />
            </div>
            {/* 職稱多語欄位 */}
            <div className="grid gap-2">
                <Label htmlFor="position">職稱</Label>
                <Input
                    id="position"
                    name="position"
                    value={form.data.position}
                    onChange={(e) => form.setData('position', e.target.value)}
                />
                <InputError message={form.errors.position} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="position_en">職稱（英文）</Label>
                <Input
                    id="position_en"
                    name="position_en"
                    value={form.data.position_en}
                    onChange={(e) => form.setData('position_en', e.target.value)}
                />
                <InputError message={form.errors.position_en} />
            </div>
            {/* 附件管理 */}
            <div className="grid gap-2">
                <Label htmlFor="photo">照片</Label>
                <Input
                    id="photo"
                    type="file"
                    name="photo"
                    onChange={(e) => form.setData('photo', e.target.files ? e.target.files[0] : null)}
                />
                <InputError message={form.errors.photo} />
            </div>
            <Button disabled={form.processing}>{initialValues?.id ? '更新' : '儲存'}</Button>
            <Link href={StaffController.index().url}>
                {/* 取消按鈕 */}
                <Button variant="outline" className="ml-2">
                    取消
                </Button>
            </Link>
        </form>
    );
}
