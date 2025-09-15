import PublicLayout from '@/layouts/public-layout';
// import { type SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import TopCarousel from '@/components/top-carousel';

export default function Welcome() {
    // Page-level shared data available if needed

    return (
        <PublicLayout>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=noto-serif-tc:400,500,600" rel="stylesheet" />
            </Head>
            {/* Hero section with banner background and a large top overlay for announcements */}
            <section className="relative h-[100vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-center bg-cover bg-fixed"
                    style={{ backgroundImage: "url('/images/banner_background.png')" }}
                />
                {/* bottom gradient for readability over the photo */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

                {/* Top announcement panel covering ~half the screen */}
                <TopCarousel
                    className="absolute inset-x-0 top-0 z-20 h-[40vh]"
                    items={[
                        {
                            image: '/images/banner/banner1.png',
                        },
                        {
                            image: '/images/banner/banner2.png',
                        },
                        {
                            image: '/images/banner/banner3.png',
                        },
                    ]}
                />
                <div className="absolute inset-x-0 bottom-0 top-[30vh] z-30 flex items-start pt-6 md:items-center md:pt-10">
                    <div className="mx-auto w-full max-w-7xl px-6">
                        <h1 className="text-white/95 text-3xl font-semibold drop-shadow md:text-6xl">
                            Computer Science 資訊工程學系
                        </h1>
                        <p className="mt-3 max-w-2xl text-white/90 md:text-xl">
                            Department overview and highlights. Scroll to explore more.
                        </p>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
