import AppLayout from '@/layouts/app-layout';
import { Head, Form } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';

// 新增文章頁
export default function PostCreate() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: '文章管理', href: '/admin/posts' },
        { title: '新增', href: '/admin/posts/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="新增文章" />
            <Form method="post" action="/admin/posts" encType="multipart/form-data" className="space-y-4">
                {({ errors }) => (
                    <>
                        {/* 標題（中文） */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">標題</Label>
                            <Input id="title" name="title" required />
                            <InputError message={errors.title} />
                        </div>

                        {/* 標題（英文） */}
                        <div className="grid gap-2">
                            <Label htmlFor="title_en">Title</Label>
                            <Input id="title_en" name="title_en" />
                            <InputError message={errors.title_en} />
                        </div>

                        {/* 內容（中文） */}
                        <div className="grid gap-2">
                            <Label htmlFor="content">內容</Label>
                            <textarea id="content" name="content" className="mt-1 block w-full rounded border" required />
                            <InputError message={errors.content} />
                        </div>

                        {/* 內容（英文） */}
                        <div className="grid gap-2">
                            <Label htmlFor="content_en">Content</Label>
                            <textarea id="content_en" name="content_en" className="mt-1 block w-full rounded border" />
                            <InputError message={errors.content_en} />
                        </div>

                        {/* 附件上傳 */}
                        <div className="grid gap-2">
                            <Label htmlFor="attachments">附件</Label>
                            <Input id="attachments" type="file" name="attachments[]" multiple />
                            <InputError message={errors.attachments} />
                        </div>

                        <Button type="submit">儲存</Button>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
