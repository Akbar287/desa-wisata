import BlogIdComponents from "@/components/BlogIdComponents";
import { BlogDetailPost } from "@/types/BlogType";

const BLOG_DB: Record<number, BlogDetailPost> = {
    1: {
        id: 1,
        title: "10 Tips Mengunjungi Desa Wisata untuk Pertama Kali",
        excerpt: "Panduan lengkap untuk mempersiapkan perjalanan ke desa wisata Indonesia.",
        image: "/assets/e4d31f2e-34fe-4720-9db0-296cdfe9e921-10questions_cover.jpg",
        date: "20 Feb 2026",
        category: "travel-tips",
        readTime: "5 menit",
        author: { name: "Rina Wulandari", avatar: "/assets/default-avatar-2020-13.jpg", role: "Travel Writer" },
        tags: ["Tips", "Pemula", "Desa Wisata", "Persiapan"],
        content: [
            "Mengunjungi desa wisata untuk pertama kali bisa menjadi pengalaman yang luar biasa jika Anda tahu cara mempersiapkannya dengan baik. Desa wisata menawarkan keindahan alam, kearifan lokal, dan pengalaman budaya yang autentik — sesuatu yang tidak bisa Anda temukan di hotel mewah atau resort modern.",
            "Pertama, lakukan riset mendalam tentang desa wisata yang akan Anda kunjungi. Cari tahu tentang budaya lokal, adat istiadat, dan aturan yang berlaku. Setiap desa memiliki keunikan tersendiri, dan memahami hal ini akan membuat kunjungan Anda lebih bermakna.",
            "Kedua, siapkan pakaian yang sesuai. Kebanyakan desa wisata berada di daerah pedesaan atau pegunungan di mana cuaca bisa berubah dengan cepat. Bawa jaket tipis, sepatu yang nyaman untuk berjalan, dan pakaian sopan untuk mengunjungi tempat-tempat sakral.",
            "Ketiga, belajar beberapa kata dalam bahasa lokal. Meskipun sederhana, usaha Anda untuk berkomunikasi dalam bahasa mereka akan sangat dihargai oleh penduduk setempat dan membuka pintu untuk interaksi yang lebih hangat.",
            "Keempat, hormati privasi penduduk lokal. Selalu minta izin sebelum mengambil foto, terutama foto orang. Ingat bahwa desa wisata adalah rumah bagi masyarakat setempat, bukan sekadar atraksi wisata.",
            "Kelima, cobalah makanan lokal. Kuliner desa wisata sering kali menjadi highlight tersendiri dalam perjalanan. Dari jajanan pasar tradisional hingga masakan rumahan yang dimasak dengan bahan-bahan segar dari kebun sendiri.",
            "Keenam, bawa uang tunai dalam pecahan kecil. Tidak semua desa wisata memiliki ATM atau menerima pembayaran digital. Uang tunai akan memudahkan Anda berbelanja di pasar tradisional atau memberikan tip.",
            "Ketujuh, datang dengan pikiran terbuka. Fasilitas di desa wisata mungkin berbeda dari yang Anda biasa nikmati di kota. Justru inilah yang membuat pengalaman desa wisata begitu istimewa dan autentik.",
            "Kedelapan, ikuti aktivitas lokal. Banyak desa wisata menawarkan workshop seperti membatik, menenun, atau bercocok tanam. Partisipasi aktif akan memberikan pengalaman yang lebih mendalam dan berkesan.",
            "Kesembilan, jaga kebersihan lingkungan. Bawa botol minum sendiri, kurangi penggunaan plastik, dan buang sampah pada tempatnya. Ini adalah bentuk penghormatan terhadap alam dan masyarakat desa.",
            "Kesepuluh, nikmati setiap momen. Matikan ponsel sesekali, dengarkan suara alam, rasakan angin pegunungan, dan hadir sepenuhnya dalam pengalaman yang Anda jalani. Desa wisata adalah tempat untuk memperlambat langkah dan menemukan kebahagiaan dalam kesederhanaan.",
        ],
        relatedPosts: [
            { id: 2, title: "Apa yang Harus Dibawa ke Desa Wisata?", image: "/assets/1d3ea945-5ed1-4f21-8102-7bfd0ebde444-720x405-4ec8ef19-bc8c-4a99-9ba6-9b0a691bf91f-3814bcbb0a7203734988b55938d1c711.jpg", category: "travel-tips" },
            { id: 3, title: "Kesalahan yang Sering Dilakukan Wisatawan", image: "/assets/a084ee08-c292-406b-84cb-929c4520639b-720x405-dab2b0a2-1b42-4f6a-a995-0193a06e8723-c7cfb592306735f092476a9701d6281b.jpg", category: "travel-tips" },
            { id: 12, title: "Etika Berkunjung ke Desa Adat", image: "/assets/22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg", category: "important-info" },
        ],
    },
};

const DEFAULT_POST = BLOG_DB[1];

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const postId = Number(id);
    const post = BLOG_DB[postId] ?? DEFAULT_POST;

    return <BlogIdComponents post={post} />;
}
