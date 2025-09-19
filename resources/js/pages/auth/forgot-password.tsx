// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const page = usePage<any>();
    const { locale, i18n } = page.props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const t = (key: string, fallback?: string) => {
        return key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;
    };

    return (
        <AuthLayout
            title={isZh ? "忘記密碼" : "Forgot Password"}
            description={isZh ? "請輸入您的電子郵件，我們將寄送密碼重設連結給您" : "Enter your email address and we'll send you a password reset link"}
        >
            <Head title={isZh ? "忘記密碼" : "Forgot Password"} />

            {status && (
                <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-center text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...PasswordResetLinkController.store.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    {isZh ? "電子郵件" : "Email"}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="請輸入您的電子郵件"
                                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600 focus:ring-1"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    {isZh ? "寄送密碼重設連結" : "Send Password Reset Link"}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-slate-600">
                    <span>{isZh ? "或者，" : "Or,"}</span>
                    <TextLink href={login()} className="font-medium text-blue-700 hover:text-blue-800">
                        {isZh ? "返回登入頁面" : "return to login"}
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
