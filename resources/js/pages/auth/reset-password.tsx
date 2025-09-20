import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useTranslator } from '@/hooks/use-translator';
import {
    formButtonClass,
    formFieldInputClass,
    formFieldLabelClass,
    formSectionClass,
} from './styles';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslator('auth');

    const copy = {
        title: t('pages.reset_password.title', '重設密碼'),
        description: t('pages.reset_password.description', '請輸入新的密碼以完成重設'),
        emailLabel: t('fields.email.label', '電子郵件'),
        passwordLabel: t('fields.new_password.label', '新密碼'),
        passwordPlaceholder: t('fields.new_password.placeholder', '請輸入新的密碼'),
        confirmLabel: t('fields.new_password_confirmation.label', '確認新密碼'),
        confirmPlaceholder: t('fields.new_password_confirmation.placeholder', '請再次輸入新的密碼'),
        submit: t('pages.reset_password.submit', '更新密碼'),
    };

    return (
        <AuthLayout title={copy.title} description={copy.description}>
            <Head title={copy.title} />

            <Form
                {...NewPasswordController.store.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="space-y-8"
            >
                {({ processing, errors }) => (
                    <div className="space-y-8">
                        <div className={formSectionClass}>
                            <div className="space-y-2">
                                <Label htmlFor="email" className={formFieldLabelClass}>
                                    {copy.emailLabel}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    className={`${formFieldInputClass} cursor-not-allowed bg-slate-100 text-slate-500`}
                                />
                                <InputError message={errors.email} className="mt-1 text-sm font-medium text-red-600" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className={formFieldLabelClass}>
                                    {copy.passwordLabel}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder={copy.passwordPlaceholder}
                                    className={formFieldInputClass}
                                />
                                <InputError message={errors.password} className="mt-1 text-sm font-medium text-red-600" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className={formFieldLabelClass}>
                                    {copy.confirmLabel}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder={copy.confirmPlaceholder}
                                    className={formFieldInputClass}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-1 text-sm font-medium text-red-600"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className={formButtonClass}
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {copy.submit}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
