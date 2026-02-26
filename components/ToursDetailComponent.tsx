'use client'
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { fmt } from '@/lib/utils';
import { DayItinerary, TourDetail } from '@/types/TourType';

export default function ToursDetailComponent({ tour, navItems, relatedTours }: {
    tour: TourDetail;
    navItems: { id: string; label: string }[];
    relatedTours: Record<number, { id: number; title: string; image: string; duration: string; price: string }>
}) {
    const [activeSection, setActiveSection] = React.useState("overview");
    const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);
    const [stickyNav, setStickyNav] = React.useState(false);
    const subNavRef = React.useRef<HTMLDivElement>(null);
    const subNavPlaceholderRef = React.useRef<HTMLDivElement>(null);
    const [navbarHeight, setNavbarHeight] = React.useState(0);

    const SUBNAV_HEIGHT = 53;

    const getNavbarHeight = () => {
        const nav = document.querySelector("nav");
        return nav ? nav.getBoundingClientRect().height : 0;
    };

    // Observe sections for active nav highlight
    React.useEffect(() => {
        const handleScroll = () => {
            const currentNavHeight = getNavbarHeight();
            setNavbarHeight(currentNavHeight);
            const totalH = currentNavHeight + SUBNAV_HEIGHT;

            // Use the placeholder position to determine when to stick
            if (subNavPlaceholderRef.current) {
                const rect = subNavPlaceholderRef.current.getBoundingClientRect();
                setStickyNav(rect.top <= currentNavHeight);
            }
            for (const item of navItems) {
                const el = document.getElementById(item.id);
                if (el) {
                    const r = el.getBoundingClientRect();
                    if (r.top <= totalH + 20 && r.bottom >= totalH + 20) {
                        setActiveSection(item.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const totalH = getNavbarHeight() + SUBNAV_HEIGHT;
            const y = el.getBoundingClientRect().top + window.scrollY - totalH - 12;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <>

            {/* ── Hero ────────────────────────────────────────── */}
            <section style={{ position: "relative", height: "clamp(360px, 55vh, 520px)", overflow: "hidden" }}>
                <Image src={tour.heroImage} alt={tour.title} fill style={{ objectFit: "cover" }} priority />
                <div className="gradient-dark-full" style={{ position: "absolute", inset: 0 }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", paddingBottom: 56 }}>
                    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", width: "100%" }}>
                        {/* Breadcrumb */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Beranda</Link>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            <Link href="/tours" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Paket Wisata</Link>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            <span style={{ color: "white" }}>{tour.title}</span>
                        </div>
                        {/* Themes */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                            {tour.themes.map((t) => (
                                <span key={t} style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", color: "white", padding: "5px 16px", borderRadius: "var(--radius-full)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4.5vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.15, maxWidth: 680 }}>
                            {tour.title}
                        </h1>
                    </div>
                </div>
            </section>

            <div ref={subNavPlaceholderRef} style={{ height: stickyNav ? SUBNAV_HEIGHT : 0 }} />
            <div
                ref={subNavRef}
                className="hide-scrollbar"
                style={{
                    position: stickyNav ? "fixed" : "relative",
                    top: stickyNav ? navbarHeight : "auto",
                    left: 0,
                    right: 0,
                    zIndex: 900,
                    background: "white",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: stickyNav ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                    transition: "box-shadow 0.3s",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                }}
            >
                <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 12px", display: "flex", gap: 0 }}>
                    {navItems.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => scrollTo(n.id)}
                            style={{
                                padding: "16px 20px",
                                background: "none",
                                border: "none",
                                borderBottom: activeSection === n.id ? "3px solid var(--color-primary)" : "3px solid transparent",
                                color: activeSection === n.id ? "var(--color-primary)" : "var(--color-text-muted)",
                                fontFamily: "var(--font-body)",
                                fontSize: 14,
                                fontWeight: activeSection === n.id ? 700 : 500,
                                cursor: "pointer",
                                transition: "all 0.3s",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {n.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main Content + Sidebar ───────────────────── */}
            <main style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px" }}>
                <div className="tour-detail-layout" style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
                    {/* ── Left Column ─────────────────────── */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                        {/* Overview */}
                        <section id="overview" style={{ marginBottom: 56 }}>
                            {/* Quick facts */}
                            <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
                                {[
                                    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Durasi", value: `${tour.durationDays} hari` },
                                    { icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a3 3 0 00-2.12-2.87M16 3.13a3 3 0 010 5.74", label: "Grup", value: tour.groupSize },
                                    { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: "Destinasi", value: tour.destinations.join(", ") },
                                ].map((f, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-bg-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d={f.icon} />
                                            </svg>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body)" }}>{f.label}</div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)", fontFamily: "var(--font-body)" }}>{f.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-light)", fontFamily: "var(--font-body)", marginBottom: 24 }}>
                                {tour.overview}
                            </p>

                            {/* Highlight list */}
                            <div style={{ background: "var(--color-bg-light)", borderRadius: "var(--radius-md)", padding: "22px 26px" }}>
                                <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "var(--color-text)", marginBottom: 14 }}>Sorotan Perjalanan</h4>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                                    {tour.highlights.map((h, i) => (
                                        <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--color-text-light)", fontFamily: "var(--font-body)" }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-primary)" style={{ flexShrink: 0 }}>
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fillRule="evenodd" />
                                            </svg>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Gallery */}
                        <section id="gallery" style={{ marginBottom: 56 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>
                                Galeri Perjalanan
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "240px 180px", gap: 10, borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                                {tour.gallery.slice(0, 5).map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setLightboxIdx(i)}
                                        style={{
                                            position: "relative",
                                            cursor: "pointer",
                                            overflow: "hidden",
                                            gridColumn: i === 0 ? "1 / 3" : undefined,
                                            gridRow: i === 0 ? "1 / 2" : undefined,
                                        }}
                                    >
                                        <Image src={img} alt={`Gallery ${i + 1}`} fill style={{ objectFit: "cover", transition: "transform 0.4s" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "scale(1.05)"; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }} />
                                        {i === 4 && tour.gallery.length > 5 && (
                                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, fontFamily: "var(--font-body)" }}>
                                                +{tour.gallery.length - 5} foto
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Itinerary */}
                        <section id="itinerary" style={{ marginBottom: 56 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>
                                Itinerari Perjalanan
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {tour.itinerary.map((day) => (
                                    <ItineraryDay key={day.day} item={day} defaultOpen={day.day === 1} />
                                ))}
                            </div>
                        </section>

                        {/* Price & Dates */}
                        <section id="price_and_date" style={{ marginBottom: 56 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>
                                Harga & Jadwal Keberangkatan
                            </h2>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: 14 }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid var(--color-primary)" }}>
                                            <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 700, color: "var(--color-text)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Berangkat</th>
                                            <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 700, color: "var(--color-text)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Kembali</th>
                                            <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 700, color: "var(--color-text)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</th>
                                            <th style={{ textAlign: "right", padding: "12px 16px", fontWeight: 700, color: "var(--color-text)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Harga</th>
                                            <th style={{ padding: "12px 16px" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tour.dates.map((d, i) => {
                                            const statusColor = d.status === "Terjamin" ? "#10B981" : d.status === "Hampir Penuh" ? "#F59E0B" : "var(--color-primary)";
                                            return (
                                                <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", transition: "background 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-light)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                                                    <td style={{ padding: "14px 16px", color: "var(--color-text)" }}>{d.start}</td>
                                                    <td style={{ padding: "14px 16px", color: "var(--color-text-light)" }}>{d.end}</td>
                                                    <td style={{ padding: "14px 16px" }}>
                                                        <span style={{ background: `${statusColor}15`, color: statusColor, padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: 12, fontWeight: 600 }}>
                                                            {d.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: "var(--color-primary)" }}>{fmt(d.price)}</td>
                                                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                                        <Link href={`/booking?slug=${tour.id}&start=${d.start}&end=${d.end}`}>
                                                            <button
                                                                className="btn-primary"
                                                                style={{ padding: "8px 18px", fontSize: 13 }}
                                                            >
                                                                Pesan
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Included / Excluded */}
                        <section id="included" style={{ marginBottom: 56 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>
                                Yang Termasuk & Tidak Termasuk
                            </h2>
                            <div className="inc-exc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                <div style={{ background: "var(--color-bg-light)", borderRadius: "var(--radius-md)", padding: "24px 26px" }}>
                                    <h4 style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                                        ✓ Termasuk
                                    </h4>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                                        {tour.included.map((item, i) => (
                                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--color-text-light)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 3 }}><polyline points="20 6 9 17 4 12" /></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ background: "#FEF2F2", borderRadius: "var(--radius-md)", padding: "24px 26px" }}>
                                    <h4 style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                                        ✕ Tidak Termasuk
                                    </h4>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                                        {tour.excluded.map((item, i) => (
                                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--color-text-light)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 3 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Good to Know */}
                        <section id="good_to_know" style={{ marginBottom: 56 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>
                                Info Penting
                            </h2>
                            <div style={{ display: "grid", gap: 16 }}>
                                {tour.goodToKnow.map((g, i) => (
                                    <div key={i} style={{ background: "var(--color-cream)", borderRadius: "var(--radius-md)", padding: "22px 26px", borderLeft: "4px solid var(--color-primary)" }}>
                                        <h4 style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, color: "var(--color-text)", marginBottom: 8 }}>{g.title}</h4>
                                        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-light)", fontFamily: "var(--font-body)", margin: 0 }}>{g.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews */}
                        <section id="reviews" style={{ marginBottom: 56 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>
                                Ulasan Wisatawan
                            </h2>
                            <div style={{ display: "grid", gap: 20 }}>
                                {tour.reviews.map((r, i) => (
                                    <div key={i} style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "var(--radius-md)", padding: "24px 26px", transition: "box-shadow 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                                            <Image src={r.avatar} alt={r.name} width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover" }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>{r.name}</div>
                                                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-text-muted)" }}>{r.location} · {r.date}</div>
                                            </div>
                                            <Stars rating={r.rating} />
                                        </div>
                                        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-light)", fontFamily: "var(--font-body)", margin: 0 }}>
                                            &quot;{r.text}&quot;
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Related Tours */}
                        <section style={{ marginBottom: 20 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>
                                Paket Wisata Serupa
                            </h2>
                            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                                {tour.relatedTourIds.map((rid) => {
                                    const rt = relatedTours[rid];
                                    if (!rt) return null;
                                    return (
                                        <Link key={rid} href={`/tours/${rt.id}`} style={{ textDecoration: "none" }}>
                                            <div className="tour-card" style={{ borderRadius: "var(--radius-md)", overflow: "hidden", background: "white", border: "1px solid rgba(0,0,0,0.07)" }}>
                                                <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                                                    <Image src={rt.image} alt={rt.title} fill className="tour-card-image" style={{ objectFit: "cover" }} />
                                                </div>
                                                <div style={{ padding: "16px 18px" }}>
                                                    <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: "var(--color-text)", marginBottom: 8, lineHeight: 1.3 }}>{rt.title}</h4>
                                                    <div style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                                                        {rt.duration} · mulai {rt.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* ── Sidebar ─────────────────────────── */}
                    <aside
                        className="tour-detail-sidebar"
                        style={{
                            width: 310,
                            flexShrink: 0,
                            position: "sticky",
                            top: 90,
                            paddingTop: "50px"
                        }}
                    >
                        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-lg)", padding: "28px 24px", boxShadow: "var(--shadow-md)" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Mulai dari</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-body)", marginBottom: 4 }}>
                                {fmt(tour.price)}
                            </div>
                            <div style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", marginBottom: 24 }}>per orang</div>

                            <button
                                className="btn-primary"
                                style={{ width: "100%", justifyContent: "center", padding: "14px 24px", marginBottom: 12 }}
                                onClick={() => scrollTo("price_and_date")}
                            >
                                Pesan Sekarang
                            </button>
                            <Link href={`/inquiry?slug=${tour.id}`}>
                                <button
                                    className="btn-outline"
                                    style={{ width: "100%", justifyContent: "center", padding: "12px 24px", marginBottom: 24 }}
                                >
                                    Tanya Kami
                                </button>
                            </Link>

                            <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                                {[
                                    { label: "Durasi", value: `${tour.durationDays} hari` },
                                    { label: "Tipe", value: tour.type },
                                    { label: "Grup", value: tour.groupSize },
                                    { label: "Destinasi", value: tour.destinations.join(", ") },
                                ].map((f) => (
                                    <div key={f.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontFamily: "var(--font-body)" }}>
                                        <span style={{ color: "var(--color-text-muted)" }}>{f.label}</span>
                                        <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* ── Mobile Bottom Bar ────────────────────────── */}
            <div
                className="mobile-bottom-bar"
                style={{
                    display: "none",
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "white",
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                    padding: "12px 20px",
                    zIndex: 999,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
                }}
            >
                <div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>Mulai dari</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-body)" }}>{fmt(tour.price)}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-outline" style={{ padding: "10px 16px", fontSize: 13 }}>Tanya</button>
                    <button className="btn-primary" style={{ padding: "10px 18px", fontSize: 13 }} onClick={() => scrollTo("price_and_date")}>Pesan</button>
                </div>
            </div>

            {/* ── Lightbox ─────────────────────────────────── */}
            {lightboxIdx !== null && (
                <div
                    onClick={() => setLightboxIdx(null)}
                    style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }}
                >
                    <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.max(0, lightboxIdx - 1)); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <Image
                        src={tour.gallery[lightboxIdx]}
                        alt="Gallery"
                        width={1200}
                        height={800}
                        style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: "var(--radius-md)" }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.min(tour.gallery.length - 1, lightboxIdx + 1)); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                    <button onClick={() => setLightboxIdx(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <div style={{ position: "absolute", bottom: 24, color: "rgba(255,255,255,0.6)", fontSize: 14, fontFamily: "var(--font-body)" }}>
                        {lightboxIdx + 1} / {tour.gallery.length}
                    </div>
                </div>
            )}

            {/* ── Responsive Styles ────────────────────────── */}
            <style jsx global>{`
                @media (max-width: 1024px) {
                    .tour-detail-sidebar { display: none !important; }
                    .mobile-bottom-bar { display: flex !important; }
                    .tour-detail-layout { flex-direction: column !important; }
                }
                @media (max-width: 768px) {
                    .inc-exc-grid { grid-template-columns: 1fr !important; }
                    .related-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 520px) {
                    #gallery > div:nth-child(2) {
                        grid-template-columns: 1fr 1fr !important;
                        grid-template-rows: 200px 160px 160px !important;
                    }
                }
            `}</style>
        </>
    );
}

function Stars({ rating }: { rating: number }) {
    return (
        <span style={{ display: "inline-flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#D4A843" : "#E5E7EB"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </span>
    );
}

function ItineraryDay({ item, defaultOpen }: { item: DayItinerary; defaultOpen?: boolean }) {
    const [open, setOpen] = React.useState(defaultOpen ?? false);

    const mealLabel: Record<string, string> = { B: "Sarapan", L: "Makan Siang", D: "Makan Malam" };
    const mealColor: Record<string, string> = { B: "#F59E0B", L: "#10B981", D: "#6366F1" };

    return (
        <div
            style={{
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                transition: "box-shadow 0.3s",
                boxShadow: open ? "var(--shadow-md)" : "var(--shadow-sm)",
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 22px",
                    background: open ? "var(--color-bg-light)" : "white",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-body)",
                    transition: "background 0.3s",
                }}
            >
                <span
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: open ? "var(--color-primary)" : "var(--color-cream-dark)",
                        color: open ? "white" : "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                        transition: "all 0.3s",
                    }}
                >
                    {item.day}
                </span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                        Hari {item.day}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text)" }}>
                        {item.title}
                    </div>
                </div>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-text-muted)"
                    strokeWidth="2"
                    style={{ flexShrink: 0, transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div
                style={{
                    maxHeight: open ? 500 : 0,
                    opacity: open ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
                }}
            >
                <div style={{ padding: "0 22px 20px 78px" }}>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-light)", marginBottom: 16, fontFamily: "var(--font-body)" }}>
                        {item.description}
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        {item.meals.map((m) => (
                            <span
                                key={m}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "4px 12px",
                                    borderRadius: "var(--radius-full)",
                                    background: `${mealColor[m]}15`,
                                    color: mealColor[m],
                                    fontSize: 12,
                                    fontWeight: 600,
                                    fontFamily: "var(--font-body)",
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" /></svg>
                                {mealLabel[m]}
                            </span>
                        ))}
                        {item.distance && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: "var(--radius-full)", background: "rgba(0,0,0,0.04)", color: "var(--color-text-muted)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-body)" }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                                {item.distance}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}