"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WaveDividerTop, VineDecoration } from "./NatureOverlay";
import { fmt } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────── */

interface DestItem {
  id: number;
  name: string;
  imageBanner: string;
  description: string;
  priceWeekday: number;
  jamBuka: string;
  jamTutup: string;
  labels: string[];
  facilities: string[];
}

/* ─── Animation variants ─────────────────────────── */

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
  visible: { transition: { staggerChildren: 0.06 } },
};
const cardScale = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ─── Component ──────────────────────────────────── */

export default function DestinationSection({
  destinations,
}: {
  destinations: DestItem[];
}) {
  const [activeFilter, setActiveFilter] = useState("Semua");

  // Extract unique labels for filter tabs
  const allLabels = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach((d) => d.labels.forEach((l) => set.add(l)));
    return Array.from(set);
  }, [destinations]);

  const filters = ["Semua", ...allLabels];

  const filtered = useMemo(() => {
    if (activeFilter === "Semua") return destinations;
    return destinations.filter((d) => d.labels.includes(activeFilter));
  }, [activeFilter, destinations]);

  if (!destinations || destinations.length === 0) return null;

  return (
    <section
      id="destinations"
      className="section-earthy-warm py-24 overflow-hidden relative"
    >
      <WaveDividerTop fill="#FFF3E0" />
      <VineDecoration position="left" />
      <VineDecoration position="right" />

      <div className="max-w-[1320px] mx-auto px-6 relative z-3">
        {/* ── Header ─────────────────────────── */}
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] mb-4 px-5 py-2 rounded-full"
            style={{
              color: "var(--color-primary)",
              background: "var(--color-cream)",
              letterSpacing: "0.25em",
            }}
          >
            Eksplorasi
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif font-extrabold mb-4"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "var(--color-text)",
            }}
          >
            Destinasi Wisata
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-sans max-w-lg mx-auto"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "clamp(14px, 1.1vw, 16px)",
            }}
          >
            Pilih petualangan yang sesuai dengan keinginan Anda
          </motion.p>
        </motion.div>

        {/* ── Filter Tabs ─────────────────────── */}
        <motion.div
          className="flex justify-center gap-2 flex-wrap mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-6 py-2.5 rounded-full font-sans text-sm font-medium border-none cursor-pointer transition-all duration-300"
              style={{
                background:
                  activeFilter === f
                    ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
                    : "transparent",
                color: activeFilter === f ? "white" : "var(--color-text-muted)",
                boxShadow:
                  activeFilter === f
                    ? "0 4px 15px rgba(45,106,79,0.25)"
                    : "none",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Card Grid ───────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={stagger}
          >
            {filtered.map((dest) => (
              <motion.div
                key={dest.id}
                variants={cardScale}
                className="group rounded-2xl overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-lg"
                style={{
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border-subtle)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Image */}
                <div className="relative h-[200px] overflow-hidden shrink-0">
                  {dest.imageBanner ? (
                    <Image
                      src={dest.imageBanner}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "var(--color-cream)" }}
                    >
                      <span className="text-4xl">🏞️</span>
                    </div>
                  )}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)",
                    }}
                  />

                  {/* Label badge */}
                  {dest.labels.length > 0 && (
                    <span
                      className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold text-white tracking-wide backdrop-blur-sm"
                      style={{
                        background: "linear-gradient(135deg, #2D6A4F, #52B788)",
                      }}
                    >
                      {dest.labels[0]}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 pb-6 flex flex-col flex-1">
                  <h3
                    className="font-serif text-[17px] font-bold mb-2 leading-snug transition-colors duration-300 group-hover:text-(--color-primary)"
                    style={{ color: "var(--color-text)" }}
                  >
                    {dest.name}
                  </h3>

                  <p
                    className="font-sans text-[13px] leading-relaxed mb-4 flex-1 line-clamp-2"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {dest.description ||
                      "Destinasi wisata menarik di Desa Manuk Jaya"}
                  </p>

                  {/* Facility tags */}
                  {dest.facilities.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {dest.facilities.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="px-2.5 py-1 rounded-full font-sans text-[11px] font-medium"
                          style={{
                            background: "var(--color-cream)",
                            color: "var(--color-text-light)",
                            border: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hours + Price */}
                  <div
                    className="flex items-center justify-between gap-3 mb-5 flex-wrap"
                    style={{ marginTop: "auto" }}
                  >
                    <span
                      className="inline-flex items-center gap-1.5 font-sans text-[13px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {dest.jamBuka} - {dest.jamTutup}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 font-sans text-[13px] font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      {fmt(dest.priceWeekday)}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/destinations/${dest.id}`}
                    className="block w-full text-center py-3 rounded-xl font-sans text-sm font-semibold text-white no-underline transition-all duration-300 hover:shadow-lg hover:brightness-110"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                    }}
                  >
                    Lihat Selengkapnya
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Empty state ─────────────────────── */}
        {filtered.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-5xl mb-4">🔍</div>
            <p
              className="font-serif text-lg font-bold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              Tidak ada destinasi
            </p>
            <p
              className="font-sans text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Coba pilih kategori lain
            </p>
          </motion.div>
        )}

        {/* View All */}
        <div className="text-center mt-14">
          <Link href="/destinations" className="btn-outline">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Lihat Semua Destinasi
          </Link>
        </div>
      </div>
    </section>
  );
}
