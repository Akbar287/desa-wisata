"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, InfoWindowF, useJsApiLoader } from "@react-google-maps/api";
import { WahanaData } from "@/types/WahanaType";

type NormalizedMapPoint = {
  id: number;
  title: string;
  content: string;
  image: string;
  icon: string;
  lat: number;
  lng: number;
  fasilitas: boolean;
  order: number;
};

type GoogleMarkerLike =
  | google.maps.Marker
  | google.maps.marker.AdvancedMarkerElement;

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

export default function WahanaIdComponents({
  wahana,
  googleMapsApiKey,
  googleMapsMapId,
}: {
  wahana: WahanaData;
  googleMapsApiKey: string;
  googleMapsMapId: string;
}) {
  const normalizedMapsApiKey = googleMapsApiKey.trim();
  const normalizedMapsMapId = googleMapsMapId.trim();
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
  const [activeSection, setActiveSection] = React.useState("overview");
  const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);
  const [stickyNav, setStickyNav] = React.useState(false);
  const subNavRef = React.useRef<HTMLDivElement>(null);
  const subNavPlaceholderRef = React.useRef<HTMLDivElement>(null);
  const [navbarHeight, setNavbarHeight] = React.useState(0);
  const [activeMapId, setActiveMapId] = React.useState<number | null>(null);
  const [mapInstance, setMapInstance] = React.useState<google.maps.Map | null>(
    null,
  );
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const markersRef = React.useRef<GoogleMarkerLike[]>([]);

  const mapPoints = React.useMemo<NormalizedMapPoint[]>(
    () =>
      (wahana.maps ?? [])
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
    [wahana.maps],
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
    if (mapPoints.length === 0) return { lat: -7.7956, lng: 110.3695 };
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

  const navItems = React.useMemo(
    () => [
      { id: "overview", label: "Ringkasan" },
      { id: "gallery", label: "Galeri" },
      { id: "map", label: "Peta" },
    ],
    [],
  );

  const SUBNAV_HEIGHT = 53;

  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: normalizedMapsApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

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
          // Basic active section detection
          if (r.top <= totalH + 60 && r.bottom >= totalH) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const totalH = getNavbarHeight() + SUBNAV_HEIGHT;
      const y = el.getBoundingClientRect().top + window.scrollY - totalH - 12;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const hasGallery = wahana.WahanaGallery && wahana.WahanaGallery.length > 0;
  const galleryImages = wahana.WahanaGallery?.map((g) => g.image) || [];

  const fakeRating = 4.8;
  const fakeReviewCount = wahana.reviewCount > 0 ? wahana.reviewCount : 15;

  return (
    <>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative pt-20 min-h-[400px] md:min-h-[520px] overflow-hidden bg-[#1C312E]">
        <Image
          src={wahana.imageBanner || "/assets/placeholder-image.jpg"}
          alt={wahana.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

        {/* Floating orb decorations */}
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
              className="flex flex-wrap items-center gap-2 mb-4 font-sans text-[13px] text-white/70"
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
                href="/wahana"
                className="text-white/70 no-underline hover:text-white transition-colors"
              >
                Wahana
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
              <span className="text-white truncate max-w-[200px] sm:max-w-none">
                {wahana.name}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif font-extrabold text-white mb-4 max-w-[680px]"
              style={{
                fontSize: "clamp(28px, 4.5vw, 52px)",
                lineHeight: 1.15,
                textShadow: "0 4px 30px rgba(0,0,0,0.4)",
              }}
            >
              {wahana.name}
            </motion.h1>

            {/* Quick facts in hero */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <span
                className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm text-white font-sans text-sm"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <Stars rating={fakeRating} />
                <span className="font-medium">
                  {fakeRating} ({fakeReviewCount} Ulasan)
                </span>
              </span>
              {hasGallery && (
                <span
                  className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm text-white font-sans text-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span>📸</span>
                  <span className="font-medium">
                    {galleryImages.length} Foto
                  </span>
                </span>
              )}
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
        <div className="max-w-[1320px] mx-auto px-6 flex gap-2">
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
                  layoutId="activeNavTabWahana"
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
              <motion.h2
                variants={fadeUp}
                className="font-serif font-bold mb-6"
                style={{
                  fontSize: "clamp(22px, 3vw, 28px)",
                  color: "var(--color-text)",
                }}
              >
                Tentang Wahana Ini
              </motion.h2>

              <motion.div
                variants={fadeUp}
                className="prose max-w-none font-sans"
                style={{ color: "var(--color-text-light)", lineHeight: 1.8 }}
              >
                {/* Splitting description by newlines to render paragraphs */}
                {wahana.description.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-[15px]">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            </motion.section>

            {/* Gallery */}
            {(hasGallery || wahana.imageBanner) && (
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
                  Galeri Wahana
                </motion.h2>
                <motion.div
                  variants={fadeUp}
                  className="gallery-grid grid gap-2.5 rounded-2xl overflow-hidden"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "240px 180px",
                  }}
                >
                  {/* Make sure we have up to 5 images to show in this grid layout */}
                  {galleryImages.length > 0 ? (
                    galleryImages.slice(0, 5).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setLightboxIdx(i)}
                        className="relative cursor-pointer overflow-hidden group"
                        style={{
                          gridColumn: i === 0 ? "1 / 3" : undefined,
                          gridRow: i === 0 ? "1 / 2" : undefined,
                          background: "#f1f5f9",
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
                        {i === 4 && galleryImages.length > 5 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold font-sans">
                            +{galleryImages.length - 5} foto
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      onClick={() => setLightboxIdx(0)}
                      className="relative cursor-pointer overflow-hidden group col-span-3 row-span-2 h-[420px]"
                      style={{ background: "#f1f5f9" }}
                    >
                      <Image
                        src={wahana.imageBanner || ""}
                        alt={"Banner"}
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
                    </div>
                  )}
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
                Menampilkan semua titik lokasi dari relasi Wahana, Maps, dan
                MapsWahana.
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
                    Data peta belum tersedia untuk wahana ini.
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
                {fmt(wahana.price)}
              </div>
              <div
                className="text-[13px] font-sans mb-6"
                style={{ color: "var(--color-text-muted)" }}
              >
                / tiket masuk
              </div>

              <Link
                className="btn-primary w-full justify-center py-3.5 px-6 mb-3 text-sm"
                href={`/booking?id=${wahana.id}&jenis=wahana`}
              >
                Pesan Sekarang
              </Link>
              <Link href="/contact" className="block">
                <button className="btn-outline w-full justify-center py-3 px-6 mb-2 text-sm">
                  Hubungi Kami
                </button>
              </Link>
            </motion.div>
          </aside>
        </div>
      </main>

      {/* ── Mobile Bottom Bar ──────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-between gap-3 p-4"
        style={{
          background: "var(--color-white)",
          borderTop: "1px solid var(--color-border-subtle)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
        id="mobile-bottom-bar"
      >
        <div>
          <div
            className="font-sans text-[11px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Tiket masuk
          </div>
          <div
            className="font-sans text-xl font-extrabold"
            style={{ color: "var(--color-primary)" }}
          >
            {fmt(wahana.price)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-primary py-2.5 px-6 text-[13px]"
            onClick={() => alert("Fitur booking akan segera hadir!")}
          >
            Pesan
          </button>
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-99999 flex items-center justify-center p-4 md:p-8"
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
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 z-10"
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
              className="relative w-full h-full max-w-[1200px] flex items-center justify-center"
            >
              <Image
                src={
                  galleryImages.length > 0
                    ? galleryImages[lightboxIdx]
                    : wahana.imageBanner || ""
                }
                alt="Gallery View"
                fill
                className="object-contain"
              />
            </motion.div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                const images =
                  galleryImages.length > 0
                    ? galleryImages
                    : [wahana.imageBanner];
                setLightboxIdx(Math.min(images.length - 1, lightboxIdx + 1));
              }}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 z-10"
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
              className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/10 hover:bg-white/20 border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm transition-colors duration-200 z-10"
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

            <div className="absolute bottom-6 text-white/60 font-sans text-sm z-10">
              {lightboxIdx + 1} /{" "}
              {galleryImages.length > 0 ? galleryImages.length : 1}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#D4A843" : "#E5E7EB"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
