import { z } from "zod"

export const LoginSkemaValidation = z.object({
    username: z
        .string({
            error: (iss) => iss.input === undefined ? "Nama Pengguna diperlukan" : "Nama Pengguna harus memiliki minimal 8 karakter",
        })
        .min(8, "Nama Pengguna harus memiliki minimal 8 karakter")
        .max(16, "Nama Pengguna harus memiliki maksimal 16 karakter"),
    password: z
        .string({
            error: (iss) => iss.input === undefined ? "Kata Sandi diperlukan" : "Kata Sandi harus memiliki minimal 8 karakter",
        })
        .min(8, "Kata Sandi harus memiliki minimal 8 karakter"),
})

export type LoginFormValidation = z.infer<typeof LoginSkemaValidation>
