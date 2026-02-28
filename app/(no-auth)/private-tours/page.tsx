import PrivateTourComponents from '@/components/PrivateTourComponents'
import { Testimonial, Tour } from '@/types/TourType'


export default function page() {
    const PRIVATE_TOURS: Tour[] = [
        {
            id: 3,
            title: "Desa Wisata Nglanggeran",
            type: "Privat",
            themes: ["Alam", "Agrowisata"],
            durationDays: 2,
            price: 1200000,
            destinations: ["Yogyakarta", "Jawa Tengah"],
            highlights: [
                "Gunung Api Purba Nglanggeran",
                "Agrowisata buah dan kebun lokal",
                "Kesenian tradisional Jawa",
            ],
            image: "/assets/38826e03-83a4-482e-a720-492ac8bfaef5-cover_culture.jpg",
            rating: 4.7,
            reviews: 72,
        },
        {
            id: 5,
            title: "Desa Sade Lombok",
            type: "Privat",
            themes: ["Budaya", "Pantai"],
            durationDays: 3,
            price: 2800000,
            destinations: ["Lombok", "NTB"],
            highlights: [
                "Rumah adat suku Sasak yang autentik",
                "Tenun tradisional khas Lombok",
                "Pantai selatan yang eksotis",
            ],
            image: "/assets/9b4e5aa3-5ec7-4c73-b146-e0f45b9eff94-mistakes_Gallery_road.jpg",
            rating: 4.8,
            reviews: 88,
        },
        {
            id: 7,
            title: "Desa Adat Baduy Dalam",
            type: "Privat",
            themes: ["Budaya", "Trekking"],
            durationDays: 2,
            price: 1500000,
            destinations: ["Banten", "Jawa Barat"],
            highlights: [
                "Merasakan hidup tanpa teknologi",
                "Trekking menuju permukiman terpencil",
                "Kearifan lokal Suku Baduy",
            ],
            image: "/assets/e50bd774-982a-4206-b5b9-3ace3c9c8f27-gobi_gallery1.jpg",
            rating: 4.9,
            reviews: 43,
        },
        {
            id: 9,
            title: "Kampung Adat Praijing Sumba",
            type: "Privat",
            themes: ["Budaya", "Fotografi"],
            durationDays: 5,
            price: 6200000,
            destinations: ["Sumba", "NTT"],
            highlights: [
                "Rumah adat beratap jerami tinggi",
                "Tradisi perang adat Pasola",
                "Savana dan pantai eksotis Sumba Barat",
            ],
            image: "/assets/38826e03-83a4-482e-a720-492ac8bfaef5-cover_culture.jpg",
            rating: 5.0,
            reviews: 31,
        },
        {
            id: 12,
            title: "Kampung Raja Ampat",
            type: "Privat",
            themes: ["Alam", "Pantai", "Fotografi"],
            durationDays: 7,
            price: 9500000,
            destinations: ["Papua Barat"],
            highlights: [
                "Surga bawah laut dengan ribuan spesies",
                "Desa nelayan tradisional di atas laut",
                "Sunset di Piaynemo yang legendaris",
            ],
            image: "/assets/22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg",
            rating: 5.0,
            reviews: 78,
        },
    ];
    const testimonials: Testimonial[] = [
        { name: 'Sarah Wijaya', avatar: '/assets/default-avatar-2020-3.jpg', role: 'Private Tour', text: 'Pengalaman luar biasa! Glamping di tepi sungai dengan bintang-bintang di atas... benar-benar seperti mimpi. Tim sangat profesional dan perhatian.', rating: 5 },
        { name: 'David Chen', avatar: '/assets/default-avatar-2020-25.jpg', role: 'Private Tour', text: 'Workshop batik dan upacara teh bersama tetua desa adalah highlight dari liburan kami. Sangat personal dan penuh makna.', rating: 5 },
        { name: 'Amelia Putri', avatar: '/assets/default-avatar-2020-54.jpg', role: 'Private Tour', text: 'Sunrise di kebun teh luar biasa indah. Foto drone-nya amazing! Sarapan di tengah perkebunan... sempurna.', rating: 5 },
    ];

    const vipPerks = [
        { emoji: '🚐', title: 'Transportasi Privat', desc: 'Antar-jemput dari hotel atau bandara dengan kendaraan premium' },
        { emoji: '👨‍🏫', title: 'Pemandu Eksklusif', desc: 'Pemandu berpengalaman khusus untuk grup Anda, bukan sharing' },
        { emoji: '🍽️', title: 'Kuliner Premium', desc: 'Menu spesial disiapkan chef lokal dengan bahan organik segar' },
        { emoji: '📸', title: 'Dokumentasi Pro', desc: 'Fotografer & videografer profesional merekam momen Anda' },
        { emoji: '⏰', title: 'Jadwal Fleksibel', desc: 'Tentukan sendiri waktu keberangkatan dan ritme perjalanan' },
        { emoji: '🎁', title: 'Souvenir Eksklusif', desc: 'Oleh-oleh handmade khas desa yang tidak dijual di pasaran' },
    ];

    return (
        <PrivateTourComponents tours={PRIVATE_TOURS} testimonials={testimonials} vipPerks={vipPerks} />
    )
}
