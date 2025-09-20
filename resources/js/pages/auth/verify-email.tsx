// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const page = usePage<any>();
    const { locale } = page.props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    return (
        <AuthLayout
              noDecor={true}
              title={isZh ? "驗證電子郵件" : "Verify Email"}
              description={isZh ? "請透過點擊我們剛才發送給您的電子郵件中的連結來驗證您的電子郵件地址。" : "Please verify your email address by clicking on the link we just emailed to you."}
        >
            <Head title={isZh ? "電子郵件驗證" : "Email Verification"} />

            {status && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <Form {...EmailVerificationNotificationController.store.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isZh ? "重新發送驗證郵件" : "Resend Verification Email"}
                        </Button>

                        <TextLink href={logout()} className="mx-auto block text-sm text-blue-700 hover:text-blue-800">
                            {isZh ? "登出" : "Log out"}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
