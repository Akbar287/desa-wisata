'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPageNumbers } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface TestimonialItem {
    id: number;
    name: string;
    avatar: string;
    role: string;
    text: string;
    rating: number;
    date: string;
    createdAt: string;
    entityType?: 'destination' | 'wahana' | 'tour' | null;
    entityName?: string | null;
    entityHref?: string | null;
    images?: Array<{
        id: number;
        fileName: string;
        url: string;
    }>;
}

export default function TestimonialComponents({
    testimonials,
    perPage,
}: {
    testimonials: TestimonialItem[];
    perPage: number;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRating, setFilterRating] = useState(0);
    const [sortBy, setSortBy] = useState<'rating_desc' | 'rating_asc' | 'newest' | 'oldest'>('rating_desc');
    const [activeTestimonial, setActiveTestimonial] = useState<TestimonialItem | null>(null);

    const fadeUp = {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };

    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };

    const filtered = useMemo(() => {
        let items = [...testimonials];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.text.toLowerCase().includes(q) ||
                    t.role.toLowerCase().includes(q) ||
                    (t.entityName || '').toLowerCase().includes(q)
            );
        }
        if (filterRating > 0) {
            items = items.filter((t) => t.rating >= filterRating);
        }
        if (sortBy === 'rating_desc') {
            items.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'rating_asc') {
            items.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === 'newest') {
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
            items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
        return items;
    }, [testimonials, searchQuery, filterRating, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Aggregate stats
    const avgRating = testimonials.length > 0
        ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
        : '0';
    const totalReviews = testimonials.length;
    const fiveStarCount = testimonials.filter((t) => Math.round(t.rating) === 5).length;

    function formatRatingNumber(value: number): string {
        return Number.isFinite(value) ? value.toFixed(2) : '0.00';
    }

    function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
        return (
            <span className="inline-flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => {
                    const fill = Math.max(0, Math.min(1, rating - (s - 1)));
                    return (
                        <span
                            key={s}
                            className="relative inline-block overflow-hidden"
                            style={{ width: size, height: size }}
                        >
                            <svg width={size} height={size} viewBox="0 0 24 24" fill="#111111">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fill * 100}%` }}
                            >
                                <svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </span>
                        </span>
                    );
                })}
            </span>
        );
    }

    return (
        <main>
            {/* ─── HERO ───────────────────────────────── */}
            <section className="relative overflow-hidden pt-32 pb-20 px-6">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 40%, var(--color-accent) 100%)',
                        backgroundSize: '300% 300%',
                        animation: 'gradientShift 8s ease infinite',
                    }}
                />
                <div className="absolute inset-0 bg-black/20" />

                <div className="relative z-2 max-w-[800px] mx-auto text-center">
                    <motion.span
                        className="inline-block text-5xl mb-4"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                    >
                        💬
                    </motion.span>
                    <motion.h1
                        className="font-serif font-bold text-white mb-5"
                        style={{ fontSize: 'clamp(30px, 5vw, 52px)' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Testimoni Wisatawan
                    </motion.h1>
                    <motion.p
                        className="font-sans text-lg text-white/80 max-w-[550px] mx-auto mb-10 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Cerita dan pengalaman autentik dari para wisatawan yang telah menjelajahi desa wisata bersama kami
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {[
                            { value: avgRating, label: 'Rating Rata-rata', emoji: '⭐' },
                            { value: `${totalReviews}`, label: 'Total Ulasan', emoji: '💬' },
                            { value: `${fiveStarCount}`, label: 'Bintang 5', emoji: '🏆' },
                        ].map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={fadeUp}
                                className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md"
                                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <span className="text-xl">{stat.emoji}</span>
                                <div className="text-left">
                                    <span className="font-sans text-sm font-bold text-white block leading-tight">{stat.value}</span>
                                    <span className="font-sans text-[11px] text-white/60">{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── SEARCH + FILTER ─────────────────────── */}
            <section className="px-6 -mt-7 relative z-10">
                <motion.div
                    className="max-w-[900px] mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div
                        className="rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center gap-3 shadow-lg"
                        style={{
                            background: 'var(--color-white)',
                            border: '1px solid var(--color-border-subtle)',
                        }}
                    >
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="var(--color-text-muted)" strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari testimoni..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-11 pr-4 py-3 rounded-xl font-sans text-sm border-none outline-none transition-all duration-300"
                                style={{ background: 'var(--color-cream)', color: 'var(--color-text)' }}
                            />
                        </div>

                        {/* Rating filter */}
                        <div className="flex gap-1.5 w-full lg:w-auto">
                            <button
                                onClick={() => { setFilterRating(0); setCurrentPage(1); }}
                                className={`px-3 py-2.5 rounded-xl font-sans text-xs font-semibold border-none cursor-pointer transition-all duration-300 ${filterRating === 0 ? 'text-white shadow-md' : ''}`}
                                style={{
                                    background: filterRating === 0 ? 'var(--color-primary)' : 'var(--color-cream)',
                                    color: filterRating === 0 ? 'white' : 'var(--color-text-muted)',
                                }}
                            >
                                Semua
                            </button>
                            {[5, 4, 3].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => { setFilterRating(r); setCurrentPage(1); }}
                                    className={`px-3 py-2.5 rounded-xl font-sans text-xs font-semibold border-none cursor-pointer transition-all duration-300 flex items-center gap-1 ${filterRating === r ? 'text-white shadow-md' : ''}`}
                                    style={{
                                        background: filterRating === r ? 'var(--color-primary)' : 'var(--color-cream)',
                                        color: filterRating === r ? 'white' : 'var(--color-text-muted)',
                                    }}
                                >
                                    {r}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill={filterRating === r ? 'white' : '#FBBF24'}>
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    +
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="w-full lg:w-[220px]">
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value as 'rating_desc' | 'rating_asc' | 'newest' | 'oldest');
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2.5 rounded-xl font-sans text-xs font-semibold border-none outline-none"
                                style={{
                                    background: 'var(--color-cream)',
                                    color: 'var(--color-text)',
                                }}
                            >
                                <option value="rating_desc">Urutkan: Rating Tertinggi</option>
                                <option value="rating_asc">Urutkan: Rating Terendah</option>
                                <option value="newest">Urutkan: Terbaru</option>
                                <option value="oldest">Urutkan: Terlama</option>
                            </select>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── GRID ──────────────────────────────── */}
            <section className="py-14 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[1100px] mx-auto">
                    {/* Results count */}
                    <motion.p
                        className="font-sans text-sm mb-8"
                        style={{ color: 'var(--color-text-muted)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Menampilkan {paginated.length} dari {filtered.length} testimoni
                        {filterRating > 0 && (
                            <span
                                className="ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                                style={{ background: 'var(--color-primary)', color: 'white' }}
                            >
                                {filterRating}★+
                                <button
                                    onClick={() => { setFilterRating(0); setCurrentPage(1); }}
                                    className="ml-1 hover:opacity-70 cursor-pointer bg-transparent border-none text-white text-xs"
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                    </motion.p>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${filterRating}-${safePage}-${searchQuery}`}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={stagger}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {paginated.length > 0 ? (
                                paginated.map((t) => (
                                    <motion.div
                                        key={t.id}
                                        variants={fadeUp}
                                        className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                        style={{
                                            background: 'var(--color-white)',
                                            boxShadow: 'var(--shadow-sm)',
                                            border: '1px solid var(--color-border-subtle)',
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setActiveTestimonial(t)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setActiveTestimonial(t);
                                            }
                                        }}
                                    >
                                        {/* Rating */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <StarDisplay rating={t.rating} />
                                                <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                                                    ({formatRatingNumber(t.rating)})
                                                </span>
                                            </div>
                                            <span className="font-sans text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                                {t.date}
                                            </span>
                                        </div>

                                        {t.entityName && (
                                            <div className="mb-3">
                                                <span
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                                                    style={{
                                                        background: 'var(--color-cream)',
                                                        color: 'var(--color-primary-dark)',
                                                    }}
                                                >
                                                    {t.entityType === 'destination' ? 'Destinasi' : t.entityType === 'wahana' ? 'Wahana' : 'Paket Tour'}
                                                    <span style={{ opacity: 0.6 }}>•</span>
                                                    {t.entityName}
                                                </span>
                                            </div>
                                        )}

                                        {/* Quote */}
                                        <div className="relative mb-5">
                                            <span
                                                className="absolute -top-2 -left-1 text-4xl font-serif leading-none select-none"
                                                style={{ color: 'var(--color-primary)', opacity: 0.15 }}
                                            >
                                                &ldquo;
                                            </span>
                                            <p
                                                className="font-sans text-sm leading-relaxed pl-4"
                                                style={{ color: 'var(--color-text)' }}
                                            >
                                                {t.text}
                                            </p>
                                        </div>

                                        {/* Author */}
                                        <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-1" >
                                                <Image
                                                    src={t.avatar}
                                                    alt={t.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                    unoptimized
                                                />
                                            </div>
                                            <div>
                                                <span className="block font-sans text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                                                    {t.name}
                                                </span>
                                                <span className="block font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                                    {t.role}
                                                </span>
                                            </div>
                                        </div>

                                        {t.entityHref && (
                                            <div className="mt-4">
                                                <Link
                                                    href={t.entityHref}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-sans text-xs font-bold no-underline transition-all duration-300 hover:scale-[1.02]"
                                                    style={{
                                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                                        color: 'white',
                                                    }}
                                                >
                                                    {t.entityType === 'destination'
                                                        ? 'Lihat Destinasi'
                                                        : t.entityType === 'wahana'
                                                            ? 'Lihat Wahana'
                                                            : 'Lihat Paket Tour'}
                                                    <span aria-hidden>→</span>
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    className="col-span-full text-center py-20"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <span className="text-6xl mb-6 block">🔍</span>
                                    <h3 className="font-serif text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                                        Tidak ada testimoni ditemukan
                                    </h3>
                                    <p className="font-sans text-base" style={{ color: 'var(--color-text-muted)' }}>
                                        Coba ubah kata kunci pencarian atau filter rating
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
                            <button
                                onClick={() => safePage > 1 && handlePageChange(safePage - 1)}
                                disabled={safePage <= 1}
                                className="w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer font-sans text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                                style={{
                                    background: 'var(--color-white)',
                                    color: 'var(--color-text)',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            >
                                ‹
                            </button>

                            {getPageNumbers(safePage, totalPages).map((page, idx) =>
                                page === 'e' ? (
                                    <span
                                        key={`e-${idx}`}
                                        className="w-11 h-11 rounded-full inline-flex items-center justify-center font-sans text-sm"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer font-sans text-sm font-bold transition-all duration-300 hover:scale-110 ${page === safePage ? 'text-white shadow-lg' : ''}`}
                                        style={{
                                            background:
                                                page === safePage
                                                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                                                    : 'var(--color-white)',
                                            color: page === safePage ? 'white' : 'var(--color-text)',
                                            boxShadow: page === safePage ? '0 4px 15px rgba(45,106,79,0.3)' : 'var(--shadow-sm)',
                                        }}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}

                            <button
                                onClick={() => safePage < totalPages && handlePageChange(safePage + 1)}
                                disabled={safePage >= totalPages}
                                className="w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer font-sans text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                                style={{
                                    background: 'var(--color-white)',
                                    color: 'var(--color-text)',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            >
                                ›
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            <Dialog
                open={Boolean(activeTestimonial)}
                onOpenChange={(open) => {
                    if (!open) setActiveTestimonial(null);
                }}
            >
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    {activeTestimonial && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="font-serif text-2xl">
                                    Detail Testimoni
                                </DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap testimoni dari pengunjung.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3 pb-4" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src={activeTestimonial.avatar}
                                            alt={activeTestimonial.name}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                                            {activeTestimonial.name}
                                        </p>
                                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                            {activeTestimonial.role} • {activeTestimonial.date}
                                        </p>
                                        <div className="mt-1.5 flex items-center gap-1.5">
                                            <StarDisplay rating={activeTestimonial.rating} size={16} />
                                            <span
                                                className="font-sans text-sm font-semibold"
                                                style={{ color: 'var(--color-text-muted)' }}
                                            >
                                                ({formatRatingNumber(activeTestimonial.rating)})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                                        {activeTestimonial.text}
                                    </p>
                                </div>

                                {activeTestimonial.entityName ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                background: 'var(--color-cream)',
                                                color: 'var(--color-primary-dark)',
                                            }}
                                        >
                                            {activeTestimonial.entityType === 'destination'
                                                ? 'Destinasi'
                                                : activeTestimonial.entityType === 'wahana'
                                                    ? 'Wahana'
                                                    : 'Paket Tour'}
                                            <span style={{ opacity: 0.6 }}>•</span>
                                            {activeTestimonial.entityName}
                                        </span>
                                        {activeTestimonial.entityHref && (
                                            <Link
                                                href={activeTestimonial.entityHref}
                                                className="inline-flex items-center gap-1 text-sm font-semibold"
                                                style={{ color: 'var(--color-primary)' }}
                                            >
                                                Buka Detail
                                                <span aria-hidden>→</span>
                                            </Link>
                                        )}
                                    </div>
                                ) : null}

                                <div className="space-y-2">
                                    <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                                        Foto Pengunjung
                                    </h4>
                                    {(activeTestimonial.images?.length ?? 0) === 0 ? (
                                        <div
                                            className="rounded-xl p-4 text-sm"
                                            style={{
                                                background: 'var(--color-cream)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            Tidak ada foto yang diunggah.
                                        </div>
                                    ) : (activeTestimonial.images?.length ?? 0) === 1 ? (
                                        <div className="relative h-[320px] w-full overflow-hidden rounded-xl border">
                                            <Image
                                                src={activeTestimonial.images![0].url}
                                                alt={activeTestimonial.images![0].fileName}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 768px"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <Carousel opts={{ loop: true }} className="w-full">
                                            <CarouselContent>
                                                {activeTestimonial.images!.map((img) => (
                                                    <CarouselItem key={img.id}>
                                                        <div className="relative h-[320px] w-full overflow-hidden rounded-xl border">
                                                            <Image
                                                                src={img.url}
                                                                alt={img.fileName}
                                                                fill
                                                                className="object-cover"
                                                                sizes="(max-width: 768px) 100vw, 768px"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2" />
                                            <CarouselNext className="right-3 top-1/2 -translate-y-1/2" />
                                        </Carousel>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* ─── CTA ──────────────────────────────── */}
            <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                <motion.div
                    className="max-w-[600px] mx-auto text-center"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-4xl mb-4 block">✈️</span>
                    <h3 className="font-serif text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                        Ingin Cerita Anda di Sini?
                    </h3>
                    <p className="font-sans text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        Bergabunglah dengan ribuan wisatawan yang telah merasakan keindahan desa wisata Indonesia
                    </p>
                    <a
                        href="/tours"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-sans text-sm font-bold text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
                    >
                        Jelajahi Paket Wisata
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </a>
                </motion.div>
            </section>
        </main>
    );
}
