export default function BookingLoading() {
    const shimmer = `
        @keyframes shimmer {
            0% { background-position: -700px 0; }
            100% { background-position: 700px 0; }
        }
    `;
    const s = {
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "700px 100%",
        animation: "shimmer 1.6s infinite linear",
        borderRadius: "var(--radius-sm)",
    } as const;

    return (
        <>
            <style>{shimmer}</style>

            {/* Hero / Steps Skeleton */}
            <div style={{ background: "linear-gradient(135deg, #1a4a30 0%, #1a5c38 50%, #2d8f5e 100%)", padding: "120px 24px 54px", position: "relative" }}>
                <div style={{ maxWidth: 1320, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.1)" }} />
                        <div style={{ ...s, width: 200, height: 36, background: "rgba(255,255,255,0.12)", opacity: 0.5 }} />
                    </div>
                    <div style={{ ...s, width: 380, height: 16, background: "rgba(255,255,255,0.1)", opacity: 0.4, marginBottom: 36 }} />
                    {/* Step circles */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 38, height: 38, borderRadius: "50%", background: i <= 2 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)" }} />
                                <div style={{ width: 50 + Math.random() * 30, height: 13, borderRadius: 4, background: "rgba(255,255,255,0.1)" }} />
                                {i < 5 && <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px", display: "flex", gap: 48, alignItems: "flex-start" }}>
                {/* Left Form */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Section 1: Personal Info */}
                    <div style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", marginBottom: 48 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                            <div style={{ ...s, width: 40, height: 40, borderRadius: "50%" }} />
                            <div>
                                <div style={{ ...s, width: 160, height: 18, marginBottom: 6 }} />
                                <div style={{ ...s, width: 220, height: 13 }} />
                            </div>
                        </div>
                        {/* Name row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            {[1, 2].map((i) => (
                                <div key={i}>
                                    <div style={{ ...s, width: 90, height: 13, marginBottom: 8 }} />
                                    <div style={{ ...s, width: "100%", height: 44, borderRadius: "var(--radius-md)" }} />
                                </div>
                            ))}
                        </div>
                        {/* Gender */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ ...s, width: 100, height: 13, marginBottom: 8 }} />
                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ ...s, flex: 1, height: 44, borderRadius: "var(--radius-sm)" }} />
                                <div style={{ ...s, flex: 1, height: 44, borderRadius: "var(--radius-sm)" }} />
                            </div>
                        </div>
                        {/* DOB */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ ...s, width: 100, height: 13, marginBottom: 8 }} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                {[1, 2, 3].map((i) => <div key={i} style={{ ...s, height: 44, borderRadius: "var(--radius-md)" }} />)}
                            </div>
                        </div>
                        {/* Nationality, Email */}
                        {[1, 2].map((i) => (
                            <div key={i} style={{ marginBottom: 20 }}>
                                <div style={{ ...s, width: 80 + i * 20, height: 13, marginBottom: 8 }} />
                                <div style={{ ...s, width: "100%", height: 44, borderRadius: "var(--radius-md)" }} />
                            </div>
                        ))}
                        {/* Phone */}
                        <div>
                            <div style={{ ...s, width: 110, height: 13, marginBottom: 8 }} />
                            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12 }}>
                                <div style={{ ...s, height: 44, borderRadius: "var(--radius-md)" }} />
                                <div style={{ ...s, height: 44, borderRadius: "var(--radius-md)" }} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Booking Info */}
                    <div style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", marginBottom: 48 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                            <div style={{ ...s, width: 40, height: 40, borderRadius: "50%" }} />
                            <div>
                                <div style={{ ...s, width: 180, height: 18, marginBottom: 6 }} />
                                <div style={{ ...s, width: 160, height: 13 }} />
                            </div>
                        </div>
                        {/* Dates & pax */}
                        {[1, 2].map((i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                {[1, 2].map((j) => (
                                    <div key={j}>
                                        <div style={{ ...s, width: 100, height: 13, marginBottom: 8 }} />
                                        <div style={{ ...s, width: "100%", height: 44, borderRadius: "var(--radius-md)" }} />
                                    </div>
                                ))}
                            </div>
                        ))}
                        {/* Total bar */}
                        <div style={{ ...s, width: "100%", height: 56, borderRadius: "var(--radius-md)", marginBottom: 20 }} />
                        {/* Source */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ ...s, width: 200, height: 13, marginBottom: 8 }} />
                            <div style={{ ...s, width: "100%", height: 44, borderRadius: "var(--radius-md)" }} />
                        </div>
                        {/* Textarea */}
                        <div>
                            <div style={{ ...s, width: 180, height: 13, marginBottom: 8 }} />
                            <div style={{ ...s, width: "100%", height: 100, borderRadius: "var(--radius-md)" }} />
                        </div>
                    </div>

                    {/* Terms + Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                        <div style={{ ...s, width: 20, height: 20, borderRadius: 5, flexShrink: 0 }} />
                        <div style={{ ...s, width: 320, height: 14 }} />
                    </div>
                    <div style={{ ...s, width: "100%", height: 54, borderRadius: "var(--radius-md)" }} />
                </div>

                {/* Sidebar */}
                <aside className="booking-sidebar" style={{ width: 340, flexShrink: 0 }}>
                    <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-lg)", padding: "24px 22px" }}>
                        <div style={{ ...s, width: 140, height: 13, marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid rgba(0,0,0,0.05)" }} />
                        <div style={{ ...s, width: "80%", height: 20, marginBottom: 10 }} />
                        <div style={{ ...s, width: 80, height: 13, marginBottom: 20 }} />
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ ...s, width: 70, height: 14 }} />
                                    <div style={{ ...s, width: 80 + i * 5, height: 14 }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "2px solid rgba(0,0,0,0.05)" }}>
                            <div style={{ ...s, width: 90, height: 16 }} />
                            <div style={{ ...s, width: 120, height: 24 }} />
                        </div>
                        <div style={{ ...s, width: "100%", height: 60, borderRadius: "var(--radius-sm)", marginTop: 16 }} />
                    </div>
                </aside>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .booking-sidebar { display: none !important; }
                }
            `}</style>
        </>
    );
}
