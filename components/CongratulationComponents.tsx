'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const PDFDownloadSection = dynamic(
    () => import('./PDFDownloadSection'),
    { ssr: false, loading: () => <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Menyiapkan PDF...</span> }
)

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
const fmtDate = (d: Date | string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const WA_GROUP_LINK = 'https://chat.whatsapp.com/dtpl-2025sa'

type BookingData = {
    id: number; tourId: number; firstName: string; lastName: string;
    email: string; phoneCode: string; phoneNumber: string; adults: number; children: number;
    startDate: Date | string; endDate: Date | string; totalPrice: number; status: string;
    createdAt: Date | string;
    tour: { id: number; title: string; durationDays: number; price: number; image: string };
    payments: {
        id: number; amount: number; status: string; referenceCode: string;
        proofOfPayment: string | null; paidAt: Date | string | null;
        createdAt: Date | string;
        paymentAvailable: { id: number; name: string; type: string; accountNumber: string; accountName: string };
    }[];
}

const focusCss = `
    @keyframes fadeSlideUp { 0% { opacity:0; transform:translateY(24px); } 100% { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
    @keyframes confetti1 { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(-120px) rotate(200deg); opacity:0; } }
    @keyframes confetti2 { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(-100px) rotate(-160deg); opacity:0; } }
    @keyframes confetti3 { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(-140px) rotate(240deg); opacity:0; } }
    .congrats-card { animation: fadeSlideUp 0.7s ease both; }
    .congrats-card:nth-child(2) { animation-delay: 0.15s; }
    .congrats-card:nth-child(3) { animation-delay: 0.25s; }
`

export default function CongratulationComponents({ booking }: { booking: BookingData | null }) {
    const [copied, setCopied] = useState(false)

    if (!booking) {
        return (
            <>
                <style>{focusCss}</style>
                <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg-light) 0%, white 100%)' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Data tidak ditemukan</h2>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', marginBottom: 28 }}>Booking tidak ditemukan atau belum tersedia.</p>
                    <Link href="/tours" className="btn-primary" style={{ padding: '14px 28px' }}>Lihat Paket Wisata</Link>
                </div>
            </>
        )
    }

    const paidPayment = booking.payments.find(p => p.status === 'PAID') ?? booking.payments[0]
    const refCode = paidPayment?.referenceCode ?? '-'

    const copyRef = () => {
        navigator.clipboard.writeText(refCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <style>{focusCss}</style>

            {/* Hero */}
            <section style={{ background: 'linear-gradient(135deg, #0d3b22 0%, var(--color-primary-dark) 30%, var(--color-primary) 65%, #2d8f5e 100%)', padding: '120px 24px 60px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: '15%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
                {/* Confetti */}
                <div style={{ position: 'absolute', top: '35%', left: '20%', width: 10, height: 10, borderRadius: 2, background: '#FFD700', animation: 'confetti1 2s ease-in infinite' }} />
                <div style={{ position: 'absolute', top: '40%', left: '70%', width: 8, height: 8, borderRadius: '50%', background: '#FF6B6B', animation: 'confetti2 2.5s ease-in infinite 0.5s' }} />
                <div style={{ position: 'absolute', top: '30%', left: '50%', width: 12, height: 6, borderRadius: 2, background: '#4ECDC4', animation: 'confetti3 2.2s ease-in infinite 0.3s' }} />
                <div style={{ position: 'absolute', top: '45%', left: '35%', width: 6, height: 12, borderRadius: 2, background: '#A78BFA', animation: 'confetti1 2.8s ease-in infinite 0.7s' }} />
                <div style={{ position: 'absolute', top: '38%', left: '85%', width: 8, height: 8, borderRadius: 2, background: '#F472B6', animation: 'confetti2 2.4s ease-in infinite 0.2s' }} />

                <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
                    {/* Success icon */}
                    <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'pulse 2s ease infinite', backdropFilter: 'blur(4px)' }}>
                        <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: 'white', margin: '0 0 12px', lineHeight: 1.2 }}>
                        Selamat, {booking.firstName}! 🎉
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
                        Pembayaran Anda telah kami terima. Tim kami akan segera memverifikasi dan menghubungi Anda.
                    </p>
                </div>
            </section>

            <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
                {/* Reference code card */}
                <div className="congrats-card" style={{ background: 'linear-gradient(135deg, rgba(26,92,56,0.06), rgba(45,143,94,0.1))', borderRadius: 16, padding: '28px 32px', marginBottom: 24, border: '1px solid rgba(26,92,56,0.12)', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Kode Referensi Pembayaran</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace', letterSpacing: 2 }}>{refCode}</span>
                        <button onClick={copyRef} title="Salin" style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            {copied
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                            }
                        </button>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8, fontFamily: 'var(--font-body)' }}>Simpan kode ini sebagai referensi pembayaran Anda</p>
                </div>

                {/* Booking details card */}
                <div className="congrats-card" style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #2d8f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Detail Pemesanan</h2>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>Booking #{booking.id}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { l: 'Paket Wisata', v: booking.tour.title },
                            { l: 'Tanggal', v: `${fmtDate(booking.startDate)} — ${fmtDate(booking.endDate)}` },
                            { l: 'Durasi', v: `${booking.tour.durationDays} hari` },
                            { l: 'Nama', v: `${booking.firstName} ${booking.lastName}` },
                            { l: 'Email', v: booking.email },
                            { l: 'Telepon', v: `${booking.phoneCode} ${booking.phoneNumber}` },
                            { l: 'Peserta', v: `${booking.adults} dewasa, ${booking.children} anak` },
                            { l: 'Metode Pembayaran', v: paidPayment?.paymentAvailable?.name ?? '-' },
                            { l: 'Tanggal Bayar', v: paidPayment?.paidAt ? fmtDate(paidPayment.paidAt) : fmtDate(booking.createdAt) },
                        ].map(r => (
                            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontFamily: 'var(--font-body)', paddingBottom: 10, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{r.l}</span>
                                <span style={{ color: 'var(--color-text)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid var(--color-primary)' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>Total Pembayaran</span>
                        <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>{fmt(booking.totalPrice)}</span>
                    </div>
                </div>

                {/* Action cards */}
                <div className="congrats-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    {/* Download PDF */}
                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>Bukti Pembayaran</h3>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginBottom: 16, lineHeight: 1.5 }}>Unduh bukti pembayaran dalam format PDF</p>
                        <PDFDownloadSection booking={booking} payment={paidPayment} refCode={refCode} />
                    </div>

                    {/* WhatsApp Group */}
                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(37,211,102,0.1), rgba(37,211,102,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>Gabung Grup WhatsApp</h3>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginBottom: 16, lineHeight: 1.5 }}>Bergabung untuk info terbaru perjalanan Anda</p>
                        <a href={WA_GROUP_LINK} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '12px 24px', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)',
                                background: '#25D366', color: 'white', borderRadius: 'var(--radius-md)', border: 'none',
                                cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', width: '100%',
                            }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
                            Gabung Grup
                        </a>
                    </div>
                </div>

                {/* Info note */}
                <div className="congrats-card" style={{ background: 'var(--color-cream)', borderRadius: 12, padding: '18px 24px', marginBottom: 28, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(234,179,8,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>Apa selanjutnya?</div>
                        <ul style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
                            <li>Tim kami akan memverifikasi pembayaran dalam <strong>1×24 jam</strong></li>
                            <li>E-ticket dan detail perjalanan akan dikirim ke <strong>{booking.email}</strong></li>
                            <li>Gabung grup WhatsApp untuk koordinasi dan info terbaru</li>
                            <li>Hubungi kami jika ada pertanyaan</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom actions */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/tours" className="btn-outline" style={{ padding: '14px 28px', fontSize: 14 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Jelajahi Paket Lain
                    </Link>
                    <Link href="/" className="btn-primary" style={{ padding: '14px 28px', fontSize: 14 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </main>

            <style>{`
                @media (max-width: 640px) {
                    .congrats-card[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    )
}
