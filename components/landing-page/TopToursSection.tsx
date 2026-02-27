"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const tours = [
    {
        title: "Pesona Desa Wisata Penglipuran",
        badge: "Grup",
        highlights: [
            "Arsitektur rumah adat Bali yang menakjubkan",
            "Interaksi dengan masyarakat lokal",
            "Keindahan alam pegunungan Bali",
        ],
        duration: "3 hari",
        price: "Rp 2.500.000",
        image: "/assets/e50bd774-982a-4206-b5b9-3ace3c9c8f27-gobi_gallery1.jpg",
    },
    {
        title: "Jelajah Desa Wae Rebo",
        badge: "Grup",
        highlights: [
            "Rumah adat Mbaru Niang kerucut",
            "Perjalanan trekking melalui hutan tropis",
            "Budaya dan tradisi Manggarai",
        ],
        duration: "4 hari",
        price: "Rp 3.800.000",
        image: "/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg",
    },
    {
        title: "Desa Wisata Nglanggeran",
        badge: "Privat",
        highlights: [
            "Gunung Api Purba Nglanggeran",
            "Wisata alam dan agrowisata buah",
            "Kesenian tradisional Jawa",
        ],
        duration: "2 hari",
        price: "Rp 1.200.000",
        image: "/assets/38826e03-83a4-482e-a720-492ac8bfaef5-cover_culture.jpg",
    },
    {
        title: "Desa Wisata Trunyan & Kintamani",
        badge: "Grup",
        highlights: [
            "Pemakaman kuno unik di Trunyan",
            "Pemandangan Danau Batur yang memukau",
            "Kehidupan masyarakat Bali Aga",
        ],
        duration: "5 hari",
        price: "Rp 4.200.000",
        image: "/assets/7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg",
    },
    {
        title: "Desa Sade Lombok",
        badge: "Privat",
        highlights: [
            "Rumah adat suku Sasak",
            "Tenun tradisional khas Lombok",
            "Pantai selatan yang eksotis",
        ],
        duration: "3 hari",
        price: "Rp 2.800.000",
        image: "/assets/9b4e5aa3-5ec7-4c73-b146-e0f45b9eff94-mistakes_Gallery_road.jpg",
    },
    {
        title: "Desa Wisata Osing Banyuwangi",
        badge: "Grup",
        highlights: [
            "Budaya suku Osing yang unik",
            "Festival Gandrung Sewu",
            "Kawah Ijen & pantai timur",
        ],
        duration: "4 hari",
        price: "Rp 3.500.000",
        image: "/assets/22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg",
    },
];

const cardVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
    }),
};

export default function TopToursSection() {
    return (
        <section
            id="tours"
            className="py-24"
            style={{ background: "var(--color-bg)" }}
        >
            <div className="max-w-[1320px] mx-auto px-6">
                {/* Heading */}
                <motion.h2
                    className="font-serif font-bold text-center mb-12"
                    style={{
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        color: "var(--color-text)",
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Paket Wisata Unggulan
                </motion.h2>

                {/* Scrollable Cards */}
                <motion.div
                    className="hide-scrollbar flex gap-6 overflow-x-auto pb-5"
                    style={{ scrollSnapType: "x mandatory" }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {tours.map((tour, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={cardVariants}
                            className="tour-card min-w-[340px] max-w-[340px] rounded-2xl overflow-hidden shrink-0"
                            style={{
                                background: "var(--color-white)",
                                boxShadow: "var(--shadow-sm)",
                                border: "1px solid var(--color-border-subtle)",
                                scrollSnapAlign: "start",
                            }}
                        >
                            {/* Image */}
                            <div className="relative h-[200px] overflow-hidden">
                                <Image
                                    src={tour.image}
                                    alt={tour.title}
                                    fill
                                    className="tour-card-image object-cover"
                                />
                                <span
                                    className="absolute top-3 left-3 text-white px-3.5 py-1 rounded-full text-xs font-semibold font-sans"
                                    style={{
                                        background:
                                            tour.badge === "Privat"
                                                ? "var(--color-primary)"
                                                : "var(--color-accent)",
                                    }}
                                >
                                    {tour.badge}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="px-5.5 py-5 pb-6">
                                <h3
                                    className="font-serif text-lg font-bold mb-3.5 leading-snug"
                                    style={{ color: "var(--color-text)" }}
                                >
                                    {tour.title}
                                </h3>
                                <ul className="flex flex-col gap-2 list-none p-0 mb-4.5">
                                    {tour.highlights.map((h, j) => (
                                        <li
                                            key={j}
                                            className="text-[13px] font-sans flex items-start gap-2 leading-snug"
                                            style={{ color: "var(--color-text-muted)" }}
                                        >
                                            <span className="shrink-0" style={{ color: "var(--color-primary)" }}>•</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>

                                {/* Footer */}
                                <div
                                    className="flex items-center justify-between pt-3.5"
                                    style={{ borderTop: "1px solid var(--color-border-subtle)" }}
                                >
                                    <span
                                        className="text-[13px] font-sans"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        {tour.duration} &nbsp;•&nbsp; mulai {tour.price}
                                    </span>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center gap-1.5 font-semibold text-sm font-sans no-underline transition-all duration-300 hover:gap-2.5"
                                        style={{ color: "var(--color-accent)" }}
                                    >
                                        Selengkapnya
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All */}
                <div className="text-center mt-12">
                    <Link href="/tours" className="btn-outline">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        Lihat Semua Paket Wisata
                    </Link>
                </div>
            </div>
        </section>
    );
}
