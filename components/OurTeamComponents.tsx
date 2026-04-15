"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TeamCategory } from "@/types/OurTeamType";

type ActiveTeamMember = {
  member: TeamCategory["members"][number];
  team: Pick<TeamCategory, "title" | "emoji" | "gradient">;
};

export default function OurTeamComponents({
  teams,
}: {
  teams: TeamCategory[];
}) {
  const [siteOrigin, setSiteOrigin] = useState("");
  const [activeMember, setActiveMember] = useState<ActiveTeamMember | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!activeMember) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMember(null);
    };

    window.addEventListener("keydown", onKeydown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = "";
    };
  }, [activeMember]);

  const resolveAvatarUrl = (rawUrl?: string) => {
    const fallback = "/assets/default-avatar-2020-25.jpg";
    const value = (rawUrl || "").trim();
    if (!value) return fallback;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    if (!siteOrigin) {
      return value.startsWith("/") ? value : `/${value}`;
    }
    return value.startsWith("/") ? `${siteOrigin}${value}` : `${siteOrigin}/${value}`;
  };

  const isGuideTeam = (title: string) =>
    title.trim().toLowerCase() === "tim pemandu wisata";

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
  const cardPop = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };
  return (
    <main>
      <section className="relative pt-20 min-h-[460px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1B4332 0%, #2D6A4F 30%, #52B788 60%, #40916C 100%)",
            backgroundSize: "400% 400%",
            animation: "gradientShift 10s ease infinite",
          }}
        />

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {["🧭", "🛡️", "🏥", "🤝", "⛰️", "🌿", "✨"].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-3xl select-none pointer-events-none"
            style={{ left: `${10 + i * 13}%`, top: `${22 + (i % 3) * 22}%` }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 8, -8, 0],
              opacity: [0.12, 0.3, 0.12],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: i * 0.6,
            }}
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
            <Link
              href="/"
              className="font-sans text-sm text-white/60 no-underline hover:text-white/90 transition-colors"
            >
              Beranda
            </Link>
            <span className="text-white/40">›</span>
            <span className="font-sans text-sm text-white/90">Tim Kami</span>
          </motion.div>

          <motion.div
            className="text-5xl mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              type: "spring",
              bounce: 0.4,
            }}
          >
            👥
          </motion.div>

          <motion.h1
            className="font-serif font-extrabold text-white mb-5"
            style={{
              fontSize: "clamp(28px, 5vw, 52px)",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Tim Kami
          </motion.h1>

          <motion.p
            className="font-sans text-white/80 max-w-[600px] mx-auto mb-8 leading-relaxed"
            style={{ fontSize: "clamp(14px, 1.2vw, 17px)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Kenali para profesional di balik pengalaman wisata tak terlupakan di
            Desa Manud Jaya — dari pemandu berpengalaman hingga tim medis yang
            siap siaga.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {[
              {
                value: `${teams.reduce((a, t) => a + t.members.length, 0)}+`,
                label: "Anggota Tim",
                emoji: "👤",
              },
              { value: "4", label: "Divisi", emoji: "📋" },
              { value: "50+", label: "Tahun Pengalaman", emoji: "⭐" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {teams.map((team, teamIdx) => (
        <section
          key={team.title}
          className="py-16 px-6"
          style={{
            background:
              teamIdx % 2 === 0 ? "var(--color-bg)" : "var(--color-cream)",
          }}
        >
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="text-center mb-12">
                <span className="text-4xl block mb-3">{team.emoji}</span>
                <h2
                  className="font-serif font-bold mb-3"
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    color: "var(--color-text)",
                  }}
                >
                  {team.title}
                </h2>
                <p
                  className="font-sans text-sm max-w-[560px] mx-auto leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {team.description}
                </p>
                <div
                  className="w-16 h-1 rounded-full mx-auto mt-5"
                  style={{ background: team.gradient }}
                />
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={stagger}
              >
                {team.members.map((member) => {
                  const showCountries = isGuideTeam(team.title);
                  const countriesText =
                    member.countries && member.countries.length > 0
                      ? member.countries.join(", ")
                      : "Belum diatur";

                  return (
                    <motion.div
                      key={member.name}
                      variants={cardPop}
                      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                      style={{
                        background: "var(--color-white)",
                        border: "1px solid var(--color-border-subtle)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <div
                        className="h-1.5 transition-all duration-300 group-hover:h-2"
                        style={{ background: team.gradient }}
                      />

                      <div className="p-6 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden ring-3 ring-offset-2 transition-all duration-300 group-hover:ring-4">
                            <Image
                              src={resolveAvatarUrl(member.avatar)}
                              alt={member.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                              unoptimized
                            />
                          </div>
                          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-400" />
                        </div>

                        <h3
                          className="font-serif text-base font-bold mb-1 transition-colors duration-300 group-hover:text-(--color-primary)"
                          style={{ color: "var(--color-text)" }}
                        >
                          {member.name}
                        </h3>
                        <span
                          className="inline-block px-3 py-1 rounded-full font-sans text-[11px] font-semibold text-white mb-4"
                          style={{ background: team.gradient }}
                        >
                          {member.role}
                        </span>

                        <div
                          className="w-full flex flex-col gap-2 pt-4"
                          style={{
                            borderTop: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          <div className="flex justify-between font-sans text-xs">
                            <span style={{ color: "var(--color-text-muted)" }}>
                              Pengalaman
                            </span>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--color-text)" }}
                            >
                              {member.experience}
                            </span>
                          </div>
                          <div className="flex justify-between font-sans text-xs">
                            <span style={{ color: "var(--color-text-muted)" }}>
                              Keahlian
                            </span>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--color-text)" }}
                            >
                              {member.specialty}
                            </span>
                          </div>
                          {showCountries ? (
                            <div
                              className="rounded-lg px-2.5 py-2 text-left"
                              style={{
                                background: "var(--color-bg)",
                                border: "1px dashed var(--color-border-subtle)",
                              }}
                            >
                              <p
                                className="text-[10px] uppercase tracking-wide mb-1"
                                style={{ color: "var(--color-text-muted)" }}
                              >
                                Bahasa / Negara
                              </p>
                              <p
                                className="text-xs font-semibold leading-relaxed"
                                style={{ color: "var(--color-text)" }}
                              >
                                {countriesText}
                              </p>
                            </div>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveMember({
                              member,
                              team: {
                                title: team.title,
                                emoji: team.emoji,
                                gradient: team.gradient,
                              },
                            })
                          }
                          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition-transform duration-300 hover:scale-105"
                          style={{
                            background: team.gradient,
                            boxShadow: "0 10px 24px rgba(27,67,50,0.22)",
                          }}
                        >
                          Lihat Detail
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14" />
                            <path d="m13 5 7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>
      ))}

      <section className="py-16 px-6" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="text-4xl block mb-4">
              💎
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-serif font-bold mb-4"
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "var(--color-text)",
              }}
            >
              Nilai-Nilai Tim Kami
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-sans text-sm leading-relaxed mb-10 max-w-[560px] mx-auto"
              style={{ color: "var(--color-text-muted)" }}
            >
              Setiap anggota tim kami berkomitmen pada standar tertinggi untuk
              memberikan pengalaman wisata terbaik.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              variants={stagger}
            >
              {[
                {
                  emoji: "🎯",
                  title: "Profesional",
                  desc: "Terlatih dan bersertifikasi dalam bidang masing-masing",
                },
                {
                  emoji: "❤️",
                  title: "Ramah",
                  desc: "Melayani dengan sepenuh hati dan ketulusan",
                },
                {
                  emoji: "🔒",
                  title: "Terpercaya",
                  desc: "Mengutamakan keamanan dan kenyamanan wisatawan",
                },
                {
                  emoji: "🌱",
                  title: "Berkelanjutan",
                  desc: "Menjaga kelestarian alam dan budaya lokal",
                },
              ].map((v) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: "var(--color-cream)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <span className="text-3xl block mb-3">{v.emoji}</span>
                  <h3
                    className="font-serif text-base font-bold mb-2"
                    style={{ color: "var(--color-text)" }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="font-sans text-[13px] leading-relaxed m-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {v.desc}
                  </p>
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
            background:
              "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #52B788 100%)",
            backgroundSize: "300% 300%",
            animation: "gradientShift 8s ease infinite",
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
          <span className="text-4xl block mb-4">🤗</span>
          <h2
            className="font-serif text-2xl md:text-3xl font-bold text-white mb-3"
            style={{ textShadow: "0 2px 15px rgba(0,0,0,0.3)" }}
          >
            Bergabunglah Bersama Kami!
          </h2>
          <p className="font-sans text-sm text-white/80 mb-6 leading-relaxed">
            Kami selalu mencari individu bersemangat yang ingin berkontribusi
            dalam pengembangan wisata desa. Hubungi kami untuk peluang
            bergabung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-[#1B4332] no-underline bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Lihat Paket Wisata
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
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-bold text-white no-underline border-2 border-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105"
            >
              Hubungi Kami
            </Link>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {activeMember ? (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[2px] p-4 md:p-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMember(null)}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--color-white)",
                border: "1px solid var(--color-border-subtle)",
                boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
              }}
            >
              <div
                className="relative px-6 md:px-8 pt-7 pb-6 text-white"
                style={{ background: activeMember.team.gradient }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                      backgroundSize: "26px 26px",
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMember(null)}
                  className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Tutup detail"
                >
                  ✕
                </button>

                <div className="relative z-[2] flex items-center gap-4 pr-10">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-white/45">
                    <Image
                      src={resolveAvatarUrl(activeMember.member.avatar)}
                      alt={activeMember.member.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-white/85 mb-1">
                      {activeMember.team.emoji} {activeMember.team.title}
                    </p>
                    <h3 className="font-serif text-2xl font-bold leading-tight">
                      {activeMember.member.name}
                    </h3>
                    <p className="text-sm text-white/90 mt-1">
                      {activeMember.member.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 md:px-8 py-6 md:py-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "var(--color-cream)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <p
                      className="text-[11px] uppercase tracking-wide mb-1"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Pengalaman
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {activeMember.member.experience || "-"}
                    </p>
                  </div>
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "var(--color-cream)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <p
                      className="text-[11px] uppercase tracking-wide mb-1"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Keahlian Utama
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {activeMember.member.specialty || "-"}
                    </p>
                  </div>
                </div>

                {isGuideTeam(activeMember.team.title) ? (
                  <div
                    className="rounded-xl px-4 py-4"
                    style={{
                      background: "var(--color-cream)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <p
                      className="text-[11px] uppercase tracking-wide mb-2"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Bahasa / Negara yang Dikuasai
                    </p>
                    <p
                      className="text-sm font-semibold leading-relaxed"
                      style={{ color: "var(--color-text)" }}
                    >
                      {activeMember.member.countries &&
                      activeMember.member.countries.length > 0
                        ? activeMember.member.countries.join(", ")
                        : "Belum ada data bahasa/negara."}
                    </p>
                  </div>
                ) : null}

                <div
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p
                    className="text-[11px] uppercase tracking-wide mb-2"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Bio
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text)" }}
                  >
                    {activeMember.member.bio?.trim()
                      ? activeMember.member.bio
                      : "Profil anggota tim ini belum memiliki deskripsi bio."}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveMember(null)}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-105"
                    style={{
                      background: activeMember.team.gradient,
                      boxShadow: "0 10px 22px rgba(27,67,50,0.2)",
                    }}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
