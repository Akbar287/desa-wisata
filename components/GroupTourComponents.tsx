'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tour, Testimonial } from '@/types/TourType';
import { fmt } from '@/lib/utils';

export default function GroupTourComponents({ tours, testimonials, groupPerks }: { tours: Tour[], testimonials: Testimonial[], groupPerks: { emoji: string; title: string; desc: string }[] }) {
    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };
    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

    return (
        <main>
            <section className="relative pt-20 min-h-[520px] flex items-center overflow-hidden">
                <Image
                    src="/assets/22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg"
                    alt="Group Tour"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(30,64,175,0.7) 0%, rgba(0,0,0,0.6) 50%, rgba(5,150,105,0.8) 100%)' }} />

                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            background: `rgba(${96 + i * 15},${165 + i * 8},${250 - i * 10},0.25)`,
                            width: `${6 + i * 2}px`,
                            height: `${6 + i * 2}px`,
                            left: `${8 + i * 11}%`,
                            top: `${25 + (i % 4) * 16}%`,
                        }}
                        animate={{ y: [0, -18, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.5 }}
                    />
                ))}

                <div className="relative z-2 w-full max-w-[900px] mx-auto px-6 py-16 text-center">
                    <motion.div className="flex items-center justify-center gap-2 mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Link href="/" className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors">Beranda</Link>
                        <span className="text-white/40">›</span>
                        <span className="font-sans text-sm text-white/90">Group Tour</span>
                    </motion.div>

                    <motion.div
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.12))', border: '1px solid rgba(96,165,250,0.3)' }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="text-lg">👥</span>
                        <span className="font-sans text-xs font-semibold text-sky-200 uppercase tracking-widest">Seru &amp; Terjangkau</span>
                    </motion.div>

                    <motion.h1
                        className="font-serif font-extrabold text-white mb-5"
                        style={{ fontSize: 'clamp(28px, 5vw, 52px)', textShadow: '0 4px 30px rgba(0,0,0,0.3)', lineHeight: 1.1 }}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        Group Tour<br />
                        <span style={{ background: 'linear-gradient(135deg, #60A5FA, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lebih Ramai, Lebih Seru!</span>
                    </motion.h1>

                    <motion.p
                        className="font-sans text-white/75 max-w-[560px] mx-auto mb-8 leading-relaxed"
                        style={{ fontSize: 'clamp(14px, 1.2vw, 16px)' }}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        Bergabung dengan wisatawan lain dan temukan teman baru! Harga lebih hemat, pengalaman tak kalah seru. Cocok untuk keluarga, sahabat, atau petualang solo.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial="hidden" animate="visible" variants={stagger}
                    >
                        {[
                            { value: `${tours.length}`, label: 'Paket Tersedia', emoji: '📋' },
                            { value: 'Hemat', label: 'Harga Terjangkau', emoji: '💰' },
                            { value: '10–25', label: 'Peserta/Grup', emoji: '👥' },
                        ].map((stat) => (
                            <motion.div key={stat.label} variants={fadeUp} className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                                <span className="text-xl">{stat.emoji}</span>
                                <div className="text-left">
                                    <span className="font-sans text-sm font-bold text-white block leading-tight">{stat.value}</span>
                                    <span className="font-sans text-[11px] text-white/50">{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[1100px] mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-sans text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ background: 'rgba(59,130,246,0.08)', color: '#2563EB', border: '1px solid rgba(59,130,246,0.15)' }}>
                                🎉 Keunggulan Group Tour
                            </span>
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Mengapa Pilih Group Tour?
                            </h2>
                            <p className="font-sans text-sm max-w-[480px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Liburan lebih menyenangkan bersama orang-orang baru. Hemat biaya, tambah pengalaman!
                            </p>
                        </motion.div>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger}>
                            {groupPerks.map((perk) => (
                                <motion.div
                                    key={perk.title}
                                    variants={fadeUp}
                                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)' }}
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
                                        {perk.emoji}
                                    </div>
                                    <h3 className="font-serif text-base font-bold mb-2" style={{ color: 'var(--color-text)' }}>{perk.title}</h3>
                                    <p className="font-sans text-[13px] leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>{perk.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-[1100px] mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Paket Group Tour
                            </h2>
                            <p className="font-sans text-sm max-w-[480px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Pilih paket wisata berkelompok yang sesuai dengan minat dan budget Anda.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tours.map((tour) => (
                                <motion.div
                                    key={tour.id}
                                    variants={fadeUp}
                                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative cursor-pointer"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                                    onClick={() => setSelectedTour(tour)}
                                >
                                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold text-white backdrop-blur-md" style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
                                        <span>👥</span>
                                        <span>Grup</span>
                                    </div>

                                    <div className="relative h-[200px] overflow-hidden">
                                        <Image src={tour.image} alt={tour.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                            <span className="font-sans text-xs text-white/80 flex items-center gap-1">
                                                📅 {tour.durationDays} hari
                                            </span>
                                            <span className="font-sans text-xs text-white/80 flex items-center gap-1">
                                                📍 {tour.destinations.join(', ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {tour.themes.map((t) => (
                                                <span key={t} className="px-2.5 py-0.5 rounded-full font-sans text-[10px] font-semibold" style={{ background: 'var(--color-cream)', color: 'var(--color-text-muted)' }}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="font-serif text-base font-bold mb-2 transition-colors duration-300 group-hover:text-(--color-primary)" style={{ color: 'var(--color-text)' }}>
                                            {tour.title}
                                        </h3>

                                        <div className="flex flex-col gap-1.5 mb-4">
                                            {tour.highlights.slice(0, 2).map((h, i) => (
                                                <div key={i} className="flex items-center gap-2 font-sans text-xs" style={{ color: 'var(--color-text-light)' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                    {h}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-1.5 mb-4">
                                            <span className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(tour.rating) ? '#F59E0B' : '#E5E7EB'}>
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                            </span>
                                            <span className="font-sans text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>{tour.rating}</span>
                                            <span className="font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>({tour.reviews} ulasan)</span>
                                        </div>

                                        <div className="pt-4 flex items-end justify-between" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <div>
                                                <div className="font-sans text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)' }}>Mulai dari</div>
                                                <div className="font-sans text-xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{fmt(tour.price)}</div>
                                            </div>
                                            <Link href={`/tours/${tour.id}`}>
                                                <button className="py-2.5 px-5 rounded-full font-sans text-xs font-bold text-white border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
                                                    Lihat Detail
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[800px] mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Cara Ikut Group Tour
                            </h2>
                            <p className="font-sans text-sm max-w-[420px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Empat langkah mudah untuk bergabung dengan group tour kami.
                            </p>
                        </motion.div>

                        <div className="flex flex-col gap-0">
                            {[
                                { step: '01', emoji: '📋', title: 'Pilih Paket', desc: 'Jelajahi paket group tour yang tersedia dan pilih destinasi impian Anda.' },
                                { step: '02', emoji: '📝', title: 'Daftar & Bayar', desc: 'Isi formulir pendaftaran dan lakukan pembayaran DP untuk mengamankan slot.' },
                                { step: '03', emoji: '👋', title: 'Meet & Greet', desc: 'Kenalan dengan sesama peserta grup sebelum keberangkatan via grup WhatsApp.' },
                                { step: '04', emoji: '🎉', title: 'Berangkat!', desc: 'Nikmati perjalanan bersama grup dan ciptakan kenangan tak terlupakan.' },
                            ].map((s, i) => (
                                <motion.div key={s.step} variants={fadeUp} className="flex gap-5 items-start">
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-sans text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
                                            {s.emoji}
                                        </div>
                                        {i < 3 && <div className="w-px h-12 my-1" style={{ background: 'linear-gradient(to bottom, #60A5FA, transparent)' }} />}
                                    </div>
                                    <div className={`pb-${i < 3 ? '8' : '0'} pt-1`}>
                                        <span className="font-sans text-[11px] font-bold uppercase tracking-widest block mb-1" style={{ color: '#2563EB' }}>Langkah {s.step}</span>
                                        <h3 className="font-serif text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>{s.title}</h3>
                                        <p className="font-sans text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-[1000px] mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-10">
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Kata Mereka
                            </h2>
                        </motion.div>

                        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5" variants={stagger}>
                            {testimonials.map((t) => (
                                <motion.div
                                    key={t.name}
                                    variants={fadeUp}
                                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)' }}
                                >
                                    <div className="flex gap-0.5 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= t.rating ? '#F59E0B' : '#E5E7EB'}>
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="font-sans text-sm leading-relaxed italic mb-5" style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>
                                        &quot;{t.text}&quot;
                                    </p>
                                    <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                        <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full object-cover" />
                                        <div>
                                            <div className="font-sans text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{t.name}</div>
                                            <div className="font-sans text-[11px]" style={{ color: '#2563EB' }}>{t.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* <section className="relative overflow-hidden py-20 px-6">
                <Image
                    src="/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg"
                    alt="Group Tour CTA"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(30,64,175,0.9) 0%, rgba(5,150,105,0.85) 50%, rgba(30,64,175,0.88) 100%)' }} />

                <motion.div
                    className="relative z-2 max-w-[600px] mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
                        <span>🎉</span>
                        <span className="font-sans text-[11px] font-semibold text-sky-200 uppercase tracking-widest">Slot Terbatas</span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
                        Siap Bertualang Bersama?
                    </h2>
                    <p className="font-sans text-sm text-white/75 mb-7 leading-relaxed max-w-[440px] mx-auto">
                        Jangan sampai ketinggalan! Slot grup terbatas setiap bulannya. Daftar sekarang dan dapatkan harga early bird.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/booking"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold no-underline transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)', color: 'white' }}
                        >
                            Daftar Sekarang
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                        </Link>
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-white no-underline border-2 border-white/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-105"
                        >
                            Tanya via WhatsApp
                        </a>
                    </div>
                </motion.div>
            </section> */}

            <AnimatePresence>
                {selectedTour && (
                    <motion.div
                        className="fixed inset-0 z-99999 flex items-start md:items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
                        onClick={() => setSelectedTour(null)}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-3xl"
                            style={{ background: 'var(--color-white)', boxShadow: '0 25px 100px rgba(0,0,0,0.3)' }}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.92, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative h-[240px] overflow-hidden rounded-t-3xl">
                                <Image src={selectedTour.image} alt={selectedTour.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                                <button
                                    onClick={() => setSelectedTour(null)}
                                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border-none cursor-pointer flex items-center justify-center text-white backdrop-blur-sm transition-colors duration-200"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                                <div className="absolute top-4 left-5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
                                        👥 Group Tour
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-5 right-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-sans text-xs text-white/80">📅 {selectedTour.durationDays} hari</span>
                                        <span className="font-sans text-xs text-white/80">📍 {selectedTour.destinations.join(', ')}</span>
                                    </div>
                                    <h2 className="font-serif text-2xl font-bold text-white">{selectedTour.title}</h2>
                                </div>
                            </div>

                            <div className="p-7 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {selectedTour.themes.map((t) => (
                                        <span key={t} className="px-3 py-1 rounded-full font-sans text-[11px] font-semibold" style={{ background: 'var(--color-cream)', color: 'var(--color-text-muted)' }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div>
                                    <h3 className="font-serif text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        <span>⭐</span> Highlight Perjalanan
                                    </h3>
                                    <div className="flex flex-col gap-2.5">
                                        {selectedTour.highlights.map((h, i) => (
                                            <div key={i} className="flex items-center gap-2.5 font-sans text-sm" style={{ color: 'var(--color-text-light)' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                {h}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        <span>👥</span> Keuntungan Group Tour
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Harga lebih hemat', 'Kenalan baru', 'Pemandu profesional', 'Transportasi bersama', 'Jadwal terjadwal', 'Keseruan bersama'].map((inc, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-medium" style={{ background: 'rgba(59,130,246,0.06)', color: '#1E40AF', border: '1px solid rgba(59,130,246,0.15)' }}>
                                                ✓ {inc}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={s <= Math.round(selectedTour.rating) ? '#F59E0B' : '#E5E7EB'}>
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </span>
                                    <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{selectedTour.rating}</span>
                                    <span className="font-sans text-xs" style={{ color: 'var(--color-text-muted)' }}>({selectedTour.reviews} ulasan)</span>
                                </div>

                                <div className="rounded-xl p-5" style={{ background: 'var(--color-cream)', border: '1px solid rgba(59,130,246,0.15)' }}>
                                    <div className="font-sans text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>Harga Group Tour</div>
                                    <div className="font-sans text-2xl font-extrabold mb-0.5" style={{ color: 'var(--color-primary)' }}>{fmt(selectedTour.price)}</div>
                                    <div className="font-sans text-xs" style={{ color: 'var(--color-text-muted)' }}>per orang · {selectedTour.durationDays} hari</div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href={`/tours/${selectedTour.id}`} className="flex-1 no-underline">
                                        <button className="w-full py-3.5 rounded-full font-sans text-sm font-bold text-white border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
                                            Lihat Detail Lengkap
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setSelectedTour(null)}
                                        className="py-3.5 px-6 rounded-full font-sans text-sm font-semibold cursor-pointer transition-colors duration-200 bg-transparent"
                                        style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border-subtle)' }}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
