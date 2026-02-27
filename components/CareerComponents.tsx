'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { JobListing } from '@/types/CareerType';

export default function CareerComponents({
    jobs
}: {
    jobs: JobListing[];
}) {
    const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };
    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };
    return (
        <main>
            <section className="relative pt-20 min-h-[460px] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #1B4332 0%, #7C3AED 40%, #2563EB 70%, #059669 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 10s ease infinite',
                    }}
                />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                {['💼', '🌿', '⛰️', '🤝', '🛡️', '✨', '🎯'].map((emoji, i) => (
                    <motion.span
                        key={i}
                        className="absolute text-2xl md:text-3xl select-none pointer-events-none"
                        style={{ left: `${10 + i * 13}%`, top: `${22 + (i % 3) * 22}%` }}
                        animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0], opacity: [0.12, 0.3, 0.12] }}
                        transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.6 }}
                    >
                        {emoji}
                    </motion.span>
                ))}

                <div className="absolute inset-0 bg-black/25" />

                <div className="relative z-2 w-full max-w-[900px] mx-auto px-6 py-16 text-center">
                    <motion.div className="flex items-center justify-center gap-2 mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Link href="/" className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors">Beranda</Link>
                        <span className="text-white/40">›</span>
                        <span className="font-sans text-sm text-white/90">Karir</span>
                    </motion.div>

                    <motion.div className="text-5xl mb-4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.4 }}>
                        💼
                    </motion.div>

                    <motion.h1
                        className="font-serif font-extrabold text-white mb-5"
                        style={{ fontSize: 'clamp(28px, 5vw, 52px)', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        Bergabung dengan Tim Kami
                    </motion.h1>

                    <motion.p
                        className="font-sans text-white/80 max-w-[600px] mx-auto mb-8 leading-relaxed"
                        style={{ fontSize: 'clamp(14px, 1.2vw, 17px)' }}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        Jadilah bagian dari tim yang membangun desa wisata berkelanjutan di kaki pegunungan. Temukan peluang karir yang bermakna bersama kami.
                    </motion.p>

                    <motion.div className="flex flex-wrap justify-center gap-4" initial="hidden" animate="visible" variants={stagger}>
                        {[
                            { value: `${jobs.length}`, label: 'Posisi Terbuka', emoji: '📋' },
                            { value: `${jobs.reduce((a, j) => a + j.slots, 0)}`, label: 'Total Lowongan', emoji: '👥' },
                            { value: 'Full-time', label: 'Tipe Pekerjaan', emoji: '⏰' },
                        ].map((stat) => (
                            <motion.div key={stat.label} variants={fadeUp} className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
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

            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[900px] mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>Posisi yang Tersedia</h2>
                            <p className="font-sans text-sm max-w-[480px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Kami membuka kesempatan bagi individu yang bersemangat untuk berkontribusi dalam pengembangan desa wisata.
                            </p>
                        </motion.div>

                        <div className="flex flex-col gap-5">
                            {jobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    variants={fadeUp}
                                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                                    onClick={() => setSelectedJob(job)}
                                >
                                    <div className="h-1.5 transition-all duration-300 group-hover:h-2" style={{ background: job.gradient }} />

                                    <div className="p-6 md:p-7">
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="text-lg">{job.departmentEmoji}</span>
                                                    <span className="font-sans text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: job.gradient }}>{job.department}</span>
                                                    <span className="font-sans text-[11px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-cream)', color: 'var(--color-text-muted)' }}>{job.type}</span>
                                                </div>
                                                <h3 className="font-serif text-xl font-bold mb-1.5 transition-colors duration-300 group-hover:text-(--color-primary)" style={{ color: 'var(--color-text)' }}>
                                                    {job.title}
                                                </h3>
                                                <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{job.summary}</p>
                                            </div>
                                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold text-emerald-700 bg-emerald-50">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    {job.slots} posisi
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mb-5">
                                            {[
                                                { icon: '📍', value: job.location },
                                                { icon: '💰', value: job.salary },
                                                { icon: '⏰', value: job.workSchedule.split(',')[0] },
                                            ].map((m) => (
                                                <span key={m.value} className="inline-flex items-center gap-1.5 font-sans text-xs" style={{ color: 'var(--color-text-light)' }}>
                                                    <span>{m.icon}</span> {m.value}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {job.requirements.slice(0, 3).map((r, i) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[11px] font-medium" style={{ background: 'var(--color-cream)', color: 'var(--color-text-light)' }}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                    {r.label}
                                                </span>
                                            ))}
                                            {job.requirements.length > 3 && (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full font-sans text-[11px] font-medium" style={{ background: 'var(--color-cream)', color: 'var(--color-text-muted)' }}>
                                                    +{job.requirements.length - 3} lainnya
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <div className="flex items-center gap-4 font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                                <span>📅 Diposting: {job.postedDate}</span>
                                                <span className="font-semibold text-red-500">⏳ Deadline: {job.deadline}</span>
                                            </div>
                                            <button
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg border-none cursor-pointer"
                                                style={{ background: job.gradient }}
                                                onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                                            >
                                                Lihat Detail
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-[900px] mx-auto text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.span variants={fadeUp} className="text-4xl block mb-4">📝</motion.span>
                        <motion.h2 variants={fadeUp} className="font-serif font-bold mb-4" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                            Cara Melamar
                        </motion.h2>
                        <motion.p variants={fadeUp} className="font-sans text-sm mb-10 max-w-[480px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            Ikuti langkah-langkah sederhana berikut untuk melamar posisi yang tersedia.
                        </motion.p>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6" variants={stagger}>
                            {[
                                { step: '01', emoji: '📄', title: 'Siapkan CV', desc: 'Buat CV terbaru dengan foto dan informasi pengalaman kerja yang relevan.' },
                                { step: '02', emoji: '📧', title: 'Kirim via Email', desc: 'Kirim CV dan surat lamaran ke karir@desamanudjaya.id dengan subjek posisi yang dilamar.' },
                                { step: '03', emoji: '🤝', title: 'Wawancara', desc: 'Tim kami akan menghubungi kandidat terpilih untuk sesi wawancara langsung di desa.' },
                            ].map((s) => (
                                <motion.div
                                    key={s.step}
                                    variants={fadeUp}
                                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)' }}
                                >
                                    <span className="absolute top-4 right-4 font-serif text-3xl font-extrabold opacity-8" style={{ color: 'var(--color-primary)' }}>{s.step}</span>
                                    <span className="text-3xl block mb-3">{s.emoji}</span>
                                    <h3 className="font-serif text-base font-bold mb-2" style={{ color: 'var(--color-text)' }}>{s.title}</h3>
                                    <p className="font-sans text-[13px] leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>{s.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="relative overflow-hidden py-16 px-6">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #52B788 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
                <div className="absolute inset-0 bg-black/20" />
                <motion.div className="relative z-2 max-w-[600px] mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <span className="text-4xl block mb-4">📬</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
                        Punya Pertanyaan?
                    </h2>
                    <p className="font-sans text-sm text-white/80 mb-6 leading-relaxed">
                        Hubungi kami untuk informasi lebih lanjut tentang lowongan atau proses rekrutmen.
                    </p>
                    <a href="mailto:karir@desamanudjaya.id" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-[#1B4332] no-underline bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        Kirim Email
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </a>
                </motion.div>
            </section>

            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        className="fixed inset-0 z-99999 flex items-start md:items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSelectedJob(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-3xl"
                            style={{ background: 'var(--color-white)', boxShadow: '0 25px 100px rgba(0,0,0,0.25)' }}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.92, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 30 }}
                            transition={{ duration: 0.3, ease: 'easeOut' as const }}
                        >
                            <div className="relative p-7 pb-6 overflow-hidden" style={{ background: selectedJob.gradient }}>
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border-none cursor-pointer flex items-center justify-center text-white transition-colors duration-200 backdrop-blur-sm"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                                <div className="relative z-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">{selectedJob.departmentEmoji}</span>
                                        <span className="font-sans text-xs font-semibold text-white/90">{selectedJob.department}</span>
                                    </div>
                                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">{selectedJob.title}</h2>
                                    <div className="flex flex-wrap gap-3 text-white/80 font-sans text-xs">
                                        <span>📍 {selectedJob.location}</span>
                                        <span>💰 {selectedJob.salary}</span>
                                        <span>⏰ {selectedJob.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-7 space-y-7">
                                <div>
                                    <h3 className="font-serif text-base font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        <span>📋</span> Deskripsi Pekerjaan
                                    </h3>
                                    <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>{selectedJob.summary}</p>
                                </div>

                                <div>
                                    <h3 className="font-serif text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        <span>📌</span> Tanggung Jawab
                                    </h3>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                        {selectedJob.responsibilities.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-serif text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        <span>✅</span> Persyaratan
                                    </h3>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                        {selectedJob.requirements.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: 'var(--color-primary)' }} />
                                                {r.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-serif text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        <span>🎯</span> Kualifikasi Tambahan
                                    </h3>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                        {selectedJob.qualifications.map((q, i) => (
                                            <li key={i} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                                <span className="text-xs mt-0.5">💡</span>
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-serif text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        <span>🎁</span> Benefit & Fasilitas
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {selectedJob.benefits.map((b, i) => (
                                            <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl font-sans text-sm" style={{ background: 'var(--color-cream)', color: 'var(--color-text)' }}>
                                                <span>{b.emoji}</span>
                                                <span>{b.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-xl p-4" style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}>
                                        <h4 className="font-sans text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>⏰ Jadwal Kerja</h4>
                                        <p className="font-sans text-sm m-0" style={{ color: 'var(--color-text)' }}>{selectedJob.workSchedule}</p>
                                    </div>
                                    <div className="rounded-xl p-4" style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}>
                                        <h4 className="font-sans text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>📧 Kirim Lamaran</h4>
                                        <p className="font-sans text-sm m-0 font-semibold" style={{ color: 'var(--color-primary)' }}>{selectedJob.contact}</p>
                                    </div>
                                </div>

                                <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                                    <span className="text-xl">⚠️</span>
                                    <div>
                                        <div className="font-sans text-sm font-bold text-amber-800">Batas Akhir Lamaran</div>
                                        <div className="font-sans text-sm text-amber-700">{selectedJob.deadline} — segera kirimkan lamaran Anda!</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <a
                                        href={`mailto:${selectedJob.contact}?subject=Lamaran: ${selectedJob.title}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-sans text-sm font-bold text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                        style={{ background: selectedJob.gradient }}
                                    >
                                        Lamar Sekarang
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                    </a>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="px-6 py-3.5 rounded-full font-sans text-sm font-semibold cursor-pointer transition-colors duration-200 bg-transparent"
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
