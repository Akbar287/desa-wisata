'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FoundationComponents() {
    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };
    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };
    const cardPop = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
    };

    const staffMembers = [
        {
            name: 'Pak Heru',
            role: 'Kepala Desa & Ketua Yayasan',
            desc: 'Visioner dan pemimpin utama yang mendorong transformasi Desa Manud Jaya menjadi destinasi wisata unggulan.',
            emoji: '👨‍💼',
            experience: '15+ Tahun',
            specialty: 'Kepemimpinan & Kebijakan',
        },
        {
            name: 'Bu Sari',
            role: 'Sekretaris Yayasan',
            desc: 'Bertanggung jawab atas administrasi, dokumentasi, dan komunikasi resmi yayasan.',
            emoji: '👩‍💼',
            experience: '10 Tahun',
            specialty: 'Administrasi & Tata Kelola',
        },
        {
            name: 'Pak Doni',
            role: 'Bendahara',
            desc: 'Mengelola keuangan yayasan secara transparan dan akuntabel untuk keberlanjutan program.',
            emoji: '👨‍💻',
            experience: '8 Tahun',
            specialty: 'Keuangan & Akuntansi',
        },
        {
            name: 'Bu Rina',
            role: 'Koordinator Wisata',
            desc: 'Merancang dan mengelola paket wisata serta memastikan pengalaman terbaik bagi setiap wisatawan.',
            emoji: '👩‍🏫',
            experience: '7 Tahun',
            specialty: 'Pariwisata & Hospitality',
        },
        {
            name: 'Pak Agus',
            role: 'Koordinator Lapangan',
            desc: 'Memimpin operasional harian di lapangan dan memastikan keamanan serta kenyamanan pengunjung.',
            emoji: '👷',
            experience: '12 Tahun',
            specialty: 'Operasional & Keamanan',
        },
        {
            name: 'Bu Dewi',
            role: 'Humas & Pemasaran',
            desc: 'Mengelola citra yayasan, media sosial, dan menjalin kemitraan strategis dengan berbagai pihak.',
            emoji: '📣',
            experience: '6 Tahun',
            specialty: 'Marketing & Komunikasi',
        },
    ];

    const certificates = [
        {
            emoji: '🏆',
            title: 'Desa Wisata Terbaik 2024',
            issuer: 'Kementerian Pariwisata RI',
            year: '2024',
            desc: 'Penghargaan untuk desa wisata dengan pengelolaan terbaik dan kontribusi terhadap ekonomi lokal.',
            gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
        },
        {
            emoji: '🌟',
            title: 'Wisata Turis Terbanyak',
            issuer: 'Dinas Pariwisata Jawa Barat',
            year: '2024',
            desc: 'Penghargaan untuk desa wisata dengan jumlah kunjungan wisatawan tertinggi se-Bandung Barat.',
            gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
        },
        {
            emoji: '🌿',
            title: 'Eco-Tourism Award',
            issuer: 'ASEAN Tourism Forum',
            year: '2023',
            desc: 'Pengakuan internasional untuk praktik pariwisata berkelanjutan dan pelestarian lingkungan.',
            gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)',
        },
        {
            emoji: '🤝',
            title: 'Community Empowerment',
            issuer: 'UNDP Indonesia',
            year: '2023',
            desc: 'Apresiasi untuk program pemberdayaan masyarakat lokal melalui sektor pariwisata.',
            gradient: 'linear-gradient(135deg, #7B1FA2, #CE93D8)',
        },
        {
            emoji: '📜',
            title: 'ISO 14001 Certified',
            issuer: 'Lembaga Sertifikasi Nasional',
            year: '2023',
            desc: 'Sertifikasi sistem manajemen lingkungan untuk operasional wisata yang ramah lingkungan.',
            gradient: 'linear-gradient(135deg, #1B4332, #40916C)',
        },
        {
            emoji: '🎖️',
            title: 'Sapta Pesona Award',
            issuer: 'Kemenparekraf RI',
            year: '2022',
            desc: 'Penghargaan atas penerapan 7 unsur pesona wisata: aman, tertib, bersih, sejuk, indah, ramah, dan kenangan.',
            gradient: 'linear-gradient(135deg, #E65100, #FF9800)',
        },
    ];

    return (
        <main>
            <section className="relative pt-20 min-h-[460px] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 30%, #52B788 60%, #40916C 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 10s ease infinite',
                    }}
                />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                {['🏛️', '🌿', '📜', '🤝', '⭐', '🏆', '💎'].map((emoji, i) => (
                    <motion.span
                        key={i}
                        className="absolute text-2xl md:text-3xl select-none pointer-events-none"
                        style={{ left: `${10 + i * 13}%`, top: `${22 + (i % 3) * 22}%` }}
                        animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0], opacity: [0.12, 0.3, 0.12] }}
                        transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.6 }}
                    >
                        {emoji}
                    </motion.span>
                ))}

                <div className="absolute inset-0 bg-black/25" />

                <div className="relative z-2 w-full max-w-[900px] mx-auto px-6 py-16 text-center">
                    <motion.div
                        className="flex items-center justify-center gap-2 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link href="/" className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors">Beranda</Link>
                        <span className="text-white/40">›</span>
                        <span className="font-sans text-sm text-white/90">Yayasan Kami</span>
                    </motion.div>

                    <motion.div
                        className="text-5xl mb-4"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.4 }}
                    >
                        🏛️
                    </motion.div>

                    <motion.h1
                        className="font-serif font-extrabold text-white mb-5"
                        style={{ fontSize: 'clamp(28px, 5vw, 52px)', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        Yayasan Desa Wisata Manud Jaya
                    </motion.h1>

                    <motion.p
                        className="font-sans text-white/80 max-w-[600px] mx-auto mb-8 leading-relaxed"
                        style={{ fontSize: 'clamp(14px, 1.2vw, 17px)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        Lembaga resmi yang mengelola dan mengembangkan potensi wisata Desa Manud Jaya secara berkelanjutan, memberdayakan masyarakat lokal, dan melestarikan warisan budaya.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {[
                            { value: '2018', label: 'Tahun Berdiri', emoji: '📅' },
                            { value: '6', label: 'Pengurus Inti', emoji: '👥' },
                            { value: '6', label: 'Penghargaan', emoji: '🏆' },
                        ].map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={fadeUp}
                                className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md"
                                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <span className="text-xl">{stat.emoji}</span>
                                <div className="text-left">
                                    <span className="font-sans text-sm font-bold text-white block leading-tight">{stat.value}</span>
                                    <span className="font-sans text-[11px] text-white/60">{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Tentang Yayasan */}
            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <span className="text-4xl block mb-3">🏛️</span>
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Tentang Yayasan
                            </h2>
                            <p className="font-sans text-sm max-w-[560px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Mengenal lebih dekat lembaga yang bertanggung jawab atas kemajuan pariwisata Desa Manud Jaya.
                            </p>
                            <div className="w-16 h-1 rounded-full mx-auto mt-5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                            <motion.div
                                variants={cardPop}
                                className="lg:col-span-2 rounded-2xl overflow-hidden"
                                style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                                <div className="p-8 text-center">
                                    <div
                                        className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-5"
                                        style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', boxShadow: '0 8px 32px rgba(27,67,50,0.3)' }}
                                    >
                                        <span className="text-5xl">👨‍💼</span>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Pak Heru</h3>
                                    <span
                                        className="inline-block px-4 py-1.5 rounded-full font-sans text-[11px] font-semibold text-white mb-4"
                                        style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
                                    >
                                        Kepala Desa & Ketua Yayasan
                                    </span>
                                    <p className="font-sans text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>
                                        &ldquo;Visi kami adalah menjadikan Desa Manud Jaya sebagai destinasi wisata kelas dunia yang tetap menjaga kearifan lokal dan memberdayakan seluruh lapisan masyarakat.&rdquo;
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={cardPop}
                                className="lg:col-span-3 rounded-2xl overflow-hidden"
                                style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #52B788, #40916C)' }} />
                                <div className="p-8">
                                    <h3 className="font-serif text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                                        Yayasan Desa Wisata Manud Jaya
                                    </h3>
                                    <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
                                        Yayasan Desa Wisata Manud Jaya didirikan pada tahun 2018 sebagai lembaga resmi yang bertugas mengelola dan mengembangkan potensi wisata yang dimiliki oleh Desa Manud Jaya, Kecamatan Cikalong Wetan, Kabupaten Bandung Barat.
                                    </p>
                                    <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
                                        Dipimpin langsung oleh Kepala Desa, Pak Heru, yayasan ini berkomitmen untuk mengangkat potensi alam, budaya, dan sumber daya manusia desa guna menciptakan ekosistem pariwisata yang berkelanjutan dan berdaya saing tinggi.
                                    </p>
                                    <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
                                        Dengan dukungan tim yang solid dan berdedikasi, yayasan telah berhasil menarik ribuan wisatawan setiap tahunnya, menciptakan lapangan kerja bagi masyarakat lokal, dan melestarikan warisan budaya serta alam yang menjadi kebanggaan Desa Manud Jaya.
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { value: '2018', label: 'Didirikan' },
                                            { value: '5000+', label: 'Wisatawan/Tahun' },
                                            { value: '120+', label: 'Tenaga Kerja Lokal' },
                                            { value: '15+', label: 'Mitra Kerjasama' },
                                        ].map((s) => (
                                            <div
                                                key={s.label}
                                                className="rounded-xl p-3 text-center"
                                                style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}
                                            >
                                                <span className="font-sans text-lg font-bold block" style={{ color: 'var(--color-primary)' }}>{s.value}</span>
                                                <span className="font-sans text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Visi & Misi */}
            <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <span className="text-4xl block mb-3">🎯</span>
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Visi & Misi
                            </h2>
                            <p className="font-sans text-sm max-w-[560px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Arah dan langkah strategis yang menjadi pedoman yayasan dalam mewujudkan desa wisata yang berdaya saing global.
                            </p>
                            <div className="w-16 h-1 rounded-full mx-auto mt-5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Visi */}
                            <motion.div
                                variants={cardPop}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }} />
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
                                        >
                                            <span className="text-2xl">🔭</span>
                                        </div>
                                        <h3 className="font-serif text-xl font-bold m-0" style={{ color: 'var(--color-text)' }}>Visi</h3>
                                    </div>
                                    <div
                                        className="rounded-xl p-6 mb-4"
                                        style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}
                                    >
                                        <p className="font-serif text-base leading-relaxed m-0 font-semibold italic" style={{ color: 'var(--color-text)' }}>
                                            &ldquo;Menjadikan Desa Manud Jaya sebagai destinasi wisata unggulan yang berwawasan lingkungan, berbudaya, dan memberdayakan masyarakat lokal menuju kemandirian ekonomi yang berkelanjutan.&rdquo;
                                        </p>
                                    </div>
                                    <p className="font-sans text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>
                                        Visi ini mencerminkan komitmen kami untuk membangun ekosistem pariwisata yang tidak hanya menarik secara ekonomi, tetapi juga bertanggung jawab terhadap lingkungan dan masyarakat.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Misi */}
                            <motion.div
                                variants={cardPop}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
                                        >
                                            <span className="text-2xl">🚀</span>
                                        </div>
                                        <h3 className="font-serif text-xl font-bold m-0" style={{ color: 'var(--color-text)' }}>Misi</h3>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            'Mengembangkan potensi wisata alam dan budaya desa secara berkelanjutan dan bertanggung jawab.',
                                            'Memberdayakan masyarakat lokal melalui pelatihan, penciptaan lapangan kerja, dan peningkatan keterampilan.',
                                            'Melestarikan warisan budaya, adat istiadat, dan kearifan lokal sebagai daya tarik wisata.',
                                            'Menjalin kemitraan strategis dengan pemerintah, swasta, dan akademisi untuk pengembangan wisata.',
                                            'Menyediakan fasilitas dan infrastruktur wisata yang berkualitas, aman, dan ramah lingkungan.',
                                            'Meningkatkan aksesibilitas informasi dan promosi wisata melalui platform digital.',
                                        ].map((misi, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <span
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-sans text-xs font-bold text-white"
                                                    style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
                                                >
                                                    {idx + 1}
                                                </span>
                                                <p className="font-sans text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>
                                                    {misi}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tujuan */}
            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[900px] mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.span variants={fadeUp} className="text-4xl block mb-4">🎯</motion.span>
                        <motion.h2
                            variants={fadeUp}
                            className="font-serif font-bold mb-4"
                            style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}
                        >
                            Tujuan Yayasan
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            className="font-sans text-sm leading-relaxed mb-10 max-w-[560px] mx-auto"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Target konkret yang ingin dicapai yayasan untuk kemajuan Desa Manud Jaya dan kesejahteraan masyarakatnya.
                        </motion.p>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger}>
                            {[
                                { emoji: '📈', title: 'Peningkatan Ekonomi', desc: 'Meningkatkan pendapatan masyarakat desa melalui sektor pariwisata hingga 200% dalam 5 tahun' },
                                { emoji: '🌱', title: 'Pelestarian Alam', desc: 'Menjaga dan merestorasi ekosistem lokal dengan program reboisasi dan pengelolaan limbah' },
                                { emoji: '🎓', title: 'Edukasi & Pelatihan', desc: 'Memberikan pelatihan hospitality dan kewirausahaan kepada 500+ warga desa' },
                                { emoji: '🏗️', title: 'Infrastruktur Wisata', desc: 'Membangun fasilitas wisata berstandar internasional dengan tetap menghormati arsitektur lokal' },
                                { emoji: '🤝', title: 'Kemitraan Strategis', desc: 'Menjalin kerjasama dengan minimal 20 mitra dari pemerintah, swasta, dan akademisi' },
                                { emoji: '🌐', title: 'Digitalisasi', desc: 'Menghadirkan platform digital terpadu untuk reservasi, informasi, dan promosi wisata desa' },
                            ].map((v) => (
                                <motion.div
                                    key={v.title}
                                    variants={fadeUp}
                                    className="rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}
                                >
                                    <span className="text-3xl block mb-3">{v.emoji}</span>
                                    <h3 className="font-serif text-base font-bold mb-2" style={{ color: 'var(--color-text)' }}>{v.title}</h3>
                                    <p className="font-sans text-[13px] leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>{v.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Struktur Organisasi / Staff */}
            <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <span className="text-4xl block mb-3">👥</span>
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Struktur Organisasi
                            </h2>
                            <p className="font-sans text-sm max-w-[560px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Tim profesional yang bekerja dengan dedikasi penuh untuk kemajuan Desa Wisata Manud Jaya.
                            </p>
                            <div className="w-16 h-1 rounded-full mx-auto mt-5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                        </motion.div>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={stagger}>
                            {staffMembers.map((member, idx) => (
                                <motion.div
                                    key={member.name}
                                    variants={cardPop}
                                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                                >
                                    <div className="h-1.5 transition-all duration-300 group-hover:h-2" style={{ background: idx === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                                    <div className="p-6 flex flex-col items-center text-center">
                                        <div className="relative mb-4">
                                            <div
                                                className="w-20 h-20 rounded-full flex items-center justify-center ring-3 ring-offset-2 transition-all duration-300 group-hover:ring-4"
                                                style={{ background: idx === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
                                            >
                                                <span className="text-3xl">{member.emoji}</span>
                                            </div>
                                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-400" />
                                        </div>

                                        <h3 className="font-serif text-base font-bold mb-1 transition-colors duration-300" style={{ color: 'var(--color-text)' }}>
                                            {member.name}
                                        </h3>
                                        <span
                                            className="inline-block px-3 py-1 rounded-full font-sans text-[11px] font-semibold text-white mb-3"
                                            style={{ background: idx === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
                                        >
                                            {member.role}
                                        </span>
                                        <p className="font-sans text-[13px] leading-relaxed mb-4 m-0" style={{ color: 'var(--color-text-muted)' }}>
                                            {member.desc}
                                        </p>

                                        <div className="w-full flex flex-col gap-2 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                            <div className="flex justify-between font-sans text-xs">
                                                <span style={{ color: 'var(--color-text-muted)' }}>Pengalaman</span>
                                                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{member.experience}</span>
                                            </div>
                                            <div className="flex justify-between font-sans text-xs">
                                                <span style={{ color: 'var(--color-text-muted)' }}>Keahlian</span>
                                                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{member.specialty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Sertifikat & Penghargaan */}
            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <span className="text-4xl block mb-3">🏆</span>
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Sertifikat & Penghargaan
                            </h2>
                            <p className="font-sans text-sm max-w-[560px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Bukti pengakuan atas komitmen dan prestasi kami dalam mengembangkan pariwisata desa yang berkualitas.
                            </p>
                            <div className="w-16 h-1 rounded-full mx-auto mt-5" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }} />
                        </motion.div>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={stagger}>
                            {certificates.map((cert) => (
                                <motion.div
                                    key={cert.title}
                                    variants={cardPop}
                                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                                >
                                    <div className="h-1.5 transition-all duration-300 group-hover:h-2" style={{ background: cert.gradient }} />
                                    <div className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                                                style={{ background: cert.gradient }}
                                            >
                                                <span className="text-2xl">{cert.emoji}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                                                    {cert.title}
                                                </h3>
                                                <span className="font-sans text-[11px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                                                    {cert.issuer}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-sans text-[13px] leading-relaxed mb-4 m-0" style={{ color: 'var(--color-text-muted)' }}>
                                            {cert.desc}
                                        </p>
                                        <div
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg w-fit"
                                            style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}
                                        >
                                            <span className="text-sm">📅</span>
                                            <span className="font-sans text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                                                Tahun {cert.year}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden py-16 px-6">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #52B788 100%)',
                        backgroundSize: '300% 300%',
                        animation: 'gradientShift 8s ease infinite',
                    }}
                />
                <div className="absolute inset-0 bg-black/20" />

                <motion.div
                    className="relative z-2 max-w-[600px] mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-4xl block mb-4">🤝</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
                        Bergabung Bersama Kami
                    </h2>
                    <p className="font-sans text-sm text-white/80 mb-6 leading-relaxed">
                        Tertarik untuk bekerja sama atau berkontribusi dalam pengembangan Desa Wisata Manud Jaya? <br /> Hubungi yayasan kami dan mari bersama membangun masa depan pariwisata desa.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-[#1B4332] no-underline bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            📞 Hubungi Kami
                        </Link>
                        <Link
                            href="/careers"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-white no-underline border-2 border-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105"
                        >
                            💼 Lowongan Kerja
                        </Link>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
