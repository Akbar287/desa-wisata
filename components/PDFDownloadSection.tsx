'use client'

import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PaymentReceiptPDF from './PaymentReceiptPDF'

type PaymentInfo = {
    id: number; amount: number; status: string; referenceCode: string;
    proofOfPayment: string | null; paidAt: Date | string | null; createdAt: Date | string;
    paymentAvailable: { id: number; name: string; type: string; accountNumber: string; accountName: string };
}

type BookingInfo = {
    id: number; tourId: number; firstName: string; lastName: string;
    email: string; phoneCode: string; phoneNumber: string; adults: number; children: number;
    startDate: Date | string; endDate: Date | string; totalPrice: number; status: string;
    createdAt: Date | string;
    tour: { id: number; title: string; durationDays: number; price: number; image: string };
    payments: PaymentInfo[];
}

export default function PDFDownloadSection({ booking, payment, refCode }: { booking: BookingInfo; payment?: PaymentInfo; refCode: string }) {
    return (
        <PDFDownloadLink
            document={<PaymentReceiptPDF booking={booking} payment={payment} />}
            fileName={`bukti-pembayaran-${refCode}.pdf`}
        >
            {({ loading: pdfLoading }) => (
                <button className="btn-primary" style={{ padding: '12px 24px', fontSize: 13, width: '100%', justifyContent: 'center', opacity: pdfLoading ? 0.7 : 1 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                    {pdfLoading ? 'Menyiapkan...' : 'Download PDF'}
                </button>
            )}
        </PDFDownloadLink>
    )
}
