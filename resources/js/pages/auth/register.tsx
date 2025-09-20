import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useTranslator } from '@/hooks/use-translator';
import {
    formButtonClass,
    formFieldInputClass,
    formFieldLabelClass,
    formHelperTextClass,
    formLinkClass,
    formSectionClass,
} from './styles';

export default function Register() {
    const { t } = useTranslator('auth');

    const copy = {
        title: t('pages.register.title', '註冊新帳號'),
        description: t('pages.register.description', '請填寫以下資訊來建立您的帳號'),
        nameLabel: t('fields.name.label', '姓名'),
        namePlaceholder: t('fields.name.placeholder', '請輸入您的姓名'),
        emailLabel: t('fields.email.label', '電子郵件'),
        emailPlaceholder: t('fields.email.placeholder', '請輸入電子郵件'),
        passwordLabel: t('fields.password.label', '密碼'),
        passwordPlaceholder: t('fields.password.placeholder', '請輸入密碼'),
        confirmLabel: t('fields.password_confirmation.label', '確認密碼'),
        confirmPlaceholder: t('fields.password_confirmation.placeholder', '請再次輸入密碼'),
        submit: t('pages.register.submit', '建立帳號'),
        loginPrompt: t('pages.register.login_prompt', '已經有帳號了？'),
        loginLink: t('pages.register.login_link', '立即登入'),
    };

    return (
        <AuthLayout title={copy.title} description={copy.description}>
            <Head title={copy.title} />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-8"
            >
                {({ processing, errors }) => (
                    <div className="space-y-8">
                        <div className={formSectionClass}>
                            <div className="space-y-2">
                                <Label htmlFor="name" className={formFieldLabelClass}>
                                    {copy.nameLabel}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    name="name"
                                    placeholder={copy.namePlaceholder}
                                    className={formFieldInputClass}
                                />
                                <InputError message={errors.name} className="mt-1 text-sm font-medium text-red-600" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className={formFieldLabelClass}>
                                    {copy.emailLabel}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    name="email"
                                    placeholder={copy.emailPlaceholder}
                                    className={formFieldInputClass}
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
                                    required
                                    autoComplete="new-password"
                                    name="password"
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
                                    required
                                    autoComplete="new-password"
                                    name="password_confirmation"
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
                            data-test="register-user-button"
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {copy.submit}
                        </Button>

                        <div className={formHelperTextClass + ' text-center'}>
                            {copy.loginPrompt}{' '}
                            <TextLink href={login()} className={formLinkClass}>
                                {copy.loginLink}
                            </TextLink>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
