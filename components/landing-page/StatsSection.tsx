"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const stats = [
    {
        number: "150+",
        label: "Desa Wisata",
        image: "/assets/withus01.png",
    },
    {
        number: "50K+",
        label: "Wisatawan Bahagia",
        image: "/assets/withus02.png",
    },
    {
        number: "2025",
        label: "Pilihan Terbaik",
        image: "/assets/withus03.png",
    },
    {
        number: "10+",
        label: "Tahun Beroperasi",
        image: "/assets/withus05.png",
    },
    {
        number: "80+",
        label: "Paket Wisata",
        image: "/assets/withus06.png",
    },
    {
        number: "50K+",
        label: "Wisatawan Puas",
        image: "/assets/withus07.png",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function StatsSection() {
    const [expandInfo, setExpandInfo] = React.useState<boolean>(false);
    return (
        <section
            id="about"
            className="py-24 px-6"
            style={{ background: "var(--color-bg)" }}
        >
            <div className="max-w-[1100px] mx-auto">
                {/* Heading */}
                <motion.h2
                    className="font-serif font-bold text-center mb-5"
                    style={{
                        fontSize: "clamp(28px, 3.5vw, 44px)",
                        color: "var(--color-text)",
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Indonesia Penuh Pesona di 2026
                </motion.h2>

                {/* Description */}
                <motion.p
                    className="font-sans text-center max-w-[750px] mx-auto mb-6 leading-relaxed"
                    style={{
                        fontSize: "clamp(15px, 1.3vw, 18px)",
                        color: "var(--color-text-light)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    {
                        expandInfo ? "Ingin pengalaman wisata yang otentik dan berbeda? Desa wisata Indonesia menawarkan perpaduan unik antara budaya, alam, dan sejarah. Jelajahi sawah terasering, perbukitan hijau, pantai tersembunyi, dan kenali kehidupan masyarakat lokal yang hangat." : "Ingin pengalaman wisata yang otentik dan berbeda? Desa wisata Indonesia menawarkan perpaduan unik antara budaya, alam, dan sejarah..."
                    }
                </motion.p>

                {/* Expand button */}
                <div className="text-center mb-15">
                    <button
                        className="w-11 h-11 rounded-full border-2 bg-transparent cursor-pointer text-xl inline-flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                            borderColor: "var(--color-accent)",
                            color: "var(--color-accent)",
                        }}
                        onClick={() => setExpandInfo(!expandInfo)}
                    >
                        {expandInfo ? "-" : "+"}
                    </button>
                </div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-3 gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="relative rounded-xl overflow-hidden aspect-square cursor-pointer transition-transform duration-400 hover:scale-[1.03]"
                        >
                            <Image
                                src={stat.image}
                                alt={stat.label}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent flex flex-col justify-end p-5">
                                <span
                                    className="font-serif font-bold text-white leading-tight dark:text-gray-300"
                                    style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
                                >
                                    {stat.number}
                                </span>
                                <span className="font-sans text-sm text-white/85 font-medium mt-1 dark:text-gray-300">
                                    {stat.label}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
