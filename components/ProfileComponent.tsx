"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";


export default function ProfileComponent({
    potensiAlam,
    potensiAgro,
    galleryImages,
}: {
    potensiAlam: { title: string; desc: string; icon: string }[];
    potensiAgro: { title: string; desc: string; image: string }[];
    galleryImages: string[];
}) {

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
    };

    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
    };

    return (
        <main>
            <section className="relative w-full min-h-[600px] h-[70vh] overflow-hidden">
                <Image
                    src="/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg"
                    alt="Desa Manud Jaya"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

                <div className="relative z-2 h-full flex flex-col items-center justify-end text-center pb-16 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="mb-6"
                    >
                        <Image
                            src="/assets/logo-white-2.png"
                            alt="Logo"
                            width={200}
                            height={60}
                            className="mx-auto h-16 w-auto opacity-90"
                        />
                    </motion.div>
                    <motion.h1
                        className="text-white dark:text-gray-300 font-serif font-bold tracking-tight max-w-[700px]"
                        style={{ fontSize: "clamp(32px, 5vw, 64px)", textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Desa Manud Jaya
                    </motion.h1>
                    <motion.p
                        className="text-white/85 dark:text-gray-300 font-sans text-lg max-w-[550px] mt-4 leading-relaxed"
                        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Dataran tinggi ±700–900 mdpl · Perbukitan · Perkebunan Teh · Sungai Alami
                    </motion.p>
                </div>
            </section>

            <section className="py-20 px-6" style={{ background: "var(--color-bg)" }}>
                <div className="max-w-[900px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="text-center"
                    >
                        <motion.span
                            variants={fadeInUp}
                            className="inline-block font-sans text-sm font-semibold tracking-widest uppercase mb-4"
                            style={{ color: "var(--color-primary)" }}
                        >
                            Tentang Desa
                        </motion.span>
                        <motion.h2
                            variants={fadeInUp}
                            className="font-serif font-bold mb-6"
                            style={{ fontSize: "clamp(26px, 3.5vw, 42px)", color: "var(--color-text)" }}
                        >
                            Pesona Alam & Budaya di Kaki Pegunungan
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="font-sans leading-relaxed mx-auto"
                            style={{ fontSize: "clamp(15px, 1.3vw, 18px)", color: "var(--color-text-light)" }}
                        >
                            Desa Manud Jaya terletak di kawasan dataran tinggi kaki pegunungan dengan ketinggian ±700–900 mdpl,
                            dengan lanskap perbukitan, area perkebunan teh, aliran sungai yang masih alami, serta didukung oleh
                            iklim yang sejuk. Kondisi tersebut menjadikan Desa Manud Jaya sangat potensial untuk dikembangkan
                            menjadi desa wisata yang berdaya saing dan berkelanjutan.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {[
                            { value: "700–900", label: "mdpl", sub: "Ketinggian" },
                            { value: "Sejuk", label: "~18–24°C", sub: "Iklim" },
                            { value: "3+", label: "Jenis", sub: "Wisata" },
                            { value: "∞", label: "Keindahan", sub: "Alam" },
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                                style={{
                                    background: "var(--color-white)",
                                    boxShadow: "var(--shadow-sm)",
                                    border: "1px solid var(--color-border-subtle)",
                                }}
                            >
                                <span
                                    className="block font-serif font-bold text-2xl mb-1"
                                    style={{ color: "var(--color-primary)" }}
                                >
                                    {s.value}
                                </span>
                                <span className="block font-sans text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                    {s.label}
                                </span>
                                <span className="block font-sans text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                    {s.sub}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-20 px-6" style={{ background: "var(--color-cream)" }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.span
                            variants={fadeInUp}
                            className="block font-sans text-sm font-semibold tracking-widest uppercase mb-3 text-center"
                            style={{ color: "var(--color-primary)" }}
                        >
                            Potensi Wisata
                        </motion.span>
                        <motion.h2
                            variants={fadeInUp}
                            className="font-serif font-bold text-center mb-4"
                            style={{ fontSize: "clamp(26px, 3.5vw, 42px)", color: "var(--color-text)" }}
                        >
                            Wisata Alam
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="font-sans text-base text-center max-w-[650px] mx-auto mb-14"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Keindahan alam Desa Manud Jaya menawarkan berbagai aktivitas wisata yang menyegarkan jiwa dan raga
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <motion.div
                            className="relative rounded-2xl overflow-hidden min-h-[400px] md:row-span-2"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <Image
                                src="/assets/7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg"
                                alt="Panorama Desa Manud Jaya"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
                                <div>
                                    <h3 className="font-serif text-2xl font-bold text-white dark:text-gray-300 mb-2">Panorama Perbukitan</h3>
                                    <p className="font-sans text-sm text-white/80 max-w-[300px]">
                                        Pemandangan spektakuler dari ketinggian 700–900 mdpl dengan udara segar pegunungan
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:row-span-2"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                        >
                            {potensiAlam.map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    style={{
                                        background: "var(--color-white)",
                                        boxShadow: "var(--shadow-sm)",
                                        border: "1px solid var(--color-border-subtle)",
                                    }}
                                >
                                    <span className="text-3xl mb-4 block">{item.icon}</span>
                                    <h3
                                        className="font-serif text-lg font-bold mb-2"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="font-sans text-sm leading-relaxed"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6" style={{ background: "var(--color-bg)" }}>
                <div className="max-w-[1100px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="text-center"
                    >
                        <motion.span
                            variants={fadeInUp}
                            className="block font-sans text-sm font-semibold tracking-widest uppercase mb-3"
                            style={{ color: "var(--color-primary)" }}
                        >
                            Potensi Wisata
                        </motion.span>
                        <motion.h2
                            variants={fadeInUp}
                            className="font-serif font-bold mb-4"
                            style={{ fontSize: "clamp(26px, 3.5vw, 42px)", color: "var(--color-text)" }}
                        >
                            Agrowisata
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="font-sans text-base max-w-[600px] mx-auto mb-14"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Pengalaman langsung di perkebunan, belajar dari petani lokal, dan nikmati hasil panen segar
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {potensiAgro.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="tour-card rounded-2xl overflow-hidden"
                                style={{
                                    background: "var(--color-white)",
                                    boxShadow: "var(--shadow-md)",
                                }}
                            >
                                <div className="relative h-[240px] overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="tour-card-image object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent h-24" />
                                </div>
                                <div className="p-7">
                                    <span
                                        className="inline-block text-xs font-sans font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
                                        style={{
                                            background: "var(--color-primary)",
                                            color: "white",
                                        }}
                                    >
                                        Agrowisata
                                    </span>
                                    <h3
                                        className="font-serif text-xl font-bold mb-3"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="font-sans text-sm leading-relaxed"
                                        style={{ color: "var(--color-text-light)" }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                className="py-24 px-6 relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)",
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
                    style={{ backgroundImage: "url('/assets/statbg.png')" }}
                />

                <div className="relative z-2 max-w-[1100px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                        >
                            <motion.span
                                variants={fadeInUp}
                                className="block font-sans text-sm font-semibold tracking-widest uppercase mb-3 text-white/70"
                            >
                                Potensi Wisata
                            </motion.span>
                            <motion.h2
                                variants={fadeInUp}
                                className="font-serif font-bold text-white mb-6"
                                style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}
                            >
                                Wisata Budaya — Angklung
                            </motion.h2>
                            <motion.p
                                variants={fadeInUp}
                                className="font-sans text-white/85 leading-relaxed mb-6"
                            >
                                Salah satu potensi wisata budaya yang dapat dikembangkan di Desa Manud Jaya adalah kesenian
                                tradisional alat musik angklung sebagai identitas budaya desa. Angklung tidak hanya berfungsi
                                sebagai alat musik tradisional, tetapi juga sebagai media edukasi, hiburan, serta sarana
                                pelestarian budaya yang memiliki nilai historis dan filosofis yang kuat.
                            </motion.p>
                            <motion.p
                                variants={fadeInUp}
                                className="font-sans text-white/75 leading-relaxed mb-8"
                            >
                                Konsep wisata angklung dikembangkan dalam bentuk wisata edukatif dan interaktif — wisatawan
                                tidak hanya menyaksikan pertunjukan, tetapi juga terlibat langsung dalam proses pembelajaran:
                                mengenal sejarah angklung, proses pembuatannya dari bahan bambu, hingga praktik memainkan
                                angklung secara berkelompok.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                                {["Edukatif", "Interaktif", "Autentik", "Berkelompok"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-block px-4 py-2 rounded-full text-sm font-sans font-medium bg-white/15 text-white border border-white/20 backdrop-blur-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="relative rounded-2xl overflow-hidden min-h-[400px]"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <Image
                                src="/assets/38826e03-83a4-482e-a720-492ac8bfaef5-cover_culture.jpg"
                                alt="Wisata Budaya Angklung"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6" style={{ background: "var(--color-cream)" }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="text-center mb-12"
                    >
                        <motion.span
                            variants={fadeInUp}
                            className="block font-sans text-sm font-semibold tracking-widest uppercase mb-3"
                            style={{ color: "var(--color-primary)" }}
                        >
                            Galeri
                        </motion.span>
                        <motion.h2
                            variants={fadeInUp}
                            className="font-serif font-bold"
                            style={{ fontSize: "clamp(26px, 3.5vw, 42px)", color: "var(--color-text)" }}
                        >
                            Momen di Desa Manud Jaya
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        {galleryImages.map((img, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-400 hover:scale-[1.03] hover:shadow-xl ${i === 0 || i === 5 ? "md:col-span-2 md:row-span-2 min-h-[300px]" : "min-h-[180px]"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Galeri ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-20 px-6" style={{ background: "var(--color-bg)" }}>
                <div className="max-w-[700px] mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="font-serif font-bold mb-4"
                            style={{ fontSize: "clamp(24px, 3vw, 38px)", color: "var(--color-text)" }}
                        >
                            Tertarik Menjelajahi Desa Manud Jaya?
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="font-sans text-base mb-8 leading-relaxed"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Hubungi kami untuk informasi paket wisata, jadwal kunjungan, dan pengalaman wisata yang tak terlupakan
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
                            <Link href="/tours" className="btn-primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                                Lihat Paket Wisata
                            </Link>
                            <Link href="/contact" className="btn-outline">
                                Hubungi Kami
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
