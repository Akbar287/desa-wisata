"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
    { id: "tips", label: "Tips Perjalanan", icon: "ℹ" },
    { id: "news", label: "Berita", icon: "📰" },
    { id: "places", label: "Tempat Wisata", icon: "🗺" },
    { id: "things", label: "Hal Menarik", icon: "✨" },
    { id: "info", label: "Info Penting", icon: "⚙" },
];

const blogPosts: Record<string, Array<{ title: string; excerpt: string; image: string; date: string }>> = {
    tips: [
        {
            title: "10 Tips Mengunjungi Desa Wisata untuk Pertama Kali",
            excerpt: "Panduan lengkap untuk mempersiapkan perjalanan ke desa wisata Indonesia...",
            image: "/assets/e4d31f2e-34fe-4720-9db0-296cdfe9e921-10questions_cover.jpg",
            date: "20 Feb 2026",
        },
        {
            title: "Apa yang Harus Dibawa ke Desa Wisata?",
            excerpt: "Packing list lengkap untuk kenyamanan Anda selama menjelajahi desa wisata...",
            image: "/assets/1d3ea945-5ed1-4f21-8102-7bfd0ebde444-720x405-4ec8ef19-bc8c-4a99-9ba6-9b0a691bf91f-3814bcbb0a7203734988b55938d1c711.jpg",
            date: "18 Feb 2026",
        },
        {
            title: "Kesalahan yang Sering Dilakukan Wisatawan",
            excerpt: "Hindari kesalahan umum ini agar pengalaman wisata Anda sempurna...",
            image: "/assets/a084ee08-c292-406b-84cb-929c4520639b-720x405-dab2b0a2-1b42-4f6a-a995-0193a06e8723-c7cfb592306735f092476a9701d6281b.jpg",
            date: "15 Feb 2026",
        },
    ],
    news: [
        {
            title: "Desa Wisata Indonesia Masuk Daftar UNWTO 2026",
            excerpt: "Beberapa desa wisata Indonesia kembali masuk daftar best tourism village UNWTO...",
            image: "/assets/48b385d3-fa48-48b9-bb8e-e2adfb8b4440-720x405-e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg",
            date: "22 Feb 2026",
        },
        {
            title: "Festival Desa Wisata Nasional 2026",
            excerpt: "Agenda lengkap Festival Desa Wisata yang akan diselenggarakan tahun ini...",
            image: "/assets/dabd56af-becf-4eb9-a39a-7138ba1b3b1b-720x405-6615f379-cebf-4ca7-93c2-606f958dde93-579f042f73c604c6f262f3c32633af91.jpg",
            date: "19 Feb 2026",
        },
        {
            title: "Program Pendampingan Desa Wisata Baru",
            excerpt: "Kementerian Pariwisata meluncurkan program pendampingan untuk desa wisata baru...",
            image: "/assets/feb131f1-fb0d-47a1-a7f0-d55d2371f04b-720x405-c0395b3f-6b1f-4804-9dae-fff07849cafd-09389ad039b.jpg",
            date: "14 Feb 2026",
        },
    ],
    places: [
        {
            title: "Desa Penglipuran — Desa Terbersih di Dunia",
            excerpt: "Menjelajahi keunikan arsitektur dan budaya desa adat Penglipuran di Bali...",
            image: "/assets/b28b323b-e465-4725-aa3d-4483c910a6ce-720x405-7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg",
            date: "21 Feb 2026",
        },
        {
            title: "Wae Rebo — Desa di Atas Awan",
            excerpt: "Petualangan menakjubkan menuju rumah adat Mbaru Niang di Flores...",
            image: "/assets/36e2a99a-7ce9-4705-87fe-cfdbddcac8ab-720x405-22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg",
            date: "17 Feb 2026",
        },
        {
            title: "Nglanggeran — Desa Wisata Gunung Api Purba",
            excerpt: "Wisata geologi dan budaya di lereng gunung api purba Yogyakarta...",
            image: "/assets/ce6fb2c5-e9c6-4ec1-ae2d-b7c7c4367d81-720x405-8c40e1c4-10d4-4dc9-90e7-b832fd6f4b79-fa723100cbf6b45c3c8aa40ca4adf9b8.jpg",
            date: "12 Feb 2026",
        },
    ],
    things: [
        {
            title: "Belajar Membatik di Desa Wisata Krebet",
            excerpt: "Pengalaman unik belajar membatik langsung dari pengrajin desa...",
            image: "/assets/a7089f28-64fa-4f1b-aaaa-77cb6b8f94fa-720x405-de04fdb2-ce95-4faf-bfc7-ff0f746da104-36eb93d315a100c3d3098747caaa90d3.jpg",
            date: "20 Feb 2026",
        },
        {
            title: "Menanam Padi di Sawah Terasering Jatiluwih",
            excerpt: "Rasakan pengalaman menanam padi di sawah UNESCO World Heritage...",
            image: "/assets/e50bd774-982a-4206-b5b9-3ace3c9c8f27-gobi_gallery1.jpg",
            date: "16 Feb 2026",
        },
        {
            title: "Upacara Adat yang Bisa Disaksikan Wisatawan",
            excerpt: "Daftar upacara adat yang terbuka untuk wisatawan di berbagai desa...",
            image: "/assets/38826e03-83a4-482e-a720-492ac8bfaef5-cover_culture.jpg",
            date: "10 Feb 2026",
        },
    ],
    info: [
        {
            title: "Waktu Terbaik Mengunjungi Desa Wisata",
            excerpt: "Panduan musim dan cuaca untuk merencanakan kunjungan optimal...",
            image: "/assets/9b4e5aa3-5ec7-4c73-b146-e0f45b9eff94-mistakes_Gallery_road.jpg",
            date: "19 Feb 2026",
        },
        {
            title: "Transportasi Menuju Desa Wisata Terpencil",
            excerpt: "Tips dan panduan transportasi untuk mencapai desa-desa wisata yang jauh...",
            image: "/assets/7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg",
            date: "13 Feb 2026",
        },
        {
            title: "Etika Berkunjung ke Desa Adat",
            excerpt: "Hal-hal yang perlu diperhatikan saat mengunjungi desa adat...",
            image: "/assets/22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg",
            date: "8 Feb 2026",
        },
    ],
};

