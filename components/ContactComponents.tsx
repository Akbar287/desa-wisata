'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function ContactComponents() {
    const router = useRouter();
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

    const contactChannels = [
        {
            emoji: '📞',
            title: 'Telepon',
            value: '+62 818-1234-567890',
            href: 'tel:+62181234567890',
            desc: 'Senin – Sabtu, 08.00 – 17.00 WIB',
            gradient: 'linear-gradient(190deg, #128C7E, #25D366)',
        },
        {
            emoji: '💬',
            title: 'WhatsApp',
            value: '+62 818-1234-567890',
            href: 'https://wa.me/62181234567890?text=Halo%20Desa%20Wisata%20Manud%20Jaya%2C%20saya%20ingin%20bertanya',
            desc: 'Respon cepat, biasanya < 1 jam',
            gradient: 'linear-gradient(135deg, #128C7E, #25D366)',
        },
        {
            emoji: '📧',
            title: 'Email',
            value: 'info@desawisatamanudjaya.id',
            href: 'mailto:info@desawisatamanudjaya.id',
            desc: 'Untuk pertanyaan umum & kerjasama',
            gradient: 'linear-gradient(135deg, #D93025, #EA4335)',
        },
        {
            emoji: '📷',
            title: 'Instagram',
            value: '@desawisata.manudjaya',
            href: 'https://instagram.com/desawisata.manudjaya',
            desc: 'Foto & video terbaru dari desa wisata',
            gradient: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)',
        },
        {
            emoji: '📘',
            title: 'Facebook',
            value: 'Desa Wisata Manud Jaya',
            href: 'https://facebook.com/desawisatamanudjaya',
            desc: 'Update event & promo terbaru',
            gradient: 'linear-gradient(135deg, #1877F2, #42A5F5)',
        },
        {
            emoji: '🎬',
            title: 'YouTube',
            value: 'Desa Wisata Manud Jaya',
            href: 'https://youtube.com/@desawisatamanudjaya',
            desc: 'Vlog perjalanan & dokumentasi wisata',
            gradient: 'linear-gradient(135deg, #FF0000, #CC0000)',
        },
        {
            emoji: '🎵',
            title: 'TikTok',
            value: '@desawisata.manudjaya',
            href: 'https://tiktok.com/@desawisata.manudjaya',
            desc: 'Konten pendek & highlights desa wisata',
            gradient: 'linear-gradient(135deg, #010101, #69C9D0)',
        },
        {
            emoji: 'X',
            title: 'X',
            value: '@desawisata.manudjaya',
            href: 'https://x.com/@desawisata.manudjaya',
            desc: 'Quote perjalanan yang mungkin anda suka',
            gradient: 'linear-gradient(135deg, #FF0000, #CC0000)',
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

                {['📞', '📍', '💬', '✉️', '🌐', '📱', '🤝'].map((emoji, i) => (
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
                        <span className="font-sans text-sm text-white/90">Kontak</span>
                    </motion.div>

                    <motion.div
                        className="text-5xl mb-4"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.4 }}
                    >
                        📞
                    </motion.div>

                    <motion.h1
                        className="font-serif font-extrabold text-white mb-5"
                        style={{ fontSize: 'clamp(28px, 5vw, 52px)', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        Hubungi Kami
                    </motion.h1>

                    <motion.p
                        className="font-sans text-white/80 max-w-[600px] mx-auto mb-8 leading-relaxed"
                        style={{ fontSize: 'clamp(14px, 1.2vw, 17px)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        Punya pertanyaan tentang paket wisata, akomodasi, atau ingin berkunjung? Tim kami siap membantu Anda merencanakan pengalaman wisata terbaik di Desa Manud Jaya.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {[
                            { value: '08.00–17.00', label: 'Jam Operasional', emoji: '🕐' },
                            { value: '< 1 Jam', label: 'Respon WhatsApp', emoji: '⚡' },
                            { value: '8 Kanal', label: 'Media Kontak', emoji: '📱' },
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

            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <span className="text-4xl block mb-3">📍</span>
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Lokasi & Alamat Kami
                            </h2>
                            <p className="font-sans text-sm max-w-[560px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Temukan kami di jantung Desa Manud Jaya, dikelilingi pemandangan alam pegunungan Bandung Barat yang menakjubkan.
                            </p>
                            <div className="w-16 h-1 rounded-full mx-auto mt-5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Informasi Alamat */}
                            <motion.div
                                variants={cardPop}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                                <div className="p-8">
                                    <div className="flex items-start gap-4 mb-8">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
                                        >
                                            <span className="text-2xl">🏛️</span>
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                                                Yayasan Desa Wisata Manud Jaya
                                            </h3>
                                            <p className="font-sans text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>
                                                Pengelola resmi kawasan wisata Desa Manud Jaya
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-5">
                                        {[
                                            {
                                                icon: '📍',
                                                label: 'Alamat Lengkap',
                                                value: 'Jl. Desa Manud Jaya No. 01, RT 03/RW 05, Kec. Cikalong Wetan, Kab. Bandung Barat, Jawa Barat 40556',
                                            },
                                            {
                                                icon: '🕐',
                                                label: 'Jam Operasional',
                                                value: 'Senin – Sabtu: 08.00 – 17.00 WIB\nMinggu & Hari Libur: 09.00 – 15.00 WIB',
                                            },
                                            {
                                                icon: '📞',
                                                label: 'Telepon Kantor',
                                                value: '+62 818-1234-567890',
                                            },
                                            {
                                                icon: '📧',
                                                label: 'Email',
                                                value: 'info@desawisatamanudjaya.id',
                                            },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-start gap-3">
                                                <span
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                                                    style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}
                                                >
                                                    {item.icon}
                                                </span>
                                                <div>
                                                    <span className="font-sans text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                                        {item.label}
                                                    </span>
                                                    <p className="font-sans text-sm leading-relaxed m-0 whitespace-pre-line" style={{ color: 'var(--color-text)' }}>
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                                        <a
                                            href="https://maps.google.com/?q=Desa+Manud+Jaya+Cikalong+Wetan+Bandung+Barat"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm font-bold text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            Buka di Google Maps
                                        </a>
                                        <Button size="lg" className='ml-2 inline-flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer font-sans text-sm font-bold text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg' style={{ background: 'linear-gradient(135deg, #FF0000, #CC0000)' }} onClick={() => router.push('/login')}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            Login Admin
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={cardPop}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)', minHeight: 480 }}
                            >
                                <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #52B788, #40916C)' }} />
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15841.305!2d107.4484!3d-6.7356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e1c4b0e0e8f3%3A0x0!2sCikalong+Wetan%2C+Bandung+Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: 470 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Desa Wisata Manud Jaya"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        variants={stagger}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <span className="text-4xl block mb-3">🌐</span>
                            <h2 className="font-serif font-bold mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}>
                                Hubungi Kami Melalui
                            </h2>
                            <p className="font-sans text-sm max-w-[560px] mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                Pilih kanal komunikasi yang paling nyaman untuk Anda. <br /> Kami siap melayani melalui berbagai platform.
                            </p>
                            <div className="w-16 h-1 rounded-full mx-auto mt-5" style={{ background: 'linear-gradient(135deg, #1B4332, #52B788)' }} />
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            variants={stagger}
                        >
                            {contactChannels.map((channel) => (
                                <motion.a
                                    key={channel.title}
                                    href={channel.href}
                                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                                    rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    variants={cardPop}
                                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl no-underline block"
                                    style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="h-1.5 transition-all duration-300 group-hover:h-2" style={{ background: channel.gradient }} />
                                    <div className="p-6 text-center">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                                            style={{ background: channel.gradient }}
                                        >
                                            <span className="text-2xl">{channel.emoji}</span>
                                        </div>
                                        <h3 className="font-serif text-base font-bold mb-1 transition-colors duration-300" style={{ color: 'var(--color-text)' }}>
                                            {channel.title}
                                        </h3>
                                        <p className="font-sans text-sm font-semibold mb-2 m-0" style={{ color: 'var(--color-primary)' }}>
                                            {channel.value}
                                        </p>
                                        <p className="font-sans text-[12px] leading-relaxed m-0" style={{ color: 'var(--color-text-muted)' }}>
                                            {channel.desc}
                                        </p>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 px-6" style={{ background: 'var(--color-bg)' }}>
                <div className="max-w-[900px] mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.span variants={fadeUp} className="text-4xl block mb-4">⏰</motion.span>
                        <motion.h2
                            variants={fadeUp}
                            className="font-serif font-bold mb-4"
                            style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--color-text)' }}
                        >
                            Informasi Penting
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            className="font-sans text-sm leading-relaxed mb-10 max-w-[560px] mx-auto"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Beberapa hal yang perlu diketahui sebelum menghubungi atau mengunjungi kami.
                        </motion.p>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" variants={stagger}>
                            {[
                                { emoji: '🕐', title: 'Jam Kantor', desc: 'Senin – Sabtu\n08.00 – 17.00 WIB' },
                                { emoji: '⚡', title: 'Respon Cepat', desc: 'WhatsApp dibalas\nmaksimal 1 jam' },
                                { emoji: '🎫', title: 'Reservasi', desc: 'Booking minimal\n3 hari sebelumnya' },
                                { emoji: '🚗', title: 'Akses Lokasi', desc: '±2 jam dari\nBandung Kota' },
                            ].map((v) => (
                                <motion.div
                                    key={v.title}
                                    variants={fadeUp}
                                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-subtle)' }}
                                >
                                    <span className="text-3xl block mb-3">{v.emoji}</span>
                                    <h3 className="font-serif text-base font-bold mb-2" style={{ color: 'var(--color-text)' }}>{v.title}</h3>
                                    <p className="font-sans text-[13px] leading-relaxed m-0 whitespace-pre-line" style={{ color: 'var(--color-text-muted)' }}>{v.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

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
                    <span className="text-4xl block mb-4">💬</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
                        Siap Merencanakan Petualangan?
                    </h2>
                    <p className="font-sans text-sm text-white/80 mb-6 leading-relaxed">
                        Jangan ragu untuk menghubungi kami. Tim kami dengan senang hati akan membantu Anda merencanakan perjalanan wisata yang sempurna ke Desa Manud Jaya.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a
                            href="https://wa.me/62181234567890?text=Halo%20Desa%20Wisata%20Manud%20Jaya%2C%20saya%20tertarik%20dengan%20paket%20wisatanya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-[#1B4332] no-underline bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            💬 Chat via WhatsApp
                        </a>
                        <Link
                            href="/tours"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-white no-underline border-2 border-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105"
                        >
                            📋 Cari Paket Sekarang
                        </Link>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
