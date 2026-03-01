import * as yup from 'yup'

export const paymentAvailableSchema = yup.object({
    name: yup
        .string()
        .required('Nama metode wajib diisi')
        .min(2, 'Nama minimal 2 karakter')
        .max(100, 'Nama maksimal 100 karakter'),
    accountNumber: yup
        .string()
        .required('Nomor rekening wajib diisi')
        .min(3, 'Nomor rekening minimal 3 karakter')
        .max(50, 'Nomor rekening maksimal 50 karakter'),
    accountName: yup
        .string()
        .required('Nama pemilik rekening wajib diisi')
        .min(2, 'Nama pemilik minimal 2 karakter')
        .max(100, 'Nama pemilik maksimal 100 karakter'),
    image: yup
        .string()
        .required('Gambar wajib diisi'),
    description: yup
        .string()
        .required('Deskripsi wajib diisi')
        .min(5, 'Deskripsi minimal 5 karakter')
        .max(500, 'Deskripsi maksimal 500 karakter'),
    type: yup
        .string()
        .oneOf(['BANK', 'WALLET', 'QRIS'] as const, 'Tipe tidak valid')
        .required('Tipe pembayaran wajib dipilih'),
    isActive: yup
        .boolean()
        .required()
        .default(true),
})

export type PaymentAvailableSchemaType = yup.InferType<typeof paymentAvailableSchema>
