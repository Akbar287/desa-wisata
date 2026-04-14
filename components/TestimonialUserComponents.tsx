"use client";

import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { fmtDate } from "@/lib/utils";
import type {
  TestimonialUserPageData,
  TestimonialUserSubmittedData,
} from "@/types/TestimonialType";

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

function StarIcon({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      style={color ? { color } : undefined}
      aria-hidden="true"
    >
      <path d="M12 2.4l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.47l-5.9 3.1 1.13-6.57L2.45 9.34l6.6-.96L12 2.4z" />
    </svg>
  );
}

function quarterRatingFromPointer(
  clientX: number,
  target: HTMLButtonElement,
  starIndex: number,
): number {
  const rect = target.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0.001, (clientX - rect.left) / rect.width));
  const quarter = Math.min(4, Math.max(1, Math.ceil(ratio * 4)));
  return Number(((starIndex - 1) + quarter / 4).toFixed(2));
}

function formatRating(value: number): string {
  return Number(value.toFixed(2)).toString();
}

export default function TestimonialUserComponents({
  initialData,
}: {
  initialData: TestimonialUserPageData;
}) {
  const [submitted, setSubmitted] =
    React.useState<TestimonialUserSubmittedData | null>(
      initialData.existingTestimonial,
    );
  const [name, setName] = React.useState(initialData.customerName);
  const [text, setText] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [pendingImages, setPendingImages] = React.useState<PendingImage[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const pendingImagesRef = React.useRef<PendingImage[]>([]);

  React.useEffect(() => {
    pendingImagesRef.current = pendingImages;
  }, [pendingImages]);

  React.useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl),
      );
    };
  }, []);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const appended: PendingImage[] = files.map((file) => ({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => [...prev, ...appended]);
    e.currentTarget.value = "";
  };

  const removePendingImage = (id: string) => {
    setPendingImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearPendingImages = () => {
    setPendingImages((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Nama minimal 2 karakter.");
      return;
    }
    if (!text.trim() || text.trim().length < 10) {
      toast.error("Testimoni minimal 10 karakter.");
      return;
    }
    if (pendingImages.length < 1) {
      toast.error("Upload foto minimal 1 gambar.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("bookingCode", initialData.bookingCode);
      fd.append("name", name.trim());
      fd.append("role", "Wisatawan");
      fd.append("text", text.trim());
      fd.append("rating", String(rating));
      pendingImages.forEach((item) => fd.append("images", item.file));

      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (json.status === "success" && json.data?.testimonial) {
        setSubmitted(json.data.testimonial);
        setPendingImages((prev) => {
          prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
          return [];
        });
        toast.success(json.message || "Testimoni berhasil dikirim.");
      } else if (json.data?.testimonial) {
        setSubmitted(json.data.testimonial);
        setPendingImages((prev) => {
          prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
          return [];
        });
        toast.error(json.message || "Testimoni sudah pernah dikirim.");
      } else {
        toast.error(json.message || "Gagal mengirim testimoni.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating ?? rating;

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <h1
          className="font-serif text-4xl font-bold mb-3"
          style={{ color: "var(--color-text)" }}
        >
          Kirim Testimoni
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Terima kasih sudah berkunjung. Bagikan pengalaman Anda dan upload foto
          minimal 1 gambar.
        </p>
      </motion.div>

      <motion.div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border-subtle)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <h2
          className="font-semibold text-lg"
          style={{ color: "var(--color-text)" }}
        >
          Informasi Booking
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <p>
            <strong>Kode Booking:</strong> {initialData.bookingCode}
          </p>
          <p>
            <strong>Pemesan:</strong> {initialData.customerName}
          </p>
          <p>
            <strong>Email:</strong> {initialData.customerEmail}
          </p>
          <p>
            <strong>Paket:</strong> {initialData.itemName}
          </p>
          <p>
            <strong>Tanggal Kunjungan:</strong> {fmtDate(initialData.visitDate)}
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            className="mt-6 rounded-2xl p-6 space-y-4"
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border-subtle)",
            }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between gap-2">
              <h3
                className="font-semibold text-lg"
                style={{ color: "var(--color-text)" }}
              >
                Testimoni Sudah Terkirim
              </h3>
              <motion.span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  submitted.isPublished
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {submitted.isPublished ? "Dipublikasikan" : "Menunggu Moderasi"}
              </motion.span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Dikirim pada: {fmtDate(submitted.createdAt)}
            </p>
            <p>
              <strong>Nama:</strong> {submitted.name}
            </p>
            <p>
              <strong>Role:</strong> {submitted.role}
            </p>
            <p>
              <strong>Rating:</strong> {formatRating(submitted.rating)} / 5
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {submitted.text}
            </p>

            <div className="space-y-2">
              <p className="font-medium">Foto yang diupload</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {submitted.images.map((img, idx) => (
                  <motion.img
                    key={img.id}
                    src={img.url}
                    alt={img.fileName}
                    className="w-full h-32 rounded-lg object-cover border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl p-6 space-y-4"
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border-subtle)",
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h3
              className="font-semibold text-lg"
              style={{ color: "var(--color-text)" }}
            >
              Form Testimoni
            </h3>

            <div>
              <label className="text-sm font-medium block mb-2">Nama</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="Nama Anda"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const fill = Math.max(0, Math.min(1, displayRating - (star - 1)));
                  return (
                    <motion.button
                      key={star}
                      type="button"
                      className="relative h-9 w-9 cursor-pointer"
                      whileTap={{ scale: 0.92 }}
                      onMouseMove={(e) =>
                        setHoverRating(
                          quarterRatingFromPointer(
                            e.clientX,
                            e.currentTarget,
                            star,
                          ),
                        )
                      }
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={(e) =>
                        setRating(
                          quarterRatingFromPointer(
                            e.clientX,
                            e.currentTarget,
                            star,
                          ),
                        )
                      }
                    >
                      <StarIcon
                        className="absolute inset-0 h-9 w-9"
                        color="#111111"
                      />
                      <div
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        style={{ width: `${fill * 100}%` }}
                      >
                        <StarIcon className="h-9 w-9" color="#F4C430" />
                      </div>
                    </motion.button>
                  );
                })}
                <motion.span
                  className="ml-1 text-sm font-medium text-zinc-700"
                  key={displayRating}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatRating(displayRating)} / 5
                </motion.span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Mendukung rating per 0.25 (contoh: 4, 4.25, 4.5, 4.75, 5).
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Testimoni</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="Ceritakan pengalaman Anda..."
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Upload Foto (minimal 1)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFilesChange}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <p className="text-xs mt-1 text-muted-foreground">
                Format: JPG/PNG/WebP/GIF, maksimal 8MB per foto.
              </p>
            </div>

            <AnimatePresence>
              {pendingImages.length > 0 ? (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      Keranjang Foto ({pendingImages.length})
                    </p>
                    <button
                      type="button"
                      onClick={clearPendingImages}
                      className="text-xs px-2.5 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Hapus Semua Foto
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Foto yang sudah masuk keranjang bisa dihapus kapan saja
                    sebelum testimoni dikirim.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <AnimatePresence>
                      {pendingImages.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{ duration: 0.2 }}
                          className="relative isolate rounded-lg overflow-hidden border"
                        >
                          <img
                            src={item.previewUrl}
                            alt={item.file.name}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePendingImage(item.id)}
                            className="absolute top-2 right-2 z-20 text-white text-xs px-2 py-1 rounded-md"
                            style={{
                              backgroundColor: "rgba(220, 38, 38, 0.95)",
                              border: "1px solid rgba(255,255,255,0.45)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}
                          >
                            Hapus
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                opacity: submitting ? 0.7 : 1,
                pointerEvents: submitting ? "none" : "auto",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? "Mengirim..." : "Kirim Testimoni"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Link href="/" className="btn-outline">
          Kembali ke Beranda
        </Link>
      </motion.div>
    </section>
  );
}
