"use client";

import { motion } from "framer-motion";
import { WaveDividerTop, VineDecoration } from "./NatureOverlay";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

export default function ProfilDesaSection() {
    return (
        <section className="section-earthy-warm py-24 overflow-hidden relative">
            <WaveDividerTop fill="#FFF3E0" />
            <VineDecoration position="left" />
            <VineDecoration position="right" />

            <div className="max-w-[1320px] mx-auto px-6 relative z-3">
                {/* ── Header ─────────────────────────────── */}
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                >
                    <motion.span
                        variants={fadeUp}
                        className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] mb-4 px-5 py-2 rounded-full"
                        style={{ color: "var(--color-primary)", background: "var(--color-cream)", letterSpacing: "0.25em" }}
                    >
                        Tentang Kami
                    </motion.span>
                    <motion.h2
                        variants={fadeUp}
                        className="font-serif font-extrabold mb-5"
                        style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "var(--color-text)", lineHeight: 1.15 }}
                    >
                        Desa Wisata Manud Jaya
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="font-sans max-w-[640px] mx-auto leading-relaxed"
                        style={{ color: "var(--color-text-muted)", fontSize: "clamp(14px, 1.1vw, 16px)", lineHeight: 1.8 }}
                    >
                        Terletak di dataran tinggi yang dikelilingi perkebunan teh dan hutan tropis, Desa
                        Wisata Manud Jaya menawarkan pengalaman wisata alam, budaya, dan
                        petualangan yang tak terlupakan.
                    </motion.p>
                </motion.div>

                {/* ── Profil & Visi Misi ──────────────────── */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                >
                    {/* Left: Profil & Sejarah */}
                    <motion.div variants={fadeUp}>
                        <h3
                            className="font-serif font-bold mb-6"
                            style={{ fontSize: "clamp(22px, 2.5vw, 30px)", color: "var(--color-text)" }}
                        >
                            Profil &amp; Sejarah Desa
                        </h3>
                        <p
                            className="font-sans text-[15px] leading-relaxed mb-5"
                            style={{ color: "var(--color-text-light)", lineHeight: 1.85 }}
                        >
                            Desa Manud Jaya telah berdiri sejak ratusan tahun lalu, dibangun oleh para pendahulu
                            yang mencintai alam dan kearifan lokal. Kini, desa ini berkembang menjadi destinasi
                            wisata unggulan yang memadukan keindahan alam, budaya Sunda, dan petualangan
                            modern.
                        </p>
                        <p
                            className="font-sans text-[15px] leading-relaxed"
                            style={{ color: "var(--color-text-light)", lineHeight: 1.85 }}
                        >
                            Dengan ketinggian lebih dari 1.200 mdpl, udara sejuk pegunungan dan panorama kebun
                            teh menjadi daya tarik utama yang memikat ribuan pengunjung setiap tahunnya.
                        </p>
                    </motion.div>

                    {/* Right: Visi & Misi */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-5">
                        {/* Visi Card */}
                        <div
                            className="rounded-2xl p-7 transition-shadow duration-300 hover:shadow-lg"
                            style={{
                                background: "var(--color-white)",
                                border: "1px solid var(--color-border-subtle)",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="6" />
                                        <circle cx="12" cy="12" r="2" />
                                    </svg>
                                </div>
                                <h4 className="font-serif text-lg font-bold" style={{ color: "var(--color-text)" }}>
                                    Visi
                                </h4>
                            </div>
                            <p className="font-sans text-sm leading-relaxed m-0" style={{ color: "var(--color-text-light)", lineHeight: 1.75 }}>
                                Menjadi desa wisata terdepan yang berkelanjutan, melestarikan alam dan
                                budaya untuk generasi mendatang.
                            </p>
                        </div>

                        {/* Misi Card */}
                        <div
                            className="rounded-2xl p-7 transition-shadow duration-300 hover:shadow-lg"
                            style={{
                                background: "var(--color-white)",
                                border: "1px solid var(--color-border-subtle)",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: "linear-gradient(135deg, #B56727, #E09F3E)" }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 16v-4M12 8h.01" />
                                    </svg>
                                </div>
                                <h4 className="font-serif text-lg font-bold" style={{ color: "var(--color-text)" }}>
                                    Misi
                                </h4>
                            </div>
                            <p className="font-sans text-sm leading-relaxed m-0" style={{ color: "var(--color-text-light)", lineHeight: 1.75 }}>
                                Mengembangkan potensi wisata berbasis komunitas, meningkatkan
                                kesejahteraan masyarakat, dan menjaga kelestarian lingkungan.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* ── Lokasi & Akses Wisata ───────────────── */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-3">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <h3 className="font-serif font-bold" style={{ fontSize: "clamp(18px, 2vw, 24px)", color: "var(--color-text)" }}>
                            Lokasi &amp; Akses Wisata
                        </h3>
                    </motion.div>

                    <motion.p
                        variants={fadeUp}
                        className="font-sans text-sm mb-5"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        Jl. Desa Wisata Manud Jaya, Kecamatan Pangalengan, Kabupaten Bandung, Jawa Barat 40378
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="rounded-2xl overflow-hidden"
                        style={{
                            border: "1px solid var(--color-border-subtle)",
                            boxShadow: "var(--shadow-md)",
                        }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126749.67899595!2d107.45!3d-7.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b5b5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2sKabupaten%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi Desa Wisata Manud Jaya"
                            className="block w-full"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
