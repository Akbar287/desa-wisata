"use client";

import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            id="hero"
            style={{
                position: "relative",
                width: "100%",
                height: "100vh",
                minHeight: 700,
                overflow: "hidden",
            }}
        >
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            >
                <source src="/assets/hero-1.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.65) 100%)",
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "0 24px",
                }}
            >
                {/* Icon */}
                <div
                    className="animate-float"
                    style={{
                        marginBottom: 24,
                    }}
                >
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        style={{ opacity: 0.9 }}
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
                </div>

                {/* Heading */}
                <h1
                    className="animate-fade-in-up"
                    style={{
                        color: "white",
                        fontSize: "clamp(36px, 5vw, 72px)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        marginBottom: 20,
                        maxWidth: 800,
                        letterSpacing: "-0.02em",
                        textShadow: "0 4px 30px rgba(0,0,0,0.3)",
                    }}
                >
                    Jelajahi Pesona Desa Wisata
                </h1>

                {/* Subtitle */}
                <p
                    className="animate-fade-in-up"
                    style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "clamp(16px, 2vw, 22px)",
                        maxWidth: 650,
                        lineHeight: 1.6,
                        marginBottom: 40,
                        animationDelay: "0.2s",
                        textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    Rasakan keindahan alam, kearifan budaya, dan keramahan masyarakat
                    desa wisata Indonesia bersama para ahli lokal.
                </p>

                {/* Scroll indicator */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 60,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <div
                        className="animate-scroll-line"
                        style={{
                            width: 2,
                            background: "rgba(255,255,255,0.6)",
                            borderRadius: 1,
                        }}
                    />
                </div>

                {/* CTA Button */}
                <Link
                    href="/tours"
                    className="btn-primary animate-fade-in-up"
                    style={{
                        animationDelay: "0.4s",
                        fontSize: 16,
                        padding: "16px 36px",
                    }}
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
            </div>
        </section>
    );
}
