import * as yup from "yup";

export const destinationSchema = yup.object({
    name: yup
        .string()
        .required("Nama destinasi wajib diisi")
        .min(2, "Nama destinasi minimal 2 karakter")
        .max(100, "Nama destinasi maksimal 100 karakter"),
});

export type DestinationFormData = yup.InferType<typeof destinationSchema>;
