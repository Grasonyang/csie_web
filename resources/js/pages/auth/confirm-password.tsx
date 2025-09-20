import ConfirmablePasswordController from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function ConfirmPassword() {
    const page = usePage<any>();
    const { locale } = page.props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    return (
        <AuthLayout
            noDecor={true}
            title={isZh ? "確認密碼" : "Confirm Password"}
            description={isZh ? "請重新輸入您的密碼以繼續" : "Please re-enter your password to continue"}
        >
            <Head title={isZh ? "確認密碼" : "Confirm password"} />

            <Form {...ConfirmablePasswordController.store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" name="password" placeholder="Password" autoComplete="current-password" autoFocus />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button className="w-full" disabled={processing} data-test="confirm-password-button">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Confirm password
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
