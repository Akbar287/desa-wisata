import ToursDetailComponent from "@/components/ToursDetailComponent";
import { TourDetail } from "@/types/TourType";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tourId: number = Number(id);
    const TOURS_DB: Record<number, TourDetail> = {
        1: {
            id: 1,
            title: "Pesona Desa Wisata Penglipuran",
            type: "Grup",
            themes: ["Budaya", "Terlaris"],
            durationDays: 3,
            groupSize: "Rata-rata 10 orang",
            price: 2500000,
            destinations: ["Bali"],
            overview:
                "Jelajahi salah satu desa tercantik di dunia — Penglipuran di Bali. Nikmati arsitektur tradisional Bali yang terawat sempurna, interaksi hangat dengan penduduk lokal, dan keindahan alam pegunungan yang menyegarkan. Perjalanan ini mengajak Anda merasakan harmoni alam dan budaya Bali yang sesungguhnya, jauh dari kebisingan wisata mainstream.",
            heroImage: "/assets/e50bd774-982a-4206-b5b9-3ace3c9c8f27-gobi_gallery1.jpg",
            gallery: [
                "/assets/38826e03-83a4-482e-a720-492ac8bfaef5-cover_culture.jpg",
                "/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg",
                "/assets/7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg",
                "/assets/9b4e5aa3-5ec7-4c73-b146-e0f45b9eff94-mistakes_Gallery_road.jpg",
                "/assets/22f1c083-1bb1-4fb6-a963-93b1e67341ef-36eb93d315a100c3d3098747caaa90d33.jpg",
                "/assets/e4d31f2e-34fe-4720-9db0-296cdfe9e921-10questions_cover.jpg",
            ],
            itinerary: [
                { day: 1, title: "Kedatangan di Bali & Perjalanan ke Penglipuran", description: "Dijemput di Bandara Ngurah Rai, lalu perjalanan selama 2 jam menuju Desa Penglipuran di Kabupaten Bangli. Check-in di homestay warga lokal dan menikmati makan malam khas Bali.", meals: ["D"], distance: "85 km" },
                { day: 2, title: "Eksplorasi Desa & Budaya Penglipuran", description: "Hari penuh meresapi kehidupan desa. Pagi dimulai dengan upacara pagi bersama warga, dilanjutkan tur arsitektur rumah adat, workshop tenun bambu, dan makan siang bersama keluarga lokal. Sore hari menikmati pemandangan Gunung Agung dari bukit desa.", meals: ["B", "L", "D"] },
                { day: 3, title: "Pasar Tradisional & Keberangkatan", description: "Pagi mengunjungi pasar tradisional Bangli, berbelanja oleh-oleh kerajinan lokal, lalu transfer kembali ke bandara atau hotel di Bali Selatan.", meals: ["B", "L"], distance: "85 km" },
            ],
            included: [
                "Akomodasi homestay 2 malam",
                "Transportasi AC selama perjalanan",
                "Pemandu wisata lokal berbahasa Indonesia",
                "Makan sesuai program (2B, 1L, 2D)",
                "Workshop tenun bambu",
                "Biaya masuk Desa Penglipuran",
                "Asuransi perjalanan dasar",
            ],
            excluded: [
                "Tiket pesawat domestik/internasional",
                "Pengeluaran pribadi & laundry",
                "Tips untuk pemandu & driver",
                "Minuman beralkohol",
                "Asuransi perjalanan premium",
            ],
            dates: [
                { start: "15 Mar 2026", end: "17 Mar 2026", status: "Tersedia", price: 2500000 },
                { start: "5 Apr 2026", end: "7 Apr 2026", status: "Tersedia", price: 2500000 },
                { start: "20 Apr 2026", end: "22 Apr 2026", status: "Terjamin", price: 2700000 },
                { start: "10 Mei 2026", end: "12 Mei 2026", status: "Tersedia", price: 2500000 },
                { start: "7 Jun 2026", end: "9 Jun 2026", status: "Hampir Penuh", price: 2800000 },
            ],
            reviews: [
                { name: "Dewi Lestari", avatar: "/assets/default-avatar-2020-13.jpg", rating: 5, date: "Januari 2026", text: "Pengalaman luar biasa! Desa Penglipuran benar-benar memukau dengan keindahan dan kearifan lokal yang masih terjaga. Pemandu sangat ramah dan informatif.", location: "Jakarta" },
                { name: "Ahmad Rizki", avatar: "/assets/default-avatar-2020-25.jpg", rating: 5, date: "Desember 2025", text: "Perjalanan yang sempurna untuk mengenal Bali yang sesungguhnya. Menginap di rumah warga memberikan pengalaman yang sangat autentik dan tak terlupakan.", location: "Surabaya" },
                { name: "Sari Purnama", avatar: "/assets/default-avatar-2020-3.jpg", rating: 4, date: "November 2025", text: "Paket wisata yang sangat worth it! Workshop tenun bambu jadi pengalaman favorit saya. Satu-satunya hal yang perlu ditingkatkan adalah pilihan makanan vegetarian.", location: "Bandung" },
            ],
            relatedTourIds: [2, 4, 5],
            highlights: [
                "Arsitektur rumah adat Bali yang menakjubkan",
                "Interaksi langsung dengan masyarakat lokal",
                "Keindahan alam pegunungan Bali",
                "Workshop tenun bambu tradisional",
            ],
            goodToKnow: [
                { title: "Cuaca & Pakaian", text: "Penglipuran berada di dataran tinggi (~700 mdpl) sehingga udara lebih sejuk. Bawa jaket tipis untuk malam hari. Gunakan pakaian sopan saat mengunjungi pura." },
                { title: "Transportasi", text: "Perjalanan dari bandara menggunakan minibus ber-AC. Medan jalan mulus dan pemandangan sepanjang perjalanan sangat indah." },
                { title: "Makanan", text: "Makanan khas Bali disajikan di homestay. Informasikan alergi atau pantangan makanan saat pemesanan agar bisa disesuaikan." },
            ],
        },
    };
    const DEFAULT_TOUR = TOURS_DB[1];
    const RELATED_TOURS: Record<number, { id: number; title: string; image: string; duration: string; price: string }> = {
        2: { id: 2, title: "Jelajah Desa Wae Rebo", image: "/assets/e4d847b7-3667-467f-992c-05ff8a23fde6-c6a9139fa9f5509fd47ec9df5236f669.jpg", duration: "4 hari", price: "Rp 3.800.000" },
        4: { id: 4, title: "Desa Wisata Trunyan & Kintamani", image: "/assets/7a750ea3-4682-4260-acf4-eb18b2ccc0a0-fa723100cbf6b45c3c8aa40ca4adf9b82222.jpg", duration: "5 hari", price: "Rp 4.200.000" },
        5: { id: 5, title: "Desa Sade Lombok", image: "/assets/9b4e5aa3-5ec7-4c73-b146-e0f45b9eff94-mistakes_Gallery_road.jpg", duration: "3 hari", price: "Rp 2.800.000" },
    };
    const NAV_ITEMS = [
        { id: "overview", label: "Ringkasan" },
        { id: "gallery", label: "Galeri" },
        { id: "itinerary", label: "Itinerari" },
        { id: "price_and_date", label: "Harga & Jadwal" },
        { id: "included", label: "Termasuk" },
        { id: "good_to_know", label: "Info Penting" },
        { id: "reviews", label: "Ulasan" },
    ];
    const tour = TOURS_DB[tourId] ?? DEFAULT_TOUR;

    return (
        <ToursDetailComponent tour={tour} navItems={NAV_ITEMS} relatedTours={RELATED_TOURS} />
    );
}
