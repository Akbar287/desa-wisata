"use client";

import Image from "next/image";

const tripTypes = [
    {
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

export default function TripTypesSection() {
    return (
        <section
            style={{
                padding: "100px 24px",
                background: "var(--color-white)",
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Heading */}
                <h2
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        textAlign: "center",
                        marginBottom: 12,
                    }}
                >
                    Temukan cara terbaik menjelajahi Desa Wisata
                </h2>
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 17,
                        color: "var(--color-text-muted)",
                        textAlign: "center",
                        marginBottom: 60,
                    }}
                >
                    Nikmati 2 cara untuk Discover Desa Wisata
                </p>

                {/* Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
                        gap: 32,
                    }}
                >
                    {tripTypes.map((trip, i) => (
                        <div
                            key={i}
                            className="tour-card"
                            style={{
                                borderRadius: "var(--radius-lg)",
                                overflow: "hidden",
                                background: "var(--color-white)",
                                boxShadow: "var(--shadow-md)",
                                cursor: "pointer",
                            }}
                        >
                            {/* Image */}
                            <div
                                style={{
                                    position: "relative",
                                    height: 280,
                                    overflow: "hidden",
                                }}
                            >
                                <Image
                                    src={trip.image}
                                    alt={trip.title}
                                    fill
                                    className="tour-card-image"
                                    style={{ objectFit: "cover" }}
                                />
                                {/* Badge */}
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 16,
                                        left: 16,
                                        background: "var(--color-accent)",
                                        color: "white",
                                        padding: "6px 18px",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        fontFamily: "var(--font-body)",
                                        letterSpacing: "0.03em",
                                    }}
                                >
                                    {trip.badge}
                                </span>
                            </div>

                            {/* Content */}
                            <div style={{ padding: "28px 28px 32px" }}>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: 24,
                                        fontWeight: 700,
                                        color: "var(--color-text)",
                                        marginBottom: 20,
                                    }}
                                >
                                    {trip.title}
                                </h3>
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                    }}
                                >
                                    {trip.features.map((feature, j) => (
                                        <li
                                            key={j}
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 12,
                                                fontFamily: "var(--font-body)",
                                                fontSize: 15,
                                                color: "var(--color-text-light)",
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="var(--color-primary)"
                                                strokeWidth="2.5"
                                                style={{ flexShrink: 0, marginTop: 2 }}
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                        color: "var(--color-text-light)",
                        textAlign: "center",
                        maxWidth: 700,
                        margin: "48px auto 0",
                        lineHeight: 1.7,
                    }}
                >
                    Kami telah membantu ribuan wisatawan menikmati petualangan tak
                    terlupakan di desa-desa wisata Indonesia, dengan keahlian dan
                    semangat yang tulus.
                </p>
            </div>
        </section>
    );
}
