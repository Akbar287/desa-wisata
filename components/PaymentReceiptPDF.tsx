'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjQ.ttf', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf', fontWeight: 700 },
        { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYAZ9hjQ.ttf', fontWeight: 800 },
    ],
})

const PRIMARY = '#1A5C38'
const PRIMARY_LIGHT = '#2d8f5e'
const GREEN_BG = '#F0FFF4'
const CREAM = '#FFFBF0'
const GRAY = '#6B7280'
const LIGHT_BORDER = '#E5E7EB'
const WHITE = '#FFFFFF'

const s = StyleSheet.create({
    page: { padding: 0, fontFamily: 'Inter', backgroundColor: WHITE, fontSize: 10 },
    // Header
    header: { backgroundColor: PRIMARY, padding: '32 36 28 36', position: 'relative' },
    headerDecor1: { position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.06)' },
    headerDecor2: { position: 'absolute', bottom: -10, left: 50, width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.04)' },
    headerTitle: { fontSize: 22, fontWeight: 800, color: WHITE, marginBottom: 4 },
    headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 14 },
    headerLine: { width: 50, height: 3, backgroundColor: PRIMARY_LIGHT, borderRadius: 2, marginBottom: 14 },
    headerMeta: { flexDirection: 'row', justifyContent: 'space-between' },
    headerMetaItem: { fontSize: 8, color: 'rgba(255,255,255,0.6)' },
    headerMetaValue: { fontSize: 11, fontWeight: 700, color: WHITE, marginTop: 2 },
    // Body
    body: { padding: '24 36 20 36' },
    // Status badge
    statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
    statusBadge: { backgroundColor: GREEN_BG, borderRadius: 20, padding: '6 16', flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
    statusText: { fontSize: 10, fontWeight: 700, color: '#15803D' },
    statusDate: { fontSize: 9, color: GRAY },
    // Section
    sectionTitle: { fontSize: 12, fontWeight: 700, color: PRIMARY, marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: 1 },
    sectionBox: { border: `1 solid ${LIGHT_BORDER}`, borderRadius: 8, marginBottom: 18, overflow: 'hidden' as const },
    sectionHeader: { backgroundColor: '#F9FAFB', padding: '10 16', borderBottom: `1 solid ${LIGHT_BORDER}` },
    sectionHeaderText: { fontSize: 11, fontWeight: 700, color: '#374151' },
    // Row
    row: { flexDirection: 'row', justifyContent: 'space-between', padding: '8 16', borderBottom: `1 solid ${LIGHT_BORDER}` },
    rowLast: { flexDirection: 'row', justifyContent: 'space-between', padding: '8 16' },
    rowLabel: { fontSize: 9, color: GRAY, flex: 1 },
    rowValue: { fontSize: 9, color: '#111827', fontWeight: 600, flex: 1, textAlign: 'right' as const },
    // Total row
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: '14 16', backgroundColor: GREEN_BG, borderTop: `2 solid ${PRIMARY}` },
    totalLabel: { fontSize: 12, fontWeight: 700, color: PRIMARY },
    totalValue: { fontSize: 16, fontWeight: 800, color: PRIMARY },
    // Separator
    separator: { borderBottom: `1 dashed ${LIGHT_BORDER}`, marginVertical: 16 },
    // Ref code box
    refBox: { backgroundColor: CREAM, borderRadius: 8, padding: '14 20', textAlign: 'center' as const, marginBottom: 18, border: `1 solid #FBBF24` },
    refLabel: { fontSize: 8, fontWeight: 600, color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 4 },
    refCode: { fontSize: 18, fontWeight: 800, color: '#B45309', letterSpacing: 3 },
    // Footer
    footer: { backgroundColor: '#F9FAFB', padding: '16 36', borderTop: `1 solid ${LIGHT_BORDER}`, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    footerLeft: { flex: 1 },
    footerText: { fontSize: 7, color: GRAY, lineHeight: 1.6 },
    footerRight: { alignItems: 'flex-end' as const },
    footerBrand: { fontSize: 10, fontWeight: 800, color: PRIMARY },
    footerTagline: { fontSize: 7, color: GRAY, marginTop: 2 },
    // Watermark stripe
    stripe: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: PRIMARY },
})

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
const fmtDate = (d: Date | string) => {
    const dt = new Date(d)
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

type PaymentInfo = {
    id: number; amount: number; status: string; referenceCode: string;
    proofOfPayment: string | null; paidAt: Date | string | null; createdAt: Date | string;
    paymentAvailable: { id: number; name: string; type: string; accountNumber: string; accountName: string };
}

type BookingInfo = {
    id: number; firstName: string; lastName: string;
    email: string; phoneCode: string; phoneNumber: string;
    adults: number; children: number;
    startDate: Date | string; endDate: Date | string;
    totalPrice: number; status: string; createdAt: Date | string;
    tour: { id: number; title: string; durationDays: number; price: number };
}

const typeLabels: Record<string, string> = { BANK: 'Transfer Bank', WALLET: 'E-Wallet', QRIS: 'QRIS' }

export default function PaymentReceiptPDF({ booking, payment }: { booking: BookingInfo; payment?: PaymentInfo }) {
    const now = new Date()
    const invoiceNo = `INV-${booking.id}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Header */}
                <View style={s.header}>
                    <View style={s.headerDecor1} />
                    <View style={s.headerDecor2} />
                    <Text style={s.headerTitle}>Discover Desa Manuk Jaya</Text>
                    <Text style={s.headerSub}>Bukti Pembayaran / Payment Receipt</Text>
                    <View style={s.headerLine} />
                    <View style={s.headerMeta}>
                        <View>
                            <Text style={s.headerMetaItem}>No. Invoice</Text>
                            <Text style={s.headerMetaValue}>{invoiceNo}</Text>
                        </View>
                        <View>
                            <Text style={s.headerMetaItem}>Tanggal Cetak</Text>
                            <Text style={s.headerMetaValue}>{fmtDate(now)}</Text>
                        </View>
                        <View>
                            <Text style={s.headerMetaItem}>Status</Text>
                            <Text style={s.headerMetaValue}>{payment?.status === 'PAID' ? '✓ LUNAS' : 'PENDING'}</Text>
                        </View>
                    </View>
                </View>

                {/* Body */}
                <View style={s.body}>
                    {/* Reference Code */}
                    {payment && (
                        <View style={s.refBox}>
                            <Text style={s.refLabel}>Kode Referensi</Text>
                            <Text style={s.refCode}>{payment.referenceCode}</Text>
                        </View>
                    )}

                    {/* Status */}
                    <View style={s.statusRow}>
                        <View style={s.statusBadge}>
                            <View style={s.statusDot} />
                            <Text style={s.statusText}>Pembayaran Berhasil</Text>
                        </View>
                        <Text style={s.statusDate}>
                            {payment?.paidAt ? fmtDate(payment.paidAt) : fmtDate(booking.createdAt)}
                        </Text>
                    </View>

                    {/* Tour Info */}
                    <Text style={s.sectionTitle}>Informasi Paket</Text>
                    <View style={s.sectionBox}>
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionHeaderText}>{booking.tour.title}</Text>
                        </View>
                        {[
                            { l: 'Tanggal Berangkat', v: fmtDate(booking.startDate) },
                            { l: 'Tanggal Kembali', v: fmtDate(booking.endDate) },
                            { l: 'Durasi', v: `${booking.tour.durationDays} hari` },
                            { l: 'Peserta Dewasa', v: `${booking.adults} orang` },
                            { l: 'Peserta Anak', v: `${booking.children} orang` },
                        ].map((r, i, arr) => (
                            <View key={r.l} style={i === arr.length - 1 ? s.rowLast : s.row}>
                                <Text style={s.rowLabel}>{r.l}</Text>
                                <Text style={s.rowValue}>{r.v}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Customer Info */}
                    <Text style={s.sectionTitle}>Informasi Pemesan</Text>
                    <View style={s.sectionBox}>
                        {[
                            { l: 'Nama Lengkap', v: `${booking.firstName} ${booking.lastName}` },
                            { l: 'Email', v: booking.email },
                            { l: 'Telepon', v: `${booking.phoneCode} ${booking.phoneNumber}` },
                        ].map((r, i, arr) => (
                            <View key={r.l} style={i === arr.length - 1 ? s.rowLast : s.row}>
                                <Text style={s.rowLabel}>{r.l}</Text>
                                <Text style={s.rowValue}>{r.v}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Payment Info */}
                    {payment && (
                        <>
                            <Text style={s.sectionTitle}>Informasi Pembayaran</Text>
                            <View style={s.sectionBox}>
                                {[
                                    { l: 'Metode', v: payment.paymentAvailable?.name ?? '-' },
                                    { l: 'Tipe', v: typeLabels[payment.paymentAvailable?.type] ?? payment.paymentAvailable?.type ?? '-' },
                                    { l: 'No. Rekening', v: payment.paymentAvailable?.accountNumber ?? '-' },
                                    { l: 'Atas Nama', v: payment.paymentAvailable?.accountName ?? '-' },
                                ].map((r, i, arr) => (
                                    <View key={r.l} style={i === arr.length - 1 ? s.rowLast : s.row}>
                                        <Text style={s.rowLabel}>{r.l}</Text>
                                        <Text style={s.rowValue}>{r.v}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {/* Total */}
                    <View style={{ ...s.sectionBox, marginBottom: 0 }}>
                        <View style={s.totalRow}>
                            <Text style={s.totalLabel}>Total Pembayaran</Text>
                            <Text style={s.totalValue}>{fmt(booking.totalPrice)}</Text>
                        </View>
                    </View>

                    <View style={s.separator} />

                    {/* Note */}
                    <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, padding: '10 14', marginBottom: 8 }}>
                        <Text style={{ fontSize: 8, fontWeight: 600, color: '#92400E', marginBottom: 3 }}>Catatan Penting:</Text>
                        <Text style={{ fontSize: 7, color: '#92400E', lineHeight: 1.6 }}>
                            Dokumen ini adalah bukti pembayaran yang sah. Simpan dokumen ini dengan baik. E-ticket dan detail perjalanan akan dikirimkan ke email Anda setelah pembayaran diverifikasi oleh tim kami.
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={s.footer}>
                    <View style={s.footerLeft}>
                        <Text style={s.footerText}>Dokumen ini digenerate secara otomatis oleh sistem Discover Desa Wisata.</Text>
                        <Text style={s.footerText}>Untuk pertanyaan, hubungi: support@discoverdesa.com | +62 812-3456-7890</Text>
                    </View>
                    <View style={s.footerRight}>
                        <Text style={s.footerBrand}>Discover Desa Wisata</Text>
                        <Text style={s.footerTagline}>Jelajahi Keindahan Desa Indonesia</Text>
                    </View>
                </View>

                {/* Bottom stripe */}
                <View style={s.stripe} />
            </Page>
        </Document>
    )
}
