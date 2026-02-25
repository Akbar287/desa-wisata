"use client";

import Image from "next/image";

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

export default function TopToursSection() {
    return (
        <section
            id="tours"
            style={{
                padding: "100px 0 100px 0",
                background: "var(--color-white)",
            }}
        >
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
                {/* Heading */}
                <h2
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        fontWeight: 700,
                        textAlign: "center",
                        color: "var(--color-text)",
                        marginBottom: 48,
                    }}
                >
                    Paket Wisata Unggulan
                </h2>

                {/* Scrollable Cards */}
                <div
                    className="hide-scrollbar"
                    style={{
                        display: "flex",
                        gap: 24,
                        overflowX: "auto",
                        paddingBottom: 20,
                        scrollSnapType: "x mandatory",
                    }}
                >
                    {tours.map((tour, i) => (
                        <div
                            key={i}
                            className="tour-card"
                            style={{
                                minWidth: 340,
                                maxWidth: 340,
                                borderRadius: "var(--radius-lg)",
                                overflow: "hidden",
                                background: "var(--color-white)",
                                boxShadow: "var(--shadow-sm)",
                                border: "1px solid rgba(0,0,0,0.06)",
                                scrollSnapAlign: "start",
                                flexShrink: 0,
                            }}
                        >
                            {/* Image */}
                            <div
                                style={{
                                    position: "relative",
                                    height: 200,
                                    overflow: "hidden",
                                }}
                            >
                                <Image
                                    src={tour.image}
                                    alt={tour.title}
                                    fill
                                    className="tour-card-image"
                                    style={{ objectFit: "cover" }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        background:
                                            tour.badge === "Privat"
                                                ? "var(--color-primary)"
                                                : "var(--color-accent)",
                                        color: "white",
                                        padding: "4px 14px",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        fontFamily: "var(--font-body)",
                                    }}
                                >
                                    {tour.badge}
                                </span>
                            </div>

                            {/* Content */}
                            <div style={{ padding: "20px 22px 24px" }}>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: "var(--color-text)",
                                        marginBottom: 14,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {tour.title}
                                </h3>
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "0 0 18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}
                                >
                                    {tour.highlights.map((h, j) => (
                                        <li
                                            key={j}
                                            style={{
                                                fontSize: 13,
                                                color: "var(--color-text-muted)",
                                                fontFamily: "var(--font-body)",
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 8,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>•</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>

                                {/* Footer */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        borderTop: "1px solid rgba(0,0,0,0.06)",
                                        paddingTop: 14,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "var(--color-text-muted)",
                                            fontFamily: "var(--font-body)",
                                        }}
                                    >
                                        {tour.duration} &nbsp;•&nbsp; mulai {tour.price}
                                    </span>
                                    <a
                                        href="#"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            color: "var(--color-accent)",
                                            fontWeight: 600,
                                            fontSize: 14,
                                            fontFamily: "var(--font-body)",
                                            textDecoration: "none",
                                            transition: "gap 0.3s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.gap = "10px")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.gap = "6px")
                                        }
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
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All */}
                <div style={{ textAlign: "center", marginTop: 48 }}>
                    <a href="#" className="btn-outline">
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
                    </a>
                </div>
            </div>
        </section>
    );
}
