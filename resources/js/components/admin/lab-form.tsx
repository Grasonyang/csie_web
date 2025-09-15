import LabController from '@/actions/App/Http/Controllers/Admin/LabController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export interface LabFormData {
    name: string;
    name_en?: string;
    cover_image: File | null;
    _method?: string;
}

interface LabFormProps {
    initialValues?: {
        id?: number;
        name?: string;
        name_en?: string;
    };
    onSubmit: (form: any) => void;
}

export default function LabForm({ initialValues, onSubmit }: LabFormProps) {
    const form = useForm<LabFormData>({
        name: initialValues?.name ?? '',
        name_en: initialValues?.name_en ?? '',
        cover_image: null,
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
                <Label htmlFor="name">名稱</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                />
                <InputError message={form.errors.name} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name_en">名稱（英文）</Label>
                <Input
                    id="name_en"
                    name="name_en"
                    value={form.data.name_en}
                    onChange={(e) => form.setData('name_en', e.target.value)}
                />
                <InputError message={form.errors.name_en} />
            </div>
            {/* 附件管理 */}
            <div className="grid gap-2">
                <Label htmlFor="cover_image">封面圖</Label>
                <Input
                    id="cover_image"
                    type="file"
                    name="cover_image"
                    onChange={(e) => form.setData('cover_image', e.target.files ? e.target.files[0] : null)}
                />
                <InputError message={form.errors.cover_image} />
            </div>
            <Button disabled={form.processing}>{initialValues?.id ? '更新' : '儲存'}</Button>
            <Link href={LabController.index().url}>
                {/* 取消按鈕 */}
                <Button variant="outline" className="ml-2">
                    取消
                </Button>
            </Link>
        </form>
    );
}
