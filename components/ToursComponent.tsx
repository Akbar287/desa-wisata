'use client'

import { Tour } from '@/types/TourType';
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";


export default function ToursComponent({
    allTours,
    themes,
    durations,
    destinations,
    toursPerPage,
}: {
    allTours: Tour[];
    themes: string[];
    durations: { label: string; min: number; max: number }[];
    destinations: string[];
    toursPerPage: number;
}) {
    const [search, setSearch] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Toggle helpers
    const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
        setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
        setCurrentPage(1);
    };

    // Filter logic
    const filtered = useMemo(() => {
        return allTours.filter((t) => {
            if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
            if (selectedTypes.length && !selectedTypes.includes(t.type)) return false;
            if (selectedThemes.length && !selectedThemes.some((s) => t.themes.includes(s))) return false;
            if (selectedDuration !== null) {
                const dur = durations[selectedDuration];
                if (t.durationDays < dur.min || t.durationDays > dur.max) return false;
            }
            if (selectedDestinations.length && !selectedDestinations.some((d) => t.destinations.includes(d))) return false;
            return true;
        });
    }, [search, selectedTypes, selectedThemes, selectedDuration, selectedDestinations]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / toursPerPage));
    const paginated = filtered.slice((currentPage - 1) * toursPerPage, currentPage * toursPerPage);

    const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };

    const resetFilters = () => {
        setSelectedTypes([]);
        setSelectedThemes([]);
        setSelectedDuration(null);
        setSelectedDestinations([]);
        setSearch("");
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedTypes.length > 0 || selectedThemes.length > 0 || selectedDuration !== null || selectedDestinations.length > 0 || search.length > 0;

    // Filter panel (shared between sidebar and mobile drawer)
    const FilterPanel = () => (
        <div>
            {hasActiveFilters && (
                <button
                    onClick={resetFilters}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid var(--color-accent)", color: "var(--color-accent)", padding: "6px 14px", borderRadius: "var(--radius-full)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", marginBottom: 20, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "white"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-accent)"; }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Reset Filter
                </button>
            )}

            <FilterSection title="Tipe Tur">
                {(["Grup", "Privat"] as const).map((t) => (
                    <Checkbox key={t} checked={selectedTypes.includes(t)} onChange={() => { toggle(selectedTypes, setSelectedTypes, t); }} label={t} />
                ))}
            </FilterSection>

            <FilterSection title="Tema">
                {themes.map((th) => (
                    <Checkbox key={th} checked={selectedThemes.includes(th)} onChange={() => { toggle(selectedThemes, setSelectedThemes, th); }} label={th} />
                ))}
            </FilterSection>

            <FilterSection title="Durasi">
                {durations.map((d, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                        <span
                            onClick={() => { setSelectedDuration(selectedDuration === i ? null : i); setCurrentPage(1); }}
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                border: selectedDuration === i ? "5px solid var(--color-primary)" : "2px solid #D1D5DB",
                                background: "white",
                                flexShrink: 0,
                                transition: "all 0.2s",
                                cursor: "pointer",
                            }}
                        />
                        <span style={{ fontSize: 14, color: "var(--color-text-light)", fontFamily: "var(--font-body)" }}>{d.label}</span>
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Destinasi">
                {destinations.map((dest) => (
                    <Checkbox key={dest} checked={selectedDestinations.includes(dest)} onChange={() => { toggle(selectedDestinations, setSelectedDestinations, dest); }} label={dest} />
                ))}
            </FilterSection>
        </div>
    );

    return (
        <>

            {/* Hero */}
            <section
                style={{
                    position: "relative",
                    height: 380,
                    display: "flex",
                    alignItems: "flex-end",
                    paddingBottom: 60,
                    overflow: "hidden",
                    background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%)",
                }}
            >
                {/* Pattern overlay */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)" }} />
                <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto", padding: "0 24px", width: "100%" }}>
                    {/* Breadcrumb */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                        <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Beranda</Link>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        <span style={{ color: "white" }}>Paket Wisata</span>
                    </div>
                    <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, color: "white", marginBottom: 14, lineHeight: 1.1 }}>
                        Paket Wisata Desa
                    </h1>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 540, lineHeight: 1.6 }}>
                        Temukan perjalanan autentik ke pelosok nusantara — dari desa budaya, alam terbuka, hingga petualangan di balik hutan tropis Indonesia.
                    </p>
                </div>
            </section>

            {/* Search bar strip */}
            <div style={{ background: "var(--color-cream)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "20px 0" }}>
                <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
                        <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari paket wisata..."
                            style={{
                                width: "100%",
                                padding: "13px 16px 13px 46px",
                                borderRadius: "var(--radius-full)",
                                border: "1.5px solid rgba(0,0,0,0.1)",
                                background: "white",
                                fontFamily: "var(--font-body)",
                                fontSize: 14,
                                color: "var(--color-text)",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                            onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.1)"; }}
                            onBlur={(e) => { e.target.style.borderColor = "rgba(0,0,0,0.1)"; e.target.style.boxShadow = "none"; }}
                        />
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                        {filtered.length} paket ditemukan
                    </div>
                    {/* Mobile filter button */}
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="mobile-filter-btn"
                        style={{
                            display: "none",
                            alignItems: "center",
                            gap: 8,
                            background: "var(--color-primary)",
                            color: "white",
                            border: "none",
                            padding: "11px 20px",
                            borderRadius: "var(--radius-full)",
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="11" y2="6" /><line x1="13" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="7" y2="12" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="16" y2="18" /><line x1="18" y1="18" x2="20" y2="18" /></svg>
                        Filter
                        {hasActiveFilters && (
                            <span style={{ background: "white", color: "var(--color-primary)", borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                {selectedTypes.length + selectedThemes.length + (selectedDuration !== null ? 1 : 0) + selectedDestinations.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main content */}
            <main style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px", display: "flex", gap: 40, alignItems: "flex-start" }}>
                {/* Sidebar filters — desktop */}
                <aside
                    className="tours-sidebar"
                    style={{
                        width: 260,
                        flexShrink: 0,
                        background: "var(--color-cream)",
                        borderRadius: "var(--radius-lg)",
                        padding: "28px 22px",
                        position: "sticky",
                        top: 90,
                        maxHeight: "calc(100vh - 110px)",
                        overflowY: "auto",
                    }}
                >
                    <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--color-text)", marginBottom: 22 }}>Filter Wisata</div>
                    <FilterPanel />
                </aside>

                {/* Tour grid */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {paginated.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.4 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Paket wisata tidak ditemukan</p>
                            <p style={{ fontSize: 14 }}>Coba ubah kata kunci atau reset filter.</p>
                            <button onClick={resetFilters} className="btn-primary" style={{ marginTop: 20 }}>Reset Filter</button>
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                    gap: 28,
                                    marginBottom: 48,
                                }}
                            >
                                {paginated.map((tour) => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    {/* Prev */}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "var(--radius-sm)",
                                            border: "1.5px solid rgba(0,0,0,0.1)",
                                            background: currentPage === 1 ? "var(--color-bg-light)" : "white",
                                            color: currentPage === 1 ? "var(--color-text-muted)" : "var(--color-text)",
                                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s",
                                            fontFamily: "var(--font-body)",
                                            fontSize: 14,
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "var(--radius-sm)",
                                                border: p === currentPage ? "none" : "1.5px solid rgba(0,0,0,0.1)",
                                                background: p === currentPage ? "var(--color-primary)" : "white",
                                                color: p === currentPage ? "white" : "var(--color-text)",
                                                cursor: "pointer",
                                                fontFamily: "var(--font-body)",
                                                fontSize: 14,
                                                fontWeight: p === currentPage ? 700 : 400,
                                                transition: "all 0.2s",
                                            }}
                                            onMouseEnter={(e) => { if (p !== currentPage) { e.currentTarget.style.background = "var(--color-bg-light)"; } }}
                                            onMouseLeave={(e) => { if (p !== currentPage) { e.currentTarget.style.background = "white"; } }}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    {/* Next */}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "var(--radius-sm)",
                                            border: "1.5px solid rgba(0,0,0,0.1)",
                                            background: currentPage === totalPages ? "var(--color-bg-light)" : "white",
                                            color: currentPage === totalPages ? "var(--color-text-muted)" : "var(--color-text)",
                                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Mobile filter drawer */}
            {mobileFilterOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.5)" }}
                    onClick={(e) => { if (e.target === e.currentTarget) setMobileFilterOpen(false); }}
                >
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: "min(85vw, 340px)",
                            background: "white",
                            padding: "28px 22px",
                            overflowY: "auto",
                            animation: "slideInRight 0.3s ease",
                            zIndex: 99999,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>Filter Wisata</span>
                            <button
                                onClick={() => setMobileFilterOpen(false)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-muted)" }}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <FilterPanel />
                        <button
                            onClick={() => setMobileFilterOpen(false)}
                            className="btn-primary"
                            style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
                        >
                            Lihat {filtered.length} Hasil
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @media (max-width: 768px) {
                    .tours-sidebar { display: none !important; }
                    .mobile-filter-btn { display: inline-flex !important; }
                }
                @media (max-width: 520px) {
                    .tour-card { min-width: 0 !important; }
                }
            `}</style>
        </>
    );
}


function StarRating({ rating }: { rating: number }) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#D4A843" : "#E5E7EB"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </span>
    );
}

function TourCard({ tour }: { tour: Tour }) {
    const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
    return (
        <div
            className="tour-card"
            style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                background: "var(--color-white)",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Image */}
            <div style={{ position: "relative", height: 220, overflow: "hidden", flexShrink: 0 }}>
                <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="tour-card-image"
                    style={{ objectFit: "cover" }}
                />
                {/* Type badge */}
                <span
                    style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: tour.type === "Privat" ? "var(--color-primary)" : "var(--color-accent)",
                        color: "white",
                        padding: "4px 14px",
                        borderRadius: "var(--radius-full)",
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                    }}
                >
                    {tour.type}
                </span>
                {/* Duration badge */}
                <span
                    style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(6px)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "var(--font-body)",
                    }}
                >
                    {tour.durationDays} hari
                </span>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Themes */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {tour.themes.slice(0, 2).map((t) => (
                        <span
                            key={t}
                            style={{
                                background: "var(--color-bg-light)",
                                color: "var(--color-primary)",
                                fontSize: 11,
                                fontWeight: 600,
                                fontFamily: "var(--font-body)",
                                padding: "3px 10px",
                                borderRadius: "var(--radius-full)",
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>

                <h3
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--color-text)",
                        marginBottom: 12,
                        lineHeight: 1.3,
                    }}
                >
                    {tour.title}
                </h3>

                {/* Highlights */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                    {tour.highlights.map((h, i) => (
                        <li key={i} style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                            <span style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 1 }}>•</span>
                            {h}
                        </li>
                    ))}
                </ul>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                    <StarRating rating={tour.rating} />
                    <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                        {tour.rating} ({tour.reviews} ulasan)
                    </span>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(0,0,0,0.07)",
                        paddingTop: 14,
                    }}
                >
                    <div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>mulai dari</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-body)" }}>
                            {fmt(tour.price)}
                        </div>
                    </div>
                    <Link
                        href={`/tours/${tour.id}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: "var(--color-accent)",
                            color: "white",
                            padding: "9px 18px",
                            borderRadius: "var(--radius-full)",
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "var(--font-body)",
                            textDecoration: "none",
                            transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-light)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; }}
                    >
                        Selengkapnya
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <span
                onClick={onChange}
                style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: checked ? "2px solid var(--color-primary)" : "2px solid #D1D5DB",
                    background: checked ? "var(--color-primary)" : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                }}
            >
                {checked && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
                        <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                )}
            </span>
            <span style={{ fontSize: 14, color: "var(--color-text-light)", fontFamily: "var(--font-body)" }}>{label}</span>
        </label>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                {title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {children}
            </div>
        </div>
    );
}