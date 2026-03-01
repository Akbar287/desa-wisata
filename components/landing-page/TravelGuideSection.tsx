"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WaveDividerTop, VineDecoration } from "./NatureOverlay";
import { useState } from "react";

type BlogPostItem = {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: Date | string;
    category: string;
};

const fmtDate = (d: Date | string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const categoryEmojis: Record<string, string> = {
    tips: "ℹ",
    news: "📰",
    places: "🗺",
    things: "✨",
    info: "⚙",
    berita: "📰",
    wisata: "🗺",
    budaya: "🎭",
    alam: "🌿",
    kuliner: "🍲",
};

export default function TravelGuideSection({ posts }: { posts: BlogPostItem[] }) {
    const categories = useMemo(() => {
        const cats = [...new Set(posts.map(p => p.category))];
        return cats.length > 0 ? ["semua", ...cats] : ["semua"];
    }, [posts]);

    const [activeTab, setActiveTab] = useState("semua");

    const filteredPosts = activeTab === "semua"
        ? posts
        : posts.filter(p => p.category === activeTab);

    if (!posts || posts.length === 0) return null;

    return (
        <section
            id="blog"
            className="section-earthy-green py-24 px-6 overflow-hidden"
        >
            <WaveDividerTop fill="#E8F5E9" />
            <VineDecoration position="left" />
            <div className="max-w-[1200px] mx-auto relative z-3">
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
                            Artikel &amp; Tips: Jelajahi tips terbaik tentang desa wisata Indonesia
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
                {categories.length > 1 && (
                    <div
                        className="hide-scrollbar flex gap-0 rounded-full p-1 mb-10 overflow-x-auto"
                        style={{ background: "var(--color-border-subtle)" }}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`flex-1 min-w-[120px] py-3 px-5 rounded-full border-none font-sans text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === cat ? "tab-active" : ""}`}
                                style={{
                                    background: activeTab === cat ? undefined : "transparent",
                                    color: activeTab === cat ? "white" : "var(--color-text-muted)",
                                }}
                            >
                                <span>{categoryEmojis[cat.toLowerCase()] ?? "📋"}</span>
                                {cat === "semua" ? "Semua" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

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
                        {filteredPosts.map((post, i) => (
                            <Link key={post.id} href={`/blog/${post.id}`} className="no-underline">
                                <motion.div
                                    className="tour-card rounded-2xl overflow-hidden cursor-pointer h-full"
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
                                        <span
                                            className="absolute top-3 left-3 text-white px-3 py-1 rounded-full text-xs font-semibold font-sans backdrop-blur-sm"
                                            style={{ background: "rgba(0,0,0,0.4)" }}
                                        >
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="px-5.5 py-5 pb-6">
                                        <span
                                            className="text-xs font-sans font-medium"
                                            style={{ color: "var(--color-text-muted)" }}
                                        >
                                            {fmtDate(post.date)}
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
                            </Link>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
