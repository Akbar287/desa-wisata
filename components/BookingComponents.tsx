'use client'
import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { bookingSchema, type BookingFormData } from "@/validation/bookingSchema";
import * as yup from "yup";
import { fmt } from "@/lib/utils";

export default function BookingComponents({
    nationalities,
    findUsOptions,
    phoneCodes,
    tourLookup,
    steps,
}: {
    nationalities: string[];
    findUsOptions: string[];
    phoneCodes: { code: string; flag: string; country: string; }[];
    tourLookup: Record<string, { title: string; duration: string; price: number }>;
    steps: { num: number; label: string; icon: string }[];
}) {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
            <BookingContent nationalities={nationalities} findUsOptions={findUsOptions} phoneCodes={phoneCodes} tourLookup={tourLookup} steps={steps} />
        </Suspense>
    );
}

const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid rgba(0,0,0,0.10)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    color: "var(--color-text)",
    background: "white",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s, transform 0.2s",
    boxSizing: "border-box" as const,
};

const focusCss = `
    input:focus, select:focus, textarea:focus {
        border-color: var(--color-primary) !important;
        box-shadow: 0 0 0 3px rgba(26,92,56,0.12) !important;
    }
    @keyframes fadeSlideUp { 0% { opacity:0; transform:translateY(20px); } 100% { opacity:1; transform:translateY(0); }}
    @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); }}
    @keyframes floatUp { 0% { transform:translateY(0) rotate(0); opacity:0.7; } 100% { transform:translateY(-80px) rotate(20deg); opacity:0; }}
    .booking-section { animation: fadeSlideUp 0.6s ease both; }
    .booking-section:nth-child(2) { animation-delay: 0.15s; }
`;

const labelStyle = {
    fontSize: 13,
    fontWeight: 600 as const,
    color: "var(--color-text)",
    fontFamily: "var(--font-body)",
    marginBottom: 6,
    display: "block" as const,
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
};

const TERMS_CONTENT = [
    { title: "Pemesanan & Konfirmasi", text: "Pemesanan dianggap sah setelah formulir diisi lengkap dan dikonfirmasi oleh tim kami melalui email atau telepon. Konfirmasi akan dikirimkan dalam 1×24 jam kerja." },
    { title: "Pembayaran", text: "Pembayaran dapat dilakukan melalui transfer bank atau metode pembayaran lain yang tersedia. Uang muka sebesar 30% dari total biaya harus dibayarkan dalam 3 hari setelah konfirmasi pemesanan." },
    { title: "Pelunasan", text: "Pelunasan penuh harus diselesaikan paling lambat 7 hari sebelum tanggal keberangkatan. Pemesanan akan otomatis dibatalkan jika pelunasan tidak diterima tepat waktu." },
    { title: "Pembatalan oleh Peserta", text: "Pembatalan lebih dari 14 hari sebelum keberangkatan: pengembalian 80%. Pembatalan 7–14 hari sebelum: pengembalian 50%. Pembatalan kurang dari 7 hari: tidak ada pengembalian." },
    { title: "Pembatalan oleh Penyelenggara", text: "Kami berhak membatalkan perjalanan karena alasan keamanan, cuaca buruk, atau jumlah peserta minimum tidak terpenuhi. Dalam hal ini, pengembalian penuh akan diberikan." },
    { title: "Perubahan Jadwal", text: "Perubahan jadwal dapat dilakukan maksimal 10 hari sebelum keberangkatan, tergantung ketersediaan. Perubahan dapat dikenakan biaya administrasi." },
    { title: "Tanggung Jawab Peserta", text: "Peserta wajib mematuhi peraturan setempat dan mengikuti arahan pemandu wisata. Peserta bertanggung jawab atas barang pribadi selama perjalanan." },
    { title: "Asuransi Perjalanan", text: "Paket wisata telah mencakup asuransi perjalanan dasar. Peserta disarankan untuk mengambil asuransi tambahan sesuai kebutuhan pribadi." },
    { title: "Dokumentasi", text: "Peserta wajib membawa identitas resmi (KTP/Paspor) yang masih berlaku selama perjalanan. Untuk wisata ke daerah tertentu, surat izin tambahan mungkin diperlukan." },
    { title: "Force Majeure", text: "Kami tidak bertanggung jawab atas kerugian yang disebabkan oleh bencana alam, pandemi, kebijakan pemerintah, atau kondisi di luar kendali kami." },
    { title: "Persetujuan", text: "Dengan melanjutkan pemesanan, peserta dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku." },
];

