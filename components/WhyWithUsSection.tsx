"use client";

import Image from "next/image";

const reasons = [
    {
        title: "Autentik",
        description: "Pengalaman budaya asli langsung dari masyarakat lokal",
        image: "/assets/withus01.png",
    },
    {
        title: "Berpengalaman",
        description: "Lebih dari 10 tahun menghubungkan wisatawan dengan desa",
        image: "/assets/withus02.png",
    },
    {
        title: "Bersejarah",
        description: "Kunjungi desa-desa dengan warisan sejarah yang kaya",
        image: "/assets/withus03.png",
    },
    {
        title: "Profesional",
        description: "Tim pemandu terlatih dan berpengetahuan luas",
        image: "/assets/withus05.png",
    },
    {
        title: "Petualangan",
        description: "Jelajahi tempat-tempat tersembunyi yang menakjubkan",
        image: "/assets/withus06.png",
    },
    {
        title: "Berkesan",
        description: "Kenangan tak terlupakan di setiap perjalanan",
        image: "/assets/withus07.png",
    },
    {
        title: "Ramah",
        description: "Sambutan hangat dari penduduk desa yang ramah",
        image: "/assets/withus08.png",
    },
    {
        title: "Komunitas",
        description: "Mendukung pemberdayaan ekonomi masyarakat desa",
        image: "/assets/4e5c0835-ea10-41d5-b91d-59bb403cc22b-company01.png",
    },
];

export default function WhyWithUsSection() {
    return (
        <section
            id="about-us"
            style={{
                padding: "100px 0",
                background:
                    "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background pattern */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url('/assets/statbg.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.08,
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "0 24px",
                }}
            >
                <h2
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        fontWeight: 700,
                        color: "white",
                        textAlign: "center",
                        marginBottom: 12,
                    }}
                >
                    Mengapa Bersama Kami
                </h2>
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 17,
                        color: "rgba(255,255,255,0.8)",
                        textAlign: "center",
                        marginBottom: 60,
                    }}
                >
                    Alasan mengapa Anda harus merencanakan wisata bersama Discover Desa Wisata
                </p>

                {/* Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
                        gap: 20,
                    }}
                >
                    {reasons.map((reason, i) => (
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                borderRadius: "var(--radius-lg)",
                                overflow: "hidden",
                                aspectRatio: "1",
                                cursor: "pointer",
                                transition: "transform 0.4s, box-shadow 0.4s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow =
                                    "0 20px 40px rgba(0,0,0,0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <Image
                                src={reason.image}
                                alt={reason.title}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    padding: 24,
                                }}
                            >
                                <h3
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: "white",
                                        marginBottom: 6,
                                    }}
                                >
                                    {reason.title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 13,
                                        color: "rgba(255,255,255,0.8)",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {reason.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
