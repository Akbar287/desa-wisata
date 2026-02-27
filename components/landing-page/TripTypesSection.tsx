"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const tripTypes = [
    {
        href: "/private-tours",
        title: "Wisata Privat",
        badge: "Privat",
        image: "/assets/2aa2ebcd-473f-4f20-ac68-2572e4f22352-journey01.png",
        features: [
            "Pilih tanggal sesuai keinginan Anda",
            "Pemandu dan kendaraan eksklusif",
            "Perhatian personal untuk grup Anda",
            "Fleksibel dalam waktu dan jadwal",
            "Pilihan layanan sesuai kebutuhan",
            "Cocok untuk keluarga dan sahabat",
        ],
    },
    {
        href: "/group-tours",
        title: "Bergabung Grup",
        badge: "Grup",
        image: "/assets/41effc39-a450-4090-976e-d306cb31c1e4-journey02.png",
        features: [
            "Temukan yang terbaik dari desa wisata",
            "Lebih hemat dan menyenangkan bersama",
            "Lebih mudah dan aman dalam kelompok",
            "Tanpa repot merencanakan sendiri",
            "Bertemu teman baru dari berbagai daerah",
            "Cocok untuk solo traveler dan grup kecil",
        ],
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.2, ease: "easeOut" as const },
    }),
};

export default function TripTypesSection() {
    return (
        <section
            className="py-24 px-6"
            style={{ background: "var(--color-bg)" }}
        >
            <div className="max-w-[1200px] mx-auto">
                {/* Heading */}
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
                    Temukan cara terbaik menjelajahi Desa Wisata
                </motion.h2>
                <motion.p
                    className="font-sans text-[17px] text-center mb-15"
                    style={{ color: "var(--color-text-muted)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Nikmati 2 cara untuk Discover Desa Wisata
                </motion.p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tripTypes.map((trip, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Link
                                href={trip.href}
                                className="tour-card block rounded-2xl overflow-hidden"
                                style={{
                                    background: "var(--color-white)",
                                    boxShadow: "var(--shadow-md)",
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-[280px] overflow-hidden">
                                    <Image
                                        src={trip.image}
                                        alt={trip.title}
                                        fill
                                        className="tour-card-image object-cover"
                                    />
                                    {/* Badge */}
                                    <span
                                        className="absolute top-4 left-4 text-white px-4.5 py-1.5 rounded-full text-[13px] font-semibold font-sans tracking-wide"
                                        style={{ background: "var(--color-accent)" }}
                                    >
                                        {trip.badge}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-7 pb-8">
                                    <h3
                                        className="font-serif text-2xl font-bold mb-5"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        {trip.title}
                                    </h3>
                                    <ul className="flex flex-col gap-3 list-none p-0 m-0">
                                        {trip.features.map((feature, j) => (
                                            <li
                                                key={j}
                                                className="flex items-start gap-3 font-sans text-[15px] leading-normal"
                                                style={{ color: "var(--color-text-light)" }}
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="var(--color-primary)"
                                                    strokeWidth="2.5"
                                                    className="shrink-0 mt-0.5"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Description */}
                <motion.p
                    className="font-sans text-base text-center max-w-[700px] mx-auto mt-12 leading-relaxed"
                    style={{ color: "var(--color-text-light)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Kami telah membantu ribuan wisatawan menikmati petualangan tak
                    terlupakan di desa-desa wisata Indonesia, dengan keahlian dan
                    semangat yang tulus.
                </motion.p>
            </div>
        </section>
    );
}
