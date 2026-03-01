"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { WaveDividerTop, VineDecoration } from "./NatureOverlay";

type StatsData = {
    tourCount: number;
    testimonialCount: number;
    bookingCount: number;
    destinationCount: number;
};

const staticImages = [
    "/assets/withus01.png",
    "/assets/withus02.png",
    "/assets/withus03.png",
    "/assets/withus05.png",
    "/assets/withus06.png",
    "/assets/withus07.png",
];

function formatStat(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K+`;
    return `${n}+`;
}

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

export default function StatsSection({ stats }: { stats: StatsData }) {
    const [expandInfo, setExpandInfo] = React.useState<boolean>(false);

    const statItems = [
        { number: formatStat(stats.destinationCount), label: "Destinasi Wisata", image: staticImages[0] },
        { number: formatStat(stats.bookingCount), label: "Wisatawan Bahagia", image: staticImages[1] },
        { number: "2026", label: "Pilihan Terbaik", image: staticImages[2] },
        { number: formatStat(stats.tourCount), label: "Paket Wisata", image: staticImages[3] },
        { number: formatStat(stats.testimonialCount), label: "Ulasan Positif", image: staticImages[4] },
        { number: "10+", label: "Tahun Beroperasi", image: staticImages[5] },
    ];

    return (
        <section
            id="about"
            className="section-earthy-green py-24 px-6 overflow-hidden"
        >
            <WaveDividerTop fill="#E8F5E9" />
            <VineDecoration position="left" />
            <VineDecoration position="right" />
            <div className="max-w-[1100px] mx-auto relative z-[3]">
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
                    Desa Manuk Jaya Penuh Pesona di 2026
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
                        expandInfo ? "Desa Manuk Jaya menawarkan pengalaman wisata yang otentik dan berbeda. Perpaduan unik antara budaya, alam, dan sejarah. Jelajahi sawah terasering, perbukitan hijau, pantai tersembunyi, dan kenali kehidupan masyarakat lokal yang hangat." : "Ingin pengalaman wisata yang otentik dan berbeda? Desa Manuk Jaya menawarkan perpaduan unik antara budaya, alam, dan sejarah..."
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
                    {statItems.map((stat, i) => (
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
