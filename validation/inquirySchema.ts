import * as yup from "yup";

export const inquirySchema = yup.object({
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
    email: yup
        .string()
        .required("Email wajib diisi")
        .email("Format email tidak valid"),
    phoneCode: yup
        .string()
        .required("Kode negara wajib dipilih"),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]{6,15}$/, "Nomor telepon harus 6-15 digit angka")
        .notRequired()
        .default(""),
    subject: yup
        .string()
        .when("$hasSlug", {
            is: false,
            then: (s) => s.required("Topik pertanyaan wajib dipilih"),
            otherwise: (s) => s.notRequired(),
        }),
    travelPlans: yup
        .string()
        .required("Pertanyaan wajib diisi")
        .min(10, "Pertanyaan minimal 10 karakter")
        .max(2000, "Pertanyaan maksimal 2000 karakter"),
});

export type InquiryFormData = yup.InferType<typeof inquirySchema>;
