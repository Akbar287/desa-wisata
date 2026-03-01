import * as yup from "yup";

export const userSchema = yup.object({
    name: yup.string().required("Nama wajib diisi").min(2, "Minimal 2 karakter").max(100, "Maksimal 100 karakter"),
    email: yup.string().required("Email wajib diisi").email("Format email tidak valid"),
    age: yup.number().required("Umur wajib diisi").min(1, "Minimal 1").max(150, "Maksimal 150").typeError("Umur harus angka"),
    gender: yup.string().oneOf(["MALE", "FEMALE"], "Gender tidak valid").required("Gender wajib dipilih"),
    nationality: yup.string().required("Kewarganegaraan wajib diisi"),
    phoneCode: yup.string().required("Kode telepon wajib diisi"),
    phoneNumber: yup.string().required("Nomor telepon wajib diisi"),
    address: yup.string().required("Alamat wajib diisi"),
    avatar: yup.string().default(""),
});

export const userLoginSchema = yup.object({
    Username: yup.string().required("Username wajib diisi").min(3, "Minimal 3 karakter"),
    Password: yup.string().required("Password wajib diisi").min(6, "Minimal 6 karakter"),
});

export const roleSchema = yup.object({
    name: yup.string().required("Nama role wajib diisi").min(2, "Minimal 2 karakter"),
    description: yup.string().default(""),
});
