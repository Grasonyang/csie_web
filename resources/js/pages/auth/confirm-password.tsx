import ConfirmablePasswordController from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
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

export default function ConfirmPassword() {
    const { t } = useTranslator('auth');

    const copy = {
        title: t('pages.confirm_password.title', '確認密碼'),
        description: t('pages.confirm_password.description', '請重新輸入您的密碼以繼續'),
        passwordLabel: t('fields.password.label', '密碼'),
        passwordPlaceholder: t('fields.password.placeholder', '請輸入密碼'),
        submit: t('pages.confirm_password.submit', '確認密碼'),
    };

    return (
        <AuthLayout title={copy.title} description={copy.description}>
            <Head title={copy.title} />

            <Form {...ConfirmablePasswordController.store.form()} resetOnSuccess={['password']} className="space-y-8">
                {({ processing, errors }) => (
                    <div className={formSectionClass}>
                        <div className="space-y-2">
                            <Label htmlFor="password" className={formFieldLabelClass}>
                                {copy.passwordLabel}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder={copy.passwordPlaceholder}
                                autoComplete="current-password"
                                autoFocus
                                className={formFieldInputClass}
                            />
                            <InputError message={errors.password} className="mt-1 text-sm font-medium text-red-600" />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className={formButtonClass}
                            disabled={processing}
                            data-test="confirm-password-button"
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
