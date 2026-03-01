import * as yup from "yup";

export const testimonialSchema = yup.object({
    name: yup.string().required("Nama wajib diisi").min(2, "Minimal 2 karakter").max(100, "Maksimal 100 karakter"),
    avatar: yup.string().default(""),
    role: yup.string().required("Role/jabatan wajib diisi").min(2, "Minimal 2 karakter"),
    text: yup.string().required("Teks testimoni wajib diisi").min(10, "Minimal 10 karakter"),
    rating: yup.number().required("Rating wajib diisi").min(1, "Minimal 1").max(5, "Maksimal 5"),
});
