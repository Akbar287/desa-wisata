"use client";

import Image from "next/image";
import React from "react";

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

export default function StatsSection() {
    const [expandInfo, setExpandInfo] = React.useState<boolean>(false);
    return (
        <section
            id="about"
            style={{
                padding: "100px 24px",
                background: "var(--color-white)",
            }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                {/* Heading */}
                <h2
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(28px, 3.5vw, 44px)",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        textAlign: "center",
                        marginBottom: 20,
                    }}
                >
                    Indonesia Penuh Pesona di 2026
                </h2>

                {/* Description */}
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(15px, 1.3vw, 18px)",
                        color: "var(--color-text-light)",
                        textAlign: "center",
                        maxWidth: 750,
                        margin: "0 auto 24px",
                        lineHeight: 1.8,
                    }}
                >
                    {
                        expandInfo ? "Ingin pengalaman wisata yang otentik dan berbeda? Desa wisata Indonesia menawarkan perpaduan unik antara budaya, alam, dan sejarah. Jelajahi sawah terasering, perbukitan hijau, pantai tersembunyi, dan kenali kehidupan masyarakat lokal yang hangat." : "Ingin pengalaman wisata yang otentik dan berbeda? Desa wisata Indonesia menawarkan perpaduan unik antara budaya, alam, dan sejarah..."
                    }
                </p>

                {/* Expand button */}
                <div style={{ textAlign: "center", marginBottom: 60 }}>
                    <button
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: "2px solid var(--color-accent)",
                            background: "transparent",
                            color: "var(--color-accent)",
                            cursor: "pointer",
                            fontSize: 20,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s",
                        }}
                        onClick={() => setExpandInfo(!expandInfo)}
                    >
                        {expandInfo ? "-" : "+"}
                    </button>
                </div>

                {/* Stats Grid */}
                <div
                    className="grid grid-cols-2 lg:grid-cols-3 gap-2"
                >
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                                aspectRatio: "1",
                                cursor: "pointer",
                                transition: "transform 0.4s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.03)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        >
                            <Image
                                src={stat.image}
                                alt={stat.label}
                                fill
                                style={{
                                    objectFit: "cover",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    padding: 20,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "clamp(24px, 3vw, 36px)",
                                        fontWeight: 700,
                                        color: "white",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {stat.number}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 14,
                                        color: "rgba(255,255,255,0.85)",
                                        fontWeight: 500,
                                        marginTop: 4,
                                    }}
                                >
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
