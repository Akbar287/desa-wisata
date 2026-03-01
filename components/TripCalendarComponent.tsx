'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MonthData } from '@/types/TripCalendarType';

export default function TripCalendarComponent({ months }: { months: MonthData[] }) {
    const [activeMonth, setActiveMonth] = useState(months[0]?.id ?? '');

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
    };

    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
    };

    const rowVariant = {
        hidden: { opacity: 0, x: -15 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
    };

    function StatusBadge({ status }: { status: string }) {
        const isOpen = status.toLowerCase().includes('dibuka');
        const isLimited = status.toLowerCase().includes('sisa');
        return (
            <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-bold whitespace-nowrap dark:text-gray-300"
                style={{
                    background: isOpen
                        ? 'rgba(45,106,79,0.12)'
                        : isLimited
                            ? 'rgba(181,103,39,0.12)'
                            : 'rgba(100,100,100,0.1)',
                    color: isOpen
                        ? 'var(--color-primary)'
                        : isLimited
                            ? '#B56727'
                            : 'var(--color-text-muted)',
                }}
            >
                <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{
                        background: isOpen ? 'var(--color-primary)' : isLimited ? '#B56727' : 'var(--color-text-muted)',
                    }}
                />
                {status}
            </span>
        );
    }

    return (
        <main>
            <section className="relative w-full min-h-[420px] h-[50vh] overflow-hidden">
                <Image
                    src="/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg"
                    alt="Trip Calendar 2026"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/35 to-black/10" />

                <div className="relative z-2 h-full flex flex-col justify-end max-w-[900px] mx-auto px-6 pb-14">
                    <motion.div
                        className="flex items-center gap-2 mb-5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link href="/" className="font-sans text-sm text-white/60 no-underline hover:text-white/90 dark:text-gray-300 transition-colors flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            Beranda
                        </Link>
                        <span className="text-white/40 dark:text-gray-300">›</span>
                        <span className="font-sans dark:text-gray-300 text-sm text-white/80">Trip Calendar</span>
                    </motion.div>

                    <motion.h1
                        className="font-serif font-bold text-white dark:text-gray-300 mb-4"
                        style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', textShadow: '0 3px 20px rgba(0,0,0,0.3)' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Trip Calendar 2026
                    </motion.h1>

                    <motion.p
                        className="font-sans text-white/80 dark:text-gray-300 max-w-[560px] leading-relaxed"
                        style={{ fontSize: 'clamp(14px, 1.2vw, 17px)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Discover Desa Wisata hadir membantu Anda menemukan paket wisata desa yang sempurna.
                        Berikut jadwal tur kelompok kecil kami dengan tanggal keberangkatan terjamin.
                        Pilihan terbaik bagi Anda yang ingin menjelajahi keindahan desa-desa wisata Indonesia.
                    </motion.p>
                </div>
            </section>

            {months.length === 0 ? (
                <section className="py-20 px-6" style={{ background: 'var(--color-bg)' }}>
                    <div className="max-w-[600px] mx-auto text-center">
                        <div className="rounded-2xl p-10" style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                            <div className="text-5xl mb-4">📅</div>
                            <h2 className="font-serif text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>Jadwal Tur Belum Tersedia</h2>
                            <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
                                Saat ini belum ada jadwal tur yang tersedia. Silakan kembali lagi nanti atau hubungi kami untuk informasi lebih lanjut.
                            </p>
                            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm font-semibold no-underline text-white transition-all duration-300 hover:scale-105" style={{ background: 'var(--color-primary)' }}>
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </section>
            ) : (<>

                <section className="sticky top-[72px] z-20 px-6" style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <div className="max-w-[1100px] mx-auto">
                        <motion.div
                            className="hide-scrollbar flex gap-0 overflow-x-auto"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            {months.map((month) => (
                                <button
                                    key={month.id}
                                    onClick={() => setActiveMonth(month.id)}
                                    className="relative px-6 py-4 font-sans text-sm font-semibold border-none bg-transparent cursor-pointer transition-colors duration-300 whitespace-nowrap"
                                    style={{
                                        color: activeMonth === month.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    }}
                                >
                                    {month.label}
                                    {activeMonth === month.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full"
                                            style={{ background: 'var(--color-primary)' }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="py-12 px-6" style={{ background: 'var(--color-bg)' }}>
                    <div className="max-w-[1100px] mx-auto">
                        <AnimatePresence mode="wait">
                            {months
                                .filter((m) => activeMonth === 'all' || m.id === activeMonth)
                                .map((month) => (
                                    <motion.div
                                        key={month.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.35 }}
                                        className="mb-14 last:mb-0"
                                    >
                                        <motion.h2
                                            className="font-serif font-bold mb-6 flex items-center gap-3"
                                            style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: 'var(--color-text)' }}
                                            variants={fadeUp}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                        >
                                            <span className="text-2xl">📅</span>
                                            {month.label} {month.year}
                                        </motion.h2>

                                        <motion.div
                                            className="hidden md:block rounded-2xl overflow-hidden"
                                            style={{
                                                background: 'var(--color-white)',
                                                boxShadow: 'var(--shadow-sm)',
                                                border: '1px solid var(--color-border-subtle)',
                                            }}
                                            variants={stagger}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                        >
                                            <div
                                                className="grid gap-0 px-6 py-4"
                                                style={{
                                                    gridTemplateColumns: '140px 1fr 100px 150px 1fr',
                                                    borderBottom: '1px solid var(--color-border-subtle)',
                                                }}
                                            >
                                                {['Tanggal', 'Nama Tur', 'Durasi', 'Status', 'Informasi Tur'].map((h) => (
                                                    <span
                                                        key={h}
                                                        className="font-sans text-xs font-bold uppercase tracking-widest"
                                                        style={{ color: 'var(--color-text-muted)' }}
                                                    >
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>

                                            {month.trips.map((trip, i) => (
                                                <motion.div
                                                    key={i}
                                                    variants={rowVariant}
                                                    className="grid gap-0 px-6 py-5 items-center transition-colors duration-200 hover:bg-(--color-cream)"
                                                    style={{
                                                        gridTemplateColumns: '140px 1fr 100px 150px 1fr',
                                                        borderBottom: i < month.trips.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                                                    }}
                                                >
                                                    <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                                                        {trip.dateStart} – {trip.dateEnd}
                                                    </span>

                                                    <Link
                                                        href={trip.tourLink}
                                                        className="font-sans text-sm font-semibold no-underline transition-colors duration-300 hover:underline"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        {trip.tour}
                                                    </Link>

                                                    <span className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                                        {trip.duration}
                                                    </span>

                                                    <StatusBadge status={trip.status} />

                                                    <span className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                                        {trip.info}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        <motion.div
                                            className="flex flex-col gap-4 md:hidden"
                                            variants={stagger}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                        >
                                            {month.trips.map((trip, i) => (
                                                <motion.div
                                                    key={i}
                                                    variants={fadeUp}
                                                    className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                                    style={{
                                                        background: 'var(--color-white)',
                                                        boxShadow: 'var(--shadow-sm)',
                                                        border: '1px solid var(--color-border-subtle)',
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-sans text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                            {trip.dateStart} – {trip.dateEnd}
                                                        </span>
                                                        <StatusBadge status={trip.status} />
                                                    </div>

                                                    <Link
                                                        href={trip.tourLink}
                                                        className="font-serif text-base font-bold no-underline block mb-2 hover:underline"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        {trip.tour}
                                                    </Link>

                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-xs font-medium"
                                                            style={{
                                                                background: 'var(--color-cream)',
                                                                color: 'var(--color-text)',
                                                            }}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                            {trip.duration}
                                                        </span>
                                                    </div>

                                                    <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                                        {trip.info}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>
                </section>
            </>)}
        </main>
    );
}
