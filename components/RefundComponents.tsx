"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createRefundRequest } from "@/services/RefundServices";
import type { RefundPageData, RefundStatus } from "@/types/RefundTypes";
import { fmt, fmtDate } from "@/lib/utils";

const REFUND_STATUS_BADGE: Record<
  RefundStatus,
  { label: string; className: string }
> = {
  REQUESTED: { label: "Diajukan", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Disetujui", className: "bg-blue-100 text-blue-700" },
  REJECTED: { label: "Ditolak", className: "bg-rose-100 text-rose-700" },
  PAID: {
    label: "Sudah Dibayar",
    className: "bg-emerald-100 text-emerald-700",
  },
  CANCELLED: { label: "Dibatalkan", className: "bg-zinc-100 text-zinc-700" },
};

export default function RefundComponents({
  initialData,
}: {
  initialData: RefundPageData;
}) {
  const [data, setData] = useState<RefundPageData>(initialData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const existingRefund = data.refund;
  const canSubmitRefund = data.eligible && !existingRefund;

  const statusBadge = useMemo(() => {
    if (!existingRefund) return null;
    return REFUND_STATUS_BADGE[existingRefund.status];
  }, [existingRefund]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Anda wajib menyetujui syarat dan ketentuan refund.");
      return;
    }

    setSubmitting(true);
    try {
      const json = await createRefundRequest({
        bookingCode: data.bookingCode,
        reason,
        termsAccepted,
      });
      if (json.status !== "success" || !json.data?.refund) {
        toast.error(json.message || "Gagal mengajukan refund");
        return;
      }

      setData((prev) => ({
        ...prev,
        refund: json.data?.refund ?? null,
      }));
      toast.success("Pengajuan refund berhasil dikirim.");
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1
          className="font-serif text-4xl font-bold mb-3"
          style={{ color: "var(--color-text)" }}
        >
          Pengajuan Refund
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Ajukan refund sebelum tanggal kunjungan. Besaran refund yang berlaku
          adalah {data.refundPercent}% dari total pembayaran.
        </p>
      </div>

      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            className="font-semibold text-lg"
            style={{ color: "var(--color-text)" }}
          >
            Ringkasan Booking
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
            {data.bookingCode}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <p>
            <strong>Pemesan:</strong> {data.customerName}
          </p>
          <p>
            <strong>Email:</strong> {data.customerEmail}
          </p>
          <p>
            <strong>Paket:</strong> {data.itemName}
          </p>
          <p>
            <strong>Tanggal Kunjungan:</strong> {fmtDate(data.visitDate)}
          </p>
          <p>
            <strong>Total Dibayar:</strong> {fmt(data.paidAmount)}
          </p>
          <p>
            <strong>Potensi Refund ({data.refundPercent}%):</strong>{" "}
            {fmt(data.refundAmount)}
          </p>
        </div>
      </div>

      {existingRefund ? (
        <div
          className="mt-6 rounded-2xl p-6 space-y-3"
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3
              className="font-semibold text-lg"
              style={{ color: "var(--color-text)" }}
            >
              Refund Sudah Diajukan
            </h3>
            {statusBadge ? (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            ) : null}
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Tanggal pengajuan: {fmtDate(existingRefund.requestedAt)}
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Nilai refund: {fmt(existingRefund.refundAmount)}
          </p>
          {existingRefund.reason ? (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Alasan: {existingRefund.reason}
            </p>
          ) : null}
        </div>
      ) : canSubmitRefund ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl p-6 space-y-4"
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h3
            className="font-semibold text-lg"
            style={{ color: "var(--color-text)" }}
          >
            Form Pengajuan Refund
          </h3>
          <div>
            <label className="text-sm font-medium block mb-2">
              Alasan refund (opsional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-24 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Contoh: perubahan rencana perjalanan."
            />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Saya menyetujui syarat dan ketentuan refund. Saya memahami bahwa
              nilai refund yang diproses adalah {data.refundPercent}% dari
              pembayaran.
            </span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              opacity: submitting ? 0.7 : 1,
              pointerEvents: submitting ? "none" : "auto",
            }}
          >
            {submitting ? "Mengirim..." : "Ajukan Refund"}
          </button>
        </form>
      ) : (
        <div
          className="mt-6 rounded-2xl p-6"
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
          }}
        >
          <h3
            className="font-semibold text-lg mb-2"
            style={{ color: "#9a3412" }}
          >
            Refund Tidak Dapat Diajukan
          </h3>
          <p className="text-sm" style={{ color: "#9a3412" }}>
            {data.ineligibleReason ??
              "Refund tidak dapat diproses untuk booking ini."}
          </p>
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="btn-outline">
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}
