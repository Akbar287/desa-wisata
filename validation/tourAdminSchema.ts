import * as yup from "yup";

export const tourBasicSchema = yup.object({
    title: yup.string().required("Judul tour wajib diisi").min(3, "Minimal 3 karakter").max(200, "Maksimal 200 karakter"),
    type: yup.string().oneOf(["GRUP", "PRIVAT"], "Pilih tipe tour").required("Tipe tour wajib dipilih"),
    durationDays: yup.number().required("Durasi wajib diisi").min(1, "Minimal 1 hari").max(365, "Maksimal 365 hari"),
    price: yup.number().required("Harga wajib diisi").min(0, "Harga tidak boleh negatif"),
    image: yup.string().required("Gambar utama wajib diisi"),
    heroImage: yup.string().default(""),
    overview: yup.string().default(""),
    groupSize: yup.string().default(""),
    rating: yup.number().min(0).max(5).default(0),
    reviewCount: yup.number().min(0).default(0),
});

export const highlightSchema = yup.object({
    text: yup.string().required("Teks sorotan wajib diisi").min(3, "Minimal 3 karakter"),
    order: yup.number().min(0).default(0),
});

export const gallerySchema = yup.object({
    image: yup.string().required("Gambar wajib diupload"),
    order: yup.number().min(0).default(0),
});

export const itinerarySchema = yup.object({
    day: yup.number().required("Hari wajib diisi").min(1, "Minimal hari ke-1"),
    title: yup.string().required("Judul wajib diisi").min(3, "Minimal 3 karakter"),
    description: yup.string().required("Deskripsi wajib diisi").min(10, "Minimal 10 karakter"),
    distance: yup.string().default(""),
    meals: yup.array().of(yup.string().required()).default([] as string[]),
});

export const textItemSchema = yup.object({
    text: yup.string().required("Teks wajib diisi").min(3, "Minimal 3 karakter"),
    order: yup.number().min(0).default(0),
});

export const dateSchema = yup.object({
    startDate: yup.string().required("Tanggal mulai wajib diisi"),
    endDate: yup.string().required("Tanggal selesai wajib diisi"),
    status: yup.string().oneOf(["AVAILABLE", "ALMOST_FULL", "FULL", "CLOSED"]).required("Status wajib dipilih"),
    price: yup.number().required("Harga wajib diisi").min(0, "Harga tidak boleh negatif"),
});

export const reviewSchema = yup.object({
    name: yup.string().required("Nama wajib diisi").min(2, "Minimal 2 karakter"),
    avatar: yup.string().default(""),
    rating: yup.number().required("Rating wajib diisi").min(1, "Minimal 1").max(5, "Maksimal 5"),
    date: yup.string().required("Tanggal wajib diisi"),
    text: yup.string().required("Teks ulasan wajib diisi").min(10, "Minimal 10 karakter"),
    location: yup.string().default(""),
});

export const goodToKnowSchema = yup.object({
    title: yup.string().required("Judul wajib diisi").min(3, "Minimal 3 karakter"),
    text: yup.string().required("Teks wajib diisi").min(10, "Minimal 10 karakter"),
    order: yup.number().min(0).default(0),
});

export const specialPackageSchema = yup.object({
    subtitle: yup.string().required("Subtitle wajib diisi"),
    originalPrice: yup.number().required("Harga asli wajib diisi").min(0),
    discount: yup.number().required("Diskon wajib diisi").min(0).max(100),
    badge: yup.string().required("Badge wajib diisi"),
    badgeEmoji: yup.string().required("Badge emoji wajib diisi"),
    gradient: yup.string().required("Gradient wajib diisi"),
    groupSize: yup.string().required("Ukuran grup wajib diisi"),
    season: yup.string().required("Musim wajib diisi"),
    dateRange: yup.string().required("Rentang tanggal wajib diisi"),
    limitedSlots: yup.number().required("Slot wajib diisi").min(1),
});

export const privatePackageSchema = yup.object({
    tagline: yup.string().required("Tagline wajib diisi"),
    maxGuests: yup.number().required("Maks tamu wajib diisi").min(1),
    priceNote: yup.string().required("Catatan harga wajib diisi"),
    tier: yup.string().oneOf(["GOLD", "PLATINUM", "DIAMOND"]).required("Tier wajib dipilih"),
    includes: yup.array().of(yup.string().required()).default([]),
});
