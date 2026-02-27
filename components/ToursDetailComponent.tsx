'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fmt } from '@/lib/utils';
import { DayItinerary, TourDetail } from '@/types/TourType';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

export default function ToursDetailComponent({ tour, navItems, relatedTours }: {
    tour: TourDetail;
    navItems: { id: string; label: string }[];
    relatedTours: Record<number, { id: number; title: string; image: string; duration: string; price: string }>;
}) {
    const [activeSection, setActiveSection] = React.useState('overview');
    const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);
    const [stickyNav, setStickyNav] = React.useState(false);
    const subNavRef = React.useRef<HTMLDivElement>(null);
    const subNavPlaceholderRef = React.useRef<HTMLDivElement>(null);
    const [navbarHeight, setNavbarHeight] = React.useState(0);

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
                    if (r.top <= totalH + 20 && r.bottom >= totalH + 20) {
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

    return (
        <>
            {/* ── Hero ──────────────────────────────────── */}
            <section className="relative pt-20 min-h-[400px] md:min-h-[520px] overflow-hidden">
                <Image src={tour.heroImage} alt={tour.title} fill className="object-cover" priority />
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
                        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4 font-sans text-[13px] text-white/70">
                            <Link href="/" className="text-white/70 no-underline hover:text-white transition-colors">Beranda</Link>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            <Link href="/tours" className="text-white/70 no-underline hover:text-white transition-colors">Paket Wisata</Link>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            <span className="text-white">{tour.title}</span>
                        </motion.div>

                        {/* Theme badges */}
                        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-4">
                            {tour.themes.map((t) => (
                                <span key={t} className="px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-white/15 backdrop-blur-sm border border-white/20 tracking-wide">
                                    {t}
                                </span>
                            ))}
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="font-serif font-extrabold text-white mb-4 max-w-[680px]"
                            style={{ fontSize: 'clamp(26px, 4.5vw, 48px)', lineHeight: 1.15, textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                        >
                            {tour.title}
                        </motion.h1>

                        {/* Quick facts in hero */}
                        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-2">
                            {[
                                { emoji: '📅', value: `${tour.durationDays} hari` },
                                { emoji: '👥', value: tour.groupSize },
                                { emoji: '📍', value: tour.destinations.join(', ') },
                            ].map((f) => (
                                <span key={f.value} className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm text-white font-sans text-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                    <span>{f.emoji}</span>
                                    <span className="font-medium">{f.value}</span>
                                </span>
                            ))}
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
                <div className="max-w-[1320px] mx-auto px-3 flex gap-0">
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
                                    layoutId="activeNavTab"
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
                            <motion.div variants={fadeUp} className="flex flex-wrap gap-5 mb-7">
                                {[
                                    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Durasi', value: `${tour.durationDays} hari` },
                                    { icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a3 3 0 00-2.12-2.87M16 3.13a3 3 0 010 5.74', label: 'Grup', value: tour.groupSize },
                                    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Destinasi', value: tour.destinations.join(', ') },
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-cream)' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-semibold uppercase tracking-widest font-sans" style={{ color: 'var(--color-text-muted)' }}>{f.label}</div>
                                            <div className="text-[15px] font-semibold font-sans" style={{ color: 'var(--color-text)' }}>{f.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            <motion.p variants={fadeUp} className="text-[15px] leading-relaxed font-sans mb-6" style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                                {tour.overview}
                            </motion.p>

                            <motion.div
                                variants={fadeUp}
                                className="rounded-2xl p-6"
                                style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}
                            >
                                <h4 className="font-serif text-base font-bold mb-4" style={{ color: 'var(--color-text)' }}>Sorotan Perjalanan</h4>
                                <ul className="list-none p-0 m-0 grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                                    {tour.highlights.map((h, i) => (
                                        <li key={i} className="flex items-center gap-2.5 font-sans text-sm" style={{ color: 'var(--color-text-light)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" className="shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.section>

                        {/* Gallery */}
                        <motion.section
                            id="gallery"
                            className="mb-14"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Galeri Perjalanan
                            </motion.h2>
                            <motion.div
                                variants={fadeUp}
                                className="gallery-grid grid gap-2.5 rounded-2xl overflow-hidden"
                                style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '240px 180px' }}
                            >
                                {tour.gallery.slice(0, 5).map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setLightboxIdx(i)}
                                        className="relative cursor-pointer overflow-hidden group"
                                        style={{
                                            gridColumn: i === 0 ? '1 / 3' : undefined,
                                            gridRow: i === 0 ? '1 / 2' : undefined,
                                        }}
                                    >
                                        <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                        </div>
                                        {i === 4 && tour.gallery.length > 5 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold font-sans">
                                                +{tour.gallery.length - 5} foto
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        </motion.section>

                        {/* Itinerary */}
                        <motion.section
                            id="itinerary"
                            className="mb-14"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Itinerari Perjalanan
                            </motion.h2>
                            <div className="flex flex-col gap-3">
                                {tour.itinerary.map((day, idx) => (
                                    <motion.div key={day.day} variants={fadeUp}>
                                        <ItineraryDay item={day} defaultOpen={day.day === 1} index={idx} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Price & Dates */}
                        <motion.section
                            id="price_and_date"
                            className="mb-14"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Harga & Jadwal Keberangkatan
                            </motion.h2>

                            {/* Desktop table */}
                            <motion.div variants={fadeUp} className="hidden md:block overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--color-border-subtle)' }}>
                                <table className="w-full font-sans text-sm" style={{ borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--color-cream)' }}>
                                            <th className="text-left py-3.5 px-5 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>Berangkat</th>
                                            <th className="text-left py-3.5 px-5 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>Kembali</th>
                                            <th className="text-left py-3.5 px-5 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>Status</th>
                                            <th className="text-right py-3.5 px-5 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>Harga</th>
                                            <th className="py-3.5 px-5"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tour.dates.map((d, i) => {
                                            const statusColor = d.status === 'Terjamin' ? '#10B981' : d.status === 'Hampir Penuh' ? '#F59E0B' : 'var(--color-primary)';
                                            return (
                                                <tr key={i} className="group transition-colors duration-200 hover:bg-(--color-cream)" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                                    <td className="py-3.5 px-5 font-medium" style={{ color: 'var(--color-text)' }}>{d.start}</td>
                                                    <td className="py-3.5 px-5" style={{ color: 'var(--color-text-light)' }}>{d.end}</td>
                                                    <td className="py-3.5 px-5">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${statusColor}15`, color: statusColor }}>
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                                                            {d.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-5 text-right font-bold" style={{ color: 'var(--color-primary)' }}>{fmt(d.price)}</td>
                                                    <td className="py-3.5 px-5 text-right">
                                                        <Link href={`/booking?slug=${tour.id}&start=${d.start}&end=${d.end}`}>
                                                            <button className="btn-primary py-2 px-5 text-xs transition-transform duration-200 hover:scale-105">Pesan</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </motion.div>

                            {/* Mobile cards */}
                            <motion.div variants={fadeUp} className="flex flex-col gap-3 md:hidden">
                                {tour.dates.map((d, i) => {
                                    const statusColor = d.status === 'Terjamin' ? '#10B981' : d.status === 'Hampir Penuh' ? '#F59E0B' : 'var(--color-primary)';
                                    return (
                                        <div key={i} className="rounded-2xl p-5 flex flex-col gap-3 transition-shadow duration-300 hover:shadow-lg" style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)' }}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-sans text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>Berangkat</div>
                                                    <div className="font-sans text-sm font-bold" style={{ color: 'var(--color-text)' }}>{d.start}</div>
                                                </div>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${statusColor}15`, color: statusColor }}>
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                                                    {d.status}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-sans text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>Kembali</div>
                                                <div className="font-sans text-sm" style={{ color: 'var(--color-text-light)' }}>{d.end}</div>
                                            </div>
                                            <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                                <span className="font-sans text-lg font-extrabold" style={{ color: 'var(--color-primary)' }}>{fmt(d.price)}</span>
                                                <Link href={`/booking?slug=${tour.id}&start=${d.start}&end=${d.end}`}>
                                                    <button className="btn-primary py-2.5 px-5 text-xs">Pesan</button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </motion.section>

                        {/* Included / Excluded */}
                        <motion.section
                            id="included"
                            className="mb-14"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Yang Termasuk & Tidak Termasuk
                            </motion.h2>
                            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="rounded-2xl p-6" style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}>
                                    <h4 className="font-sans text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#10B981' }}>✓ Termasuk</h4>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                                        {tour.included.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-2xl p-6" style={{ background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.1)' }}>
                                    <h4 className="font-sans text-sm font-bold uppercase tracking-wider mb-4 text-red-600">✕ Tidak Termasuk</h4>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                                        {tour.excluded.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" className="shrink-0 mt-0.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.section>

                        {/* Good to Know */}
                        <motion.section
                            id="good_to_know"
                            className="mb-14"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Info Penting
                            </motion.h2>
                            <div className="flex flex-col gap-4">
                                {tour.goodToKnow.map((g, i) => (
                                    <motion.div
                                        key={i}
                                        variants={fadeUp}
                                        className="rounded-2xl p-6 border-l-4 transition-shadow duration-300 hover:shadow-md"
                                        style={{ background: 'var(--color-cream)', borderLeftColor: 'var(--color-primary)', border: '1px solid var(--color-border-subtle)', borderLeft: '4px solid var(--color-primary)' }}
                                    >
                                        <h4 className="font-sans text-[15px] font-bold mb-2" style={{ color: 'var(--color-text)' }}>{g.title}</h4>
                                        <p className="font-sans text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>{g.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Reviews */}
                        <motion.section
                            id="reviews"
                            className="mb-14"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Ulasan Wisatawan
                            </motion.h2>
                            <div className="flex flex-col gap-5">
                                {tour.reviews.map((r, i) => (
                                    <motion.div
                                        key={i}
                                        variants={fadeUp}
                                        className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                        style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)' }}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <Image src={r.avatar} alt={r.name} width={48} height={48} className="rounded-full object-cover ring-2 ring-offset-2" />
                                            <div className="flex-1">
                                                <div className="font-sans text-[15px] font-semibold" style={{ color: 'var(--color-text)' }}>{r.name}</div>
                                                <div className="font-sans text-xs" style={{ color: 'var(--color-text-muted)' }}>{r.location} · {r.date}</div>
                                            </div>
                                            <Stars rating={r.rating} />
                                        </div>
                                        <p className="font-sans text-sm leading-relaxed m-0 italic" style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>
                                            &quot;{r.text}&quot;
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Related Tours */}
                        <motion.section
                            className="mb-5"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                        >
                            <motion.h2 variants={fadeUp} className="font-serif font-bold mb-6" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--color-text)' }}>
                                Paket Wisata Serupa
                            </motion.h2>
                            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {tour.relatedTourIds.map((rid) => {
                                    const rt = relatedTours[rid];
                                    if (!rt) return null;
                                    return (
                                        <Link key={rid} href={`/tours/${rt.id}`} className="no-underline group">
                                            <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)' }}>
                                                <div className="relative h-[160px] overflow-hidden">
                                                    <Image src={rt.image} alt={rt.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-serif text-[15px] font-bold mb-2 leading-snug transition-colors duration-300 group-hover:text-(--color-primary)" style={{ color: 'var(--color-text)' }}>{rt.title}</h4>
                                                    <div className="font-sans text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                                                        {rt.duration} · mulai {rt.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        </motion.section>
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
                            <div className="text-3xl font-extrabold font-sans mb-1" style={{ color: 'var(--color-primary)' }}>{fmt(tour.price)}</div>
                            <div className="text-[13px] font-sans mb-6" style={{ color: 'var(--color-text-muted)' }}>per orang</div>

                            <motion.button
                                className="btn-primary w-full justify-center py-3.5 px-6 mb-3 text-sm"
                                onClick={() => scrollTo('price_and_date')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Pesan Sekarang
                            </motion.button>
                            <Link href={`/inquiry?slug=${tour.id}`} className="block">
                                <button className="btn-outline w-full justify-center py-3 px-6 mb-6 text-sm">Tanya Kami</button>
                            </Link>

                            <div className="flex flex-col gap-3.5 pt-5" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                {[
                                    { label: 'Durasi', value: `${tour.durationDays} hari` },
                                    { label: 'Tipe', value: tour.type },
                                    { label: 'Grup', value: tour.groupSize },
                                    { label: 'Destinasi', value: tour.destinations.join(', ') },
                                ].map((f) => (
                                    <div key={f.label} className="flex justify-between font-sans text-sm">
                                        <span style={{ color: 'var(--color-text-muted)' }}>{f.label}</span>
                                        <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </main>

            {/* ── Mobile Bottom Bar ──────────────────────── */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 items-center justify-between gap-3 p-4 mobile-bottom-bar"
                style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-border-subtle)', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}
                id="mobile-bottom-bar"
            >
                <div>
                    <div className="font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Mulai dari</div>
                    <div className="font-sans text-xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{fmt(tour.price)}</div>
                </div>
                <div className="flex gap-2">
                    <button className="btn-outline py-2.5 px-4 text-[13px]">Tanya</button>
                    <button className="btn-primary py-2.5 px-5 text-[13px]" onClick={() => scrollTo('price_and_date')}>Pesan</button>
                </div>
            </div>

            {/* ── Lightbox ───────────────────────────────── */}
            <AnimatePresence>
                {lightboxIdx !== null && (
                    <motion.div
                        className="fixed inset-0 z-99999 flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.92)' }}
                        onClick={() => setLightboxIdx(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.button
                            onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.max(0, lightboxIdx - 1)); }}
                            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/15 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
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
                        >
                            <Image
                                src={tour.gallery[lightboxIdx]}
                                alt="Gallery"
                                width={1200}
                                height={800}
                                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                            />
                        </motion.div>
                        <motion.button
                            onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.min(tour.gallery.length - 1, lightboxIdx + 1)); }}
                            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/15 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        </motion.button>
                        <motion.button
                            onClick={() => setLightboxIdx(null)}
                            className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/15 border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </motion.button>
                        <div className="absolute bottom-6 text-white/60 font-sans text-sm">
                            {lightboxIdx + 1} / {tour.gallery.length}
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

function ItineraryDay({ item, defaultOpen, index }: { item: DayItinerary; defaultOpen?: boolean; index: number }) {
    const [open, setOpen] = React.useState(defaultOpen ?? false);

    const mealLabel: Record<string, string> = { B: 'Sarapan', L: 'Makan Siang', D: 'Makan Malam' };
    const mealColor: Record<string, string> = { B: '#F59E0B', L: '#10B981', D: '#6366F1' };
    const dayGradients = [
        'linear-gradient(135deg, #2D6A4F, #52B788)',
        'linear-gradient(135deg, #7C3AED, #A78BFA)',
        'linear-gradient(135deg, #0891B2, #67E8F9)',
        'linear-gradient(135deg, #DC2626, #F87171)',
        'linear-gradient(135deg, #D97706, #FBBF24)',
    ];

    return (
        <div
            className="rounded-2xl overflow-hidden transition-shadow duration-300"
            style={{
                border: '1px solid var(--color-border-subtle)',
                boxShadow: open ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-4 py-5 px-5 border-none cursor-pointer text-left font-sans transition-colors duration-300"
                style={{ background: open ? 'var(--color-cream)' : 'var(--color-white)' }}
            >
                <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 text-white"
                    style={{ background: open ? dayGradients[index % dayGradients.length] : 'var(--color-cream)', color: open ? 'white' : 'var(--color-primary)' }}
                >
                    {item.day}
                </span>
                <div className="flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Hari {item.day}</div>
                    <div className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{item.title}</div>
                </div>
                <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"
                    className="shrink-0 transition-transform duration-300"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0 pl-[72px] md:pl-[76px]">
                            <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>
                                {item.description}
                            </p>
                            <div className="flex gap-2 flex-wrap items-center">
                                {item.meals.map((m) => (
                                    <span
                                        key={m}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-semibold"
                                        style={{ background: `${mealColor[m]}15`, color: mealColor[m] }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: mealColor[m] }} />
                                        {mealLabel[m]}
                                    </span>
                                ))}
                                {item.distance && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-semibold" style={{ background: 'var(--color-cream)', color: 'var(--color-text-muted)' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {item.distance}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}