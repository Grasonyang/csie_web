import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const page = usePage<any>();
    const { locale, i18n } = page.props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const t = (key: string, fallback?: string) => {
        return key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;
    };

    return (
        <AuthLayout
            noDecor={true}
            title={isZh ? "註冊新帳號" : "Register"}
            description={isZh ? "請填寫以下資訊來建立您的帳號" : "Fill in the information below to create your account"}
        >
            <Head title={isZh ? "註冊" : "Register"} />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                    {isZh ? "姓名" : "Name"}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={isZh ? "請輸入您的姓名" : "Enter your name"}
                                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600 focus:ring-1"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    {isZh ? "電子郵件" : "Email"}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={isZh ? "請輸入電子郵件" : "Enter your email"}
                                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600 focus:ring-1"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    {isZh ? "密碼" : "Password"}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={isZh ? "請輸入密碼" : "Enter your password"}
                                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600 focus:ring-1"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                                    {isZh ? "確認密碼" : "Confirm Password"}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={isZh ? "請再次輸入密碼" : "Confirm your password"}
                                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600 focus:ring-1"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                {isZh ? "建立帳號" : "Create Account"}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-slate-600">
                            {isZh ? "已經有帳號了？" : "Already have an account?"}{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-medium text-blue-700 hover:text-blue-800"
                            >
                                {isZh ? "立即登入" : "Sign in"}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
