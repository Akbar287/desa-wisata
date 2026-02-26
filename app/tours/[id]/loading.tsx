export default function TourDetailLoading() {
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

            {/* Hero Skeleton */}
            <div style={{ height: "clamp(360px, 55vh, 520px)", background: "linear-gradient(135deg, #e8f0ec 0%, #d6e6dd 60%, #e0ede5 100%)", display: "flex", alignItems: "flex-end", paddingBottom: 56 }}>
                <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", width: "100%" }}>
                    <div style={{ ...s, width: 220, height: 14, marginBottom: 16, opacity: 0.5 }} />
                    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        <div style={{ ...s, width: 70, height: 28, borderRadius: "var(--radius-full)", opacity: 0.5 }} />
                        <div style={{ ...s, width: 80, height: 28, borderRadius: "var(--radius-full)", opacity: 0.5 }} />
                    </div>
                    <div style={{ ...s, width: 420, height: 42, opacity: 0.5 }} />
                </div>
            </div>

            {/* Sub-Nav Skeleton */}
            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0" }}>
                <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", gap: 8 }}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} style={{ ...s, width: 70 + Math.random() * 30, height: 14, margin: "18px 12px" }} />
                    ))}
                </div>
            </div>

            {/* Main + Sidebar */}
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px", display: "flex", gap: 48, alignItems: "flex-start" }}>
                {/* Left Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Quick Facts */}
                    <div style={{ display: "flex", gap: 24, marginBottom: 28 }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ ...s, width: 44, height: 44, borderRadius: "50%" }} />
                                <div>
                                    <div style={{ ...s, width: 50, height: 11, marginBottom: 6 }} />
                                    <div style={{ ...s, width: 80, height: 15 }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Overview text */}
                    <div style={{ ...s, width: "100%", height: 14, marginBottom: 10 }} />
                    <div style={{ ...s, width: "95%", height: 14, marginBottom: 10 }} />
                    <div style={{ ...s, width: "80%", height: 14, marginBottom: 28 }} />

                    {/* Highlights box */}
                    <div style={{ background: "var(--color-bg-light)", borderRadius: "var(--radius-md)", padding: "22px 26px", marginBottom: 56 }}>
                        <div style={{ ...s, width: 160, height: 18, marginBottom: 16 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} style={{ ...s, width: "90%", height: 14 }} />
                            ))}
                        </div>
                    </div>

                    {/* Gallery Skeleton */}
                    <div style={{ ...s, width: 180, height: 24, marginBottom: 22 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "240px 180px", gap: 10, borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 56 }}>
                        <div style={{ ...s, borderRadius: 0, gridColumn: "1 / 3", gridRow: "1 / 2" }} />
                        <div style={{ ...s, borderRadius: 0 }} />
                        <div style={{ ...s, borderRadius: 0 }} />
                        <div style={{ ...s, borderRadius: 0 }} />
                        <div style={{ ...s, borderRadius: 0 }} />
                    </div>

                    {/* Itinerary Skeleton */}
                    <div style={{ ...s, width: 200, height: 24, marginBottom: 22 }} />
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-md)", padding: "18px 22px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ ...s, width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ ...s, width: 60, height: 11, marginBottom: 6 }} />
                                <div style={{ ...s, width: 200 + i * 30, height: 16 }} />
                            </div>
                        </div>
                    ))}

                    {/* Price Table Skeleton */}
                    <div style={{ ...s, width: 240, height: 24, marginTop: 44, marginBottom: 22 }} />
                    <div style={{ border: "1px solid rgba(0,0,0,0.07)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                        <div style={{ ...s, height: 44, borderRadius: 0 }} />
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ display: "flex", gap: 16, padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                                <div style={{ ...s, width: 100, height: 14, flex: 1 }} />
                                <div style={{ ...s, width: 100, height: 14, flex: 1 }} />
                                <div style={{ ...s, width: 70, height: 24, borderRadius: "var(--radius-full)" }} />
                                <div style={{ ...s, width: 90, height: 14 }} />
                                <div style={{ ...s, width: 70, height: 32, borderRadius: "var(--radius-full)" }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <aside className="tour-detail-sidebar" style={{ width: 310, flexShrink: 0 }}>
                    <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-lg)", padding: "28px 24px" }}>
                        <div style={{ ...s, width: 70, height: 11, marginBottom: 8 }} />
                        <div style={{ ...s, width: 160, height: 32, marginBottom: 6 }} />
                        <div style={{ ...s, width: 60, height: 13, marginBottom: 24 }} />
                        <div style={{ ...s, width: "100%", height: 48, borderRadius: "var(--radius-full)", marginBottom: 12 }} />
                        <div style={{ ...s, width: "100%", height: 44, borderRadius: "var(--radius-full)", marginBottom: 24 }} />
                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 18, display: "flex", flexDirection: "column" as const, gap: 14 }}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ ...s, width: 60, height: 14 }} />
                                    <div style={{ ...s, width: 80 + i * 10, height: 14 }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .tour-detail-sidebar { display: none !important; }
                }
            `}</style>
        </>
    );
}
