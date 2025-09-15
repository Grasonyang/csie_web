import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { FormEventHandler } from 'react';

interface PostCategory {
    id: number;
    name: string;
    name_en: string;
    slug: string;
}

interface CreatePostProps {
    categories: PostCategory[];
}

export default function CreatePost({ categories }: CreatePostProps) {
    const { locale } = usePage<SharedData>().props;
    const isZh = locale === 'zh-TW';

    const { data, setData, post, processing, errors, reset } = useForm({
        title: {
            'zh-TW': '',
            en: '',
        },
        content: {
            'zh-TW': '',
            en: '',
        },
        category_id: '',
        status: 'draft',
        pinned: false,
        publish_at: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(PostController.store().url, {
            onSuccess: () => {
                // 成功後會自動重導向
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={isZh ? '建立公告' : 'Create Post'} />

            <div className="min-h-screen">
                <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href={PostController.index().url}>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{isZh ? '建立公告' : 'Create Post'}</h1>
                            <p className="mt-2 text-gray-600">{isZh ? '建立新的公告或新聞' : 'Create a new announcement or news post'}</p>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <Card className="bg-white shadow-sm">
                                <CardHeader className="border-b border-gray-200">
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        {isZh ? '基本資訊' : 'Basic Information'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    {/* 標題 (中文) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title-zh">{isZh ? '標題 (中文)' : 'Title (Chinese)'}</Label>
                                        <Input
                                            id="title-zh"
                                            value={data.title['zh-TW']}
                                            onChange={(e) => setData('title.zh-TW', e.target.value)}
                                            placeholder={isZh ? '請輸入中文標題' : 'Enter Chinese title'}
                                        />
                                        <InputError message={errors['title.zh-TW']} />
                                    </div>

                                    {/* 標題 (英文) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title-en">{isZh ? '標題 (英文)' : 'Title (English)'}</Label>
                                        <Input
                                            id="title-en"
                                            value={data.title.en}
                                            onChange={(e) => setData('title.en', e.target.value)}
                                            placeholder={isZh ? '請輸入英文標題' : 'Enter English title'}
                                        />
                                        <InputError message={errors['title.en']} />
                                    </div>

                                    {/* 分類 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">{isZh ? '分類' : 'Category'}</Label>
                                        <Select id="category" value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
                                            <option value="">{isZh ? '請選擇分類' : 'Select category'}</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {isZh ? category.name : category.name_en}
                                                </option>
                                            ))}
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    {/* 狀態 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">{isZh ? '狀態' : 'Status'}</Label>
                                        <Select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                            <option value="draft">{isZh ? '草稿' : 'Draft'}</option>
                                            <option value="published">{isZh ? '已發布' : 'Published'}</option>
                                        </Select>
                                    </div>

                                    {/* 置頂 */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="pinned" checked={data.pinned} onCheckedChange={(checked) => setData('pinned', !!checked)} />
                                        <Label htmlFor="pinned">{isZh ? '置頂公告' : 'Pin this post'}</Label>
                                    </div>

                                    {/* 發布時間 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="publish_at">{isZh ? '發布時間' : 'Publish Date'}</Label>
                                        <Input
                                            id="publish_at"
                                            type="datetime-local"
                                            value={data.publish_at}
                                            onChange={(e) => setData('publish_at', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm">
                                <CardHeader className="border-b border-gray-200">
                                    <CardTitle className="text-gray-900">{isZh ? '內容' : 'Content'}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    {/* 內容 (中文) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="content-zh">{isZh ? '內容 (中文)' : 'Content (Chinese)'}</Label>
                                        <Textarea
                                            id="content-zh"
                                            className="min-h-[200px]"
                                            value={data.content['zh-TW']}
                                            onChange={(e) => setData('content.zh-TW', e.target.value)}
                                            placeholder={isZh ? '請輸入中文內容' : 'Enter Chinese content'}
                                        />
                                        <InputError message={errors['content.zh-TW']} />
                                    </div>

                                    {/* 內容 (英文) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="content-en">{isZh ? '內容 (英文)' : 'Content (English)'}</Label>
                                        <Textarea
                                            id="content-en"
                                            className="min-h-[200px]"
                                            value={data.content.en}
                                            onChange={(e) => setData('content.en', e.target.value)}
                                            placeholder={isZh ? '請輸入英文內容' : 'Enter English content'}
                                        />
                                        <InputError message={errors['content.en']} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-end space-x-3 pt-6">
                                <Link href={PostController.index().url}>
                                    <Button variant="outline" className="border-gray-300 text-gray-600">
                                        {isZh ? '取消' : 'Cancel'}
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-blue-600 text-white hover:bg-blue-700">
                                    {processing ? (isZh ? '建立中...' : 'Creating...') : isZh ? '建立公告' : 'Create Post'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
