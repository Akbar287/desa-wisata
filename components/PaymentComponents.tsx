'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PaymentMethod, PaymentRecord, BookingData } from '@/types/PaymentTypes'
import { fmt, fmtDate } from '@/lib/utils'

const IMG_API = '/api/img'

const focusCss = `
    @keyframes fadeSlideUp { 0% { opacity:0; transform:translateY(20px); } 100% { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
    .pay-section { animation: fadeSlideUp 0.5s ease both; }
    .pay-section:nth-child(2) { animation-delay: 0.1s; }
    .pay-section:nth-child(3) { animation-delay: 0.2s; }
`

const STEPS = [
    { num: 1, label: 'Pilih Tur', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { num: 2, label: 'Isi Data', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { num: 3, label: 'Pembayaran', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { num: 4, label: 'Konfirmasi', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { num: 5, label: 'Selamat Berlibur!', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
]

const typeLabels: Record<string, string> = { BANK: 'Transfer Bank', WALLET: 'E-Wallet', QRIS: 'QRIS' }
const typeEmojis: Record<string, string> = { BANK: '🏦', WALLET: '📱', QRIS: '📲' }
const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'rgba(234,179,8,0.12)', text: '#B45309', label: 'Menunggu Pembayaran' },
    PAID: { bg: 'rgba(34,197,94,0.12)', text: '#15803D', label: 'Sudah Dibayar' },
    FAILED: { bg: 'rgba(239,68,68,0.12)', text: '#DC2626', label: 'Gagal' },
    CANCELLED: { bg: 'rgba(107,114,128,0.12)', text: '#4B5563', label: 'Dibatalkan' },
}

export default function PaymentComponents({ bookingData, paymentMethods }: {
    bookingData: BookingData; paymentMethods: PaymentMethod[]
}) {
    const [step, setStep] = React.useState<'select' | 'pay' | 'done'>(
        bookingData.payments.some(p => p.status === 'PAID') ? 'done' :
            bookingData.payments.some(p => p.status === 'PENDING') ? 'pay' : 'select'
    )
    const [selectedType, setSelectedType] = React.useState<string | null>(null)
    const [selectedMethodId, setSelectedMethodId] = React.useState<number | null>(null)
    const [currentPayment, setCurrentPayment] = React.useState<PaymentRecord | null>(
        bookingData.payments.find(p => p.status === 'PENDING') ?? null
    )
    const [submitting, setSubmitting] = React.useState(false)
    const [uploadingProof, setUploadingProof] = React.useState(false)
    const [proofUrl, setProofUrl] = React.useState('')

    const paidPayment = bookingData.payments.find(p => p.status === 'PAID')

    const grouped = paymentMethods.reduce<Record<string, PaymentMethod[]>>((acc, m) => {
        if (!acc[m.type]) acc[m.type] = []
        acc[m.type].push(m)
        return acc
    }, {})

    // Create payment
    const handleCreatePayment = async () => {
        if (!selectedMethodId) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/bookings/create-payment', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: bookingData.id, paymentAvailableId: selectedMethodId, amount: bookingData.totalPrice }),
            })
            const json = await res.json()
            if (json.status === 'success') {
                setCurrentPayment(json.data)
                setStep('pay')
            } else alert(json.message)
        } catch { alert('Gagal terhubung') } finally { setSubmitting(false) }
    }

    // Upload proof
    const handleUploadProof = async (file: File) => {
        setUploadingProof(true)
        try {
            const fd = new FormData(); fd.append('files', file)
            const res = await fetch(IMG_API, { method: 'POST', body: fd })
            const json = await res.json()
            if (json.status === 'success') setProofUrl(`${IMG_API}?_id=${json.data.id}`)
            else alert('Gagal upload')
        } catch { alert('Gagal upload') } finally { setUploadingProof(false) }
    }

    // Confirm paid
    const router = useRouter()

    const handleConfirmPaid = async () => {
        if (!currentPayment || !proofUrl) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/bookings/confirm-payment', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: currentPayment.id, proofOfPayment: proofUrl }),
            })
            const json = await res.json()
            if (json.status === 'success') {
                router.push(`/congratulations?id=${bookingData.id}`)
            } else alert(json.message)
        } catch { alert('Gagal terhubung') } finally { setSubmitting(false) }
    }

    const activeStep = step === 'select' ? 3 : step === 'pay' ? 3 : 4

    return (
        <>
            <style>{focusCss}</style>

            <section style={{ background: 'linear-gradient(135deg, #0d3b22 0%, var(--color-primary-dark) 30%, var(--color-primary) 65%, #2d8f5e 100%)', padding: '120px 24px 54px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: '20%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
                <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'white', margin: 0 }}>Pembayaran</h1>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 36, maxWidth: 480 }}>
                        Pilih metode pembayaran dan selesaikan pembayaran Anda.
                    </p>
                    <div className="steps-row" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                        {STEPS.map((s, i) => (
                            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        background: s.num <= activeStep ? 'white' : 'rgba(255,255,255,0.12)',
                                        color: s.num <= activeStep ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.4s',
                                        boxShadow: s.num === activeStep ? '0 0 0 3px rgba(255,255,255,0.25)' : 'none',
                                    }}>
                                        {s.num < activeStep
                                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                                        }
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: s.num === activeStep ? 700 : 400, color: s.num <= activeStep ? 'white' : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>{s.label}</span>
                                </div>
                                {i < STEPS.length - 1 && <div style={{ width: 40, height: 2, background: s.num < activeStep ? 'white' : 'rgba(255,255,255,0.2)', margin: '0 12px', flexShrink: 0 }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <main style={{ maxWidth: 1320, margin: '0 auto', padding: '48px 24px 80px' }}>
                <div className="payment-layout" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {step === 'done' && (
                            <div className="pay-section" style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.06)', padding: '40px 32px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.25))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'pulse 2s ease infinite' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12, background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Pembayaran Berhasil!
                                </h2>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--color-text-muted)', maxWidth: 480, margin: '0 auto 8px', lineHeight: 1.7 }}>
                                    Terima kasih! Bukti pembayaran Anda telah kami terima. Tim kami akan memverifikasi pembayaran dan menghubungi Anda melalui email <strong>{bookingData.email}</strong>.
                                </p>
                                {(paidPayment || currentPayment) && (
                                    <div style={{ background: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)', padding: '16px 20px', maxWidth: 400, margin: '20px auto', textAlign: 'left' }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Kode Referensi</div>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace', letterSpacing: 1 }}>{(paidPayment ?? currentPayment)?.referenceCode}</div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
                                    <Link href="/tours" className="btn-outline" style={{ padding: '12px 24px' }}>Lihat Paket Lain</Link>
                                    <Link href="/" className="btn-primary" style={{ padding: '12px 24px' }}>Kembali ke Beranda</Link>
                                </div>
                            </div>
                        )}

                        {step === 'select' && (
                            <div className="pay-section">
                                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.06)', padding: '28px 26px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #2d8f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        </div>
                                        <div>
                                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Pilih Metode Pembayaran</h2>
                                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>Pilih salah satu metode pembayaran di bawah</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                                        {Object.keys(grouped).map(type => (
                                            <button key={type} onClick={() => { setSelectedType(t => t === type ? null : type); setSelectedMethodId(null) }}
                                                style={{
                                                    padding: '10px 20px', borderRadius: 'var(--radius-md)', border: selectedType === type ? '2px solid var(--color-primary)' : '1.5px solid rgba(0,0,0,0.1)',
                                                    background: selectedType === type ? 'var(--color-bg-light)' : 'white', color: selectedType === type ? 'var(--color-primary)' : 'var(--color-text-light)',
                                                    fontWeight: selectedType === type ? 700 : 500, fontSize: 14, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
                                                }}>
                                                <span>{typeEmojis[type]}</span> {typeLabels[type]} <span style={{ fontSize: 11, opacity: 0.6 }}>({grouped[type].length})</span>
                                            </button>
                                        ))}
                                    </div>

                                    {selectedType && grouped[selectedType] && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {grouped[selectedType].map(m => (
                                                <button key={m.id} onClick={() => setSelectedMethodId(m.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                                                        borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                                                        border: selectedMethodId === m.id ? '2px solid var(--color-primary)' : '1.5px solid rgba(0,0,0,0.08)',
                                                        background: selectedMethodId === m.id ? 'linear-gradient(135deg, rgba(26,92,56,0.04), rgba(45,143,94,0.08))' : 'white',
                                                        boxShadow: selectedMethodId === m.id ? '0 2px 12px rgba(26,92,56,0.1)' : 'none',
                                                    }}>
                                                    <div style={{ width: 56, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#f5f5f5' }}>
                                                        <Image src={m.image} alt={m.name} fill style={{ objectFit: 'contain' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{m.name}</div>
                                                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{m.description}</div>
                                                    </div>
                                                    {selectedMethodId === m.id && (
                                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {!selectedType && (
                                        <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--color-text-muted)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                                            Pilih kategori metode pembayaran di atas untuk melihat daftar.
                                        </div>
                                    )}
                                </div>

                                <button onClick={handleCreatePayment} disabled={!selectedMethodId || submitting}
                                    className="btn-primary"
                                    style={{
                                        width: '100%', justifyContent: 'center', padding: '17px 32px', fontSize: 16,
                                        background: !selectedMethodId ? '#ccc' : 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #2d8f5e)',
                                        borderRadius: 'var(--radius-md)', boxShadow: selectedMethodId ? '0 4px 14px rgba(26,92,56,0.3)' : 'none',
                                        transition: 'all 0.3s', cursor: !selectedMethodId ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                                    }}>
                                    {submitting ? (
                                        <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Memproses...</>
                                    ) : (
                                        <>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                                            Lanjutkan Pembayaran
                                        </>
                                    )}
                                </button>
                                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                            </div>
                        )}

                        {step === 'pay' && currentPayment && (
                            <div className="pay-section" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.06)', padding: '28px 26px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #EAB308, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        </div>
                                        <div>
                                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Lakukan Pembayaran</h2>
                                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>Transfer ke rekening di bawah lalu upload bukti pembayaran</p>
                                        </div>
                                    </div>

                                    <div style={{ background: 'linear-gradient(135deg, rgba(26,92,56,0.04), rgba(45,143,94,0.08))', borderRadius: 'var(--radius-md)', padding: '20px 22px', border: '1px solid rgba(26,92,56,0.12)', marginBottom: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                                            {currentPayment.paymentAvailable?.image && (
                                                <div style={{ width: 60, height: 42, borderRadius: 8, overflow: 'hidden', position: 'relative', background: 'white', flexShrink: 0, border: '1px solid rgba(0,0,0,0.08)' }}>
                                                    <Image src={currentPayment.paymentAvailable.image} alt="" fill style={{ objectFit: 'contain', padding: 4 }} />
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{currentPayment.paymentAvailable?.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{typeLabels[currentPayment.paymentAvailable?.type ?? 'BANK']}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {[
                                                { l: 'Nomor Rekening', v: currentPayment.paymentAvailable?.accountNumber, bold: true },
                                                { l: 'Atas Nama', v: currentPayment.paymentAvailable?.accountName, bold: false },
                                                { l: 'Jumlah Transfer', v: fmt(currentPayment.amount), bold: true },
                                                { l: 'Kode Referensi', v: currentPayment.referenceCode, bold: true },
                                            ].map(r => (
                                                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontFamily: 'var(--font-body)', paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <span style={{ color: 'var(--color-text-muted)' }}>{r.l}</span>
                                                    <span style={{ color: r.bold ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: r.bold ? 700 : 500, fontFamily: r.bold ? 'monospace' : 'var(--font-body)', letterSpacing: r.bold ? 0.5 : 0 }}>{r.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                                        ⚠️ Pastikan jumlah transfer <strong>sesuai persis</strong> dengan nominal di atas. Sertakan kode referensi di catatan transfer jika memungkinkan.
                                    </div>
                                </div>

                                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.06)', padding: '28px 26px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #2d8f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                        </div>
                                        <div>
                                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Upload Bukti Pembayaran</h2>
                                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>Unggah tangkapan layar atau foto bukti transfer</p>
                                        </div>
                                    </div>

                                    <div style={{
                                        border: `2px dashed ${proofUrl ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)'}`,
                                        borderRadius: 'var(--radius-md)', padding: proofUrl ? '16px' : '40px 20px', textAlign: 'center',
                                        background: proofUrl ? 'rgba(26,92,56,0.04)' : 'var(--color-bg-light)',
                                        transition: 'all 0.3s', cursor: 'pointer', position: 'relative', marginBottom: 20,
                                    }}>
                                        {proofUrl ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }}>
                                                    <Image src={proofUrl} alt="Bukti" fill style={{ objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ flex: 1, textAlign: 'left' }}>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>✅ Bukti telah diupload</div>
                                                    <label style={{ fontSize: 12, color: 'var(--color-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                                                        Ganti foto
                                                        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadProof(f) }} style={{ display: 'none' }} />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <label style={{ cursor: 'pointer', display: 'block' }}>
                                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(26,92,56,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                                    {uploadingProof ? (
                                                        <span style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid rgba(26,92,56,0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                                    ) : (
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>
                                                    {uploadingProof ? 'Mengupload...' : 'Klik untuk upload bukti pembayaran'}
                                                </div>
                                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>JPG, PNG — maks 5MB</div>
                                                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadProof(f) }} style={{ display: 'none' }} disabled={uploadingProof} />
                                            </label>
                                        )}
                                    </div>

                                    <button onClick={handleConfirmPaid} disabled={!proofUrl || submitting}
                                        className="btn-primary"
                                        style={{
                                            width: '100%', justifyContent: 'center', padding: '17px 32px', fontSize: 16,
                                            background: !proofUrl ? '#ccc' : 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #2d8f5e)',
                                            borderRadius: 'var(--radius-md)', boxShadow: proofUrl ? '0 4px 14px rgba(26,92,56,0.3)' : 'none',
                                            transition: 'all 0.3s', cursor: !proofUrl ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                                        }}>
                                        {submitting ? (
                                            <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Memproses...</>
                                        ) : (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                                Saya Sudah Bayar
                                            </>
                                        )}
                                    </button>

                                    <button onClick={() => setStep('select')} style={{
                                        width: '100%', padding: '14px 24px', marginTop: 12, fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600,
                                        background: 'transparent', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                        color: 'var(--color-text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                                        Ganti Metode Pembayaran
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="payment-sidebar" style={{ width: 340, flexShrink: 0, position: 'sticky', top: 140 }}>
                        <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 'var(--radius-lg)', padding: '24px 22px', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, paddingBottom: 12, borderTop: 'none', borderBottom: '2px solid var(--color-primary)' }}>Ringkasan Pemesanan</div>

                            <div style={{ marginBottom: 20 }}>
                                <Link href={`/tours/${bookingData.tourId}`} style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', textDecoration: 'none', lineHeight: 1.3, display: 'block', marginBottom: 8 }}>
                                    {bookingData.tour.title}
                                </Link>
                                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>⏱ {bookingData.tour.durationDays} hari</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                {[
                                    { l: 'Nama', v: `${bookingData.firstName} ${bookingData.lastName}` },
                                    { l: 'Email', v: bookingData.email },
                                    { l: 'Berangkat', v: fmtDate(bookingData.startDate) },
                                    { l: 'Kembali', v: fmtDate(bookingData.endDate) },
                                    { l: 'Peserta', v: `${bookingData.adults} dewasa, ${bookingData.children} anak` },
                                ].map(r => (
                                    <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>{r.l}</span>
                                        <span style={{ color: 'var(--color-text)', fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{r.v}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid var(--color-primary)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>Total</span>
                                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }}>{fmt(bookingData.totalPrice)}</span>
                            </div>

                            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                {(() => {
                                    const s = step === 'done' ? 'PAID' : 'PENDING'; const c = statusColors[s]; return (
                                        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)', padding: '6px 14px', borderRadius: 20, background: c.bg, color: c.text }}>{c.label}</span>
                                    )
                                })()}
                            </div>

                            <div style={{ background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginTop: 16, fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                                💡 Setelah pembayaran dikonfirmasi, tim kami akan mengirimkan e-ticket dan detail perjalanan ke email Anda dalam 1×24 jam.
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    )
}
