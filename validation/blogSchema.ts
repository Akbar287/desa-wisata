import * as yup from "yup";

export const blogPostSchema = yup.object({
    title: yup.string().required("Judul wajib diisi").min(3, "Minimal 3 karakter").max(300, "Maksimal 300 karakter"),
    excerpt: yup.string().required("Ringkasan wajib diisi").min(10, "Minimal 10 karakter"),
    image: yup.string().required("Gambar wajib diisi"),
    date: yup.string().required("Tanggal wajib diisi"),
    category: yup.string().required("Kategori wajib diisi"),
    readTime: yup.string().required("Waktu baca wajib diisi"),
    authorId: yup.number().nullable().default(null),
    content: yup.array().of(yup.string().required()).default([]),
});

export const blogTagSchema = yup.object({
    tag: yup.string().required("Tag wajib diisi").min(2, "Minimal 2 karakter").max(50, "Maksimal 50 karakter"),
});

export const blogAuthorSchema = yup.object({
    name: yup.string().required("Nama wajib diisi").min(2, "Minimal 2 karakter"),
    avatar: yup.string().default(""),
    role: yup.string().required("Role wajib diisi"),
});
