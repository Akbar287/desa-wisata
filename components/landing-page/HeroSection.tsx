"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative w-full min-h-[700px] h-screen overflow-hidden"
        >
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="/assets/hero-1.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/50 to-black/65" />

            {/* Content */}
            <div className="relative z-2 h-full flex flex-col items-center justify-center text-center px-6">
                {/* Floating Icon */}
                <motion.div
                    className="animate-float mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        className="opacity-90"
                    >
                        <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="white"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        <path
                            d="M40 15 C25 25, 20 40, 40 55 C60 40, 55 25, 40 15Z"
                            fill="rgba(255,255,255,0.15)"
                            stroke="white"
                            strokeWidth="1.5"
                        />
                        <circle cx="40" cy="35" r="5" fill="white" opacity="0.7" />
                    </svg>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    className="text-white font-serif font-bold mb-5 max-w-[800px] tracking-tight dark:text-gray-200"
                    style={{
                        fontSize: "clamp(36px, 5vw, 72px)",
                        textShadow: "0 4px 30px rgba(0,0,0,0.3)",
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Jelajahi Pesona <br />Desa Manuk Jaya
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-white/90 max-w-[650px] leading-relaxed mb-10 dark:text-gray-200"
                    style={{
                        fontSize: "clamp(16px, 2vw, 22px)",
                        textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Rasakan keindahan alam, kearifan budaya, dan keramahan masyarakat
                    desa wisata Indonesia bersama para ahli lokal.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link
                        href="/tours"
                        className="btn-primary text-base py-4 px-9"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        Mulai Petualangan
                    </Link>
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-15 flex flex-col items-center gap-3">
                    <div className="animate-scroll-line w-0.5 bg-white/60 rounded-sm" />
                </div>
            </div>
        </section>
    );
}
