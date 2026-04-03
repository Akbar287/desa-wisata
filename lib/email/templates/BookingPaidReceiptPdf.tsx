import React from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

type BookingPaidReceiptPdfInput = {
  bookingCode: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  totalAmount: number;
  paidAt: Date | string | null;
  refundUrl?: string;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    fontSize: 11,
    color: "#111827",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
    color: "#14532d",
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 18,
    color: "#6b7280",
  },
  section: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  rowLast: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#6b7280",
    fontSize: 10,
    width: "42%",
  },
  value: {
    fontSize: 10,
    fontWeight: 700,
    width: "58%",
    textAlign: "right",
  },
  totalWrap: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 15,
    color: "#166534",
    fontWeight: 800,
  },
  footer: {
    marginTop: 18,
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  refundWrap: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  refundLabel: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 2,
    fontWeight: 700,
  },
  refundUrl: {
    fontSize: 9,
    color: "#1d4ed8",
  },
});

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(value: Date | string | null): string {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function BookingPaidReceiptPdfDocument({
  bookingCode,
  orderId,
  customerName,
  customerEmail,
  itemName,
  totalAmount,
  paidAt,
  refundUrl,
}: BookingPaidReceiptPdfInput) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Bukti Pembayaran</Text>
        <Text style={styles.subtitle}>
          Discover Desa Wisata - Desa Manud Jaya
        </Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Kode Booking</Text>
            <Text style={styles.value}>{bookingCode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nama</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{customerEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Paket</Text>
            <Text style={styles.value}>{itemName}</Text>
          </View>
          <View style={styles.rowLast}>
            <Text style={styles.label}>Waktu Pembayaran</Text>
            <Text style={styles.value}>{fmtDate(paidAt)}</Text>
          </View>
          <View style={styles.totalWrap}>
            <View style={styles.rowLast}>
              <Text style={styles.totalLabel}>Total Dibayar</Text>
              <Text style={styles.totalValue}>{fmtCurrency(totalAmount)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Dokumen ini dibuat otomatis oleh sistem. Simpan dokumen ini sebagai
          bukti pembayaran resmi Anda.
        </Text>
        {!!refundUrl && (
          <View style={styles.refundWrap}>
            <Text style={styles.refundLabel}>Link Refund:</Text>
            <Text style={styles.refundUrl}>{refundUrl}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function renderBookingPaidReceiptPdf(
  input: BookingPaidReceiptPdfInput,
): Promise<Buffer> {
  return renderToBuffer(<BookingPaidReceiptPdfDocument {...input} />);
}
