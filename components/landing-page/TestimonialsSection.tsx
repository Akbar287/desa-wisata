"use client";

import Image from "next/image";
import Link from "next/link";

const testimonials = [
    {
        text: "Pengalaman luar biasa di Desa Penglipuran! Kami disambut dengan upacara tradisional, belajar membuat canang sari, dan tinggal di rumah adat Bali. Pemandu kami, Pak Wayan, sangat berpengetahuan tentang sejarah dan budaya desa. Makanan lokal yang disajikan sangat autentik dan lezat. Highly recommended!",
        name: "Ayrein Nisya",
        location: "Jakarta, Indonesia",
        avatar: "/assets/default-avatar-2020-13.jpg",
    },
    {
        text: "Tur ke Wae Rebo adalah highlight dari liburan kami. Trekking melalui hutan tropis yang menakjubkan, dan saat tiba di desa di atas awan, rasanya seperti masuk ke dunia lain. Rumah adat Mbaru Niang sangat unik. Tim Discover Desa Wisata mengatur segalanya dengan sangat profesional.",
        name: "Irma Nur",
        location: "Surabaya, Indonesia",
        avatar: "/assets/default-avatar-2020-25.jpg",
    },
    {
        text: "Kami mengambil tur keluarga 5 hari ke desa-desa di Yogyakarta. Anak-anak sangat senang belajar membatik dan menanam padi. Yang paling berkesan adalah keramahan penduduk desa. Mereka benar-benar menyambut kami sebagai bagian dari keluarga mereka. Terima kasih Discover Desa Wisata!",
        name: "Akbar M et al.",
        location: "Bandung, Indonesia",
        avatar: "/assets/default-avatar-2020-3.jpg",
    },
    {
        text: "Private tour ke Desa Sade di Lombok sangat berkesan. Melihat langsung proses tenun tradisional suku Sasak, arsitektur rumah adat yang unik, dan pemandangan alam yang memukau. Pemandu kami sangat informatif dan akomodatif. Worth every penny!",
        name: "Ahmad Fauzi",
        location: "Medan, Indonesia",
        avatar: "/assets/default-avatar-2020-49.jpg",
    },
    {
        text: "Tour 4 hari ke kawasan Nglanggeran luar biasa! Gunung Api Purba sungguh menakjubkan, air terjun tersembunyi, dan sunset dari puncak sangat indah. Agrowisata buah-buahan segar jadi bonus yang menyenangkan. Organisasinya rapi dari awal sampai akhir.",
        name: "Dewi Lestari",
        location: "Semarang, Indonesia",
        avatar: "/assets/default-avatar-2020-54.jpg",
    },
    {
        text: "Saya solo traveler yang bergabung grup tour ke Banyuwangi. Selain Kawah Ijen yang menakjubkan, kunjungan ke desa Osing adalah pengalaman tak terduga yang luar biasa. Budaya mereka sangat unik dan berbeda dari Jawa pada umumnya. Teman-teman satu grup juga sangat menyenangkan!",
        name: "Carlos Adrianto",
        location: "Makassar, Indonesia",
        avatar: "/assets/default-avatar-2020-67.jpg",
    },
];

export default function TestimonialsSection() {
    return (
        <section
            style={{
                padding: "100px 24px",
                background: "var(--color-cream)",
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
                    Cerita dari Wisatawan Kami
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
                    Pengalaman asli dari para wisatawan yang telah menjelajahi desa wisata bersama kami
                </p>

                {/* Masonry Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            style={{
                                breakInside: "avoid",
                                marginBottom: 24,
                                background: "var(--color-white)",
                                borderRadius: "var(--radius-lg)",
                                padding: "32px 28px",
                                boxShadow: "var(--shadow-sm)",
                                border: "1px solid rgba(0,0,0,0.04)",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                            }}
                        >
                            {/* Quote icon */}
                            <div
                                style={{
                                    fontSize: 36,
                                    color: "var(--color-accent)",
                                    fontFamily: "Georgia, serif",
                                    lineHeight: 1,
                                    marginBottom: 16,
                                    fontWeight: 700,
                                }}
                            >
                                ❝
                            </div>

                            {/* Text */}
                            <p
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: 14,
                                    lineHeight: 1.8,
                                    color: "var(--color-text-light)",
                                    marginBottom: 24,
                                }}
                            >
                                {t.text}
                            </p>

                            {/* Author */}
                            <div
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: "var(--color-accent)",
                                        marginBottom: 4,
                                    }}
                                >
                                    {t.name}
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 13,
                                        color: "var(--color-text-muted)",
                                        marginBottom: 12,
                                    }}
                                >
                                    {t.location}
                                </p>
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        margin: "0 auto",
                                        border: "3px dashed var(--color-accent-light)",
                                        padding: 3,
                                    }}
                                >
                                    <Image
                                        src={t.avatar}
                                        alt={t.name}
                                        width={50}
                                        height={50}
                                        style={{
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: "center", marginTop: 48 }}>
                    <Link href="/testimonials" className="btn-outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        Lihat semua ulasan
                    </Link>
                </div>
            </div>

            {/* Responsive masonry override */}
            <style jsx>{`
        @media (max-width: 900px) {
          div[style*="columnCount: 3"] {
            column-count: 2 !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="columnCount: 3"] {
            column-count: 1 !important;
          }
        }
      `}</style>
        </section>
    );
}
