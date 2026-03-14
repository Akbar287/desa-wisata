import * as yup from "yup";

export const wahanaSchema = yup.object({
  name: yup
    .string()
    .required("Nama wahana wajib diisi")
    .min(2, "Nama wahana minimal 2 karakter")
    .max(100, "Nama wahana maksimal 100 karakter"),
  price: yup
    .number()
    .required("Harga wahana wajib diisi")
    .typeError("Harga harus berupa angka")
    .min(0, "Harga tidak boleh negatif"),
  description: yup
    .string()
    .required("Deskripsi wahana wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter"),
  imageBanner: yup.string().required("Banner wahana wajib diisi"),
  gallery: yup
    .array()
    .of(
      yup.object({
        image: yup.string().required("URL gambar galeri wajib diisi"),
      }),
    )
    .default([]),
  mapIds: yup
    .array()
    .of(
      yup
        .number()
        .typeError("Map ID harus berupa angka")
        .integer("Map ID tidak valid")
        .positive("Map ID tidak valid")
        .required("Map ID wajib diisi"),
    )
    .default([]),
});

export const mapMasterSchema = yup.object({
  title: yup.string().required("Judul peta wajib diisi").min(2).max(120),
  content: yup.string().default(""),
  image: yup.string().default(""),
  icon: yup.string().default(""),
  lat: yup
    .number()
    .typeError("Latitude wajib berupa angka")
    .required("Latitude wajib diisi")
    .min(-90, "Latitude minimum -90")
    .max(90, "Latitude maksimum 90"),
  lng: yup
    .number()
    .typeError("Longitude wajib berupa angka")
    .required("Longitude wajib diisi")
    .min(-180, "Longitude minimum -180")
    .max(180, "Longitude maksimum 180"),
  fasilitas: yup.boolean().required(),
});

export type WahanaFormData = yup.InferType<typeof wahanaSchema>;
