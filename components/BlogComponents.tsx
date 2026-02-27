'use client'
import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "@/types/BlogType";

export default function BlogComponents({
    categories,
    allPosts,
    postsPerPage,
}: {
    categories: { id: string; label: string, icon: string }[];
    allPosts: BlogPost[];
    postsPerPage: number;
}) {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    };

    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };

    const cardHover = {
        rest: { scale: 1, y: 0 },
        hover: { scale: 1.02, y: -6, transition: { duration: 0.3, ease: "easeOut" as const } },
    };

    function BlogContent() {
        const searchParams = useSearchParams();
        const router = useRouter();
        const categoryParam = searchParams.get("category") || "all";
        const pageParam = parseInt(searchParams.get("page") || "1", 10);

        const [searchQuery, setSearchQuery] = useState("");
        const [activeCategory, setActiveCategory] = useState(categoryParam);
        const [currentPage, setCurrentPage] = useState(pageParam);

        // Filter + search
        const filteredPosts = useMemo(() => {
            let posts = allPosts;
            if (activeCategory !== "all") {
                posts = posts.filter((p) => p.category === activeCategory);
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                posts = posts.filter(
                    (p) =>
                        p.title.toLowerCase().includes(q) ||
                        p.excerpt.toLowerCase().includes(q)
                );
            }
            return posts;
        }, [activeCategory, searchQuery]);

        const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
        const safePage = Math.min(currentPage, totalPages);
        const paginatedPosts = filteredPosts.slice(
            (safePage - 1) * postsPerPage,
            safePage * postsPerPage
        );

        const handleCategoryChange = (catId: string) => {
            setActiveCategory(catId);
            setCurrentPage(1);
            const params = new URLSearchParams();
            if (catId !== "all") params.set("category", catId);
            router.push(`/blog${params.toString() ? "?" + params.toString() : ""}`, { scroll: false });
        };

        const handlePageChange = (page: number) => {
            setCurrentPage(page);
            const params = new URLSearchParams();
            if (activeCategory !== "all") params.set("category", activeCategory);
            if (page > 1) params.set("page", String(page));
            router.push(`/blog${params.toString() ? "?" + params.toString() : ""}`, { scroll: false });
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        const getCategoryLabel = (catId: string) =>
            categories.find((c) => c.id === catId)?.label || catId;

        return (
            <main>
                {/* ─── HERO ──────────────────────────────── */}
                <section className="relative overflow-hidden pt-32 pb-20 px-6">
                    {/* Animated gradient background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 40%, var(--color-primary-light) 70%, var(--color-accent) 100%)",
                            backgroundSize: "300% 300%",
                            animation: "gradientShift 8s ease infinite",
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: "url('/assets/statbg.png')", backgroundSize: "cover" }}
                    />

                    <div className="relative z-2 max-w-[800px] mx-auto text-center">
                        <motion.span
                            className="inline-block font-sans text-sm font-semibold tracking-widest uppercase mb-4 text-white/60"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Blog & Artikel
                        </motion.span>
                        <motion.h1
                            className="font-serif font-bold text-white mb-5"
                            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Panduan Wisata Desa
                        </motion.h1>
                        <motion.p
                            className="font-sans text-lg text-white/80 max-w-[550px] mx-auto mb-10 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Temukan tips, berita, dan panduan lengkap untuk menjelajahi desa wisata Indonesia
                        </motion.p>

                        {/* Search bar */}
                        <motion.div
                            className="relative max-w-[520px] mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                        >
                            <div className="relative">
                                <svg
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari artikel..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-13 pr-5 py-4 rounded-full bg-white/15 text-white placeholder-white/50 font-sans text-base border border-white/20 backdrop-blur-md outline-none transition-all duration-300 focus:bg-white/25 focus:border-white/40 focus:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ─── CATEGORY TABS ─────────────────────── */}
                <section className="px-6 -mt-7 relative z-10">
                    <motion.div
                        className="max-w-[800px] mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div
                            className="hide-scrollbar flex gap-0 rounded-full p-1.5 overflow-x-auto shadow-lg"
                            style={{
                                background: "var(--color-white)",
                                border: "1px solid var(--color-border-subtle)",
                            }}
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-full border-none font-sans text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeCategory === cat.id ? "tab-active shadow-md" : ""
                                        }`}
                                    style={{
                                        background: activeCategory === cat.id ? undefined : "transparent",
                                        color: activeCategory === cat.id ? "white" : "var(--color-text-muted)",
                                    }}
                                >
                                    <span className="text-base">{cat.icon}</span>
                                    <span className="hidden sm:inline">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* ─── POSTS GRID ────────────────────────── */}
                <section className="py-16 px-6" style={{ background: "var(--color-bg)" }}>
                    <div className="max-w-[1200px] mx-auto">
                        {/* Results info */}
                        <motion.div
                            className="flex items-center justify-between mb-8 flex-wrap gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <p className="font-sans text-sm" style={{ color: "var(--color-text-muted)" }}>
                                Menampilkan {paginatedPosts.length} dari {filteredPosts.length} artikel
                                {activeCategory !== "all" && (
                                    <span
                                        className="ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ background: "var(--color-primary)", color: "white" }}
                                    >
                                        {getCategoryLabel(activeCategory)}
                                        <button
                                            onClick={() => handleCategoryChange("all")}
                                            className="ml-1 hover:opacity-70 cursor-pointer bg-transparent border-none text-white text-xs"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                            </p>
                            {searchQuery && (
                                <p className="font-sans text-sm" style={{ color: "var(--color-text-muted)" }}>
                                    Hasil pencarian: &ldquo;{searchQuery}&rdquo;
                                </p>
                            )}
                        </motion.div>

                        {/* Cards */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeCategory}-${safePage}-${searchQuery}`}
                                className="grid gap-7"
                                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))" }}
                                variants={stagger}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -10.0 }}
                            >
                                {paginatedPosts.length > 0 ? (
                                    paginatedPosts.map((post) => (
                                        <motion.div
                                            key={post.id}
                                            variants={fadeUp}
                                            initial="rest"
                                            whileHover="hover"
                                            className="group"
                                        >
                                            <motion.div
                                                variants={cardHover}
                                                className="tour-card rounded-2xl overflow-hidden h-full flex flex-col"
                                                style={{
                                                    background: "var(--color-white)",
                                                    boxShadow: "var(--shadow-sm)",
                                                    border: "1px solid var(--color-border-subtle)",
                                                }}
                                            >
                                                {/* Image */}
                                                <div className="relative h-[220px] overflow-hidden">
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className="tour-card-image object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    {/* Gradient overlay on hover */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                        style={{
                                                            background: "linear-gradient(135deg, rgba(45,106,79,0.3), rgba(123,44,191,0.2))",
                                                        }}
                                                    />
                                                    {/* Category badge */}
                                                    <span
                                                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-sans font-semibold text-white backdrop-blur-sm"
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                                                        }}
                                                    >
                                                        {getCategoryLabel(post.category)}
                                                    </span>
                                                    {/* Read time */}
                                                    <span
                                                        className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-sans font-medium text-white/90 bg-black/30 backdrop-blur-sm"
                                                    >
                                                        ⏱ {post.readTime}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 pb-7 flex flex-col flex-1">
                                                    <span
                                                        className="text-xs font-sans font-medium mb-2 block"
                                                        style={{ color: "var(--color-text-muted)" }}
                                                    >
                                                        {post.date}
                                                    </span>
                                                    <h3
                                                        className="font-serif text-lg font-bold mb-3 leading-snug transition-colors duration-300 group-hover:text-(--color-primary)"
                                                        style={{ color: "var(--color-text)" }}
                                                    >
                                                        {post.title}
                                                    </h3>
                                                    <p
                                                        className="font-sans text-sm leading-relaxed flex-1"
                                                        style={{ color: "var(--color-text-muted)" }}
                                                    >
                                                        {post.excerpt}
                                                    </p>
                                                    <Link
                                                        href={`/blog/${post.id}`}
                                                        className="inline-flex items-center gap-2 font-sans text-sm font-semibold mt-5 no-underline transition-all duration-300 group-hover:gap-3"
                                                        style={{ color: "var(--color-accent)" }}
                                                    >
                                                        Baca selengkapnya
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                                        >
                                                            <polyline points="9 18 15 12 9 6" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        className="col-span-full text-center py-20"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <span className="text-6xl mb-6 block">🔍</span>
                                        <h3
                                            className="font-serif text-2xl font-bold mb-3"
                                            style={{ color: "var(--color-text)" }}
                                        >
                                            Tidak ada artikel ditemukan
                                        </h3>
                                        <p
                                            className="font-sans text-base"
                                            style={{ color: "var(--color-text-muted)" }}
                                        >
                                            Coba ubah kata kunci pencarian atau pilih kategori lain
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* ─── PAGINATION ─────────────────────── */}
                        {totalPages > 1 && (
                            <motion.div
                                className="flex items-center justify-center gap-2 mt-14"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                {/* Prev */}
                                <button
                                    onClick={() => safePage > 1 && handlePageChange(safePage - 1)}
                                    disabled={safePage <= 1}
                                    className="w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer font-sans text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                                    style={{
                                        background: "var(--color-white)",
                                        color: "var(--color-text)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}
                                >
                                    ‹
                                </button>

                                {/* Pages */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer font-sans text-sm font-bold transition-all duration-300 hover:scale-110 ${page === safePage ? "text-white shadow-lg" : ""
                                            }`}
                                        style={{
                                            background:
                                                page === safePage
                                                    ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
                                                    : "var(--color-white)",
                                            color: page === safePage ? "white" : "var(--color-text)",
                                            boxShadow: page === safePage ? "0 4px 15px rgba(123,44,191,0.3)" : "var(--shadow-sm)",
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next */}
                                <button
                                    onClick={() => safePage < totalPages && handlePageChange(safePage + 1)}
                                    disabled={safePage >= totalPages}
                                    className="w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer font-sans text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                                    style={{
                                        background: "var(--color-white)",
                                        color: "var(--color-text)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}
                                >
                                    ›
                                </button>
                            </motion.div>
                        )}
                    </div>
                </section>
            </main>
        );
    }

    return (
        <Suspense
            fallback={
                <div
                    className="min-h-screen flex items-center justify-center"
                    style={{ background: "var(--color-bg)" }}
                >
                    <div className="animate-pulse font-sans text-lg" style={{ color: "var(--color-text-muted)" }}>
                        Memuat artikel...
                    </div>
                </div>
            }
        >
            <BlogContent />
        </Suspense>
    );
}
