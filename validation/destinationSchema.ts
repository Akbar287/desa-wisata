import * as yup from "yup";

export const destinationSchema = yup.object({
    name: yup
        .string()
        .required("Nama destinasi wajib diisi")
        .min(2, "Nama destinasi minimal 2 karakter")
        .max(100, "Nama destinasi maksimal 100 karakter"),
});

export type DestinationFormData = yup.InferType<typeof destinationSchema>;

export const destinationFullSchema = yup.object({
    name: yup.string().required("Nama wajib diisi").min(2).max(100),
    priceWeekend: yup.number().required("Harga weekend wajib diisi").min(0),
    priceWeekday: yup.number().required("Harga weekday wajib diisi").min(0),
    priceGroup: yup.number().required("Harga grup wajib diisi").min(0),
    minimalGroup: yup.number().required("Minimal grup wajib diisi").min(1),
    jamBuka: yup.string().required("Jam buka wajib diisi"),
    jamTutup: yup.string().required("Jam tutup wajib diisi"),
    durasiRekomendasi: yup.string().required("Durasi rekomendasi wajib diisi"),
    isAktif: yup.boolean().required(),
    imageBanner: yup.string().required("Gambar banner wajib diisi"),
    description: yup.string().required("Deskripsi wajib diisi"),
    KuotaHarian: yup.number().required("Kuota harian wajib diisi").min(1),
    rating: yup.number().min(0).max(5).default(0),
    reviewCount: yup.number().min(0).default(0),
});

export const galleryDestinationSchema = yup.object({
    image: yup.string().required("Gambar wajib diisi"),
});

export const masterItemSchema = yup.object({
    name: yup.string().required("Nama wajib diisi").min(2).max(100),
    description: yup.string().default(''),
    icon: yup.string().default(''),
});
