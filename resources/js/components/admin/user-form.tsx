import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';

type Option = {
    value: string;
    label: string;
};

interface UserFormInitialValues {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    status?: string;
    locale?: string | null;
    email_verified_at?: string | null;
}

interface UserFormProps {
    initialValues?: UserFormInitialValues;
    roleOptions: Option[];
    statusOptions: Option[];
    onSubmit?: (form: ReturnType<typeof useForm<UserFormData>>) => void;
}

export interface UserFormData {
    name: string;
    email: string;
    role: string;
    status: string;
    locale: string;
    password: string;
    password_confirmation: string;
    email_verified: boolean;
    _method?: string;
}

export default function UserForm({ initialValues, roleOptions, statusOptions, onSubmit }: UserFormProps) {
    const form = useForm<UserFormData>({
        name: initialValues?.name ?? '',
        email: initialValues?.email ?? '',
        role: initialValues?.role ?? 'user',
        status: initialValues?.status ?? 'active',
        locale: initialValues?.locale ?? '',
        password: '',
        password_confirmation: '',
        email_verified: Boolean(initialValues?.email_verified_at),
        ...(initialValues?.id ? { _method: 'put' } : {}),
    });

    const isEditing = useMemo(() => Boolean(initialValues?.id), [initialValues?.id]);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        if (onSubmit) {
            onSubmit(form);
            return;
        }

        if (isEditing && initialValues?.id) {
            form.post(UserController.update(initialValues.id).url, {
                preserveScroll: true,
            });
        } else {
            form.post(UserController.store().url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                        id="name"
                        name="name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        disabled={form.processing}
                        required
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        disabled={form.processing}
                        required
                    />
                    <InputError message={form.errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="locale">語系（選填）</Label>
                    <Input
                        id="locale"
                        name="locale"
                        placeholder="例如 zh-TW"
                        value={form.data.locale}
                        onChange={(event) => form.setData('locale', event.target.value)}
                        disabled={form.processing}
                    />
                    <InputError message={form.errors.locale} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="role">角色</Label>
                    <Select
                        id="role"
                        value={form.data.role}
                        onChange={(event) => form.setData('role', event.target.value)}
                        disabled={form.processing}
                    >
                        {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <InputError message={form.errors.role} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">狀態</Label>
                    <Select
                        id="status"
                        value={form.data.status}
                        onChange={(event) => form.setData('status', event.target.value)}
                        disabled={form.processing}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <InputError message={form.errors.status} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">密碼{isEditing ? '（若留空則維持不變）' : ''}</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        disabled={form.processing}
                        autoComplete={isEditing ? 'new-password' : 'password'}
                    />
                    <InputError message={form.errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">密碼確認</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={form.data.password_confirmation}
                        onChange={(event) =>
                            form.setData('password_confirmation', event.target.value)
                        }
                        disabled={form.processing}
                        autoComplete={isEditing ? 'new-password' : 'password'}
                    />
                    <InputError message={form.errors.password_confirmation} />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="email_verified"
                        checked={form.data.email_verified}
                        onCheckedChange={(value) => form.setData('email_verified', value === true)}
                        disabled={form.processing}
                    />
                    <Label htmlFor="email_verified" className="text-sm">
                        已驗證 Email
                    </Label>
                </div>
                <InputError message={form.errors.email_verified as string | undefined} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={form.processing}>
                    {isEditing ? '更新使用者' : '建立使用者'}
                </Button>
                <Link href={UserController.index().url}>
                    <Button type="button" variant="outline" disabled={form.processing}>
                        取消
                    </Button>
                </Link>
            </div>
        </form>
    );
}
