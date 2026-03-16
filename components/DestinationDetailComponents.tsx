"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fmt } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, InfoWindowF, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "./ui/button";
import { toast } from "sonner";

/* ─── Types ───────────────────────────────────────────── */

interface LabelItem {
  name: string;
  icon: string;
}
interface AccessibilityItem {
  name: string;
  icon: string;
  description: string;
}
interface FacilityItem {
  name: string;
  icon: string;
  description: string;
}
interface MapItem {
  id: number;
  title: string;
  content: string;
  image: string;
  icon: string;
  lat: number | string;
  lng: number | string;
  fasilitas: boolean;
  order: number;
}

type NormalizedMapPoint = Omit<MapItem, "lat" | "lng"> & {
  lat: number;
  lng: number;
};

type GoogleMarkerLike =
  | google.maps.Marker
  | google.maps.marker.AdvancedMarkerElement;

interface DestinationData {
  id: number;
  name: string;
  imageBanner: string;
  description: string;
  priceWeekday: number;
  priceWeekend: number;
  priceGroup: number;
  minimalGroup: number;
  jamBuka: string;
  jamTutup: string;
  durasiRekomendasi: string;
  KuotaHarian: number;
  rating: number;
  reviewCount: number;
  isAktif: boolean;
  labels: LabelItem[];
  accessibilities: AccessibilityItem[];
  facilities: FacilityItem[];
  gallery: string[];
  maps: MapItem[];
  createdAt: string;
  updatedAt: string;
}

interface RelatedDest {
  id: number;
  name: string;
  imageBanner: string;
  priceWeekday: number;
  rating: number;
  jamBuka: string;
  jamTutup: string;
}

/* ─── Animation Variants ──────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const GOOGLE_MAPS_LOADER_ID = "discover-desa-wisata-gmaps-loader";
const GOOGLE_MAPS_LIBRARIES: "marker"[] = ["marker"];

/* ─── Icon helper (supports data:image URLs) ──────────── */
function IconImg({
  src,
  size = 20,
  className = "",
}: {
  src?: string;
  size?: number;
  className?: string;
}) {
  if (!src)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  if (src.startsWith("data:") || src.startsWith("http"))
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={`inline-block ${className}`.trim()}
        style={{ objectFit: "contain" }}
      />
    );
  return <span style={{ fontSize: size * 0.8 }}>{src}</span>;
}

/* ─── Component ───────────────────────────────────────── */

