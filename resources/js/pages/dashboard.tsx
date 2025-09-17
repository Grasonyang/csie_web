import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Megaphone,
    UserCheck,
    Beaker,
    BookOpen,
    GraduationCap,
    Users,
    Mail,
    TrendingUp,
    Clock,
    Calendar,
    Eye,
    ChevronRight
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// 統計數據卡片組件
function StatCard({ title, value, icon: Icon, trend, color = "blue" }: {
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    trend?: string;
    color?: "blue" | "green" | "purple" | "orange";
}) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        green: "bg-green-50 text-green-600 border-green-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200",
        orange: "bg-orange-50 text-orange-600 border-orange-200"
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

// 快速操作卡片組件
function QuickActionCard({ title, description, href, icon: Icon, color = "blue" }: {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<any>;
    color?: "blue" | "green" | "purple" | "orange";
}) {
    const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-600",
        green: "bg-green-500 hover:bg-green-600",
        purple: "bg-purple-500 hover:bg-purple-600",
        orange: "bg-orange-500 hover:bg-orange-600"
    };

    return (
        <Link href={href} className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colorClasses[color]} text-white`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </Link>
    );
}

export default function Dashboard() {
    const page = usePage<any>();
    const { locale } = page.props;
    const isZh = locale?.toLowerCase() === 'zh-tw';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isZh ? "管理後台" : "Dashboard"} />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isZh ? "系統管理後台" : "System Dashboard"}
                        </h1>
                        <p className="text-gray-600">
                            {isZh ? "歡迎回來！這是您的系統概覽。" : "Welcome back! Here's your system overview."}
                        </p>
                    </div>

                    {/* 統計卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title={isZh ? "總公告數" : "Total Posts"}
                            value="48"
                            icon={Megaphone}
                            trend="+12% this month"
                            color="blue"
                        />
                        <StatCard
                            title={isZh ? "師資人數" : "Faculty Members"}
                            value="25"
                            icon={UserCheck}
                            trend="+3 new this year"
                            color="green"
                        />
                        <StatCard
                            title={isZh ? "實驗室數" : "Laboratories"}
                            value="12"
                            icon={Beaker}
                            color="purple"
                        />
                        <StatCard
                            title={isZh ? "開設課程" : "Courses Offered"}
                            value="156"
                            icon={BookOpen}
                            trend="+8 this semester"
                            color="orange"
                        />
                    </div>

                    {/* 快速操作區 */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            {isZh ? "快速操作" : "Quick Actions"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <QuickActionCard
                                title={isZh ? "發布公告" : "Create Post"}
                                description={isZh ? "新增公告、新聞或活動資訊" : "Add announcements, news or event information"}
                                href="/admin/posts/create"
                                icon={Megaphone}
                                color="blue"
                            />
                            <QuickActionCard
                                title={isZh ? "管理師資" : "Manage Faculty"}
                                description={isZh ? "新增或編輯教師與行政人員資料" : "Add or edit faculty and staff information"}
                                href="/admin/staff"
                                icon={UserCheck}
                                color="green"
                            />
                            <QuickActionCard
                                title={isZh ? "實驗室設定" : "Lab Settings"}
                                description={isZh ? "管理實驗室資訊與成員" : "Manage laboratory information and members"}
                                href="/admin/labs"
                                icon={Beaker}
                                color="purple"
                            />
                            <QuickActionCard
                                title={isZh ? "課程管理" : "Course Management"}
                                description={isZh ? "設定課程資訊與學分" : "Configure course information and credits"}
                                href="/admin/courses"
                                icon={BookOpen}
                                color="orange"
                            />
                            <QuickActionCard
                                title={isZh ? "學程規劃" : "Program Planning"}
                                description={isZh ? "管理學位學程設定" : "Manage degree program configurations"}
                                href="/admin/programs"
                                icon={GraduationCap}
                                color="blue"
                            />
                            <QuickActionCard
                                title={isZh ? "使用者管理" : "User Management"}
                                description={isZh ? "管理使用者帳號與權限" : "Manage user accounts and permissions"}
                                href="/admin/users"
                                icon={Users}
                                color="green"
                            />
                        </div>
                    </div>

                    {/* 最近活動 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 最新公告 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {isZh ? "最新公告" : "Latest Posts"}
                                </h3>
                                <Link href="/admin/posts" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    {isZh ? "查看全部" : "View All"}
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {isZh ? `重要公告標題 ${item}` : `Important Announcement ${item}`}
                                            </p>
                                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3 mr-1" />
                                                <span>2 hours ago</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Eye className="w-4 h-4 text-gray-400 mr-1" />
                                            <span className="text-xs text-gray-500">124</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 待處理事項 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {isZh ? "待處理事項" : "Pending Tasks"}
                                </h3>
                                <Link href="/admin/contact-messages" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    {isZh ? "查看全部" : "View All"}
                                </Link>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 text-blue-500 mr-3" />
                                        <span className="text-sm text-gray-900">
                                            {isZh ? "新聯絡訊息" : "New Contact Messages"}
                                        </span>
                                    </div>
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">3</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 text-green-500 mr-3" />
                                        <span className="text-sm text-gray-900">
                                            {isZh ? "待審核使用者" : "Pending User Approvals"}
                                        </span>
                                    </div>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">1</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-purple-500 mr-3" />
                                        <span className="text-sm text-gray-900">
                                            {isZh ? "今日活動" : "Today's Events"}
                                        </span>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