const PRIVACY_CONTENT = [
    { title: "Data yang Dikumpulkan", text: "Kami mengumpulkan data pribadi seperti nama lengkap, email, nomor telepon, tanggal lahir, dan kewarganegaraan yang Anda berikan saat mengisi formulir pemesanan." },
    { title: "Tujuan Penggunaan Data", text: "Data pribadi Anda digunakan untuk memproses pemesanan, menghubungi Anda terkait perjalanan, memberikan layanan pelanggan, dan mengirimkan informasi terkait wisata." },
    { title: "Penyimpanan Data", text: "Data Anda disimpan secara aman dengan enkripsi standar industri. Kami menyimpan data selama diperlukan untuk tujuan pemesanan dan sesuai dengan peraturan yang berlaku." },
    { title: "Berbagi Data", text: "Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Data hanya dibagikan kepada mitra operasional (hotel, transportasi) sejauh diperlukan untuk layanan." },
    { title: "Keamanan Data", text: "Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran." },
    { title: "Hak Pengguna", text: "Anda berhak meminta akses, koreksi, atau penghapusan data pribadi Anda. Hubungi kami melalui email untuk mengajukan permintaan terkait data Anda." },
    { title: "Cookie & Analitik", text: "Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna. Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda." },
    { title: "Perubahan Kebijakan", text: "Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di website kami." },
];

