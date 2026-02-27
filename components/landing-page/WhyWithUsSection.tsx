"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const reasons = [
    {
        title: "Autentik",
        description: "Pengalaman budaya asli langsung dari masyarakat lokal",
        image: "/assets/withus01.png",
    },
    {
        title: "Berpengalaman",
        description: "Lebih dari 10 tahun menghubungkan wisatawan dengan desa",
        image: "/assets/withus02.png",
    },
    {
        title: "Bersejarah",
        description: "Kunjungi desa-desa dengan warisan sejarah yang kaya",
        image: "/assets/withus03.png",
    },
    {
        title: "Profesional",
        description: "Tim pemandu terlatih dan berpengetahuan luas",
        image: "/assets/withus05.png",
    },
    {
        title: "Petualangan",
        description: "Jelajahi tempat-tempat tersembunyi yang menakjubkan",
        image: "/assets/withus06.png",
    },
    {
        title: "Berkesan",
        description: "Kenangan tak terlupakan di setiap perjalanan",
        image: "/assets/withus07.png",
    },
    {
        title: "Ramah",
        description: "Sambutan hangat dari penduduk desa yang ramah",
        image: "/assets/withus08.png",
    },
    {
        title: "Komunitas",
        description: "Mendukung pemberdayaan ekonomi masyarakat desa",
        image: "/assets/4e5c0835-ea10-41d5-b91d-59bb403cc22b-company01.png",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function WhyWithUsSection() {
    return (
        <section
            id="about-us"
            className="py-24 relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)",
            }}
        >
            {/* Background pattern */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
                style={{ backgroundImage: "url('/assets/statbg.png')" }}
            />

            <div className="relative z-2 max-w-[1200px] mx-auto px-6">
                <motion.h2
                    className="font-serif font-bold text-white text-center mb-3"
                    style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Mengapa Bersama Kami
                </motion.h2>
                <motion.p
                    className="font-sans text-[17px] text-white/80 text-center mb-15"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Alasan mengapa Anda harus merencanakan wisata bersama Discover Desa Wisata
                </motion.p>

                {/* Cards Grid */}
                <motion.div
                    className="grid gap-5"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))" }}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {reasons.map((reason, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                        >
                            <Image
                                src={reason.image}
                                alt={reason.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6">
                                <h3 className="font-serif text-xl font-bold text-white mb-1.5 dark:text-gray-300">
                                    {reason.title}
                                </h3>
                                <p className="font-sans text-[13px] text-white/80 leading-normal dark:text-gray-300">
                                    {reason.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
