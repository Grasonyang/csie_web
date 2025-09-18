import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const currentYear = new Date().getFullYear();

const quickLinks = [
    { href: '/bulletins', label: '最新公告' },
    { href: '/labs', label: '研究實驗室' },
    { href: '/people', label: '師資陣容' },
    { href: '#contact', label: '聯絡窗口' },
];

const resources = [
    { href: '/bulletins?cat=admission', label: '招生資訊' },
    { href: '/bulletins?cat=events', label: '活動報名' },
    { href: '/bulletins?cat=scholarship', label: '獎助學金' },
    { href: '/bulletins', label: '下載專區' },
];

export default function PublicFooter() {
    return (
        <footer className="mt-16 bg-[#0b1126] text-slate-200">
            <div className="content-container section-padding grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr,1fr]">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-primary/60">NCUE CSIE</p>
                        <h2 className="text-2xl font-semibold text-white">資訊工程學系</h2>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-slate-300">
                        我們致力於培養兼具技術與視野的資訊專業人才，透過跨領域合作、產學研結合與創新課程，陪伴學生走向國際舞台。
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-slate-300">
                        <a className="flex items-center gap-2 hover:text-white" href="tel:+886-4-7232105">
                            <Phone className="size-4" />
                            <span>+886-4-723-2105</span>
                        </a>
                        <a className="flex items-center gap-2 hover:text-white" href="mailto:csie@ncue.edu.tw">
                            <Mail className="size-4" />
                            <span>csie@ncue.edu.tw</span>
                        </a>
                        <div className="flex items-start gap-2">
                            <MapPin className="size-4 shrink-0" />
                            <span>50074 彰化市進德路一段1號 理學院大樓</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-white">快速連結</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        {quickLinks.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="group inline-flex items-center gap-2 text-slate-300 transition hover:text-white"
                                >
                                    <ArrowUpRight className="size-4 text-primary/50 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-white">學習資源</h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        {resources.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="group inline-flex items-center gap-2 text-slate-300 transition hover:text-white"
                                >
                                    <ArrowUpRight className="size-4 text-primary/50 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-white">追蹤我們</h3>
                    <p className="text-sm text-slate-300">
                        持續掌握系所最新公告、國際合作與校友活動，歡迎關注官方社群與電子報。
                    </p>
                    <div className="flex flex-col gap-3 text-sm">
                        <a
                            href="https://www.facebook.com/ncue.csie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 transition hover:border-primary hover:text-white"
                        >
                            <ArrowUpRight className="size-4 text-primary/50 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                            Facebook
                        </a>
                        <a
                            href="https://www.instagram.com/ncue.csie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 transition hover:border-primary hover:text-white"
                        >
                            <ArrowUpRight className="size-4 text-primary/50 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                            Instagram
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10"> 
                <div className="content-container flex flex-col gap-3 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
                    <div>© {currentYear} National Changhua University of Education – Department of Computer Science and Information Engineering.</div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span>All Rights Reserved.</span>
                        <Link href="/privacy" className="hover:text-white">
                            隱私權政策
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

