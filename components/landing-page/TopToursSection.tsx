"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WaveDividerTop } from "./NatureOverlay";

type TourItem = {
    id: number;
    title: string;
    type: string;
    durationDays: number;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
    highlights: { text: string }[];
};

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const cardVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
    }),
};

export default function TopToursSection({ tours }: { tours: TourItem[] }) {
    if (!tours || tours.length === 0) return null;

    return (
        <section
            id="tours"
            className="section-earthy-warm py-24 overflow-hidden"
        >
            <WaveDividerTop fill="#FFF3E0" />
            <div className="max-w-[1320px] mx-auto px-6 relative z-[3]">
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
                            key={tour.id}
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
                                            tour.type === "PRIVATE"
                                                ? "var(--color-primary)"
                                                : "var(--color-accent)",
                                    }}
                                >
                                    {tour.type === "PRIVATE" ? "Privat" : "Grup"}
                                </span>

                                {/* Rating */}
                                {tour.rating > 0 && (
                                    <span className="absolute top-3 right-3 text-white px-2.5 py-1 rounded-full text-xs font-semibold font-sans bg-black/40 backdrop-blur-sm flex items-center gap-1">
                                        ⭐ {tour.rating.toFixed(1)}
                                    </span>
                                )}
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
                                            {h.text}
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
                                        {tour.durationDays} hari &nbsp;•&nbsp; mulai {fmt(tour.price)}
                                    </span>
                                    <Link
                                        href={`/tours/${tour.id}`}
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
