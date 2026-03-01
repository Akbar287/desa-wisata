"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BlogDetailPost } from "@/types/BlogType";

const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const CATEGORY_COLORS: Record<string, string> = {
    "travel-tips": "linear-gradient(135deg, #2D6A4F, #40916C)",
    news: "linear-gradient(135deg, #1B4332, #52B788)",
    destinations: "linear-gradient(135deg, #5A189A, #7B2CBF)",
    "important-info": "linear-gradient(135deg, #B56727, #E09F3E)",
};

const CATEGORY_LABELS: Record<string, string> = {
    "travel-tips": "Tips Perjalanan",
    news: "Berita",
    destinations: "Tempat Wisata",
    "important-info": "Info Penting",
};

export default function BlogIdComponents({ post }: { post: BlogDetailPost }) {
    const catGradient = CATEGORY_COLORS[post.category] || CATEGORY_COLORS["travel-tips"];
    const catLabel = CATEGORY_LABELS[post.category] || post.category;

    return (
        <main>
            {/* ─── HERO ──────────────────────────────────── */}
            <section className="relative w-full min-h-[520px] h-[55vh] overflow-hidden">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)",
                    }}
                />

                <div className="relative z-2 h-full flex flex-col justify-end max-w-[900px] mx-auto px-6 pb-14">
                    {/* Breadcrumb */}
                    <motion.div
                        className="flex items-center gap-2 mb-5"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            href="/blog"
                            className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors"
                        >
                            Blog
                        </Link>
                        <span className="text-white/40">›</span>
                        <Link
                            href={`/blog?category=${post.category}`}
                            className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors"
                        >
                            {catLabel}
                        </Link>
                    </motion.div>

                    {/* Category badge */}
                    <motion.span
                        className="inline-block w-fit px-4 py-1.5 rounded-full text-xs font-sans font-bold text-white uppercase tracking-wide mb-4"
                        style={{ background: catGradient }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {catLabel}
                    </motion.span>

                    {/* Title */}
                    <motion.h1
                        className="font-serif font-bold text-white dark:text-gray-300 leading-tight mb-5"
                        style={{ fontSize: "clamp(28px, 4.5vw, 52px)", textShadow: "0 3px 20px rgba(0,0,0,0.3)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        {post.title}
                    </motion.h1>

                    {/* Meta row */}
                    <motion.div
                        className="flex flex-wrap items-center gap-5"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30  dark:text-gray-300">
                                <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <span className="block font-sans text-sm font-semibold text-white dark:text-gray-300">
                                    {post.author.name}
                                </span>
                                <span className="block font-sans text-xs text-white/60 dark:text-gray-300">
                                    {post.author.role}
                                </span>
                            </div>
                        </div>

                        <span className="w-px h-6 bg-white/20 dark:text-gray-300 hidden sm:block" />

                        {/* Date */}
                        <span className="font-sans text-sm text-white/70 flex items-center gap-1.5 dark:text-gray-300">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            {post.date}
                        </span>

                        {/* Read time */}
                        <span className="font-sans text-sm text-white/70 flex items-center gap-1.5 dark:text-gray-300">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            {post.readTime} baca
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* ─── ARTICLE BODY ──────────────────────────── */}
            <section className="py-16 px-6" style={{ background: "var(--color-bg)" }}>
                <div className="max-w-[800px] mx-auto">
                    {/* Summary box */}
                    <motion.div
                        className="rounded-2xl p-7 mb-12 border-l-4"
                        style={{
                            background: "var(--color-cream)",
                            borderColor: "var(--color-primary)",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5">📝</span>
                            <div>
                                <h3
                                    className="font-serif text-lg font-bold mb-2"
                                    style={{ color: "var(--color-text)" }}
                                >
                                    Ringkasan
                                </h3>
                                <p
                                    className="font-sans text-sm leading-relaxed"
                                    style={{ color: "var(--color-text-light)" }}
                                >
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content paragraphs */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {post.content.map((paragraph, i) => {
                            // Insert a decorative divider every 3 paragraphs
                            const showDivider = i > 0 && i % 3 === 0;
                            // Extract tip number if paragraph starts with a keyword
                            const tipMatch = paragraph.match(/^(Pertama|Kedua|Ketiga|Keempat|Kelima|Keenam|Ketujuh|Kedelapan|Kesembilan|Kesepuluh),/);

                            return (
                                <motion.div key={i} variants={fadeUp}>
                                    {showDivider && (
                                        <div className="flex items-center gap-4 my-10">
                                            <div className="flex-1 h-px" style={{ background: "var(--color-border-subtle)" }} />
                                            <span className="text-lg">🌿</span>
                                            <div className="flex-1 h-px" style={{ background: "var(--color-border-subtle)" }} />
                                        </div>
                                    )}

                                    {tipMatch ? (
                                        <div
                                            className="flex gap-4 mb-7 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                                            style={{
                                                background: "var(--color-white)",
                                                boxShadow: "var(--shadow-sm)",
                                                border: "1px solid var(--color-border-subtle)",
                                            }}
                                        >
                                            <span
                                                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-white text-sm"
                                                style={{ background: catGradient }}
                                            >
                                                {i}
                                            </span>
                                            <p
                                                className="font-sans leading-relaxed flex-1"
                                                style={{ fontSize: "clamp(15px, 1.2vw, 17px)", color: "var(--color-text)" }}
                                            >
                                                <strong style={{ color: "var(--color-primary)" }}>{tipMatch[1]}</strong>
                                                {paragraph.slice(tipMatch[0].length)}
                                            </p>
                                        </div>
                                    ) : (
                                        <p
                                            className="font-sans leading-loose mb-7"
                                            style={{ fontSize: "clamp(15px, 1.2vw, 17px)", color: "var(--color-text)" }}
                                        >
                                            {paragraph}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Tags */}
                    <motion.div
                        className="mt-12 pt-8"
                        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-text-muted)" }}>
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                                <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                            <span className="font-sans text-sm font-semibold" style={{ color: "var(--color-text-muted)" }}>
                                Tags
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                                    style={{
                                        background: "var(--color-cream)",
                                        color: "var(--color-text)",
                                        border: "1px solid var(--color-border-subtle)",
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Share + Actions */}
                    <motion.div
                        className="mt-10 rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
                        style={{
                            background: catGradient,
                        }}
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center sm:text-left">
                            <h3 className="font-serif text-lg font-bold text-white mb-1">
                                ✨ Suka artikel ini?
                            </h3>
                            <p className="font-sans text-sm text-white/70">
                                Bagikan ke teman yang sedang merencanakan perjalanan
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {[
                                { icon: "📋", label: "Salin Link" },
                                { icon: "💬", label: "WhatsApp" },
                                { icon: "🐦", label: "Twitter" },
                            ].map((action) => (
                                <button
                                    key={action.label}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 text-white font-sans text-sm font-medium border border-white/20 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/25 hover:scale-105"
                                >
                                    <span>{action.icon}</span>
                                    <span className="hidden sm:inline">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── AUTHOR CARD ────────────────────────────── */}
            <section className="py-12 px-6" style={{ background: "var(--color-cream)" }}>
                <motion.div
                    className="max-w-[800px] mx-auto rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6"
                    style={{
                        background: "var(--color-white)",
                        boxShadow: "var(--shadow-md)",
                        border: "1px solid var(--color-border-subtle)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 ring-4">
                        <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <span className="font-sans text-xs font-semibold uppercase tracking-widest mb-1 block" style={{ color: "var(--color-primary)" }}>
                            ✍️ Ditulis oleh
                        </span>
                        <h3 className="font-serif text-xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
                            {post.author.name}
                        </h3>
                        <p className="font-sans text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
                            {post.author.role}
                        </p>
                        <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--color-text-light)" }}>
                            Menulis tentang pengalaman wisata desa, budaya lokal, dan petualangan alam di Indonesia.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* ─── RELATED POSTS ──────────────────────────── */}
            <section className="py-16 px-6" style={{ background: "var(--color-bg)" }}>
                <div className="max-w-[1100px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="text-center mb-10"
                    >
                        <motion.span
                            variants={fadeUp}
                            className="font-sans text-sm font-semibold tracking-widest uppercase mb-3 block"
                            style={{ color: "var(--color-primary)" }}
                        >
                            📖 Baca Juga
                        </motion.span>
                        <motion.h2
                            variants={fadeUp}
                            className="font-serif font-bold"
                            style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "var(--color-text)" }}
                        >
                            Artikel Terkait
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {post.relatedPosts.map((related) => (
                            <motion.div key={related.id} variants={fadeUp}>
                                <Link
                                    href={`/blog/${related.id}`}
                                    className="group block no-underline"
                                >
                                    <div
                                        className="rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-xl"
                                        style={{
                                            background: "var(--color-white)",
                                            boxShadow: "var(--shadow-sm)",
                                            border: "1px solid var(--color-border-subtle)",
                                        }}
                                    >
                                        <div className="relative h-[180px] overflow-hidden">
                                            <Image
                                                src={related.image}
                                                alt={related.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    background: "linear-gradient(135deg, rgba(45,106,79,0.25), rgba(123,44,191,0.15))",
                                                }}
                                            />
                                            <span
                                                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-sans font-bold text-white uppercase tracking-wide"
                                                style={{ background: CATEGORY_COLORS[related.category] || catGradient }}
                                            >
                                                {CATEGORY_LABELS[related.category] || related.category}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3
                                                className="font-serif text-base font-bold leading-snug transition-colors duration-300 group-hover:text-(--color-primary)"
                                                style={{ color: "var(--color-text)" }}
                                            >
                                                {related.title}
                                            </h3>
                                            <span
                                                className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold mt-3 transition-all duration-300 group-hover:gap-2.5"
                                                style={{ color: "var(--color-accent)" }}
                                            >
                                                Baca artikel
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                                >
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── BACK TO BLOG CTA ──────────────────────── */}
            <section className="py-14 px-6" style={{ background: "var(--color-cream)" }}>
                <motion.div
                    className="max-w-[600px] mx-auto text-center"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-4xl mb-4 block">📚</span>
                    <h3
                        className="font-serif text-xl font-bold mb-3"
                        style={{ color: "var(--color-text)" }}
                    >
                        Jelajahi Lebih Banyak Artikel
                    </h3>
                    <p
                        className="font-sans text-sm mb-6 leading-relaxed"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        Temukan tips, panduan, dan berita terbaru seputar wisata desa Indonesia
                    </p>
                    <Link href="/blog" className="btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Kembali ke Blog
                    </Link>
                </motion.div>
            </section>
        </main>
    );
}
