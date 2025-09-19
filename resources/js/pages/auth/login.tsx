import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const page = usePage<any>();
    const { locale, i18n } = page.props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    const t = (key: string, fallback?: string) => {
        return key.split('.').reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), i18n?.common) ?? fallback ?? key;
    };

    return (
        <AuthLayout
            title={isZh ? "登入系統" : "Login"}
            description={isZh ? "請輸入您的帳號密碼以登入系統" : "Enter your credentials to access the system"}
        >
            <Head title={isZh ? "登入" : "Login"} />

            {status && (
                <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-center text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    {isZh ? "電子郵件" : "Email"}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={isZh ? "請輸入電子郵件" : "Enter your email"}
                                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600 focus:ring-1"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        {isZh ? "密碼" : "Password"}
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm text-blue-700 hover:text-blue-800"
                                            tabIndex={5}
                                        >
                                            {isZh ? "忘記密碼？" : "Forgot password?"}
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={isZh ? "請輸入密碼" : "Enter your password"}
                                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600 focus:ring-1"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                />
                                <Label htmlFor="remember" className="text-sm text-slate-700">
                                    {isZh ? "記住我" : "Remember me"}
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                {isZh ? "登入" : "Login"}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-slate-600">
                            {isZh ? "還沒有帳號？" : "Don't have an account?"}{' '}
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="font-medium text-blue-700 hover:text-blue-800"
                            >
                                {isZh ? "註冊新帳號" : "Sign up"}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