export default function DestinationDetailComponents({
  destination: d,
  relatedDestinations,
  googleMapsApiKey,
  googleMapsMapId,
}: {
  destination: DestinationData;
  relatedDestinations: RelatedDest[];
  googleMapsApiKey: string;
  googleMapsMapId: string;
}) {
  const normalizedMapsApiKey = googleMapsApiKey.trim();
  const normalizedMapsMapId = googleMapsMapId.trim();
  const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);
  const [stickyNav, setStickyNav] = React.useState(false);
  const subNavRef = React.useRef<HTMLDivElement>(null);
  const subNavPlaceholderRef = React.useRef<HTMLDivElement>(null);
  const [navbarHeight, setNavbarHeight] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState("overview");
  const [activeMapId, setActiveMapId] = React.useState<number | null>(null);
  const [mapInstance, setMapInstance] = React.useState<google.maps.Map | null>(
    null,
  );
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const markersRef = React.useRef<GoogleMarkerLike[]>([]);

  const SUBNAV_HEIGHT = 53;
  const navItems = React.useMemo(
    () => [
      { id: "overview", label: "Ringkasan" },
      ...(d.gallery.length > 0 ? [{ id: "gallery", label: "Galeri" }] : []),
      { id: "map", label: "Peta" },
      ...(d.facilities.length > 0
        ? [{ id: "facilities", label: "Fasilitas" }]
        : []),
      ...(d.accessibilities.length > 0
        ? [{ id: "accessibility", label: "Aksesibilitas" }]
        : []),
      { id: "pricing", label: "Harga" },
      ...(relatedDestinations.length > 0
        ? [{ id: "related", label: "Serupa" }]
        : []),
    ],
    [
      d.gallery.length,
      d.facilities.length,
      d.accessibilities.length,
      relatedDestinations.length,
    ],
  );

  const mapPoints = React.useMemo<NormalizedMapPoint[]>(
    () =>
      d.maps
        .map((item) => ({
          ...item,
          lat: Number(item.lat),
          lng: Number(item.lng),
        }))
        .filter(
          (item) =>
            Number.isFinite(item.lat) &&
            Number.isFinite(item.lng) &&
            item.lat >= -90 &&
            item.lat <= 90 &&
            item.lng >= -180 &&
            item.lng <= 180,
        ),
    [d.maps],
  );

  const facilityMapPoints = React.useMemo(
    () => mapPoints.filter((item) => item.fasilitas),
    [mapPoints],
  );

  const nonFacilityMapPoints = React.useMemo(
    () => mapPoints.filter((item) => !item.fasilitas),
    [mapPoints],
  );

  const mapCenter = React.useMemo(() => {
    if (mapPoints.length === 0) {
      return { lat: -7.7956, lng: 110.3695 };
    }

    const total = mapPoints.reduce(
      (acc, item) => ({
        lat: acc.lat + item.lat,
        lng: acc.lng + item.lng,
      }),
      { lat: 0, lng: 0 },
    );

    return {
      lat: total.lat / mapPoints.length,
      lng: total.lng / mapPoints.length,
    };
  }, [mapPoints]);

  React.useEffect(() => {
    if (mapPoints.length === 0) {
      setActiveMapId(null);
      return;
    }

    setActiveMapId((prev) => {
      if (prev && mapPoints.some((point) => point.id === prev)) return prev;
      return mapPoints[0].id;
    });
  }, [mapPoints]);

  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: normalizedMapsApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  React.useEffect(() => {
    if (!isMapLoaded || !mapInstance) return;
    if (typeof window === "undefined" || !window.google?.maps) {
      return;
    }

    const clearMarkers = () => {
      markersRef.current.forEach((marker) => {
        if (marker instanceof google.maps.Marker) {
          marker.setMap(null);
        } else {
          marker.map = null;
        }
      });
      markersRef.current = [];
    };

    // Clean up previous marker instances before re-rendering.
    clearMarkers();

    const hasAdvancedMarker =
      Boolean(window.google.maps.marker) &&
      Boolean(window.google.maps.marker.AdvancedMarkerElement) &&
      Boolean(normalizedMapsMapId);

    mapPoints.forEach((point) => {
      const markerFillColor = point.fasilitas ? "#6B7280" : "#16A34A";
      const markerBorderColor = point.fasilitas ? "#4B5563" : "#15803D";

      if (hasAdvancedMarker) {
        const pin = new google.maps.marker.PinElement({
          background: markerFillColor,
          borderColor: markerBorderColor,
          glyphColor: "#FFFFFF",
        });
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: { lat: point.lat, lng: point.lng },
          content: pin.element,
          title: point.title,
        });

        marker.addListener("click", () => {
          setActiveMapId(point.id);
        });

        markersRef.current.push(marker);
        return;
      }

      const marker = new google.maps.Marker({
        map: mapInstance,
        position: { lat: point.lat, lng: point.lng },
        title: point.title,
        icon: {
          path: "M12 2C8.134 2 5 5.134 5 9c0 5.523 7 13 7 13s7-7.477 7-13c0-3.866-3.134-7-7-7zm0 10.5c-1.933 0-3.5-1.567-3.5-3.5S10.067 5.5 12 5.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z",
          fillColor: markerFillColor,
          fillOpacity: 1,
          strokeColor: markerBorderColor,
          strokeWeight: 1.2,
          scale: 1.4,
          anchor: new google.maps.Point(12, 24),
        },
      });

      marker.addListener("click", () => {
        setActiveMapId(point.id);
      });

      markersRef.current.push(marker);
    });

    return () => {
      clearMarkers();
    };
  }, [isMapLoaded, mapPoints, mapInstance, normalizedMapsMapId]);

  React.useEffect(() => {
    if (!mapInstance || !activeMapId) return;

    const activePoint = mapPoints.find((point) => point.id === activeMapId);
    if (!activePoint) return;

    mapInstance.panTo({ lat: activePoint.lat, lng: activePoint.lng });
  }, [activeMapId, mapPoints, mapInstance]);

  const getNavbarHeight = () => {
    const nav = document.querySelector("nav");
    return nav ? nav.getBoundingClientRect().height : 0;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const currentNavHeight = getNavbarHeight();
      setNavbarHeight(currentNavHeight);
      if (subNavPlaceholderRef.current) {
        const rect = subNavPlaceholderRef.current.getBoundingClientRect();
        setStickyNav(rect.top <= currentNavHeight);
      }
      const totalH = currentNavHeight + SUBNAV_HEIGHT;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= totalH + 20 && r.bottom >= totalH + 20) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const totalH = getNavbarHeight() + SUBNAV_HEIGHT;
      const y = el.getBoundingClientRect().top + window.scrollY - totalH - 12;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative pt-20 min-h-[400px] md:min-h-[520px] overflow-hidden">
        {d.imageBanner ? (
          <Image
            src={d.imageBanner}
            alt={d.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #1B4332)" }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

        <motion.div
          className="absolute rounded-full opacity-15 blur-3xl"
          style={{
            width: 300,
            height: 300,
            top: -60,
            right: -60,
            background: "radial-gradient(circle, #52B788 0%, transparent 70%)",
          }}
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-0 flex items-end pb-12 md:pb-16">
          <motion.div
            className="w-full max-w-[1320px] mx-auto px-6"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Breadcrumb */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2 mb-4 font-sans text-[13px] text-white/70"
            >
              <Link
                href="/"
                className="text-white/70 no-underline hover:text-white transition-colors"
              >
                Beranda
              </Link>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <Link
                href="/destinations"
                className="text-white/70 no-underline hover:text-white transition-colors"
              >
                Destinasi
              </Link>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="text-white">{d.name}</span>
            </motion.div>

            {/* Labels */}
            {d.labels.length > 0 && (
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-2 mb-4"
              >
                {d.labels.map((l) => (
                  <span
                    key={l.name}
                    className="px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-white/15 backdrop-blur-sm border border-white/20 tracking-wide flex items-center gap-1.5"
                  >
                    {l.icon && <IconImg src={l.icon} size={14} />}
                    {l.name}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.h1
              variants={fadeUp}
              className="font-serif font-extrabold text-white mb-4 max-w-[680px]"
              style={{
                fontSize: "clamp(26px, 4.5vw, 48px)",
                lineHeight: 1.15,
                textShadow: "0 4px 30px rgba(0,0,0,0.3)",
              }}
            >
              {d.name}
            </motion.h1>

            {/* Quick facts */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-2">
              {[
                { emoji: "🕐", value: `${d.jamBuka} – ${d.jamTutup}` },
                { emoji: "⏳", value: d.durasiRekomendasi },
                {
                  emoji: "⭐",
                  value: `${d.rating.toFixed(1)} (${d.reviewCount} ulasan)`,
                },
                { emoji: "👥", value: `Kuota ${d.KuotaHarian}/hari` },
              ].map((f) => (
                <span
                  key={f.value}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm text-white font-sans text-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span>{f.emoji}</span>
                  <span className="font-medium">{f.value}</span>
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Sub Navigation ────────────────────────── */}
      <div
        ref={subNavPlaceholderRef}
        style={{ height: stickyNav ? SUBNAV_HEIGHT : 0 }}
      />
      <div
        ref={subNavRef}
        className="hide-scrollbar overflow-x-auto whitespace-nowrap transition-shadow duration-300"
        style={{
          position: stickyNav ? "fixed" : "relative",
          top: stickyNav ? navbarHeight : "auto",
          left: 0,
          right: 0,
          zIndex: 900,
          background: "var(--color-white)",
          borderBottom: "1px solid var(--color-border-subtle)",
          boxShadow: stickyNav ? "var(--shadow-md)" : "none",
        }}
      >
        <div className="max-w-[1320px] mx-auto px-3 flex gap-0">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="relative px-5 py-4 bg-transparent border-none cursor-pointer font-sans text-sm whitespace-nowrap transition-colors duration-300"
              style={{
                color:
                  activeSection === n.id
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                fontWeight: activeSection === n.id ? 700 : 500,
              }}
            >
              {n.label}
              {activeSection === n.id && (
                <motion.div
                  layoutId="activeDestNavTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-primary), #52B788)",
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content + Sidebar ────────────────── */}
      <main
        className="max-w-[1320px] mx-auto px-6 py-12"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="tour-detail-layout flex gap-12 items-start flex-col lg:flex-row">
          {/* ── Left Column ───────────────────── */}
          <div className="flex-1 min-w-0 w-full">
            {/* Overview */}
            <motion.section
              id="overview"
              className="mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-5 mb-7"
              >
                {[
                  {
                    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                    label: "Jam Operasi",
                    value: `${d.jamBuka} – ${d.jamTutup}`,
                  },
                  {
                    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                    label: "Durasi Rekomendasi",
                    value: d.durasiRekomendasi,
                  },
                  {
                    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a3 3 0 00-2.12-2.87M16 3.13a3 3 0 010 5.74",
                    label: "Kuota Harian",
                    value: `${d.KuotaHarian} orang`,
                  },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--color-cream)" }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={f.icon} />
                      </svg>
                    </div>
                    <div>
                      <div
                        className="text-[11px] font-semibold uppercase tracking-widest font-sans"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {f.label}
                      </div>
                      <div
                        className="text-[15px] font-semibold font-sans"
                        style={{ color: "var(--color-text)" }}
                      >
                        {f.value}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="text-[15px] leading-relaxed font-sans mb-6"
                style={{ color: "var(--color-text-light)", lineHeight: 1.8 }}
              >
                {d.description ||
                  "Destinasi wisata yang menarik dan layak untuk dikunjungi."}
              </motion.p>

              {/* Labels highlight */}
              {d.labels.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl p-6"
                  style={{
                    background: "var(--color-cream)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <h4
                    className="font-serif text-base font-bold mb-4"
                    style={{ color: "var(--color-text)" }}
                  >
                    Kategori Aktivitas
                  </h4>
                  <ul
                    className="list-none p-0 m-0 grid gap-2.5"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                    }}
                  >
                    {d.labels.map((l) => (
                      <li
                        key={l.name}
                        className="flex items-center gap-2.5 font-sans text-sm"
                        style={{ color: "var(--color-text-light)" }}
                      >
                        <span
                          className="shrink-0"
                          style={{ color: "var(--color-primary)" }}
                        >
                          <IconImg src={l.icon} size={16} />
                        </span>
                        {l.name}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.section>

            {/* Gallery */}
            {d.gallery.length > 0 && (
              <motion.section
                id="gallery"
                className="mb-14"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={stagger}
              >
                <motion.h2
                  variants={fadeUp}
                  className="font-serif font-bold mb-6"
                  style={{
                    fontSize: "clamp(22px, 3vw, 28px)",
                    color: "var(--color-text)",
                  }}
                >
                  Galeri Destinasi
                </motion.h2>
                <motion.div
                  variants={fadeUp}
                  className="gallery-grid grid gap-2.5 rounded-2xl overflow-hidden"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "240px 180px",
                  }}
                >
                  {d.gallery.slice(0, 5).map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      className="relative cursor-pointer overflow-hidden group"
                      style={{
                        gridColumn: i === 0 ? "1 / 3" : undefined,
                        gridRow: i === 0 ? "1 / 2" : undefined,
                      }}
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                      {i === 4 && d.gallery.length > 5 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold font-sans">
                          +{d.gallery.length - 5} foto
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Map */}
            <motion.section
              id="map"
              className="mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                className="font-serif font-bold mb-2"
                style={{
                  fontSize: "clamp(22px, 3vw, 28px)",
                  color: "var(--color-text)",
                }}
              >
                Peta
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="font-sans text-sm mb-4"
                style={{ color: "var(--color-text-muted)" }}
              >
                Menampilkan semua titik lokasi dari relasi Destination, Maps,
                dan MapsDestination.
              </motion.p>

              {mapPoints.length === 0 ? (
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl p-6 text-center"
                  style={{
                    background: "var(--color-white)",
                    border: "1px dashed var(--color-border-subtle)",
                  }}
                >
                  <p
                    className="font-sans text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Data peta belum tersedia untuk destinasi ini.
                  </p>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    variants={fadeUp}
                    className="flex flex-wrap gap-2.5 mb-4"
                  >
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold font-sans flex items-center gap-2"
                      style={{
                        background: "#ECFDF5",
                        color: "#047857",
                        border: "1px solid #A7F3D0",
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      Fasilitas ({facilityMapPoints.length})
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold font-sans flex items-center gap-2"
                      style={{
                        background: "#FEF2F2",
                        color: "#B91C1C",
                        border: "1px solid #FECACA",
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                      Non-fasilitas ({nonFacilityMapPoints.length})
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold font-sans"
                      style={{
                        background: "var(--color-cream)",
                        color: "var(--color-text-light)",
                        border: "1px solid var(--color-border-subtle)",
                      }}
                    >
                      Total marker: {mapPoints.length}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      border: "1px solid var(--color-border-subtle)",
                      background: "var(--color-white)",
                    }}
                  >
                    {!normalizedMapsApiKey ? (
                      <div className="h-[420px] flex items-center justify-center p-6 text-center font-sans text-sm text-red-600">
                        Key Google Maps tidak ditemukan. Pastikan variabel{" "}
                        <strong className="mx-1">NEXT_PUBLIC_GMAPS_API</strong>{" "}
                        atau <strong>NEXT_GMAPS_API</strong> tersedia di file{" "}
                        <code>.env</code>.
                      </div>
                    ) : mapLoadError ? (
                      <div className="h-[420px] flex items-center justify-center p-6 text-center font-sans text-sm text-red-600">
                        Gagal memuat peta. Coba refresh halaman atau periksa API
                        key Google Maps.
                      </div>
                    ) : !isMapLoaded ? (
                      <div
                        className="h-[420px] flex items-center justify-center font-sans text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Memuat peta...
                      </div>
                    ) : (
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "420px" }}
                        center={mapCenter}
                        zoom={15}
                        onLoad={(map) => {
                          mapRef.current = map;
                          setMapInstance(map);
                        }}
                        onUnmount={() => {
                          mapRef.current = null;
                          setMapInstance(null);
                        }}
                        options={{
                          mapTypeControl: false,
                          streetViewControl: false,
                          fullscreenControl: true,
                          mapId: normalizedMapsMapId || undefined,
                        }}
                      >
                        {mapPoints
                          .filter((point) => point.id === activeMapId)
                          .map((point) => (
                            <InfoWindowF
                              key={point.id}
                              position={{ lat: point.lat, lng: point.lng }}
                              onCloseClick={() => setActiveMapId(null)}
                            >
                              <div className="max-w-[230px] font-sans">
                                {point.image ? (
                                  <img
                                    src={point.image}
                                    alt={point.title}
                                    className="w-full h-[90px] object-cover rounded mb-2"
                                  />
                                ) : null}
                                <div className="font-semibold text-sm mb-1">
                                  {point.title}
                                </div>
                                {point.content ? (
                                  <p className="text-xs text-neutral-600 leading-relaxed m-0">
                                    {point.content}
                                  </p>
                                ) : null}
                                <div
                                  className="mt-2 inline-flex px-2 py-1 rounded text-[11px] font-semibold"
                                  style={{
                                    background: point.fasilitas
                                      ? "#ECFDF5"
                                      : "#FEF2F2",
                                    color: point.fasilitas
                                      ? "#047857"
                                      : "#B91C1C",
                                  }}
                                >
                                  {point.fasilitas
                                    ? "Fasilitas"
                                    : "Non-fasilitas"}
                                </div>
                              </div>
                            </InfoWindowF>
                          ))}
                      </GoogleMap>
                    )}
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4"
                  >
                    {mapPoints.map((point) => (
                      <button
                        type="button"
                        key={point.id}
                        onClick={() => setActiveMapId(point.id)}
                        className="text-left rounded-xl p-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          background: "var(--color-white)",
                          border:
                            activeMapId === point.id
                              ? "1px solid var(--color-primary)"
                              : "1px solid var(--color-border-subtle)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div
                            className="font-sans font-semibold text-sm"
                            style={{ color: "var(--color-text)" }}
                          >
                            {point.title}
                          </div>
                          <span
                            className="px-2 py-0.5 rounded text-[11px] font-semibold"
                            style={{
                              background: point.fasilitas
                                ? "#ECFDF5"
                                : "#FEF2F2",
                              color: point.fasilitas ? "#047857" : "#B91C1C",
                            }}
                          >
                            {point.fasilitas ? "Fasilitas" : "Non-fasilitas"}
                          </span>
                        </div>
                        {point.content ? (
                          <p
                            className="font-sans text-xs m-0"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {point.content}
                          </p>
                        ) : null}
                        <div
                          className="font-mono text-[11px] mt-2"
                          style={{ color: "var(--color-text-light)" }}
                        >
                          {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </motion.section>

            {/* Facilities */}
            {d.facilities.length > 0 && (
              <motion.section
                id="facilities"
                className="mb-14"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={stagger}
              >
                <motion.h2
                  variants={fadeUp}
                  className="font-serif font-bold mb-6"
                  style={{
                    fontSize: "clamp(22px, 3vw, 28px)",
                    color: "var(--color-text)",
                  }}
                >
                  Fasilitas
                </motion.h2>
                <motion.div
                  variants={fadeUp}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {d.facilities.map((f, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      className="rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                      style={{
                        background: "var(--color-white)",
                        border: "1px solid var(--color-border-subtle)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: "var(--color-cream)" }}
                        >
                          <IconImg src={f.icon || undefined} size={22} />
                        </div>
                        <h4
                          className="font-sans text-[15px] font-bold"
                          style={{ color: "var(--color-text)" }}
                        >
                          {f.name}
                        </h4>
                      </div>
                      {f.description && (
                        <p
                          className="font-sans text-sm leading-relaxed m-0"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {f.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Accessibility */}
            {d.accessibilities.length > 0 && (
              <motion.section
                id="accessibility"
                className="mb-14"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={stagger}
              >
                <motion.h2
                  variants={fadeUp}
                  className="font-serif font-bold mb-6"
                  style={{
                    fontSize: "clamp(22px, 3vw, 28px)",
                    color: "var(--color-text)",
                  }}
                >
                  Aksesibilitas
                </motion.h2>
                <motion.div
                  variants={fadeUp}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {d.accessibilities.map((a, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      className="rounded-2xl p-5 border-l-4 transition-shadow duration-300 hover:shadow-md"
                      style={{
                        background: "var(--color-cream)",
                        borderLeftColor: "var(--color-primary)",
                        border: "1px solid var(--color-border-subtle)",
                        borderLeft: "4px solid var(--color-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-7 h-7">
                          <IconImg src={a.icon || undefined} size={22} />
                        </span>
                        <h4
                          className="font-sans text-[15px] font-bold"
                          style={{ color: "var(--color-text)" }}
                        >
                          {a.name}
                        </h4>
                      </div>
                      {a.description && (
                        <p
                          className="font-sans text-sm leading-relaxed m-0"
                          style={{
                            color: "var(--color-text-light)",
                            lineHeight: 1.7,
                          }}
                        >
                          {a.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Pricing */}
            <motion.section
              id="pricing"
              className="mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                className="font-serif font-bold mb-6"
                style={{
                  fontSize: "clamp(22px, 3vw, 28px)",
                  color: "var(--color-text)",
                }}
              >
                Informasi Harga
              </motion.h2>

              {/* Desktop table */}
              <motion.div
                variants={fadeUp}
                className="hidden md:block overflow-x-auto rounded-2xl"
                style={{ border: "1px solid var(--color-border-subtle)" }}
              >
                <table
                  className="w-full font-sans text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ background: "var(--color-cream)" }}>
                      <th
                        className="text-left py-3.5 px-5 font-bold text-xs uppercase tracking-wider"
                        style={{ color: "var(--color-text)" }}
                      >
                        Jenis Tiket
                      </th>
                      <th
                        className="text-right py-3.5 px-5 font-bold text-xs uppercase tracking-wider"
                        style={{ color: "var(--color-text)" }}
                      >
                        Harga
                      </th>
                      <th
                        className="text-left py-3.5 px-5 font-bold text-xs uppercase tracking-wider"
                        style={{ color: "var(--color-text)" }}
                      >
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        type: "Weekday (Senin–Jumat)",
                        price: d.priceWeekday,
                        note: "Harga per orang",
                        color: "#10B981",
                      },
                      {
                        type: "Weekend (Sabtu–Minggu)",
                        price: d.priceWeekend,
                        note: "Harga per orang",
                        color: "#F59E0B",
                      },
                      {
                        type: `Grup (min. ${d.minimalGroup} orang)`,
                        price: d.priceGroup,
                        note: `Minimal ${d.minimalGroup} orang`,
                        color: "#6366F1",
                      },
                    ].map((item, i) => (
                      <tr
                        key={i}
                        className="group transition-colors duration-200 hover:bg-(--color-cream)"
                        style={{
                          borderBottom: "1px solid var(--color-border-subtle)",
                        }}
                      >
                        <td className="py-3.5 px-5">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: item.color }}
                            />
                            <span
                              className="font-medium"
                              style={{ color: "var(--color-text)" }}
                            >
                              {item.type}
                            </span>
                          </span>
                        </td>
                        <td
                          className="py-3.5 px-5 text-right font-bold"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {fmt(item.price)}
                        </td>
                        <td
                          className="py-3.5 px-5"
                          style={{ color: "var(--color-text-light)" }}
                        >
                          {item.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              {/* Mobile cards */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col gap-3 md:hidden"
              >
                {[
                  {
                    type: "Weekday",
                    desc: "Senin – Jumat",
                    price: d.priceWeekday,
                    color: "#10B981",
                  },
                  {
                    type: "Weekend",
                    desc: "Sabtu – Minggu",
                    price: d.priceWeekend,
                    color: "#F59E0B",
                  },
                  {
                    type: "Grup",
                    desc: `Min. ${d.minimalGroup} orang`,
                    price: d.priceGroup,
                    color: "#6366F1",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-5 flex items-center justify-between gap-3 transition-shadow duration-300 hover:shadow-lg"
                    style={{
                      background: "var(--color-white)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      <div>
                        <div
                          className="font-sans text-sm font-bold"
                          style={{ color: "var(--color-text)" }}
                        >
                          {item.type}
                        </div>
                        <div
                          className="font-sans text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <span
                      className="font-sans text-lg font-extrabold whitespace-nowrap"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {fmt(item.price)}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.section>

            {/* Related Destinations */}
            {relatedDestinations.length > 0 && (
              <motion.section
                id="related"
                className="mb-5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={stagger}
              >
                <motion.h2
                  variants={fadeUp}
                  className="font-serif font-bold mb-6"
                  style={{
                    fontSize: "clamp(22px, 3vw, 28px)",
                    color: "var(--color-text)",
                  }}
                >
                  Destinasi Serupa
                </motion.h2>
                <motion.div
                  variants={fadeUp}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {relatedDestinations.map((rd) => (
                    <Link
                      key={rd.id}
                      href={`/destinations/${rd.id}`}
                      className="no-underline group"
                    >
                      <div
                        className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        style={{
                          background: "var(--color-white)",
                          border: "1px solid var(--color-border-subtle)",
                        }}
                      >
                        <div className="relative h-[160px] overflow-hidden">
                          {rd.imageBanner ? (
                            <Image
                              src={rd.imageBanner}
                              alt={rd.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                background:
                                  "linear-gradient(135deg, #2D6A4F20, #52B78830)",
                              }}
                            >
                              <span className="text-4xl">🏞️</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h4
                            className="font-serif text-[15px] font-bold mb-2 leading-snug transition-colors duration-300 group-hover:text-(--color-primary)"
                            style={{ color: "var(--color-text)" }}
                          >
                            {rd.name}
                          </h4>
                          <div
                            className="font-sans text-[13px]"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {rd.jamBuka}–{rd.jamTutup} · mulai{" "}
                            {fmt(rd.priceWeekday)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              </motion.section>
            )}
          </div>

          {/* ── Sidebar ─────────────────────── */}
          <aside className="tour-detail-sidebar hidden lg:block w-[310px] shrink-0 sticky top-[120px] pt-2">
            <motion.div
              className="rounded-2xl p-7"
              style={{
                background: "var(--color-white)",
                border: "1px solid var(--color-border-subtle)",
                boxShadow: "var(--shadow-md)",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider font-sans mb-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                Mulai dari
              </div>
              <div
                className="text-3xl font-extrabold font-sans mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                {fmt(d.priceWeekday)}
              </div>
              <div
                className="text-[13px] font-sans mb-6"
                style={{ color: "var(--color-text-muted)" }}
              >
                per orang (weekday)
              </div>

              {/*<Link
                href={`/booking?id=${d.id}&jenis=destinasi`}
                className="btn-primary w-full justify-center py-3.5 px-6 mb-3 text-sm no-underline flex items-center gap-2"
              >
                Booking
              </Link>*/}
              <Button
                type="button"
                onClick={() => toast("Fitur akan tersedia di sprint 3")}
                style={{ height: "45px" }}
                className="btn-primary w-full justify-center py-3 px-6 mb-3 text-sm no-underline flex items-center gap-2"
              >
                Booking
              </Button>
              <button
                className="btn-outline w-full justify-center py-3 px-6 mb-6 text-sm"
                onClick={() => scrollTo("pricing")}
              >
                Lihat Harga
              </button>

              <div
                className="flex flex-col gap-3.5 pt-5"
                style={{ borderTop: "1px solid var(--color-border-subtle)" }}
              >
                {[
                  { label: "Jam Buka", value: `${d.jamBuka} – ${d.jamTutup}` },
                  { label: "Durasi", value: d.durasiRekomendasi },
                  { label: "Kuota", value: `${d.KuotaHarian}/hari` },
                  {
                    label: "Rating",
                    value: `⭐ ${d.rating.toFixed(1)} (${d.reviewCount})`,
                  },
                  { label: "Harga Weekend", value: fmt(d.priceWeekend) },
                  {
                    label: "Harga Grup",
                    value: `${fmt(d.priceGroup)} (min ${d.minimalGroup})`,
                  },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex justify-between font-sans text-sm"
                  >
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {f.label}
                    </span>
                    <span
                      className="font-semibold text-right"
                      style={{ color: "var(--color-text)" }}
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </main>

      {/* ── Mobile Bottom Bar ──────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 items-center justify-between gap-3 p-4 mobile-bottom-bar"
        style={{
          background: "var(--color-white)",
          borderTop: "1px solid var(--color-border-subtle)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <div
            className="font-sans text-[11px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Mulai dari
          </div>
          <div
            className="font-sans text-xl font-extrabold"
            style={{ color: "var(--color-primary)" }}
          >
            {fmt(d.priceWeekday)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-outline py-2.5 px-4 text-[13px]"
            onClick={() => scrollTo("pricing")}
          >
            Harga
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang destinasi "${d.name}"`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2.5 px-5 text-[13px] no-underline"
          >
            Hubungi
          </a>
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-99999 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setLightboxIdx(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(Math.max(0, lightboxIdx - 1));
              }}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/15 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={d.gallery[lightboxIdx]}
                alt="Gallery"
                width={1200}
                height={800}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(Math.min(d.gallery.length - 1, lightboxIdx + 1));
              }}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/15 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/15 border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
            <div className="absolute bottom-6 text-white/60 font-sans text-sm">
              {lightboxIdx + 1} / {d.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
