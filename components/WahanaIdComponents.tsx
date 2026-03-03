'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { WahanaData } from '@/types/WahanaType';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

export default function WahanaIdComponents({
    wahana,
}: {
    wahana: WahanaData;
}) {
    const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
    const [activeSection, setActiveSection] = React.useState('overview');
    const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);
    const [stickyNav, setStickyNav] = React.useState(false);
    const subNavRef = React.useRef<HTMLDivElement>(null);
    const subNavPlaceholderRef = React.useRef<HTMLDivElement>(null);
    const [navbarHeight, setNavbarHeight] = React.useState(0);

    const navItems = [
        { id: 'overview', label: 'Ringkasan' },
        { id: 'gallery', label: 'Galeri' },
    ];

    const SUBNAV_HEIGHT = 53;

    const getNavbarHeight = () => {
        const nav = document.querySelector('nav');
        return nav ? nav.getBoundingClientRect().height : 0;
    };

    React.useEffect(() => {
        const handleScroll = () => {
            const currentNavHeight = getNavbarHeight();
            setNavbarHeight(currentNavHeight);
            if (subNavPlaceholderRef.current) {
                const rect = subNavPlaceholderRef.current.getBoundingClientRect();
                setStickyNav(rect.top <= currentNavHeight);
            }
            const totalH = currentNavHeight + SUBNAV_HEIGHT;
            for (const item of navItems) {
                const el = document.getElementById(item.id);
                if (el) {
                    const r = el.getBoundingClientRect();
                    // Basic active section detection
                    if (r.top <= totalH + 60 && r.bottom >= totalH) {
                        setActiveSection(item.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navItems]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const totalH = getNavbarHeight() + SUBNAV_HEIGHT;
            const y = el.getBoundingClientRect().top + window.scrollY - totalH - 12;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const hasGallery = wahana.WahanaGallery && wahana.WahanaGallery.length > 0;
    const galleryImages = wahana.WahanaGallery?.map((g) => g.image) || [];

    const fakeRating = 4.8;
    const fakeReviewCount = Math.floor(Math.random() * 50) + 15;

    return (
        <>
            {/* ── Hero ──────────────────────────────────── */}
            <section className="relative pt-20 min-h-[400px] md:min-h-[520px] overflow-hidden bg-[#1C312E]">
                <Image
                    src={wahana.imageBanner || '/assets/placeholder-image.jpg'}
                    alt={wahana.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

                {/* Floating orb decorations */}
                <motion.div
                    className="absolute rounded-full opacity-15 blur-3xl"
                    style={{ width: 300, height: 300, top: -60, right: -60, background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
                    animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="absolute inset-0 flex items-end pb-12 md:pb-16">
                    <motion.div
                        className="w-full max-w-[1320px] mx-auto px-6"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {/* Breadcrumb */}
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-4 font-sans text-[13px] text-white/70">
                            <Link href="/" className="text-white/70 no-underline hover:text-white transition-colors">Beranda</Link>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            <Link href="/wahana" className="text-white/70 no-underline hover:text-white transition-colors">Wahana</Link>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            <span className="text-white truncate max-w-[200px] sm:max-w-none">{wahana.name}</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="font-serif font-extrabold text-white mb-4 max-w-[680px]"
                            style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', lineHeight: 1.15, textShadow: '0 4px 30px rgba(0,0,0,0.4)' }}
                        >
                            {wahana.name}
                        </motion.h1>

                        {/* Quick facts in hero */}
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm text-white font-sans text-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <Stars rating={fakeRating} />
                                <span className="font-medium">{fakeRating} ({fakeReviewCount} Ulasan)</span>
                            </span>
                            {hasGallery && (
                                <span className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm text-white font-sans text-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                    <span>📸</span>
                                    <span className="font-medium">{galleryImages.length} Foto</span>
                                </span>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Sub Navigation ────────────────────────── */}
            <div ref={subNavPlaceholderRef} style={{ height: stickyNav ? SUBNAV_HEIGHT : 0 }} />
            <div
                ref={subNavRef}
                className="hide-scrollbar overflow-x-auto whitespace-nowrap transition-shadow duration-300"
                style={{
                    position: stickyNav ? 'fixed' : 'relative',
                    top: stickyNav ? navbarHeight : 'auto',
                    left: 0, right: 0,
                    zIndex: 900,
                    background: 'var(--color-white)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    boxShadow: stickyNav ? 'var(--shadow-md)' : 'none',
                }}
            >
                <div className="max-w-[1320px] mx-auto px-6 flex gap-2">
                    {navItems.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => scrollTo(n.id)}
                            className="relative px-5 py-4 bg-transparent border-none cursor-pointer font-sans text-sm whitespace-nowrap transition-colors duration-300"
                            style={{
                                color: activeSection === n.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                fontWeight: activeSection === n.id ? 700 : 500,
                            }}
                        >
                            {n.label}
                            {activeSection === n.id && (
                                <motion.div
                                    layoutId="activeNavTabWahana"
                                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full"
                                    style={{ background: 'linear-gradient(90deg, var(--color-primary), #52B788)' }}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main Content + Sidebar ────────────────── */}
            <main className="max-w-[1320px] mx-auto px-6 py-12" style={{ background: 'var(--color-bg)' }}>
                <div className="tour-detail-layout flex gap-12 items-start flex-col lg:flex-row">

                    {/* ── Left Column ───────────────────── */}
                    <div className="flex-1 min-w-0 w-full">

                        {/* Overview */}
                        <motion.section
                            id="overview"
                            className="mb-14"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Tentang Wahana Ini
                            </motion.h2>

                            <motion.div variants={fadeUp} className="prose max-w-none font-sans" style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                                {/* Splitting description by newlines to render paragraphs */}
                                {wahana.description.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 text-[15px]">{paragraph}</p>
                                ))}
                            </motion.div>
                        </motion.section>

                        {/* Gallery */}
                        {(hasGallery || wahana.imageBanner) && (
                            <motion.section
                                id="gallery"
                                className="mb-14"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={stagger}
                            >
                                <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                    Galeri Wahana
                                </motion.h2>
                                <motion.div
                                    variants={fadeUp}
                                    className="gallery-grid grid gap-2.5 rounded-2xl overflow-hidden"
                                    style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '240px 180px' }}
                                >
                                    {/* Make sure we have up to 5 images to show in this grid layout */}
                                    {galleryImages.length > 0 ? galleryImages.slice(0, 5).map((img, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setLightboxIdx(i)}
                                            className="relative cursor-pointer overflow-hidden group"
                                            style={{
                                                gridColumn: i === 0 ? '1 / 3' : undefined,
                                                gridRow: i === 0 ? '1 / 2' : undefined,
                                                background: '#f1f5f9'
                                            }}
                                        >
                                            <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                            </div>
                                            {i === 4 && galleryImages.length > 5 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold font-sans">
                                                    +{galleryImages.length - 5} foto
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div
                                            onClick={() => setLightboxIdx(0)}
                                            className="relative cursor-pointer overflow-hidden group col-span-3 row-span-2 h-[420px]"
                                            style={{ background: '#f1f5f9' }}
                                        >
                                            <Image src={wahana.imageBanner || ''} alt={"Banner"} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.section>
                        )}
                    </div>

                    {/* ── Sidebar ─────────────────────── */}
                    <aside className="tour-detail-sidebar hidden lg:block w-[310px] shrink-0 sticky top-[120px] pt-2">
                        <motion.div
                            className="rounded-2xl p-7"
                            style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-md)' }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="text-xs font-semibold uppercase tracking-wider font-sans mb-1" style={{ color: 'var(--color-text-muted)' }}>Mulai dari</div>
                            <div className="text-3xl font-extrabold font-sans mb-1" style={{ color: 'var(--color-primary)' }}>{fmt(wahana.price)}</div>
                            <div className="text-[13px] font-sans mb-6" style={{ color: 'var(--color-text-muted)' }}>/ tiket masuk</div>

                            <motion.button
                                className="btn-primary w-full justify-center py-3.5 px-6 mb-3 text-sm"
                                onClick={() => alert('Fitur booking akan segera hadir!')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Pesan Sekarang
                            </motion.button>
                            <Link href="/contact" className="block">
                                <button className="btn-outline w-full justify-center py-3 px-6 mb-2 text-sm">Hubungi Kami</button>
                            </Link>
                        </motion.div>
                    </aside>
                </div>
            </main>

            {/* ── Mobile Bottom Bar ──────────────────────── */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-between gap-3 p-4"
                style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-border-subtle)', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}
                id="mobile-bottom-bar"
            >
                <div>
                    <div className="font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Tiket masuk</div>
                    <div className="font-sans text-xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{fmt(wahana.price)}</div>
                </div>
                <div className="flex gap-2">
                    <button className="btn-primary py-2.5 px-6 text-[13px]" onClick={() => alert('Fitur booking akan segera hadir!')}>Pesan</button>
                </div>
            </div>

            {/* ── Lightbox ───────────────────────────────── */}
            <AnimatePresence>
                {lightboxIdx !== null && (
                    <motion.div
                        className="fixed inset-0 z-99999 flex items-center justify-center p-4 md:p-8"
                        style={{ background: 'rgba(0,0,0,0.92)' }}
                        onClick={() => setLightboxIdx(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                const images = galleryImages.length > 0 ? galleryImages : [wahana.imageBanner];
                                setLightboxIdx(Math.max(0, lightboxIdx - 1));
                            }}
                            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 z-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full h-full max-w-[1200px] flex items-center justify-center"
                        >
                            <Image
                                src={galleryImages.length > 0 ? galleryImages[lightboxIdx] : (wahana.imageBanner || '')}
                                alt="Gallery View"
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                const images = galleryImages.length > 0 ? galleryImages : [wahana.imageBanner];
                                setLightboxIdx(Math.min(images.length - 1, lightboxIdx + 1));
                            }}
                            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 z-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        </motion.button>

                        <motion.button
                            onClick={() => setLightboxIdx(null)}
                            className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/10 hover:bg-white/20 border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 z-10"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </motion.button>

                        <div className="absolute bottom-6 text-white/60 font-sans text-sm z-10">
                            {lightboxIdx + 1} / {galleryImages.length > 0 ? galleryImages.length : 1}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function Stars({ rating }: { rating: number }) {
    return (
        <span className="inline-flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#D4A843' : '#E5E7EB'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </span>
    );
}
