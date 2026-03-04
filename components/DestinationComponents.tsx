'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fmt } from '@/lib/utils';

/* ─── Types ───────────────────────────────────────────── */

export interface DestinationItem {
    id: number;
    name: string;
    imageBanner: string;
    description: string;
    priceWeekday: number;
    priceWeekend: number;
    priceGroup: number;
    minimalGroup: number;
    jamBuka: string;
    jamTutup: string;
    durasiRekomendasi: string;
    KuotaHarian: number;
    rating: number;
    reviewCount: number;
    labels: string[];
    facilities: string[];
    galleryCount: number;
}

/* ─── Animation Variants ──────────────────────────────── */

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
};
const cardHover = {
    rest: { y: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    hover: { y: -6, boxShadow: '0 18px 40px rgba(0,0,0,0.12)', transition: { duration: 0.3, ease: 'easeOut' as const } },
};

/* ─── Component ───────────────────────────────────────── */

export default function DestinationComponents({
    allDestinations,
    labels,
    facilities,
    itemsPerPage,
}: {
    allDestinations: DestinationItem[];
    labels: string[];
    facilities: string[];
    itemsPerPage: number;
}) {
    const [search, setSearch] = useState('');
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
        setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
        setCurrentPage(1);
    };

    const priceRanges = [
        { label: '< Rp 25.000', min: 0, max: 25000 },
        { label: 'Rp 25.000–50.000', min: 25000, max: 50000 },
        { label: 'Rp 50.000–100.000', min: 50000, max: 100000 },
        { label: '> Rp 100.000', min: 100000, max: Infinity },
    ];

    const filtered = useMemo(() => {
        return allDestinations.filter(d => {
            if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (selectedLabels.length && !selectedLabels.some(l => d.labels.includes(l))) return false;
            if (selectedFacilities.length && !selectedFacilities.some(f => d.facilities.includes(f))) return false;
            if (selectedPrice !== null) {
                const range = priceRanges[selectedPrice];
                if (d.priceWeekday < range.min || d.priceWeekday > range.max) return false;
            }
            return true;
        });
    }, [search, selectedLabels, selectedFacilities, selectedPrice, allDestinations, priceRanges]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const resetFilters = () => { setSelectedLabels([]); setSelectedFacilities([]); setSelectedPrice(null); setSearch(''); setCurrentPage(1); };
    const hasActiveFilters = selectedLabels.length > 0 || selectedFacilities.length > 0 || selectedPrice !== null || search.length > 0;

    const FilterPanel = () => (
        <div className="space-y-6">
            {hasActiveFilters && (
                <motion.button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-bold border cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', background: 'transparent' }}
                    whileHover={{ background: 'var(--color-accent)', color: '#fff' }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Reset Filter
                </motion.button>
            )}

            {labels.length > 0 && (
                <FilterSection title="Label">
                    {labels.map(l => <Checkbox key={l} checked={selectedLabels.includes(l)} onChange={() => toggle(selectedLabels, setSelectedLabels, l)} label={l} />)}
                </FilterSection>
            )}

            {facilities.length > 0 && (
                <FilterSection title="Fasilitas">
                    {facilities.map(f => <Checkbox key={f} checked={selectedFacilities.includes(f)} onChange={() => toggle(selectedFacilities, setSelectedFacilities, f)} label={f} />)}
                </FilterSection>
            )}

            <FilterSection title="Harga">
                {priceRanges.map((r, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer select-none">
                        <span
                            onClick={() => { setSelectedPrice(selectedPrice === i ? null : i); setCurrentPage(1); }}
                            className="w-[18px] h-[18px] rounded-full shrink-0 transition-all duration-200 cursor-pointer"
                            style={{ border: selectedPrice === i ? '5px solid var(--color-primary)' : '2px solid #D1D5DB', background: 'var(--color-white)' }}
                        />
                        <span className="font-sans text-sm" style={{ color: 'var(--color-text-light)' }}>{r.label}</span>
                    </label>
                ))}
            </FilterSection>
        </div>
    );

    return (
        <>
            {/* ── Hero ──────────────────────────────────── */}
            <section className="relative pt-20 min-h-[420px] flex items-end pb-14 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'url("/assets/withus07.png")', backgroundSize: 'cover', backgroundPosition: 'top' }} />
                <motion.div className="absolute rounded-full opacity-10 blur-3xl" style={{ width: 400, height: 400, top: -100, right: -80, background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }} animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="absolute rounded-full opacity-10 blur-3xl" style={{ width: 300, height: 300, bottom: -60, left: -40, background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)' }} animate={{ y: [0, -25, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                <div className="relative z-2 w-full max-w-[1320px] mx-auto px-6">
                    <motion.div className="flex items-center gap-2 mb-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Link href="/" className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            Beranda
                        </Link>
                        <span className="text-white/40">›</span>
                        <span className="font-sans text-sm text-white/90">Destinasi Wisata</span>
                    </motion.div>
                    <motion.h1 className="font-serif font-extrabold text-white mb-4 leading-[1.1]" style={{ fontSize: 'clamp(30px, 5vw, 56px)', textShadow: '0 4px 30px rgba(0,0,0,0.2)' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                        Destinasi Wisata
                    </motion.h1>
                    <motion.p className="font-sans text-white/80 max-w-[540px] leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 17px)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        Temukan berbagai destinasi wisata menarik di Desa Manuk Jaya — dari panorama alam, wisata budaya, hingga spot foto instagramable.
                    </motion.p>

                    <motion.div className="flex flex-wrap gap-6 mt-8" initial="hidden" animate="visible" variants={stagger}>
                        {[
                            { icon: '🏞', value: `${allDestinations.length}`, label: 'Destinasi' },
                            { icon: '⭐', value: (allDestinations.reduce((s, d) => s + d.rating, 0) / (allDestinations.length || 1)).toFixed(1), label: 'Rating Rata-rata' },
                            { icon: '🏷', value: `${labels.length}`, label: 'Label' },
                        ].map(stat => (
                            <motion.div key={stat.label} variants={fadeUp} className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <span className="text-xl">{stat.icon}</span>
                                <div>
                                    <span className="font-sans text-lg font-bold text-white block leading-tight">{stat.value}</span>
                                    <span className="font-sans text-xs text-white/60">{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Sticky Search Bar ────────────────────── */}
            <motion.div className="sticky top-[72px] z-20 py-4 px-6" style={{ background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border-subtle)' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
                <div className="max-w-[1320px] mx-auto flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[260px] relative group">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 group-focus-within:text-(--color-primary)" style={{ color: 'var(--color-text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Cari destinasi..." className="w-full py-3 pl-12 pr-4 rounded-full font-sans text-sm outline-none transition-all duration-300 focus:ring-3" style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-border-subtle)', color: 'var(--color-text)' }} />
                    </div>
                    <div className="font-sans text-sm whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                        <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{filtered.length}</span> destinasi ditemukan
                    </div>
                    <button onClick={() => setMobileFilterOpen(true)} className="mobile-filter-btn hidden items-center gap-2 px-5 py-3 rounded-full border-none font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:opacity-90" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', color: 'white' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="11" y2="6" /><line x1="13" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="7" y2="12" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="16" y2="18" /><line x1="18" y1="18" x2="20" y2="18" /></svg>
                        Filter
                        {hasActiveFilters && <span className="bg-white rounded-full w-[18px] h-[18px] text-[11px] font-bold inline-flex items-center justify-center" style={{ color: 'var(--color-primary)' }}>{selectedLabels.length + selectedFacilities.length + (selectedPrice !== null ? 1 : 0)}</span>}
                    </button>
                </div>
            </motion.div>

            {/* ── Main Content ─────────────────────────── */}
            <main className="max-w-[1320px] mx-auto px-6 py-12 flex gap-10 items-start" style={{ background: 'var(--color-bg)' }}>
                <motion.aside className="tours-sidebar w-[260px] shrink-0 sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto rounded-2xl p-6" style={{ background: 'var(--color-white)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-subtle)' }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="11" y2="6" /><line x1="13" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="7" y2="12" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="16" y2="18" /><line x1="18" y1="18" x2="20" y2="18" /></svg>
                        </span>
                        <span className="font-serif text-lg font-bold" style={{ color: 'var(--color-text)' }}>Filter Destinasi</span>
                    </div>
                    <FilterPanel />
                </motion.aside>

                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {paginated.length === 0 ? (
                            <motion.div key="empty" className="text-center py-20 px-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-5">🔍</motion.div>
                                <p className="font-serif text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Destinasi tidak ditemukan</p>
                                <p className="font-sans text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Coba ubah kata kunci atau reset filter.</p>
                                <button onClick={resetFilters} className="btn-primary">Reset Filter</button>
                            </motion.div>
                        ) : (
                            <motion.div key="grid">
                                <motion.div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }} initial="hidden" animate="visible" variants={stagger}>
                                    {paginated.map(dest => <DestinationCard key={dest.id} dest={dest} />)}
                                </motion.div>

                                {totalPages > 1 && (
                                    <motion.div className="flex justify-center items-center gap-2 flex-wrap mt-12" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                                        <motion.button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-lg border inline-flex items-center justify-center transition-all duration-200 font-sans text-sm" style={{ borderColor: 'var(--color-border-subtle)', background: currentPage === 1 ? 'var(--color-cream)' : 'var(--color-white)', color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }} whileHover={currentPage !== 1 ? { scale: 1.05 } : {}} whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                        </motion.button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <motion.button key={p} onClick={() => setCurrentPage(p)} className="w-10 h-10 rounded-lg font-sans text-sm font-medium transition-all duration-200 cursor-pointer border-none" style={{ background: p === currentPage ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' : 'var(--color-white)', color: p === currentPage ? 'white' : 'var(--color-text)', fontWeight: p === currentPage ? 700 : 400, boxShadow: p === currentPage ? '0 4px 15px rgba(45,106,79,0.3)' : 'var(--shadow-sm)' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}>
                                                {p}
                                            </motion.button>
                                        ))}
                                        <motion.button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-lg border inline-flex items-center justify-center transition-all duration-200" style={{ borderColor: 'var(--color-border-subtle)', background: currentPage === totalPages ? 'var(--color-cream)' : 'var(--color-white)', color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }} whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}} whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ── Mobile Filter Drawer ─────────────────── */}
            <AnimatePresence>
                {mobileFilterOpen && (
                    <>
                        <motion.div className="fixed inset-0 z-9998" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFilterOpen(false)} />
                        <motion.div className="fixed top-0 right-0 bottom-0 z-9999 w-[min(85vw,340px)] overflow-y-auto p-6" style={{ background: 'var(--color-white)' }} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-serif text-lg font-bold" style={{ color: 'var(--color-text)' }}>Filter Destinasi</span>
                                <motion.button onClick={() => setMobileFilterOpen(false)} className="bg-transparent border-none cursor-pointer p-1.5 rounded-full" style={{ color: 'var(--color-text-muted)' }} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </motion.button>
                            </div>
                            <FilterPanel />
                            <motion.button onClick={() => setMobileFilterOpen(false)} className="btn-primary w-full justify-center mt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                Lihat {filtered.length} Hasil
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

/* ── Sub-components ──────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
    return (
        <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#D4A843' : '#E5E7EB'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </span>
    );
}

function DestinationCard({ dest }: { dest: DestinationItem }) {
    return (
        <motion.div variants={scaleIn} initial="rest" whileHover="hover" className="group">
            <motion.div variants={cardHover} className="tour-card rounded-2xl overflow-hidden flex flex-col h-full" style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)' }}>
                {/* Image */}
                <div className="relative h-[230px] overflow-hidden shrink-0">
                    {dest.imageBanner ? (
                        <Image src={dest.imageBanner} alt={dest.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #2D6A4F20, #52B78830)' }}>
                            <span className="text-5xl">🏞️</span>
                        </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

                    {/* Hours badge */}
                    <span className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold text-white uppercase tracking-wide backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}>
                        🕐 {dest.jamBuka}–{dest.jamTutup}
                    </span>

                    {/* Duration badge */}
                    <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-black/40 backdrop-blur-sm flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {dest.durasiRekomendasi}
                    </span>

                    {/* Rating on hover */}
                    {dest.rating > 0 && (
                        <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-[11px] font-sans font-medium text-white bg-white/15 border border-white/25 backdrop-blur-sm flex items-center gap-1">
                            ⭐ {dest.rating.toFixed(1)}
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="p-5 pb-6 flex flex-col flex-1">
                    {/* Labels */}
                    {dest.labels.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mb-3">
                            {dest.labels.slice(0, 3).map(l => (
                                <span key={l} className="px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold" style={{ background: 'var(--color-cream)', color: 'var(--color-primary)' }}>{l}</span>
                            ))}
                        </div>
                    )}

                    <h3 className="font-serif text-[17px] font-bold mb-2 leading-snug transition-colors duration-300 group-hover:text-(--color-primary)" style={{ color: 'var(--color-text)' }}>
                        {dest.name}
                    </h3>

                    <p className="font-sans text-[13px] leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                        {dest.description || 'Destinasi wisata menarik di Desa Manuk Jaya'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={dest.rating} />
                        <span className="font-sans text-xs" style={{ color: 'var(--color-text-muted)' }}>{dest.rating.toFixed(1)} ({dest.reviewCount} ulasan)</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                        <div>
                            <div className="font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>mulai dari</div>
                            <div className="font-sans text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{fmt(dest.priceWeekday)}</div>
                        </div>
                        <Link href={`/destinations/${dest.id}`} className="group/btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-[13px] font-semibold text-white no-underline transition-all duration-300 hover:gap-2.5 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--color-accent), #E09F3E)' }}>
                            Selengkapnya
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/btn:translate-x-0.5"><polyline points="9 18 15 12 9 6" /></svg>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer select-none group/cb">
            <motion.span onClick={onChange} className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200" style={{ border: checked ? '2px solid var(--color-primary)' : '2px solid #D1D5DB', background: checked ? 'var(--color-primary)' : 'var(--color-white)' }} whileTap={{ scale: 0.85 }}>
                {checked && (
                    <motion.svg width="11" height="11" viewBox="0 0 12 12" fill="white" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                        <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </motion.svg>
                )}
            </motion.span>
            <span className="font-sans text-sm transition-colors duration-200 group-hover/cb:text-(--color-primary)" style={{ color: 'var(--color-text-light)' }}>{label}</span>
        </label>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <div className="text-xs font-bold font-sans uppercase tracking-widest mb-3 pb-2.5" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border-subtle)' }}>{title}</div>
            <div className="flex flex-col gap-2.5">{children}</div>
        </div>
    );
}
