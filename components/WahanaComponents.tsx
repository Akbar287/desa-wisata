'use client';

import { WahanaData } from '@/types/WahanaType';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

/* ─── ANIMATION VARIANTS ────────────────────────────── */

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const cardHover = {
    rest: { y: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    hover: { y: -6, boxShadow: '0 18px 40px rgba(0,0,0,0.12)', transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

/* ─── COMPONENT ─────────────────────────────────────── */

export default function WahanaComponents({
    wahanas,
}: {
    wahanas: WahanaData[];
}) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Configurable number of items per page
    const itemsPerPage = 6;

    const filtered = useMemo(() => {
        return wahanas.filter((w) => {
            if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [search, wahanas]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };

    const resetFilters = () => {
        setSearch('');
        setCurrentPage(1);
    };

    const hasActiveFilters = search.length > 0;

    const FilterPanel = () => (
        <div className="space-y-6">
            {hasActiveFilters && (
                <motion.button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-bold border cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-accent)',
                        background: 'transparent',
                    }}
                    whileHover={{ background: 'var(--color-accent)', color: '#fff' }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Reset Filter
                </motion.button>
            )}

            <div className="mb-6">
                <div
                    className="text-xs font-bold font-sans uppercase tracking-widest mb-3 pb-2.5"
                    style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border-subtle)' }}
                >
                    Pencarian
                </div>
                <div className="flex flex-col gap-2.5">
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Gunakan kotak pencarian di atas untuk menemukan wahana yang Anda inginkan.</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <section className="relative pt-20 min-h-[420px] flex items-end pb-14 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'url("/assets/hero-wahana.jpg")', // Assuming a general hero image, or fallback
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#1C312E', // Fallback color matching the theme
                    }}
                />
                {/* Fallback pattern overlay if image fails */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                {/* Gradient overlay for text readability */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }}
                />

                <motion.div
                    className="absolute rounded-full opacity-10 blur-3xl"
                    style={{ width: 400, height: 400, top: -100, right: -80, background: 'radial-gradient(circle, #95D5B2 0%, transparent 70%)' }}
                    animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute rounded-full opacity-10 blur-3xl"
                    style={{ width: 300, height: 300, bottom: -60, left: -40, background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)' }}
                    animate={{ y: [0, -25, 0], x: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="relative z-2 w-full max-w-[1320px] mx-auto px-6">
                    <motion.div
                        className="flex items-center gap-2 mb-5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link href="/" className="font-sans text-sm text-white/60 no-underline dark:text-gray-100 hover:text-white/90 transition-colors flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            Beranda
                        </Link>
                        <span className="text-white/40 dark:text-gray-100">›</span>
                        <span className="font-sans text-sm text-white/90 dark:text-gray-100">Wahana</span>
                    </motion.div>

                    <motion.h1
                        className="font-serif font-extrabold text-white dark:text-gray-200 mb-4 leading-[1.1]"
                        style={{ fontSize: 'clamp(30px, 5vw, 56px)', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Wahana Wisata Desa
                    </motion.h1>

                    <motion.p
                        className="font-sans text-white/80 dark:text-gray-300 max-w-[540px] leading-relaxed"
                        style={{ fontSize: 'clamp(14px, 1.2vw, 17px)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Eksplorasi berbagai wahana seru dan pengalaman tak terlupakan yang ditawarkan oleh desa wisata kami.
                    </motion.p>

                    {/* Hero stats */}
                    <motion.div
                        className="flex flex-wrap gap-6 mt-8"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {[
                            { icon: '🎢', value: `${wahanas.length}+`, label: 'Wahana Seru' },
                            { icon: '📸', value: `${wahanas.reduce((acc, curr) => acc + (curr.WahanaGallery?.length || 0), 0)}`, label: 'Spot Foto' },
                            { icon: '⭐', value: '4.8', label: 'Rating Rata-rata' },
                        ].map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={fadeUp}
                                className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md"
                                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <span className="text-xl">{stat.icon}</span>
                                <div>
                                    <span className="font-sans text-lg font-bold text-white dark:text-gray-100 block leading-tight">{stat.value}</span>
                                    <span className="font-sans text-xs text-white/80 dark:text-gray-100">{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <motion.div
                className="sticky top-[72px] z-20 py-4 px-6"
                style={{ background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border-subtle)' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
            >
                <div className="max-w-[1320px] mx-auto flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[260px] relative group">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 group-focus-within:text-(--color-primary)" style={{ color: 'var(--color-text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari wahana menarik..."
                            className="w-full py-3 pl-12 pr-4 rounded-full font-sans text-sm outline-none transition-all duration-300 focus:ring-3"
                            style={{
                                background: 'var(--color-white)',
                                border: '1.5px solid var(--color-border-subtle)',
                                color: 'var(--color-text)',
                            }}
                        />
                    </div>

                    <div className="font-sans text-sm whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                        <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{filtered.length}</span> wahana ditemukan
                    </div>

                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="mobile-filter-btn hidden items-center gap-2 px-5 py-3 rounded-full border-none font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:opacity-90 xl:hidden lg:hidden md:hidden"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', color: 'white' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="11" y2="6" /><line x1="13" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="7" y2="12" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="16" y2="18" /><line x1="18" y1="18" x2="20" y2="18" /></svg>
                        Filter
                        {hasActiveFilters && (
                            <span className="bg-white rounded-full w-[18px] h-[18px] text-[11px] font-bold inline-flex items-center justify-center" style={{ color: 'var(--color-primary)' }}>
                                1
                            </span>
                        )}
                    </button>
                </div>
            </motion.div>

            <main className="max-w-[1320px] mx-auto px-6 py-12 flex gap-10 items-start" style={{ background: 'var(--color-bg)' }}>
                {/* 
                  Omit the sidebar on Desktop since we only have Search to filter Wahana 
                  If more complex filters are added to Wahana later, it can be re-enabled. 
                */}

                {/* Wahana grid */}
                <div className="flex-1 w-full min-w-0">
                    <AnimatePresence mode="wait">
                        {paginated.length === 0 ? (
                            <motion.div
                                key="empty"
                                className="text-center py-20 px-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-6xl mb-5"
                                >
                                    🔍
                                </motion.div>
                                <p className="font-serif text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Wahana tidak ditemukan</p>
                                <p className="font-sans text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Coba ubah kata kunci pencarian Anda.</p>
                                <button onClick={resetFilters} className="btn-primary">Reset Pencarian</button>
                            </motion.div>
                        ) : (
                            <motion.div key="grid">
                                <motion.div
                                    className="grid gap-8 mb-12"
                                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
                                    initial="hidden"
                                    animate="visible"
                                    variants={stagger}
                                >
                                    {paginated.map((wahana) => (
                                        <WahanaCard key={wahana.id} wahana={wahana} />
                                    ))}
                                </motion.div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <motion.div
                                        className="flex justify-center items-center gap-2 flex-wrap"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                    >
                                        <motion.button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-lg border inline-flex items-center justify-center transition-all duration-200 font-sans text-sm"
                                            style={{
                                                borderColor: 'var(--color-border-subtle)',
                                                background: currentPage === 1 ? 'var(--color-cream)' : 'var(--color-white)',
                                                color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            }}
                                            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                                            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                        </motion.button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <motion.button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className="w-10 h-10 rounded-lg font-sans text-sm font-medium transition-all duration-200 cursor-pointer border-none"
                                                style={{
                                                    background: p === currentPage
                                                        ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
                                                        : 'var(--color-white)',
                                                    color: p === currentPage ? 'white' : 'var(--color-text)',
                                                    fontWeight: p === currentPage ? 700 : 400,
                                                    boxShadow: p === currentPage ? '0 4px 15px rgba(45,106,79,0.3)' : 'var(--shadow-sm)',
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.92 }}
                                            >
                                                {p}
                                            </motion.button>
                                        ))}

                                        <motion.button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 rounded-lg border inline-flex items-center justify-center transition-all duration-200"
                                            style={{
                                                borderColor: 'var(--color-border-subtle)',
                                                background: currentPage === totalPages ? 'var(--color-cream)' : 'var(--color-white)',
                                                color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text)',
                                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            }}
                                            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                                            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ─── MOBILE FILTER DRAWER ──────────────── */}
            <AnimatePresence>
                {mobileFilterOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-9998"
                            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileFilterOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 bottom-0 z-9999 w-[min(85vw,340px)] overflow-y-auto p-6"
                            style={{ background: 'var(--color-white)' }}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="11" y2="6" /><line x1="13" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="7" y2="12" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="16" y2="18" /><line x1="18" y1="18" x2="20" y2="18" /></svg>
                                    </span>
                                    <span className="font-serif text-lg font-bold" style={{ color: 'var(--color-text)' }}>Filter</span>
                                </div>
                                <motion.button
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="bg-transparent border-none cursor-pointer p-1.5 rounded-full transition-colors duration-200"
                                    style={{ color: 'var(--color-text-muted)' }}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </motion.button>
                            </div>
                            <FilterPanel />
                            <motion.button
                                onClick={() => setMobileFilterOpen(false)}
                                className="btn-primary w-full justify-center mt-6"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Lihat {filtered.length} Hasil
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function StarRating({ rating }: { rating: number }) {
    return (
        <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#D4A843' : '#E5E7EB'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </span>
    );
}

function WahanaCard({ wahana }: { wahana: WahanaData }) {
    const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
    const imageCount = wahana.WahanaGallery?.length || 0;
    const router = useRouter();

    return (
        <motion.div
            variants={scaleIn}
            initial="rest"
            whileHover="hover"
            className="group"
        >
            <motion.div
                variants={cardHover}
                className="tour-card rounded-2xl overflow-hidden flex flex-col h-full"
                style={{
                    background: 'var(--color-white)',
                    border: '1px solid var(--color-border-subtle)',
                }}
            >
                {/* Image */}
                <div className="relative h-[240px] overflow-hidden shrink-0 bg-gray-100">
                    <Image
                        src={wahana.imageBanner || '/assets/placeholder-image.jpg'}
                        alt={wahana.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
                    />

                    {/* Gallery Count badge */}
                    {imageCount > 0 && (
                        <span
                            className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold text-white uppercase tracking-wide backdrop-blur-md flex items-center gap-1.5 opacity-90 transition-opacity group-hover:opacity-100"
                            style={{ background: 'rgba(0,0,0,0.5)' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                            {imageCount} Foto
                        </span>
                    )}

                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                    <h3
                        className="font-serif text-xl font-bold mb-3 leading-snug transition-colors duration-300 group-hover:text-(--color-primary)"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {wahana.name}
                    </h3>

                    {/* Description excerpt */}
                    <p className="font-sans text-sm line-clamp-3 mb-4 leading-relaxed flex-1" style={{ color: 'var(--color-text-muted)' }}>
                        {wahana.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-5">
                        <StarRating rating={wahana.rating || 4.8} />
                        <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                            {wahana.rating || 4.8} ({wahana.reviewCount || Math.floor(Math.random() * 50) + 10} ulasan)
                        </span>
                    </div>

                    {/* Footer */}
                    <div
                        className="flex items-center justify-between pt-5"
                        style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                    >
                        <div>
                            <div className="font-sans text-[11px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Harga Tiket</div>
                            <div className="font-sans text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                {fmt(wahana.price)}
                            </div>
                        </div>
                        {/* Note: since there's no wahana detail page yet, the button could just be visual or link to booking */}
                        <Link href={`/wahana/${wahana.id}`}>
                            <div
                                className="group/btn inline-flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-300 hover:shadow-lg"
                                style={{ background: 'linear-gradient(135deg, var(--color-accent), #E09F3E)', cursor: 'pointer' }}
                                title="Lihat Detail"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover/btn:translate-x-0.5"><polyline points="9 18 15 12 9 6" /></svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

