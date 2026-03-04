import * as yup from "yup";

export const landingPageStatisticSchema = yup.object({
    title: yup.string().required("Judul wajib diisi").min(2, "Minimal 2 karakter").max(100, "Maksimal 100 karakter"),
    count: yup.number().required("Jumlah wajib diisi").min(0, "Minimal 0").typeError("Harus berupa angka"),
    image: yup.string().default(""),
    order: yup.number().required("Urutan wajib diisi").min(0, "Minimal 0").typeError("Harus berupa angka"),
});

export const landingPageWithUsSchema = yup.object({
    title: yup.string().required("Judul wajib diisi").min(2, "Minimal 2 karakter").max(100, "Maksimal 100 karakter"),
    subtitle: yup.string().required("Subtitle wajib diisi").min(2, "Minimal 2 karakter"),
    image: yup.string().default(""),
    order: yup.number().required("Urutan wajib diisi").min(0, "Minimal 0").typeError("Harus berupa angka"),
});
