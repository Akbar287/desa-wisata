"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
            style={{
                padding: "100px 24px",
                background: "var(--color-cream)",
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 20,
                        marginBottom: 40,
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "clamp(26px, 3.5vw, 42px)",
                                fontWeight: 700,
                                color: "var(--color-text)",
                                marginBottom: 8,
                            }}
                        >
                            Panduan Wisata Desa
                        </h2>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 16,
                                color: "var(--color-text-muted)",
                            }}
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
                    style={{
                        display: "flex",
                        gap: 0,
                        background: "rgba(255,255,255,0.7)",
                        borderRadius: "var(--radius-full)",
                        padding: 4,
                        marginBottom: 40,
                        overflowX: "auto",
                    }}
                    className="hide-scrollbar"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={activeTab === tab.id ? "tab-active" : ""}
                            style={{
                                flex: 1,
                                minWidth: 140,
                                padding: "12px 20px",
                                borderRadius: "var(--radius-full)",
                                border: "none",
                                background: "transparent",
                                color:
                                    activeTab === tab.id
                                        ? "white"
                                        : "var(--color-text-muted)",
                                fontFamily: "var(--font-body)",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.3s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                whiteSpace: "nowrap",
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Blog Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                        gap: 24,
                    }}
                >
                    {posts.map((post, i) => (
                        <div
                            key={`${activeTab}-${i}`}
                            className="tour-card"
                            style={{
                                borderRadius: "var(--radius-lg)",
                                overflow: "hidden",
                                background: "var(--color-white)",
                                boxShadow: "var(--shadow-sm)",
                                cursor: "pointer",
                                animation: "fadeInUp 0.5s ease forwards",
                                animationDelay: `${i * 0.1}s`,
                                opacity: 0,
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    height: 200,
                                    overflow: "hidden",
                                }}
                            >
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="tour-card-image"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div style={{ padding: "20px 22px 24px" }}>
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-body)",
                                        fontWeight: 500,
                                    }}
                                >
                                    {post.date}
                                </span>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: "var(--color-text)",
                                        margin: "8px 0 10px",
                                        lineHeight: 1.35,
                                    }}
                                >
                                    {post.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-body)",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
