"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { inquirySchema } from "@/validation/inquirySchema";
import * as yup from "yup";

const PHONE_CODES = [
    { code: "+62", flag: "🇮🇩", country: "Indonesia" }, { code: "+1", flag: "🇺🇸", country: "USA" }, { code: "+44", flag: "🇬🇧", country: "UK" }, { code: "+61", flag: "🇦🇺", country: "Australia" }, { code: "+81", flag: "🇯🇵", country: "Japan" }, { code: "+82", flag: "🇰🇷", country: "South Korea" }, { code: "+86", flag: "🇨🇳", country: "China" }, { code: "+91", flag: "🇮🇳", country: "India" }, { code: "+60", flag: "🇲🇾", country: "Malaysia" }, { code: "+65", flag: "🇸🇬", country: "Singapore" }, { code: "+66", flag: "🇹🇭", country: "Thailand" }, { code: "+84", flag: "🇻🇳", country: "Vietnam" }, { code: "+63", flag: "🇵🇭", country: "Philippines" }, { code: "+49", flag: "🇩🇪", country: "Germany" }, { code: "+33", flag: "🇫🇷", country: "France" }, { code: "+39", flag: "🇮🇹", country: "Italy" }, { code: "+34", flag: "🇪🇸", country: "Spain" }, { code: "+31", flag: "🇳🇱", country: "Netherlands" }, { code: "+46", flag: "🇸🇪", country: "Sweden" }, { code: "+47", flag: "🇳🇴", country: "Norway" }, { code: "+7", flag: "🇷🇺", country: "Russia" }, { code: "+55", flag: "🇧🇷", country: "Brazil" }, { code: "+52", flag: "🇲🇽", country: "Mexico" }, { code: "+971", flag: "🇦🇪", country: "UAE" }, { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" }, { code: "+90", flag: "🇹🇷", country: "Turkey" }, { code: "+48", flag: "🇵🇱", country: "Poland" }, { code: "+41", flag: "🇨🇭", country: "Switzerland" }, { code: "+43", flag: "🇦🇹", country: "Austria" }, { code: "+351", flag: "🇵🇹", country: "Portugal" }, { code: "+380", flag: "🇺🇦", country: "Ukraine" }, { code: "+40", flag: "🇷🇴", country: "Romania" }, { code: "+30", flag: "🇬🇷", country: "Greece" },
];

const SUBJECTS = [
    "Informasi Umum Paket Wisata",
    "Ketersediaan Jadwal",
    "Harga & Pembayaran",
    "Custom / Private Tour",
    "Akomodasi & Transportasi",
    "Visa & Dokumentasi Perjalanan",
    "Kerjasama & Partnership",
    "Komplain / Masukan",
    "Lainnya",
];

const TOUR_LOOKUP: Record<string, { title: string; duration: string }> = {
    "pesona-desa-wisata-penglipuran": { title: "Pesona Desa Wisata Penglipuran", duration: "3 hari" },
    "jelajah-desa-wae-rebo": { title: "Jelajah Desa Wae Rebo", duration: "4 hari" },
    "desa-wisata-nglanggeran": { title: "Desa Wisata Nglanggeran", duration: "2 hari" },
    "desa-wisata-trunyan-kintamani": { title: "Desa Wisata Trunyan & Kintamani", duration: "5 hari" },
    "desa-sade-lombok": { title: "Desa Sade Lombok", duration: "3 hari" },
    "desa-wisata-osing-banyuwangi": { title: "Desa Wisata Osing Banyuwangi", duration: "4 hari" },
};

const STEPS = [
    { num: 1, label: "Pilih Tur", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { num: 2, label: "Kirim Pertanyaan", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
    { num: 3, label: "Jawaban 24 Jam", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const BENEFITS = [
    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Tur yang disesuaikan — untuk setiap minat" },
    { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", text: "Personalisasi perjalanan sesuai keinginan Anda" },
    { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", text: "Wujudkan impian wisata desa Anda" },
];

// ─── Styles & Helpers ─────────────────────────────────────────────────────────
const focusCss = `
    input:focus, select:focus, textarea:focus {
        border-color: var(--color-primary) !important;
        box-shadow: 0 0 0 3px rgba(26,92,56,0.12) !important;
    }
    @keyframes fadeSlideUp { 0% { opacity:0; transform:translateY(20px); } 100% { opacity:1; transform:translateY(0); }}
    @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); }}
    @keyframes shimmerGlow { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; }}
    .inquiry-section { animation: fadeSlideUp 0.6s ease both; }
`;

const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: "var(--radius-md)",
    border: "1.5px solid rgba(0,0,0,0.10)", fontFamily: "var(--font-body)", fontSize: 14,
    color: "var(--color-text)", background: "white", outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s", boxSizing: "border-box" as const,
};

const labelStyle = {
    fontSize: 13, fontWeight: 600 as const, color: "var(--color-text)",
    fontFamily: "var(--font-body)", marginBottom: 6, display: "block" as const,
};

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <div style={{ fontSize: 12, color: "#DC2626", fontFamily: "var(--font-body)", marginTop: 5, display: "flex", alignItems: "center", gap: 4, animation: "fadeSlideUp 0.3s ease" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#DC2626"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            {msg}
        </div>
    );
}

function SectionIcon({ d }: { d: string }) {
    return (
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-primary), #2d8f5e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
        </div>
    );
}

// ─── Success State ────────────────────────────────────────────────────────────
function SuccessState() {
    return (
        <div style={{ textAlign: "center", padding: "60px 24px", animation: "fadeSlideUp 0.6s ease" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, rgba(26,92,56,0.1), rgba(45,143,94,0.18))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "pulse 2s ease infinite" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: "var(--color-text)", marginBottom: 10 }}>Pertanyaan Terkirim!</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-text-muted)", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.7 }}>
                Terima kasih atas pertanyaan Anda. Tim kami akan merespons dalam waktu <strong>24 jam</strong>.
            </p>
            <Link href="/tours" className="btn-primary" style={{ padding: "14px 28px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Jelajahi Paket Wisata Lainnya
            </Link>
        </div>
    );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function InquiryContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const hasSlug = !!slug;
    const tour = slug ? (TOUR_LOOKUP[slug] ?? { title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), duration: "-" }) : null;

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        phoneCode: "+62", phoneNumber: "",
        subject: "", travelPlans: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const set = useCallback((field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }, []);

    const handleSubmit = async () => {
        try {
            await inquirySchema.validate(form, { abortEarly: false, context: { hasSlug } });
            setErrors({});
            setSubmitted(true);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                err.inner.forEach(e => { if (e.path) newErrors[e.path] = e.message; });
                setErrors(newErrors);
                const firstField = err.inner[0]?.path;
                if (firstField) {
                    const el = document.querySelector(`[name="${firstField}"]`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        }
    };

    return (
        <>
            <style>{focusCss}</style>

            {/* ── Hero Section ──────────────────────────── */}
            <section style={{ background: "linear-gradient(135deg, #0d3b22 0%, var(--color-primary-dark) 30%, var(--color-primary) 65%, #2d8f5e 100%)", padding: "120px 24px 54px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ position: "absolute", bottom: -40, left: "15%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
                <div style={{ position: "absolute", top: "40%", right: "25%", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />

                <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
                    {/* Breadcrumb */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, fontFamily: "var(--font-body)" }}>
                        <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Beranda</Link>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        <Link href="/tours" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Paket Wisata</Link>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        <span style={{ color: "rgba(255,255,255,0.8)" }}>Tanya Kami</span>
                    </div>

                    {/* Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "white", margin: 0 }}>
                            {hasSlug ? "Tanyakan Tentang Tur Ini" : "Ada Pertanyaan?"}
                        </h1>
                    </div>

                    {/* Benefits */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", marginBottom: 36 }}>
                        {BENEFITS.map((b, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={b.icon} /></svg>
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)" }}>{b.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Steps */}
                    <div className="steps-row" style={{ display: "flex", gap: 0, overflowX: "auto" }}>
                        {STEPS.map((s, i) => (
                            <div key={s.num} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: "50%",
                                        background: s.num <= 2 ? "white" : "rgba(255,255,255,0.12)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.4s",
                                        boxShadow: s.num === 2 ? "0 0 0 3px rgba(255,255,255,0.25)" : "none",
                                    }}>
                                        {s.num < 2
                                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.num === 2 ? "var(--color-primary)" : "rgba(255,255,255,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                                        }
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: s.num === 2 ? 700 : 400, color: s.num <= 2 ? "white" : "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ width: 40, height: 2, background: s.num < 2 ? "white" : "rgba(255,255,255,0.15)", margin: "0 14px", flexShrink: 0 }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Main Form ────────────────────────────── */}
            <main style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px" }}>
                <div className="inquiry-layout" style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
                    {/* Left — Form */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {submitted ? (
                            <SuccessState />
                        ) : (
                            <>
                                {/* Personal Info Section */}
                                <div className="inquiry-section" style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", marginBottom: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                                        <SectionIcon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        <div>
                                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>Informasi Pribadi</h2>
                                            <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", margin: 0 }}>Data kontak untuk membalas pertanyaan Anda</p>
                                        </div>
                                    </div>

                                    {/* Name Row */}
                                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                        <div>
                                            <label style={labelStyle}>Nama Depan <span style={{ color: "#DC2626" }}>*</span></label>
                                            <input name="firstName" value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Nama depan" style={{ ...inputStyle, borderColor: errors.firstName ? "#DC2626" : undefined }} />
                                            <FieldError msg={errors.firstName} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Nama Belakang <span style={{ color: "#DC2626" }}>*</span></label>
                                            <input name="lastName" value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Nama belakang" style={{ ...inputStyle, borderColor: errors.lastName ? "#DC2626" : undefined }} />
                                            <FieldError msg={errors.lastName} />
                                        </div>
                                    </div>

                                    {/* Email & Phone Row */}
                                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        <div>
                                            <label style={labelStyle}>Email <span style={{ color: "#DC2626" }}>*</span></label>
                                            <input name="email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@contoh.com" style={{ ...inputStyle, borderColor: errors.email ? "#DC2626" : undefined }} />
                                            <FieldError msg={errors.email} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Nomor Telepon</label>
                                            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 8 }}>
                                                <select name="phoneCode" value={form.phoneCode} onChange={e => set("phoneCode", e.target.value)} style={{ ...inputStyle, padding: "13px 8px" }}>
                                                    {PHONE_CODES.map(p => (
                                                        <option key={`${p.code}-${p.country}`} value={p.code}>{p.flag} {p.code}</option>
                                                    ))}
                                                </select>
                                                <input name="phoneNumber" value={form.phoneNumber} onChange={e => set("phoneNumber", e.target.value.replace(/\D/g, ""))} placeholder="81234567890" style={{ ...inputStyle, borderColor: errors.phoneNumber ? "#DC2626" : undefined }} />
                                            </div>
                                            <FieldError msg={errors.phoneNumber} />
                                        </div>
                                    </div>
                                </div>

                                {/* Travel Plans Section */}
                                <div className="inquiry-section" style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", marginBottom: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", animationDelay: "0.15s" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                                        <SectionIcon d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        <div>
                                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
                                                {hasSlug ? "Detail Pertanyaan" : "Pertanyaan Anda"}
                                            </h2>
                                            <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", margin: 0 }}>
                                                {hasSlug ? "Ceritakan apa yang ingin Anda ketahui tentang tur ini" : "Pilih topik dan sampaikan pertanyaan Anda"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Subject — only for general inquiry */}
                                    {!hasSlug && (
                                        <div style={{ marginBottom: 20 }}>
                                            <label style={labelStyle}>Topik Pertanyaan <span style={{ color: "#DC2626" }}>*</span></label>
                                            <select name="subject" value={form.subject} onChange={e => set("subject", e.target.value)} style={{ ...inputStyle, borderColor: errors.subject ? "#DC2626" : undefined }}>
                                                <option value="">Pilih topik</option>
                                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <FieldError msg={errors.subject} />
                                        </div>
                                    )}

                                    {/* Travel Plans */}
                                    <div>
                                        <label style={labelStyle}>
                                            {hasSlug ? "Pertanyaan tentang tur ini" : "Detail pertanyaan Anda"} <span style={{ color: "#DC2626" }}>*</span>
                                        </label>
                                        <textarea
                                            name="travelPlans"
                                            value={form.travelPlans}
                                            onChange={e => set("travelPlans", e.target.value)}
                                            rows={6}
                                            placeholder={hasSlug
                                                ? "Ceritakan apa yang ingin Anda ketahui tentang tur ini. Misalnya: jadwal, aktivitas, akomodasi, dll."
                                                : "Sampaikan detail pertanyaan atau kebutuhan Anda. Semakin lengkap informasi, semakin baik kami dapat membantu."}
                                            style={{ ...inputStyle, resize: "vertical" as const, borderColor: errors.travelPlans ? "#DC2626" : undefined }}
                                        />
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                            <FieldError msg={errors.travelPlans} />
                                            <span style={{ fontSize: 12, color: form.travelPlans.length > 1800 ? "#DC2626" : "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                                                {form.travelPlans.length}/2000
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    className="btn-primary"
                                    style={{
                                        width: "100%", justifyContent: "center", padding: "17px 32px", fontSize: 16,
                                        background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #2d8f5e)",
                                        borderRadius: "var(--radius-md)", boxShadow: "0 4px 14px rgba(26,92,56,0.3)",
                                        transition: "all 0.3s, transform 0.2s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,92,56,0.4)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(26,92,56,0.3)"; }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Kirim Pertanyaan
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="inquiry-sidebar" style={{ width: 340, flexShrink: 0, position: "sticky", top: 140 }}>
                        {/* Tour Info Card */}
                        {hasSlug && tour && (
                            <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-lg)", padding: "24px 22px", boxShadow: "var(--shadow-md)", marginBottom: 20 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14, paddingBottom: 12, borderBottom: "2px solid var(--color-primary)" }}>
                                    Info Tur
                                </div>
                                <Link href={`/tours/${slug}`} style={{ fontSize: 17, fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-heading)", textDecoration: "none", lineHeight: 1.3, display: "block", marginBottom: 10 }}>
                                    {tour.title}
                                </Link>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {tour.duration}
                                </div>
                            </div>
                        )}

                        {/* Help Card */}
                        <div style={{ background: "linear-gradient(135deg, rgba(26,92,56,0.04), rgba(45,143,94,0.08))", border: "1px solid rgba(26,92,56,0.1)", borderRadius: "var(--radius-lg)", padding: "22px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-primary), #2d8f5e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <span style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: "var(--color-text)" }}>Butuh Bantuan?</span>
                            </div>
                            <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: 14 }}>
                                Tim kami siap membantu Anda merencanakan perjalanan sempurna. Hubungi kami langsung:
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    info@desawisata.id
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    +62 812 3456 7890
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <style>{`
                @media (max-width: 1024px) {
                    .inquiry-sidebar { display: none !important; }
                    .inquiry-layout { flex-direction: column !important; }
                }
                @media (max-width: 640px) {
                    .form-row { grid-template-columns: 1fr !important; }
                    .steps-row { gap: 4px !important; }
                }
            `}</style>
        </>
    );
}

// ─── Page Export ───────────────────────────────────────────────────────────────
export default function InquiryPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
            <InquiryContent />
        </Suspense>
    );
}