export default function TravelGuideSection() {
    const [activeTab, setActiveTab] = useState("tips");
    const posts = blogPosts[activeTab] || [];

    return (
        <section
            id="blog"
            className="py-24 px-6"
            style={{ background: "var(--color-cream)" }}
        >
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-5 mb-10">
                    <div>
                        <motion.h2
                            className="font-serif font-bold mb-2"
                            style={{
                                fontSize: "clamp(26px, 3.5vw, 42px)",
                                color: "var(--color-text)",
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Panduan Wisata Desa
                        </motion.h2>
                        <p
                            className="font-sans text-base"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Artikel & Tips: Jelajahi tips terbaik tentang desa wisata Indonesia
                        </p>
                    </div>
                    <Link href="/blog" className="btn-outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        Lihat semua artikel
                    </Link>
                </div>

                {/* Tabs */}
                <div
                    className="hide-scrollbar flex gap-0 rounded-full p-1 mb-10 overflow-x-auto"
                    style={{ background: "var(--color-border-subtle)" }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[140px] py-3 px-5 rounded-full border-none font-sans text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "tab-active" : ""}`}
                            style={{
                                background: activeTab === tab.id ? undefined : "transparent",
                                color: activeTab === tab.id ? "white" : "var(--color-text-muted)",
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Blog Cards */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        className="grid gap-6"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {posts.map((post, i) => (
                            <motion.div
                                key={`${activeTab}-${i}`}
                                className="tour-card rounded-2xl overflow-hidden cursor-pointer"
                                style={{
                                    background: "var(--color-white)",
                                    boxShadow: "var(--shadow-sm)",
                                }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="relative h-[200px] overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="tour-card-image object-cover"
                                    />
                                </div>
                                <div className="px-5.5 py-5 pb-6">
                                    <span
                                        className="text-xs font-sans font-medium"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        {post.date}
                                    </span>
                                    <h3
                                        className="font-serif text-lg font-bold mt-2 mb-2.5 leading-snug"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        {post.title}
                                    </h3>
                                    <p
                                        className="text-sm font-sans leading-relaxed"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        {post.excerpt}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