function LegalModal({ type, onClose }: { type: "terms" | "privacy"; onClose: () => void }) {
    const isTerms = type === "terms";
    const title = isTerms ? "Syarat & Ketentuan" : "Kebijakan Privasi";
    const subtitle = isTerms ? "Harap baca dengan seksama sebelum melanjutkan" : "Bagaimana kami melindungi data pribadi Anda";
    const items = isTerms ? TERMS_CONTENT : PRIVACY_CONTENT;
    const iconPath = isTerms
        ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z";

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeSlideUp 0.3s ease", overscrollBehavior: "contain" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 600, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
                {/* Header */}
                <div style={{ background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #2d8f5e)", padding: "24px 28px", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={iconPath} /></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>{title}</h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-body)", margin: 0 }}>{subtitle}</p>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.35)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Scrollable content */}
                <div style={{ overflowY: "auto", padding: "24px 28px", flex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {items.map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", background: i % 2 === 0 ? "var(--color-bg-light)" : "white", borderRadius: "var(--radius-md)", border: "1px solid rgba(0,0,0,0.04)" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-primary), #2d8f5e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                                    <span style={{ color: "white", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-body)" }}>{i + 1}</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-heading)", marginBottom: 4 }}>{item.title}</div>
                                    <div style={{ fontSize: 13, color: "var(--color-text-light)", fontFamily: "var(--font-body)", lineHeight: 1.65 }}>{item.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "16px 28px", borderTop: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}>
                    <button onClick={onClose} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 28px" }}>
                        Saya Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfirmModal({ data, tour, startDate, endDate, onConfirm, onCancel }: {
    data: BookingFormData;
    tour: { title: string; duration: string; price: number };
    startDate: string;
    endDate: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const totalPrice = tour.price * (data.adults + (data.children ?? 0));
    return (
        <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeSlideUp 0.3s ease" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
                {/* Gradient Header */}
                <div style={{ background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #2d8f5e)", padding: "24px 28px", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>Konfirmasi Pemesanan</h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-body)", margin: 0 }}>Pastikan semua data sudah benar</p>
                    </div>
                </div>
                <div style={{ padding: "24px 28px" }}>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                        {[
                            { l: "Paket Wisata", v: tour.title },
                            { l: "Tanggal", v: `${startDate} — ${endDate}` },
                            { l: "Nama", v: `${data.firstName} ${data.lastName}` },
                            { l: "Email", v: data.email },
                            { l: "Telepon", v: `${data.phoneCode} ${data.phoneNumber}` },
                            { l: "Kewarganegaraan", v: data.nationality },
                            { l: "Dewasa / Anak", v: `${data.adults} dewasa, ${data.children ?? 0} anak` },
                            { l: "Estimasi Total", v: fmt(totalPrice) },
                        ].map((r) => (
                            <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontFamily: "var(--font-body)", paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                                <span style={{ color: "var(--color-text-muted)" }}>{r.l}</span>
                                <span style={{ color: "var(--color-text)", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{r.v}</span>
                            </div>
                        ))}
                    </div>

                    {data.comments && (
                        <div style={{ background: "var(--color-bg-light)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 24 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 4, fontFamily: "var(--font-body)" }}>Catatan:</div>
                            <div style={{ fontSize: 14, color: "var(--color-text-light)", fontFamily: "var(--font-body)" }}>{data.comments}</div>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={onCancel} className="btn-outline" style={{ flex: 1, justifyContent: "center" }}>Kembali</button>
                        <button onClick={onConfirm} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            Konfirmasi & Lanjutkan
                        </button>
                    </div>
                </div>{/* end padding div */}
            </div>
        </div>
    );
}

function NoTourSelected() {
    return (
        <>
            <style>{focusCss}</style>
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center", background: "linear-gradient(180deg, var(--color-bg-light) 0%, white 100%)", animation: "fadeSlideUp 0.6s ease" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, rgba(26,92,56,0.1), rgba(45,143,94,0.15))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, animation: "pulse 2s ease infinite" }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7v4m-2-2h4" /></svg>
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "var(--color-text)", marginBottom: 12, background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Belum Ada Paket yang Dipilih
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-text-muted)", maxWidth: 440, marginBottom: 32, lineHeight: 1.7 }}>
                    Untuk melakukan pemesanan, silakan pilih paket wisata dan jadwal keberangkatan terlebih dahulu.
                </p>
                <Link href="/tours" className="btn-primary" style={{ padding: "14px 28px", fontSize: 15 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Jelajahi Paket Wisata
                </Link>
            </div>
        </>
    );
}

function BookingContent({
    nationalities,
    findUsOptions,
    phoneCodes,
    tourLookup,
    steps,
}: {
    nationalities: string[];
    findUsOptions: string[];
    phoneCodes: { code: string; flag: string; country: string; }[];
    tourLookup: Record<string, { title: string; duration: string; price: number }>;
    steps: { num: number; label: string; icon: string }[];
}) {
    const searchParams = useSearchParams();

    const slug = searchParams.get("slug");
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    // Check params
    if (!slug || !startDate || !endDate) {
        return <NoTourSelected />;
    }

    const tour = tourLookup[slug] ?? { title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), duration: "-", price: 0 };

    return <BookingForm tour={tour} startDate={startDate} endDate={endDate} nationalities={nationalities} steps={steps} findUsOptions={findUsOptions} phoneCodes={phoneCodes} />;
}

function BookingForm({
    tour,
    startDate,
    endDate,
    nationalities,
    findUsOptions,
    phoneCodes,
    steps,
}: {
    tour: { title: string; duration: string; price: number };
    startDate: string;
    endDate: string;
    nationalities: string[];
    findUsOptions: string[];
    phoneCodes: { code: string; flag: string; country: string; }[];
    steps: { num: number; label: string; icon: string }[];
}) {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "", lastName: "", gender: "", birthYear: "", birthMonth: "", birthDay: "",
        nationality: "", email: "", phoneCode: "+62", phoneNumber: "",
        adults: 1, children: 0, findUs: "", comments: "", acceptTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

    const set = useCallback((field: string, value: string | number | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }, []);

    const totalPrice = useMemo(() => tour.price * (form.adults + form.children), [tour.price, form.adults, form.children]);

    // Years for DOB
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 80 }, (_, i) => currentYear - 10 - i);
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleSubmit = async () => {
        try {
            await bookingSchema.validate(form, { abortEarly: false });
            setErrors({});
            setShowConfirm(true);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                err.inner.forEach((e) => { if (e.path) newErrors[e.path] = e.message; });
                setErrors(newErrors);
                // Scroll to first error
                const firstErrorField = err.inner[0]?.path;
                if (firstErrorField) {
                    const el = document.querySelector(`[name="${firstErrorField}"]`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        }
    };

    const handleConfirm = () => {
        setSubmitting(true);
        setTimeout(() => {
            alert("Pemesanan berhasil! Tim kami akan menghubungi Anda segera.");
            router.push("/tours");
        }, 800);
    };

    return (
        <>
            <style>{focusCss}</style>

            {/* Progress Steps */}
            <section style={{ background: "linear-gradient(135deg, #0d3b22 0%, var(--color-primary-dark) 30%, var(--color-primary) 65%, #2d8f5e 100%)", padding: "120px 24px 54px", position: "relative", overflow: "hidden" }}>
                {/* Decorative circles */}
                <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ position: "absolute", bottom: -30, left: "20%", width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
                <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        </div>
                        <div>
                            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "white", margin: 0 }}>Pemesanan</h1>
                        </div>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.65)", marginBottom: 36, maxWidth: 480 }}>
                        Lengkapi informasi di bawah ini untuk memesan paket wisata Anda.
                    </p>
                    {/* Steps */}
                    <div className="steps-row" style={{ display: "flex", gap: 0, overflowX: "auto" }}>
                        {steps.map((s, i) => (
                            <div key={s.num} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: "50%",
                                        background: s.num <= 2 ? "white" : "rgba(255,255,255,0.12)",
                                        color: s.num <= 2 ? "var(--color-primary)" : "rgba(255,255,255,0.4)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.4s",
                                        boxShadow: s.num === 2 ? "0 0 0 3px rgba(255,255,255,0.25)" : "none",
                                    }}>
                                        {s.num < 2
                                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                                        }
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: s.num === 2 ? 700 : 400, color: s.num <= 2 ? "white" : "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div style={{ width: 40, height: 2, background: s.num < 2 ? "white" : "rgba(255,255,255,0.2)", margin: "0 12px", flexShrink: 0 }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <main style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px" }}>
                <div className="booking-layout" style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
                    {/* Left — Form Fields */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                        {/* Section: Personal Info */}
                        <div className="booking-section" style={{ marginBottom: 48, background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                                <SectionIcon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                <div>
                                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>Informasi Pribadi</h2>
                                    <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", margin: 0 }}>Isi sesuai dengan identitas resmi Anda</p>
                                </div>
                            </div>

                            {/* Name Row */}
                            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                <div>
                                    <label style={labelStyle}>Nama Depan <span style={{ color: "#DC2626" }}>*</span></label>
                                    <input name="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Nama depan" style={{ ...inputStyle, borderColor: errors.firstName ? "#DC2626" : undefined }} />
                                    <FieldError msg={errors.firstName} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Nama Belakang <span style={{ color: "#DC2626" }}>*</span></label>
                                    <input name="lastName" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Nama belakang" style={{ ...inputStyle, borderColor: errors.lastName ? "#DC2626" : undefined }} />
                                    <FieldError msg={errors.lastName} />
                                </div>
                            </div>

                            {/* Gender */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Jenis Kelamin <span style={{ color: "#DC2626" }}>*</span></label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    {[{ v: "male", l: "Laki-laki" }, { v: "female", l: "Perempuan" }].map(({ v, l }) => (
                                        <button key={v} type="button" onClick={() => set("gender", v)} style={{
                                            flex: 1, padding: "12px 20px", borderRadius: "var(--radius-sm)",
                                            border: form.gender === v ? "2px solid var(--color-primary)" : errors.gender ? "2px solid #DC2626" : "1.5px solid rgba(0,0,0,0.12)",
                                            background: form.gender === v ? "var(--color-bg-light)" : "white",
                                            color: form.gender === v ? "var(--color-primary)" : "var(--color-text-light)",
                                            fontWeight: form.gender === v ? 700 : 400,
                                            fontSize: 14, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s",
                                        }}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" name="gender" value={form.gender} />
                                <FieldError msg={errors.gender} />
                            </div>

                            {/* DOB */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Tanggal Lahir <span style={{ color: "#DC2626" }}>*</span></label>
                                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                    <div>
                                        <select name="birthYear" value={form.birthYear} onChange={(e) => set("birthYear", e.target.value)} style={{ ...inputStyle, borderColor: errors.birthYear ? "#DC2626" : undefined }}>
                                            <option value="">Tahun</option>
                                            {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
                                        </select>
                                        <FieldError msg={errors.birthYear} />
                                    </div>
                                    <div>
                                        <select name="birthMonth" value={form.birthMonth} onChange={(e) => set("birthMonth", e.target.value)} style={{ ...inputStyle, borderColor: errors.birthMonth ? "#DC2626" : undefined }}>
                                            <option value="">Bulan</option>
                                            {months.map((m, i) => <option key={i} value={String(i + 1)}>{m}</option>)}
                                        </select>
                                        <FieldError msg={errors.birthMonth} />
                                    </div>
                                    <div>
                                        <select name="birthDay" value={form.birthDay} onChange={(e) => set("birthDay", e.target.value)} style={{ ...inputStyle, borderColor: errors.birthDay ? "#DC2626" : undefined }}>
                                            <option value="">Hari</option>
                                            {days.map((d) => <option key={d} value={String(d)}>{d}</option>)}
                                        </select>
                                        <FieldError msg={errors.birthDay} />
                                    </div>
                                </div>
                            </div>

                            {/* Nationality */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Kewarganegaraan <span style={{ color: "#DC2626" }}>*</span></label>
                                <select name="nationality" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} style={{ ...inputStyle, borderColor: errors.nationality ? "#DC2626" : undefined }}>
                                    <option value="">Pilih kewarganegaraan</option>
                                    {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <FieldError msg={errors.nationality} />
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Email <span style={{ color: "#DC2626" }}>*</span></label>
                                <input name="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@contoh.com" style={{ ...inputStyle, borderColor: errors.email ? "#DC2626" : undefined }} />
                                <FieldError msg={errors.email} />
                            </div>

                            {/* Phone */}
                            <div style={{ marginBottom: 0 }}>
                                <label style={labelStyle}>Nomor Telepon <span style={{ color: "#DC2626" }}>*</span></label>
                                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12 }}>
                                    <div>
                                        <select name="phoneCode" value={form.phoneCode} onChange={(e) => set("phoneCode", e.target.value)} style={{ ...inputStyle }}>
                                            {phoneCodes.map((p) => (
                                                <option key={`${p.code}-${p.country}`} value={p.code}>{p.flag} {p.code} {p.country}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <input name="phoneNumber" value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value.replace(/\D/g, ""))} placeholder="81234567890" style={{ ...inputStyle, borderColor: errors.phoneNumber ? "#DC2626" : undefined }} />
                                        <FieldError msg={errors.phoneNumber} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Booking Info */}
                        <div className="booking-section" style={{ marginBottom: 48, background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                                <SectionIcon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                <div>
                                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>Informasi Pemesanan</h2>
                                    <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", margin: 0 }}>Detail perjalanan Anda</p>
                                </div>
                            </div>

                            {/* Dates (read-only) */}
                            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                <div>
                                    <label style={labelStyle}>Tanggal Berangkat</label>
                                    <input value={startDate} readOnly style={{ ...inputStyle, background: "var(--color-bg-light)", color: "var(--color-text-muted)" }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Tanggal Kembali</label>
                                    <input value={endDate} readOnly style={{ ...inputStyle, background: "var(--color-bg-light)", color: "var(--color-text-muted)" }} />
                                </div>
                            </div>

                            {/* Adults / Children */}
                            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                <div>
                                    <label style={labelStyle}>Jumlah Dewasa <span style={{ color: "#DC2626" }}>*</span></label>
                                    <input name="adults" type="number" min={1} max={20} value={form.adults} onChange={(e) => set("adults", Math.max(1, parseInt(e.target.value) || 1))} style={{ ...inputStyle, borderColor: errors.adults ? "#DC2626" : undefined }} />
                                    <FieldError msg={errors.adults} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Jumlah Anak</label>
                                    <input name="children" type="number" min={0} max={10} value={form.children} onChange={(e) => set("children", Math.max(0, parseInt(e.target.value) || 0))} style={{ ...inputStyle }} />
                                    <FieldError msg={errors.children} />
                                </div>
                            </div>

                            {/* Estimated total */}
                            <div style={{ background: "linear-gradient(135deg, rgba(26,92,56,0.06), rgba(45,143,94,0.1))", borderRadius: "var(--radius-md)", padding: "18px 22px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(26,92,56,0.12)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>Estimasi total ({form.adults + form.children} pax)</span>
                                </div>
                                <span style={{ fontSize: 22, fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-body)" }}>{fmt(totalPrice)}</span>
                            </div>

                            {/* How found */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Darimana Anda mengetahui kami? <span style={{ color: "#DC2626" }}>*</span></label>
                                <select name="findUs" value={form.findUs} onChange={(e) => set("findUs", e.target.value)} style={{ ...inputStyle, borderColor: errors.findUs ? "#DC2626" : undefined }}>
                                    <option value="">Pilih sumber</option>
                                    {findUsOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <FieldError msg={errors.findUs} />
                            </div>

                            {/* Comments */}
                            <div>
                                <label style={labelStyle}>Pertanyaan atau catatan (opsional)</label>
                                <textarea name="comments" value={form.comments} onChange={(e) => set("comments", e.target.value)} rows={4} placeholder="Ada permintaan khusus? Diet tertentu? Alergi?" style={{ ...inputStyle, resize: "vertical" as const }} />
                                <FieldError msg={errors.comments} />
                            </div>
                        </div>

                        {/* Terms */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", userSelect: "none" }}>
                                <span
                                    onClick={() => set("acceptTerms", !form.acceptTerms)}
                                    style={{
                                        width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
                                        border: form.acceptTerms ? "2px solid var(--color-primary)" : errors.acceptTerms ? "2px solid #DC2626" : "2px solid #D1D5DB",
                                        background: form.acceptTerms ? "var(--color-primary)" : "white",
                                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                                    }}
                                >
                                    {form.acceptTerms && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
                                </span>
                                <span style={{ fontSize: 14, color: "var(--color-text-light)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                                    Saya menyetujui <a onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLegalModal("terms"); }} href="#" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>syarat & ketentuan</a> dan telah membaca <a onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLegalModal("privacy"); }} href="#" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>kebijakan privasi</a>.
                                </span>
                            </label>
                            <input type="hidden" name="acceptTerms" value={form.acceptTerms ? "true" : ""} />
                            <FieldError msg={errors.acceptTerms} />
                        </div>

                        {/* Submit */}
                        <button onClick={handleSubmit} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "17px 32px", fontSize: 16, background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #2d8f5e)", borderRadius: "var(--radius-md)", boxShadow: "0 4px 14px rgba(26,92,56,0.3)", transition: "all 0.3s, transform 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,92,56,0.4)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(26,92,56,0.3)"; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                            Lanjutkan Pemesanan
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>

                    {/* Sidebar */}
                    <aside className="booking-sidebar" style={{ width: 340, flexShrink: 0, position: "sticky", top: 140 }}>
                        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-lg)", padding: "24px 22px", boxShadow: "var(--shadow-md)" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14, paddingBottom: 12, borderBottom: "2px solid var(--color-primary)" }}>
                                Ringkasan Pemesanan
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <Link href="/tours" style={{ fontSize: 17, fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-heading)", textDecoration: "none", lineHeight: 1.3, display: "block", marginBottom: 8 }}>
                                    {tour.title}
                                </Link>
                                <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                                    <span>⏱ {tour.duration}</span>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                                {[
                                    { l: "Berangkat", v: startDate },
                                    { l: "Kembali", v: endDate },
                                    { l: "Dewasa", v: `${form.adults} orang` },
                                    { l: "Anak", v: `${form.children} orang` },
                                    { l: "Harga / pax", v: fmt(tour.price) },
                                ].map((r) => (
                                    <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontFamily: "var(--font-body)" }}>
                                        <span style={{ color: "var(--color-text-muted)" }}>{r.l}</span>
                                        <span style={{ color: "var(--color-text)", fontWeight: 500 }}>{r.v}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "2px solid var(--color-primary)", fontSize: 14, fontFamily: "var(--font-body)" }}>
                                <span style={{ fontWeight: 700, color: "var(--color-text)" }}>Estimasi Total</span>
                                <span style={{ fontSize: 22, fontWeight: 800, color: "var(--color-primary)" }}>{fmt(totalPrice)}</span>
                            </div>

                            <div style={{ background: "var(--color-cream)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginTop: 16, fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                                💡 Harga final tergantung jumlah peserta dalam grup. Tim kami akan mengkonfirmasi setelah pemesanan.
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Legal Modal */}
            {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}

            {/* Confirmation Modal */}
            {showConfirm && (
                <ConfirmModal
                    data={form as unknown as BookingFormData}
                    tour={tour}
                    startDate={startDate}
                    endDate={endDate}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleConfirm}
                />
            )}

            <style jsx global>{`
                @media (max-width: 1024px) {
                    .booking-sidebar { display: none !important; }
                    .booking-layout { flex-direction: column !important; }
                }
                @media (max-width: 640px) {
                    .form-row { grid-template-columns: 1fr !important; }
                    .steps-row { gap: 4px !important; }
                }
            `}</style>
        </>
    );
}