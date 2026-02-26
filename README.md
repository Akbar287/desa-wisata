# 🏡 Discover Desa Wisata

> **Jelajahi Pesona Desa Wisata Indonesia** — Platform digital untuk menemukan keindahan, budaya, dan pengalaman autentik di desa‑desa wisata Indonesia.

🌐 **Live Demo:** [desa-wisata-ui.vercel.app](https://desa-wisata-ui.vercel.app)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🎠 **Hero Section** | Landing page visual dengan parallax dan call‑to‑action |
| 🗺️ **Paket Wisata** | Katalog paket perjalanan terlaris dengan harga & detail |
| 🧭 **Tipe Perjalanan** | Pilihan wisata: budaya, alam, kuliner, petualangan |
| 📊 **Statistik** | Angka pencapaian (wisatawan, destinasi, ulasan) |
| 💬 **Testimoni** | Ulasan dari wisatawan dengan rating bintang |
| 📖 **Travel Guide** | Panduan perjalanan dan tips bermanfaat |
| 🤝 **Mengapa Bersama Kami** | Keunggulan dan nilai yang ditawarkan |
| 📱 **Responsive Design** | Tampilan optimal di semua perangkat |
| 🟢 **WhatsApp CTA** | Tombol kontak langsung via WhatsApp |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** Vanilla CSS + CSS Custom Properties
- **State Management:** [Recoil](https://recoiljs.org/)
- **Validation:** [Yup](https://github.com/jquense/yup)
- **Deployment:** [Vercel](https://vercel.com)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Yarn

### Installation

```bash
# Clone repository
git clone https://github.com/akbar287/discover-desa-wisata.git
cd discover-desa-wisata

# Install dependencies
yarn install

# Start development server
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
yarn build
yarn start
```

---

## 📂 Struktur Proyek

```
discover-desa-wisata/
├── app/
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Halaman utama
│   └── globals.css         # Design system & global styles
├── components/
│   ├── Navbar.tsx           # Navigasi responsif
│   ├── HeroSection.tsx      # Hero banner
│   ├── TopToursSection.tsx   # Paket wisata terlaris
│   ├── TripTypesSection.tsx  # Tipe perjalanan
│   ├── StatsSection.tsx      # Statistik pencapaian
│   ├── TestimonialsSection.tsx # Ulasan wisatawan
│   ├── TravelGuideSection.tsx  # Panduan wisata
│   ├── WhyWithUsSection.tsx    # Keunggulan kami
│   └── Footer.tsx            # Footer + newsletter
└── public/
    ├── assets/              # Gambar & media
    └── favicon_io/          # Favicon set
```

---

## 🎨 Design System

Proyek ini menggunakan **CSS Custom Properties** untuk konsistensi visual:

```css
--color-primary: #1a5c38       /* Hijau utama */
--color-accent: #e8a838        /* Aksen emas */
--font-heading: 'Playfair Display'
--font-body: 'Inter'
```

---

## 📄 Lisensi

Hak cipta © 2026 **Discover Desa Wisata**. Seluruh hak dilindungi.

---

<p align="center">
  Dibuat dengan ❤️ untuk memajukan pariwisata desa Indonesia
</p>
