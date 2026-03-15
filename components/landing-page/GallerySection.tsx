import Image from "next/image";
import Link from "next/link";
import { WaveDividerTop, VineDecoration } from "./NatureOverlay";

type GalleryPreviewItem = {
  id: string;
  image: string;
  title: string;
  href: string;
  label: string;
};

interface GallerySectionProps {
  items: GalleryPreviewItem[];
}

function getResponsiveVisibilityClass(index: number): string {
  if (index <= 2) return "";
  if (index === 3) return "hidden md:block";
  return "hidden lg:block";
}

export default function GallerySection({ items }: GallerySectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section-earthy-green py-24 overflow-hidden relative">
      <WaveDividerTop fill="#E8F5E9" />
      <VineDecoration position="left" />
      <VineDecoration position="right" />

      <div className="max-w-[1320px] mx-auto px-6 relative z-3">
        <div className="text-center mb-12">
          <span
            className="inline-block font-sans text-xs font-bold uppercase tracking-[0.2em] mb-4 px-5 py-2 rounded-full"
            style={{
              color: "var(--color-primary)",
              background: "var(--color-cream)",
            }}
          >
            Galeri
          </span>
          <h2
            className="font-serif font-bold mb-3"
            style={{
              fontSize: "clamp(28px, 3.6vw, 46px)",
              color: "var(--color-text)",
            }}
          >
            Potret Desa Manud Jaya
          </h2>
          <p
            className="font-sans text-sm max-w-[640px] mx-auto"
            style={{ color: "var(--color-text-muted)" }}
          >
            Cuplikan momen terbaik dari destinasi, wahana, dan tour favorit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-4">
          {items.slice(0, 5).map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative overflow-hidden rounded-2xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${getResponsiveVisibilityClass(index)} ${
                index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                }
                unoptimized
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute left-0 right-0 bottom-0 p-4">
                <span className="inline-block mb-2 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white bg-white/20 backdrop-blur-sm">
                  {item.label}
                </span>
                <h3 className="font-serif text-white font-semibold leading-snug text-base md:text-lg">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/gallery" className="btn-outline">
            Lihat Semua Galeri
          </Link>
        </div>
      </div>
    </section>
  );
}
