import * as yup from "yup";

export const themeSchema = yup.object({
    name: yup
        .string()
        .required("Nama tema wajib diisi")
        .min(2, "Nama tema minimal 2 karakter")
        .max(100, "Nama tema maksimal 100 karakter"),
    description: yup
        .string()
        .required("Deskripsi wajib diisi")
        .min(10, "Deskripsi minimal 10 karakter")
        .max(500, "Deskripsi maksimal 500 karakter"),
});

export type ThemeFormData = yup.InferType<typeof themeSchema>;
