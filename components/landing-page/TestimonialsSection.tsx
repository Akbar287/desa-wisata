"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const testimonials = [
    {
        text: "Pengalaman luar biasa di Desa Penglipuran! Kami disambut dengan upacara tradisional, belajar membuat canang sari, dan tinggal di rumah adat Bali. Pemandu kami, Pak Wayan, sangat berpengetahuan tentang sejarah dan budaya desa. Makanan lokal yang disajikan sangat autentik dan lezat. Highly recommended!",
        name: "Ayrein Nisya",
        location: "Jakarta, Indonesia",
        avatar: "/assets/default-avatar-2020-13.jpg",
    },
    {
        text: "Tur ke Wae Rebo adalah highlight dari liburan kami. Trekking melalui hutan tropis yang menakjubkan, dan saat tiba di desa di atas awan, rasanya seperti masuk ke dunia lain. Rumah adat Mbaru Niang sangat unik. Tim Discover Desa Wisata mengatur segalanya dengan sangat profesional.",
        name: "Irma Nur",
        location: "Surabaya, Indonesia",
        avatar: "/assets/default-avatar-2020-25.jpg",
    },
    {
        text: "Kami mengambil tur keluarga 5 hari ke desa-desa di Yogyakarta. Anak-anak sangat senang belajar membatik dan menanam padi. Yang paling berkesan adalah keramahan penduduk desa. Mereka benar-benar menyambut kami sebagai bagian dari keluarga mereka. Terima kasih Discover Desa Wisata!",
        name: "Akbar M et al.",
        location: "Bandung, Indonesia",
        avatar: "/assets/default-avatar-2020-3.jpg",
    },
    {
        text: "Private tour ke Desa Sade di Lombok sangat berkesan. Melihat langsung proses tenun tradisional suku Sasak, arsitektur rumah adat yang unik, dan pemandangan alam yang memukau. Pemandu kami sangat informatif dan akomodatif. Worth every penny!",
        name: "Ahmad Fauzi",
        location: "Medan, Indonesia",
        avatar: "/assets/default-avatar-2020-49.jpg",
    },
    {
        text: "Tour 4 hari ke kawasan Nglanggeran luar biasa! Gunung Api Purba sungguh menakjubkan, air terjun tersembunyi, dan sunset dari puncak sangat indah. Agrowisata buah-buahan segar jadi bonus yang menyenangkan. Organisasinya rapi dari awal sampai akhir.",
        name: "Dewi Lestari",
        location: "Semarang, Indonesia",
        avatar: "/assets/default-avatar-2020-54.jpg",
    },
    {
        text: "Saya solo traveler yang bergabung grup tour ke Banyuwangi. Selain Kawah Ijen yang menakjubkan, kunjungan ke desa Osing adalah pengalaman tak terduga yang luar biasa. Budaya mereka sangat unik dan berbeda dari Jawa pada umumnya. Teman-teman satu grup juga sangat menyenangkan!",
        name: "Carlos Adrianto",
        location: "Makassar, Indonesia",
        avatar: "/assets/default-avatar-2020-67.jpg",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function TestimonialsSection() {
    return (
        <section
            className="py-24 px-6"
            style={{ background: "var(--color-cream)" }}
        >
            <div className="max-w-[1200px] mx-auto">
                <motion.h2
                    className="font-serif font-bold text-center mb-3"
                    style={{
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        color: "var(--color-text)",
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Cerita dari Wisatawan Kami
                </motion.h2>
                <motion.p
                    className="font-sans text-[17px] text-center mb-15"
                    style={{ color: "var(--color-text-muted)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Pengalaman asli dari para wisatawan yang telah menjelajahi desa wisata bersama kami
                </motion.p>

                {/* Masonry Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            className="rounded-2xl p-8 pb-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-lg)"
                            style={{
                                background: "var(--color-white)",
                                boxShadow: "var(--shadow-sm)",
                                border: "1px solid var(--color-border-subtle)",
                            }}
                        >
                            {/* Quote icon */}
                            <div
                                className="text-4xl font-serif leading-none mb-4 font-bold"
                                style={{ color: "var(--color-accent)" }}
                            >
                                ❝
                            </div>

                            {/* Text */}
                            <p
                                className="font-sans text-sm leading-relaxed mb-6"
                                style={{ color: "var(--color-text-light)" }}
                            >
                                {t.text}
                            </p>

                            {/* Author */}
                            <div className="text-center">
                                <p
                                    className="font-sans text-[15px] font-bold mb-1"
                                    style={{ color: "var(--color-accent)" }}
                                >
                                    {t.name}
                                </p>
                                <p
                                    className="font-sans text-[13px] mb-3"
                                    style={{ color: "var(--color-text-muted)" }}
                                >
                                    {t.location}
                                </p>
                                <div
                                    className="w-14 h-14 rounded-full overflow-hidden mx-auto p-[3px]"
                                    style={{ border: "3px dashed var(--color-accent-light)" }}
                                >
                                    <Image
                                        src={t.avatar}
                                        alt={t.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link href="/testimonials" className="btn-outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        Lihat semua ulasan
                    </Link>
                </div>
            </div>
        </section>
    );
}
