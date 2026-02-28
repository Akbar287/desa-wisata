export default function ToursLoading() {
    const shimmer = `
        @keyframes shimmer {
            0% { background-position: -700px 0; }
            100% { background-position: 700px 0; }
        }
    `;
    const skeletonBg = {
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "700px 100%",
        animation: "shimmer 1.6s infinite linear",
        borderRadius: "var(--radius-sm)",
    } as const;

    return (
        <>
            <style>{shimmer}</style>

            {/* Hero Skeleton */}
            <div
                style={{
                    height: 380,
                    background: "linear-gradient(135deg, #e8f0ec 0%, #d6e6dd 60%, #e0ede5 100%)",
                    display: "flex",
                    alignItems: "flex-end",
                    paddingBottom: 60,
                }}
            >
                <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", width: "100%" }}>
                    <div style={{ ...skeletonBg, width: 140, height: 16, marginBottom: 18, opacity: 0.5 }} />
                    <div style={{ ...skeletonBg, width: 340, height: 42, marginBottom: 16, opacity: 0.5 }} />
                    <div style={{ ...skeletonBg, width: 460, height: 16, opacity: 0.5 }} />
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div style={{ background: "var(--color-cream)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "20px 0" }}>
                <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ ...skeletonBg, flex: 1, height: 46, borderRadius: "var(--radius-full)" }} />
                    <div style={{ ...skeletonBg, width: 130, height: 20 }} />
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px", display: "flex", gap: 40, alignItems: "flex-start" }}>
                {/* Sidebar Skeleton */}
                <aside className="tours-sidebar" style={{ width: 260, flexShrink: 0, background: "var(--color-cream)", borderRadius: "var(--radius-lg)", padding: "28px 22px" }}>
                    <div style={{ ...skeletonBg, width: 120, height: 20, marginBottom: 24 }} />
                    {[1, 2, 3, 4].map((section) => (
                        <div key={section} style={{ marginBottom: 28 }}>
                            <div style={{ ...skeletonBg, width: 90, height: 14, marginBottom: 16 }} />
                            {Array.from({ length: section === 2 ? 5 : 3 }).map((_, j) => (
                                <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <div style={{ ...skeletonBg, width: 18, height: 18, borderRadius: 5, flexShrink: 0 }} />
                                    <div style={{ ...skeletonBg, width: 60 + Math.random() * 60, height: 14 }} />
                                </div>
                            ))}
                        </div>
                    ))}
                </aside>

                {/* Cards Grid Skeleton */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    borderRadius: "var(--radius-lg)",
                                    overflow: "hidden",
                                    background: "white",
                                    boxShadow: "var(--shadow-sm)",
                                    border: "1px solid rgba(0,0,0,0.07)",
                                }}
                            >
                                {/* Image skeleton */}
                                <div style={{ ...skeletonBg, height: 220, borderRadius: 0 }} />

                                {/* Body skeleton */}
                                <div style={{ padding: "20px 22px 22px" }}>
                                    {/* Theme tags */}
                                    <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                                        <div style={{ ...skeletonBg, width: 58, height: 22, borderRadius: "var(--radius-full)" }} />
                                        <div style={{ ...skeletonBg, width: 70, height: 22, borderRadius: "var(--radius-full)" }} />
                                    </div>
                                    {/* Title */}
                                    <div style={{ ...skeletonBg, width: "85%", height: 18, marginBottom: 16 }} />
                                    {/* Highlights */}
                                    <div style={{ ...skeletonBg, width: "100%", height: 13, marginBottom: 8 }} />
                                    <div style={{ ...skeletonBg, width: "90%", height: 13, marginBottom: 8 }} />
                                    <div style={{ ...skeletonBg, width: "75%", height: 13, marginBottom: 18 }} />
                                    {/* Stars */}
                                    <div style={{ ...skeletonBg, width: 140, height: 14, marginBottom: 16 }} />
                                    {/* Footer */}
                                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <div style={{ ...skeletonBg, width: 50, height: 11, marginBottom: 6 }} />
                                            <div style={{ ...skeletonBg, width: 100, height: 18 }} />
                                        </div>
                                        <div style={{ ...skeletonBg, width: 110, height: 36, borderRadius: "var(--radius-full)" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hide sidebar on mobile */}
            <style>{`
                @media (max-width: 768px) {
                    .tours-sidebar { display: none !important; }
                }
            `}</style>
        </>
    );
}
