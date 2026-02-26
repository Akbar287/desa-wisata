"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Paket Wisata", href: "/tours" },
        { label: "Tentang Desa", href: "/profile" },
        { label: "Blog", href: "/blog" },
        { label: "Kalender Trip", href: "/trip-calendar" },
        { label: "Tentang Kami", href: "/our-team" },
        { label: "Kontak", href: "/contact" },
    ];

    const menuOverlay = mobileOpen ? (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 27, 21, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                animation: "fadeIn 0.3s ease",
            }}
        >
            <button
                onClick={() => setMobileOpen(false)}
                style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 32,
                }}
            >
                ✕
            </button>
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                        color: "white",
                        fontSize: 24,
                        fontFamily: "var(--font-heading)",
                        fontWeight: 500,
                        textDecoration: "none",
                        padding: "12px 0",
                        transition: "color 0.3s",
                        letterSpacing: "0.02em",
                    }}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    ) : null;

    return (
        <>
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: scrolled ? "12px 0" : "20px 0",
                    background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                    boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <div
                    style={{
                        maxWidth: 1320,
                        margin: "0 auto",
                        padding: "0 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: scrolled ? "var(--color-text)" : "white",
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase" as const,
                            transition: "color 0.3s",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                        MENU
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    >
                        <Image
                            src={scrolled ? "/assets/logo.png" : "/assets/logo-white-2.png"}
                            alt="Discover Desa Wisata"
                            width={300}
                            height={90}
                            style={{
                                height: scrolled ? 100 : 85,
                                width: "auto",
                                transition: "height 0.3s",
                            }}
                        />
                    </Link>

                    {/* WhatsApp CTA */}
                    <a
                        href="https://wa.me/62181234567890?text=Halo%20Discover%20Desa%20Wisata%2C%20saya%20tertarik%20dengan%20paket%20wisatanya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wa-btn"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: scrolled ? "#25D366" : "rgba(255,255,255,0.15)",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "var(--radius-full)",
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: "var(--font-body)",
                            textDecoration: "none",
                            transition: "all 0.3s",
                            backdropFilter: scrolled ? "none" : "blur(8px)",
                            border: scrolled ? "none" : "1px solid rgba(255,255,255,0.2)",
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="wa-text">Chat via WhatsApp</span>
                    </a>
                </div>
            </nav>

            {/* Render overlay via portal to document.body so it's always on top */}
            {mounted && menuOverlay && createPortal(menuOverlay, document.body)}

            {/* Responsive style for WhatsApp button */}
            <style jsx global>{`
        @media (max-width: 768px) {
          .wa-btn {
            padding: 10px !important;
          }
          .wa-text {
            display: none !important;
          }
        }
      `}</style>
        </>
    );
}
