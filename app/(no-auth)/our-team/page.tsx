import OurTeamComponents from '@/components/OurTeamComponents'
import { TeamCategory } from '@/types/OurTeamType';
import React from 'react'

export default function page() {
    const teams: TeamCategory[] = [
        {
            title: 'Tim Pemandu Wisata',
            emoji: '🧭',
            description: 'Pemandu berpengalaman yang mengenal setiap sudut Desa Manud Jaya dan siap membawa Anda menjelajah dengan aman dan menyenangkan.',
            gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)',
            members: [
                { name: 'Budi Santoso', role: 'Kepala Pemandu', avatar: '/assets/default-avatar-2020-25.jpg', experience: '12 tahun', specialty: 'Trekking & Ekowisata' },
                { name: 'Rina Wulandari', role: 'Pemandu Senior', avatar: '/assets/default-avatar-2020-3.jpg', experience: '8 tahun', specialty: 'Wisata Budaya' },
                { name: 'Agus Pratama', role: 'Pemandu', avatar: '/assets/default-avatar-2020-13.jpg', experience: '5 tahun', specialty: 'River Tubing & Outbound' },
                { name: 'Siti Nurhaliza', role: 'Pemandu', avatar: '/assets/default-avatar-2020-54.jpg', experience: '4 tahun', specialty: 'Agrowisata & Perkebunan' },
                { name: 'Dedi Kurniawan', role: 'Pemandu', avatar: '/assets/default-avatar-2020-49.jpg', experience: '3 tahun', specialty: 'Fotografi & Alam' },
                { name: 'Lestari Dewi', role: 'Pemandu Junior', avatar: '/assets/default-avatar-2020-67.jpg', experience: '2 tahun', specialty: 'Wisata Edukasi' },
            ],
        },
        {
            title: 'Tim Keamanan',
            emoji: '🛡️',
            description: 'Tim keamanan profesional yang menjaga kenyamanan dan keselamatan wisatawan selama berada di kawasan desa wisata.',
            gradient: 'linear-gradient(135deg, #1E40AF, #60A5FA)',
            members: [
                { name: 'Hendra Wijaya', role: 'Kepala Keamanan', avatar: '/assets/default-avatar-2020-49.jpg', experience: '15 tahun', specialty: 'Manajemen Keamanan' },
                { name: 'Riko Firmansyah', role: 'Petugas Keamanan', avatar: '/assets/default-avatar-2020-25.jpg', experience: '7 tahun', specialty: 'Patrol & Pengawasan' },
                { name: 'Andi Saputra', role: 'Petugas Keamanan', avatar: '/assets/default-avatar-2020-13.jpg', experience: '5 tahun', specialty: 'Keamanan Outdoor' },
                { name: 'Wahyu Nugroho', role: 'Petugas Keamanan', avatar: '/assets/default-avatar-2020-67.jpg', experience: '4 tahun', specialty: 'SAR & Evakuasi' },
                { name: 'Putu Arya', role: 'Petugas Keamanan', avatar: '/assets/default-avatar-2020-54.jpg', experience: '3 tahun', specialty: 'Penanganan Darurat' },
            ],
        },
        {
            title: 'Tim Kesehatan',
            emoji: '🏥',
            description: 'Tenaga medis terlatih yang siap memberikan pertolongan pertama dan menjaga kesehatan wisatawan selama aktivitas.',
            gradient: 'linear-gradient(135deg, #DC2626, #F87171)',
            members: [
                { name: 'dr. Maya Sari', role: 'Dokter Jaga', avatar: '/assets/default-avatar-2020-3.jpg', experience: '10 tahun', specialty: 'Kedokteran Umum' },
                { name: 'Ns. Fitri Handayani', role: 'Perawat Senior', avatar: '/assets/default-avatar-2020-54.jpg', experience: '8 tahun', specialty: 'Pertolongan Pertama' },
                { name: 'Dwi Rahayu', role: 'Paramedis', avatar: '/assets/default-avatar-2020-67.jpg', experience: '6 tahun', specialty: 'Trauma & P3K' },
                { name: 'Irwan Setiawan', role: 'Paramedis', avatar: '/assets/default-avatar-2020-13.jpg', experience: '5 tahun', specialty: 'Rescue Medis' },
                { name: 'Ratna Kumala', role: 'Tenaga Medis', avatar: '/assets/default-avatar-2020-49.jpg', experience: '3 tahun', specialty: 'Kesehatan Lingkungan' },
            ],
        },
        {
            title: 'Tim Bantuan & Layanan',
            emoji: '🤝',
            description: 'Tim pendukung yang memastikan segala kebutuhan wisatawan terpenuhi, dari logistik hingga hospitality.',
            gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
            members: [
                { name: 'Wayan Sudiarta', role: 'Koordinator Layanan', avatar: '/assets/default-avatar-2020-25.jpg', experience: '9 tahun', specialty: 'Hospitality' },
                { name: 'Nita Puspitasari', role: 'Customer Service', avatar: '/assets/default-avatar-2020-3.jpg', experience: '6 tahun', specialty: 'Komunikasi & Informasi' },
                { name: 'Tono Subekti', role: 'Logistik', avatar: '/assets/default-avatar-2020-49.jpg', experience: '7 tahun', specialty: 'Perlengkapan & Transport' },
                { name: 'Dewi Anggraini', role: 'Kuliner & Akomodasi', avatar: '/assets/default-avatar-2020-67.jpg', experience: '5 tahun', specialty: 'F&B Management' },
                { name: 'Bambang Hermanto', role: 'Teknisi', avatar: '/assets/default-avatar-2020-13.jpg', experience: '8 tahun', specialty: 'Fasilitas & Infrastruktur' },
                { name: 'Sri Mulyani', role: 'Administrasi', avatar: '/assets/default-avatar-2020-54.jpg', experience: '4 tahun', specialty: 'Booking & Reservasi' },
            ],
        },
    ];
    return (
        <OurTeamComponents teams={teams} />
    )
}
