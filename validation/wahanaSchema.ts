import * as yup from "yup";

export const wahanaSchema = yup.object({
    name: yup
        .string()
        .required("Nama wahana wajib diisi")
        .min(2, "Nama wahana minimal 2 karakter")
        .max(100, "Nama wahana maksimal 100 karakter"),
    price: yup
        .number()
        .required("Harga wahana wajib diisi")
        .typeError("Harga harus berupa angka")
        .min(0, "Harga tidak boleh negatif"),
    description: yup
        .string()
        .required("Deskripsi wahana wajib diisi")
        .min(10, "Deskripsi minimal 10 karakter"),
    imageBanner: yup
        .string()
        .required("Banner wahana wajib diisi"),
    gallery: yup
        .array()
        .of(
            yup.object({
                image: yup.string().required("URL gambar galeri wajib diisi")
            })
        )
        .default([]),
});

export type WahanaFormData = yup.InferType<typeof wahanaSchema>;
