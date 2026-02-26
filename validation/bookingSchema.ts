import * as yup from "yup";

export const bookingSchema = yup.object({
    // Personal Information
    firstName: yup
        .string()
        .required("Nama depan wajib diisi")
        .min(2, "Nama depan minimal 2 karakter")
        .max(50, "Nama depan maksimal 50 karakter"),
    lastName: yup
        .string()
        .required("Nama belakang wajib diisi")
        .min(2, "Nama belakang minimal 2 karakter")
        .max(50, "Nama belakang maksimal 50 karakter"),
    gender: yup
        .string()
        .oneOf(["male", "female"], "Pilih jenis kelamin")
        .required("Jenis kelamin wajib dipilih"),
    birthYear: yup
        .string()
        .required("Tahun lahir wajib diisi"),
    birthMonth: yup
        .string()
        .required("Bulan lahir wajib diisi"),
    birthDay: yup
        .string()
        .required("Hari lahir wajib diisi"),
    nationality: yup
        .string()
        .required("Kewarganegaraan wajib dipilih"),
    email: yup
        .string()
        .required("Email wajib diisi")
        .email("Format email tidak valid"),
    phoneCode: yup
        .string()
        .required("Kode negara wajib dipilih"),
    phoneNumber: yup
        .string()
        .required("Nomor telepon wajib diisi")
        .matches(/^[0-9]{6,15}$/, "Nomor telepon harus 6-15 digit angka"),

    // Booking Information
    adults: yup
        .number()
        .required("Jumlah dewasa wajib diisi")
        .min(1, "Minimal 1 orang dewasa")
        .max(20, "Maksimal 20 orang dewasa"),
    children: yup
        .number()
        .min(0, "Tidak boleh negatif")
        .max(10, "Maksimal 10 anak")
        .default(0),
    findUs: yup
        .string()
        .required("Pilih sumber informasi"),
    comments: yup
        .string()
        .max(1000, "Maksimal 1000 karakter"),

    // Terms
    acceptTerms: yup
        .boolean()
        .oneOf([true], "Anda harus menyetujui syarat & ketentuan")
        .required("Anda harus menyetujui syarat & ketentuan"),
});

export type BookingFormData = yup.InferType<typeof bookingSchema>;
