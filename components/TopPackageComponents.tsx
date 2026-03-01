'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpecialPackage } from '@/types/TourType';
import { fmt } from '@/lib/utils';

export default function TopPackageComponents({
    packages,
    seasons,
}: {
    packages: SpecialPackage[];
    seasons: string[];
}) {
    const fadeUp = {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };

    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };

    const cardVariant = {
        hidden: { opacity: 0, y: 30, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };
    const [activeSeason, setActiveSeason] = useState('Semua');

    const filtered = activeSeason === 'Semua'
        ? packages
        : packages.filter((p) => p.season === activeSeason);

    function StarRating({ rating }: { rating: number }) {
        return (
            <span className="inline-flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#FBBF24' : '#4B5563'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </span>
        );
    }

    return (
        <main>

            <section className="relative pt-20 min-h-[500px] flex items-center overflow-hidden">

                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #1B4332 0%, #7C3AED 30%, #DC2626 55%, #F59E0B 80%, #059669 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 10s ease infinite',
                    }}
                />


                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 4 + 2,
                            height: Math.random() * 4 + 2,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0, 0.7, 0],
                            scale: [0, 1.2, 0],
                            y: [0, -(Math.random() * 40 + 20)],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: 'easeOut' as const,
                        }}
                    />
                ))}


                {['🌙', '🎄', '🎒', '🏖', '✨', '🎆', '🎊'].map((emoji, i) => (
                    <motion.span
                        key={i}
                        className="absolute text-3xl select-none pointer-events-none"
                        style={{ left: `${12 + i * 13}%`, top: `${20 + (i % 3) * 25}%` }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                            opacity: [0.15, 0.35, 0.15],
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            ease: 'easeInOut' as const,
                            delay: i * 0.7,
                        }}
                    >
                        {emoji}
                    </motion.span>
                ))}


                <div className="absolute inset-0 bg-black/30" />


                <div className="relative z-2 w-full max-w-[900px] mx-auto px-6 py-16 text-center">
                    <motion.div
                        className="flex items-center justify-center gap-2 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link href="/" className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors">Beranda</Link>
                        <span className="text-white/40">›</span>
                        <span className="font-sans text-sm text-white/90">Paket Spesial</span>
                    </motion.div>

                    <motion.div
                        className="text-5xl mb-4"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.15, type: 'spring', bounce: 0.4 }}
                    >
                        🎉
                    </motion.div>

                    <motion.h1
                        className="font-serif font-extrabold text-white mb-5"
                        style={{ fontSize: 'clamp(30px, 5vw, 56px)', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Paket Wisata Spesial
                    </motion.h1>

                    <motion.p
                        className="font-sans text-white/80 max-w-[600px] mx-auto mb-8 leading-relaxed"
                        style={{ fontSize: 'clamp(14px, 1.2vw, 17px)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Paket tur eksklusif untuk momen istimewa — menyambut hari raya, liburan sekolah, natal, tahun baru, dan long weekend. Harga spesial dengan slot terbatas!
                    </motion.p>


                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {[
                            { value: `${packages.length}`, label: 'Paket Spesial', emoji: '🎁' },
                            { value: 'Hemat 25%', label: 'Diskon Terbesar', emoji: '🏷' },
                            { value: 'Terbatas!', label: 'Slot Tersisa', emoji: '⏳' },
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

            {packages.length === 0 ? (
                <section className="py-20 px-6" style={{ background: 'var(--color-bg)' }}>
                    <div className="max-w-[600px] mx-auto text-center">
                        <div className="rounded-2xl p-10" style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                            <div className="text-5xl mb-4">🎁</div>
                            <h2 className="font-serif text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>Paket Spesial Belum Tersedia</h2>
                            <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
                                Saat ini belum ada paket wisata spesial yang tersedia. Silakan kembali lagi nanti atau lihat paket wisata reguler kami.
                            </p>
                            <a href="/tours" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm font-semibold no-underline text-white transition-all duration-300 hover:scale-105" style={{ background: 'var(--color-primary)' }}>
                                Lihat Paket Reguler
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
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            {seasons.map((season) => (
                                <button
                                    key={season}
                                    onClick={() => setActiveSeason(season)}
                                    className="relative px-6 py-4 font-sans text-sm font-semibold border-none bg-transparent cursor-pointer transition-colors duration-300 whitespace-nowrap"
                                    style={{ color: activeSeason === season ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                                >
                                    {season}
                                    {activeSeason === season && (
                                        <motion.div
                                            layoutId="seasonTab"
                                            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full"
                                            style={{ background: 'linear-gradient(90deg, var(--color-primary), #7C3AED)' }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </section>


                <section className="py-14 px-6" style={{ background: 'var(--color-bg)' }}>
                    <div className="max-w-[1200px] mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSeason}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -10 }}
                                variants={stagger}
                            >
                                {filtered.map((pkg) => (
                                    <motion.div key={pkg.id} variants={cardVariant} className="group">
                                        <div
                                            className="rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                            style={{
                                                background: 'var(--color-white)',
                                                boxShadow: 'var(--shadow-md)',
                                                border: '1px solid var(--color-border-subtle)',
                                            }}
                                        >

                                            <div className="relative h-[260px] overflow-hidden">
                                                <Image
                                                    src={pkg.image}
                                                    alt={pkg.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />

                                                <div
                                                    className="absolute inset-0 opacity-60 group-hover:opacity-70 transition-opacity duration-500"
                                                    style={{ background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%), ${pkg.gradient}`, mixBlendMode: 'multiply' }}
                                                />


                                                <motion.span
                                                    className="absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-sans font-bold text-white uppercase tracking-wider backdrop-blur-sm flex items-center gap-2"
                                                    style={{ background: pkg.gradient }}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <span className="text-sm">{pkg.badgeEmoji}</span>
                                                    {pkg.badge}
                                                </motion.span>


                                                <motion.span
                                                    className="absolute top-4 right-4 px-3 py-2 rounded-full text-xs font-sans font-extrabold text-white"
                                                    style={{ background: 'linear-gradient(135deg, #DC2626, #F97316)' }}
                                                    animate={{ scale: [1, 1.08, 1] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
                                                >
                                                    -{pkg.discount}%
                                                </motion.span>


                                                <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-sans font-bold text-white bg-black/50 backdrop-blur-sm flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                                    Sisa {pkg.limitedSlots} slot
                                                </span>


                                                <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-[11px] font-sans font-medium text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 flex items-center gap-1">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                    {pkg.dateRange}
                                                </span>
                                            </div>


                                            <div className="p-6">

                                                <h3
                                                    className="font-serif text-xl font-bold mb-2 leading-snug transition-colors duration-300 group-hover:text-(--color-primary)"
                                                    style={{ color: 'var(--color-text)' }}
                                                >
                                                    {pkg.title}
                                                </h3>

                                                <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
                                                    {pkg.subtitle}
                                                </p>


                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-[11px] font-medium" style={{ background: 'var(--color-cream)', color: 'var(--color-text)' }}>
                                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                        {pkg.durationDays} hari
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-[11px] font-medium" style={{ background: 'var(--color-cream)', color: 'var(--color-text)' }}>
                                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                                                        {pkg.groupSize}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <StarRating rating={pkg.rating} />
                                                        <span className="font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{pkg.rating} ({pkg.reviews})</span>
                                                    </span>
                                                </div>


                                                <div className="grid grid-cols-2 gap-2 mb-5">
                                                    {pkg.highlights.map((h, i) => (
                                                        <span key={i} className="flex items-start gap-1.5 font-sans text-[12px] leading-snug" style={{ color: 'var(--color-text-light)' }}>
                                                            <span className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }}>
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                            </span>
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>


                                                <div
                                                    className="flex items-center justify-between pt-5"
                                                    style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                                                >
                                                    <div>
                                                        <div className="font-sans text-[11px] line-through" style={{ color: 'var(--color-text-muted)' }}>
                                                            {fmt(pkg.originalPrice)}
                                                        </div>
                                                        <div className="font-sans text-xl font-extrabold" style={{ color: 'var(--color-primary)' }}>
                                                            {fmt(pkg.price)}
                                                        </div>
                                                        <div className="font-sans text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                                            /orang
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/tours/${pkg.id}`}
                                                        className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm font-bold text-white no-underline transition-all duration-300 hover:gap-3 hover:shadow-xl hover:scale-105"
                                                        style={{ background: pkg.gradient }}
                                                    >
                                                        Pesan Sekarang
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/btn:translate-x-0.5"><polyline points="9 18 15 12 9 6" /></svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>


                        {filtered.length === 0 && (
                            <motion.div
                                className="text-center py-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <span className="text-5xl block mb-4">🔍</span>
                                <p className="font-serif text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Belum ada paket untuk musim ini</p>
                                <p className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>Coba lihat kategori lainnya</p>
                            </motion.div>
                        )}
                    </div>
                </section>


                <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                    <div className="max-w-[900px] mx-auto text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                        >
                            <motion.span variants={fadeUp} className="text-4xl block mb-4">💎</motion.span>
                            <motion.h2
                                variants={fadeUp}
                                className="font-serif font-bold mb-4"
                                style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: 'var(--color-text)' }}
                            >
                                Kenapa Paket Spesial?
                            </motion.h2>
                            <motion.p
                                variants={fadeUp}
                                className="font-sans text-sm leading-relaxed mb-10 max-w-[600px] mx-auto"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Paket-paket ini dirancang khusus untuk momen istimewa dengan pengalaman unik yang tidak tersedia di paket reguler.
                            </motion.p>

                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                                variants={stagger}
                            >
                                {[
                                    { emoji: '🏷', title: 'Harga Spesial', desc: 'Diskon hingga 25% hanya untuk musim tertentu' },
                                    { emoji: '🎭', title: 'Pengalaman Eksklusif', desc: 'Aktivitas khusus yang tidak ada di paket reguler' },
                                    { emoji: '👥', title: 'Grup Terbatas', desc: 'Slot sedikit untuk pengalaman lebih intim & personal' },
                                ].map((item) => (
                                    <motion.div
                                        key={item.title}
                                        variants={fadeUp}
                                        className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        style={{
                                            background: 'var(--color-white)',
                                            boxShadow: 'var(--shadow-sm)',
                                            border: '1px solid var(--color-border-subtle)',
                                        }}
                                    >
                                        <span className="text-3xl block mb-3">{item.emoji}</span>
                                        <h3 className="font-serif text-base font-bold mb-2" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                                        <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* <section className="relative overflow-hidden py-16 px-6">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #1B4332 0%, #7C3AED 50%, #DC2626 100%)',
                        backgroundSize: '300% 300%',
                        animation: 'gradientShift 8s ease infinite',
                    }}
                />
                <div className="absolute inset-0 bg-black/20" />

                <motion.div
                    className="relative z-2 max-w-[600px] mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-4xl block mb-4">🚀</span>
                    <h2 className="font-serif text-2xl font-bold text-white mb-3" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
                        Jangan Sampai Kehabisan!
                    </h2>
                    <p className="font-sans text-sm text-white/80 mb-6 leading-relaxed">
                        Slot paket spesial sangat terbatas. Pesan sekarang dan amankan tempat Anda untuk liburan tak terlupakan.
                    </p>
                    <Link
                        href="/tours"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-sans text-sm font-bold text-[#1B4332] no-underline bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        Lihat Semua Paket
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                </motion.div>
            </section> */}
            </>)}
        </main>
    );
}
