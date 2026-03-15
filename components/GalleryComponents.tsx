import Image from "next/image";
import Link from "next/link";
import type { GalleryPageData } from "@/types/GalleryTypes";
import { fmtDateShort, getPageNumbers } from "@/lib/utils";

interface GalleryComponentsProps {
  galleryData: GalleryPageData;
}

function toPageHref(page: number): string {
  return page <= 1 ? "/gallery" : `/gallery?page=${page}`;
}

function trimContent(content: string, maxLength = 180): string {
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trim()}...`;
}

export default function GalleryComponents({
  galleryData,
}: GalleryComponentsProps) {
  const { items, pagination } = galleryData;
  const pageNumbers = getPageNumbers(pagination.page, pagination.totalPages);
  const showingFrom =
    pagination.totalItems === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(
    pagination.page * pagination.limit,
    pagination.totalItems,
  );

  return (
    <main>
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 40%, var(--color-accent) 100%)",
            backgroundSize: "300% 300%",
            animation: "gradientShift 8s ease infinite",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-2 max-w-[800px] mx-auto text-center">
          <span className="inline-block text-5xl mb-4">🖼️</span>
          <h1
            className="font-serif font-bold text-white mb-5"
            style={{ fontSize: "clamp(30px, 5vw, 52px)" }}
          >
            Galeri Wisata
          </h1>
          <p className="font-sans text-lg text-white/80 max-w-[550px] mx-auto mb-10 leading-relaxed">
            Semua foto dari destinasi, wahana, dan tour dalam satu halaman.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                value: `${pagination.totalItems}`,
                label: "Total Foto",
                emoji: "📷",
              },
              {
                value: `${pagination.page}/${pagination.totalPages}`,
                label: "Halaman",
                emoji: "📄",
              },
              {
                value: `${items.length}`,
                label: "Foto Ditampilkan",
                emoji: "🧩",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span className="text-xl">{stat.emoji}</span>
                <div className="text-left">
                  <span className="font-sans text-sm font-bold text-white block leading-tight">
                    {stat.value}
                  </span>
                  <span className="font-sans text-[11px] text-white/60">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 -mt-7 relative z-10">
        <div className="max-w-[1320px] mx-auto">
          <div
            className="rounded-2xl p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-lg"
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p
              className="font-sans text-sm"
              style={{ color: "var(--color-text)" }}
            >
              Menampilkan <strong>{showingFrom}</strong> -{" "}
              <strong>{showingTo}</strong> dari{" "}
              <strong>{pagination.totalItems}</strong> foto
            </p>
            <p
              className="font-sans text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Klik foto untuk buka halaman detail
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-6 py-16">
        {items.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p
              className="font-sans text-base"
              style={{ color: "var(--color-text)" }}
            >
              Belum ada foto untuk ditampilkan.
            </p>
          </div>
        ) : (
          <>
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              }}
            >
              {items.map((item) => {
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "var(--color-white)",
                      border: "1px solid var(--color-border-subtle)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <Link href={item.href} className="block relative h-52">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        unoptimized
                      />
                    </Link>

                    <div className="p-4 space-y-3">
                      <h2
                        className="font-serif text-lg font-bold"
                        style={{ color: "var(--color-text)" }}
                      >
                        {item.title}
                      </h2>

                      <p
                        className="font-sans text-sm leading-relaxed"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {trimContent(item.content)}
                      </p>

                      <div className="space-y-1.5 text-sm">
                        <p
                          className="font-sans"
                          style={{ color: "var(--color-text)" }}
                        >
                          <strong>Nama:</strong>{" "}
                          <Link
                            href={item.href}
                            className="underline underline-offset-2"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {item.name}
                          </Link>
                        </p>
                        <p
                          className="font-sans"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <strong>Tanggal:</strong>{" "}
                          {fmtDateShort(item.createdAt)}
                        </p>
                      </div>

                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Buka Halaman
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href={toPageHref(pagination.page - 1)}
                  aria-disabled={!pagination.hasPrev}
                  className="px-4 py-2 rounded-lg border text-sm"
                  style={{
                    pointerEvents: pagination.hasPrev ? "auto" : "none",
                    opacity: pagination.hasPrev ? 1 : 0.45,
                    borderColor: "var(--color-border-subtle)",
                    background: "var(--color-white)",
                  }}
                >
                  Prev
                </Link>

                {pageNumbers.map((p, idx) => {
                  if (p === "e") {
                    return (
                      <span
                        key={`e-${idx}`}
                        className="px-2 text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        ...
                      </span>
                    );
                  }

                  const active = p === pagination.page;
                  return (
                    <Link
                      key={`page-${p}`}
                      href={toPageHref(p)}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: active
                          ? "var(--color-primary)"
                          : "var(--color-white)",
                        color: active ? "#fff" : "var(--color-text)",
                        border: active
                          ? "1px solid var(--color-primary)"
                          : "1px solid var(--color-border-subtle)",
                      }}
                    >
                      {p}
                    </Link>
                  );
                })}

                <Link
                  href={toPageHref(pagination.page + 1)}
                  aria-disabled={!pagination.hasNext}
                  className="px-4 py-2 rounded-lg border text-sm"
                  style={{
                    pointerEvents: pagination.hasNext ? "auto" : "none",
                    opacity: pagination.hasNext ? 1 : 0.45,
                    borderColor: "var(--color-border-subtle)",
                    background: "var(--color-white)",
                  }}
                >
                  Next
                </Link>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
