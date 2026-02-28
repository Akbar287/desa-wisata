import { z } from "zod/v3"

export const LoginSkemaValidation = z.object({
    username: z
        .string({
            required_error: "Nama Pengguna diperlukan",
            invalid_type_error: "Nama Pengguna harus berupa teks",
        })
        .min(8, "Nama Pengguna harus memiliki minimal 8 karakter")
        .max(16, "Nama Pengguna harus memiliki maksimal 16 karakter"),
    password: z
        .string({
            required_error: "Kata Sandi diperlukan",
            invalid_type_error: "Kata Sandi harus berupa teks",
        })
        .min(8, "Kata Sandi harus memiliki minimal 8 karakter"),
})

export type LoginFormValidation = z.infer<typeof LoginSkemaValidation>
