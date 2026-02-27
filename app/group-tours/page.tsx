import GroupTourComponents from '@/components/GroupTourComponents'
import { Testimonial, Tour } from '@/types/TourType'

export default function page() {
    const GROUP_TOURS: Tour[] = [
        {
            id: 1,
            title: "Pesona Desa Wisata Penglipuran",
            type: "Grup",
            themes: ["Budaya", "Terlaris"],
            durationDays: 3,
            price: 2500000,
            destinations: ["Bali"],
            highlights: [
                "Arsitektur rumah adat Bali yang menakjubkan",
                "Interaksi langsung dengan masyarakat lokal",
                "Keindahan alam pegunungan Bali",
            ],
            image: "/assets/e50bd774-982a-4206-b5b9-3ace3c9c8f27-gobi_gallery1.jpg",
            rating: 4.9,
            reviews: 128,
        },
        {
            id: 2,
            title: "Jelajah Desa Wae Rebo",
            type: "Grup",
            themes: ["Trekking", "Budaya", "Terlaris"],
            durationDays: 4,
            price: 3800000,
            destinations: ["Flores", "NTT"],
            highlights: [
                "Rumah adat Mbaru Niang yang ikonik",
                "Trekking melewati hutan tropis lebat",
                "Budaya dan tradisi suku Manggarai",
            ],
            image: "/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg",
            rating: 4.8,
            reviews: 95,
        },
        {
            id: 4,
            title: "Desa Wisata Trunyan & Kintamani",
            type: "Grup",
            themes: ["Budaya", "Alam"],
            durationDays: 5,
            price: 4200000,
            destinations: ["Bali"],
            highlights: [
                "Pemakaman kuno unik di Trunyan",
                "Panorama Danau Batur yang memukau",
                "Kehidupan masyarakat Bali Aga",
            ],
            image: "/assets/7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg",
            rating: 4.6,
            reviews: 54,
        },
        {
            id: 6,
            title: "Desa Wisata Osing Banyuwangi",
            type: "Grup",
            themes: ["Budaya", "Festival"],
            durationDays: 4,
            price: 3500000,
            destinations: ["Jawa Timur"],
            highlights: [
                "Budaya suku Osing yang unik",
                "Festival Gandrung Sewu spektakuler",
                "Kawah Ijen & pantai timur Jawa",
            ],
            image: "/assets/22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg",
            rating: 4.7,
            reviews: 61,
        },
        {
            id: 8,
            title: "Danau Toba & Desa Tomok Samosir",
            type: "Grup",
            themes: ["Alam", "Budaya", "Terlaris"],
            durationDays: 6,
            price: 5500000,
            destinations: ["Sumatera Utara"],
            highlights: [
                "Danau vulkanik terbesar di dunia",
                "Desa tradisional Batak Toba",
                "Wisata budaya dan seni ukir Batak",
            ],
            image: "/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg",
            rating: 4.8,
            reviews: 117,
        },
        {
            id: 10,
            title: "Desa Wisata Candirejo Borobudur",
            type: "Grup",
            themes: ["Budaya", "Agrowisata"],
            durationDays: 1,
            price: 450000,
            destinations: ["Jawa Tengah"],
            highlights: [
                "Bersepeda mengelilingi desa",
                "Sunrise di Bukit Punthuk Setumbu",
                "Kerajinan perak dan batik lokal",
            ],
            image: "/assets/7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg",
            rating: 4.6,
            reviews: 204,
        },
        {
            id: 11,
            title: "Desa Nelayan Bajo Komodo",
            type: "Grup",
            themes: ["Alam", "Pantai", "Terlaris"],
            durationDays: 4,
            price: 4800000,
            destinations: ["Flores", "NTT"],
            highlights: [
                "Snorkeling di Taman Nasional Komodo",
                "Bertemu komodo di habitatnya",
                "Kehidupan nelayan Bajo di atas air",
            ],
            image: "/assets/9b4e5aa3-5ec7-4c73-b146-e0f45b9eff94-mistakes_Gallery_road.jpg",
            rating: 4.9,
            reviews: 156,
        },
    ];

    const testimonials: Testimonial[] = [
        { name: 'Rina Handayani', avatar: '/assets/default-avatar-2020-13.jpg', role: 'Group Tour – Wae Rebo', text: 'Awalnya takut ikut trip sendirian, tapi ternyata teman-teman satu grup sangat ramah! Sekarang kami masih sering jalan bareng. Best trip ever!', rating: 5 },
        { name: 'Budi Santoso', avatar: '/assets/default-avatar-2020-49.jpg', role: 'Group Tour – Penglipuran', text: 'Bawa keluarga besar ikut group tour ini, anak-anak senang banget! Harganya terjangkau dan fasilitasnya lengkap. Pasti balik lagi.', rating: 5 },
        { name: 'Maya Lestari', avatar: '/assets/default-avatar-2020-67.jpg', role: 'Group Tour – Komodo', text: 'Pengalaman snorkeling bareng grup baru itu seru banget! Guide-nya profesional dan sabar. Recommended untuk yang suka petualangan.', rating: 5 },
    ];

    const groupPerks = [
        { emoji: '💰', title: 'Harga Lebih Hemat', desc: 'Biaya dibagi rata dengan peserta lain, jadi liburan premium dengan budget yang ramah kantong' },
        { emoji: '🤝', title: 'Teman Baru', desc: 'Bertemu orang-orang baru dari berbagai kota dan latar belakang. Cocok untuk para ekstrovert!' },
        { emoji: '👨‍👩‍👧‍👦', title: 'Cocok untuk Semua', desc: 'Solo traveler, keluarga, sahabat, maupun pasangan — semua bisa ikut dan menikmati' },
        { emoji: '📅', title: 'Jadwal Teratur', desc: 'Trip berangkat sesuai jadwal yang sudah ditentukan, tinggal pilih tanggal yang cocok' },
        { emoji: '🎯', title: 'Itinerari Terencana', desc: 'Tidak perlu pusing menyusun rencana, semua sudah diatur dari A sampai Z oleh tim kami' },
        { emoji: '🛡️', title: 'Aman & Terorganisir', desc: 'Tim pemandu dan koordinator selalu siap memastikan keselamatan dan kenyamanan grup' },
    ];

    return (
        <GroupTourComponents tours={GROUP_TOURS} testimonials={testimonials} groupPerks={groupPerks} />
    )
}
