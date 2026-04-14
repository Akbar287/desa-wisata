"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WaveDividerTop, VineDecoration } from "./NatureOverlay";

type TestimonialItem = {
    id: number;
    name: string;
    avatar: string | null;
    role: string;
    text: string;
    rating: number;
};

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

function formatRatingNumber(value: number): string {
    return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => {
                const fill = Math.max(0, Math.min(1, rating - (s - 1)));
                return (
                    <span
                        key={s}
                        className="relative inline-block overflow-hidden"
                        style={{ width: size, height: size }}
                    >
                        <svg width={size} height={size} viewBox="0 0 24 24" fill="#111111">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fill * 100}%` }}
                        >
                            <svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </span>
                    </span>
                );
            })}
        </span>
    );
}

export default function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section
            className="section-earthy-cream py-24 px-6 overflow-hidden"
        >
            <WaveDividerTop fill="#F5EDE3" />
            <VineDecoration position="right" />
            <div className="max-w-[1200px] mx-auto relative z-3">
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
                    {testimonials.map((t) => (
                        <motion.div
                            key={t.id}
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

                            {/* Rating */}
                            {t.rating > 0 && (
                                <div className="flex items-center gap-1.5 mb-3">
                                    <StarDisplay rating={t.rating} />
                                    <span
                                        className="font-sans text-xs font-semibold"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        ({formatRatingNumber(t.rating)})
                                    </span>
                                </div>
                            )}

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
                                    {t.role}
                                </p>
                                {t.avatar && (
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
                                )}
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
