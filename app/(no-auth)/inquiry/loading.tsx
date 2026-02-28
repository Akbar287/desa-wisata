export default function InquiryLoading() {
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

            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, #1a4a30 0%, #1a5c38 50%, #2d8f5e 100%)", padding: "120px 24px 54px" }}>
                <div style={{ maxWidth: 1320, margin: "0 auto" }}>
                    <div style={{ ...s, width: 200, height: 13, background: "rgba(255,255,255,0.08)", marginBottom: 20, opacity: 0.5 }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.1)" }} />
                        <div style={{ ...s, width: 280, height: 34, background: "rgba(255,255,255,0.12)", opacity: 0.5 }} />
                    </div>
                    <div style={{ display: "flex", gap: 24, marginBottom: 36 }}>
                        {[1, 2, 3].map(i => <div key={i} style={{ ...s, width: 200, height: 14, background: "rgba(255,255,255,0.06)", opacity: 0.4 }} />)}
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 38, height: 38, borderRadius: "50%", background: i <= 2 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)" }} />
                                <div style={{ width: 80, height: 13, borderRadius: 4, background: "rgba(255,255,255,0.08)" }} />
                                {i < 3 && <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.08)", margin: "0 6px" }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form */}
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px", display: "flex", gap: 48 }}>
                <div style={{ flex: 1 }}>
                    {/* Section 1 */}
                    <div style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", marginBottom: 32 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                            <div style={{ ...s, width: 40, height: 40, borderRadius: "50%" }} />
                            <div>
                                <div style={{ ...s, width: 140, height: 18, marginBottom: 6 }} />
                                <div style={{ ...s, width: 240, height: 13 }} />
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            {[1, 2].map(i => (
                                <div key={i}>
                                    <div style={{ ...s, width: 80, height: 13, marginBottom: 8 }} />
                                    <div style={{ ...s, width: "100%", height: 44, borderRadius: "var(--radius-md)" }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            {[1, 2].map(i => (
                                <div key={i}>
                                    <div style={{ ...s, width: 90, height: 13, marginBottom: 8 }} />
                                    <div style={{ ...s, width: "100%", height: 44, borderRadius: "var(--radius-md)" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Section 2 */}
                    <div style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)", padding: "28px 26px", marginBottom: 32 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                            <div style={{ ...s, width: 40, height: 40, borderRadius: "50%" }} />
                            <div>
                                <div style={{ ...s, width: 160, height: 18, marginBottom: 6 }} />
                                <div style={{ ...s, width: 260, height: 13 }} />
                            </div>
                        </div>
                        <div style={{ ...s, width: 100, height: 13, marginBottom: 8 }} />
                        <div style={{ ...s, width: "100%", height: 140, borderRadius: "var(--radius-md)" }} />
                    </div>
                    <div style={{ ...s, width: "100%", height: 54, borderRadius: "var(--radius-md)" }} />
                </div>

                {/* Sidebar */}
                <aside className="inquiry-sidebar" style={{ width: 340, flexShrink: 0 }}>
                    <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-lg)", padding: "24px 22px", marginBottom: 20 }}>
                        <div style={{ ...s, width: 60, height: 13, marginBottom: 16 }} />
                        <div style={{ ...s, width: "80%", height: 20, marginBottom: 10 }} />
                        <div style={{ ...s, width: 80, height: 14 }} />
                    </div>
                    <div style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: "var(--radius-lg)", padding: "22px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <div style={{ ...s, width: 36, height: 36, borderRadius: "50%" }} />
                            <div style={{ ...s, width: 100, height: 15 }} />
                        </div>
                        <div style={{ ...s, width: "100%", height: 40, marginBottom: 14 }} />
                        <div style={{ ...s, width: 160, height: 13, marginBottom: 8 }} />
                        <div style={{ ...s, width: 140, height: 13 }} />
                    </div>
                </aside>
            </div>

            <style>{`@media (max-width: 1024px) { .inquiry-sidebar { display: none !important; } }`}</style>
        </>
    );
}
