import { Tour } from "@/types/TourType";
import ToursComponent from "@/components/ToursComponent";
import { prisma } from "@/lib/prisma";

const DURATIONS = [
    { label: "1 hari", min: 1, max: 1 },
    { label: "2–3 hari", min: 2, max: 3 },
    { label: "4–7 hari", min: 4, max: 7 },
    { label: "8+ hari", min: 8, max: 999 },
];
const TOURS_PER_PAGE = 6;

const typeMap: Record<string, "Grup" | "Privat"> = { GRUP: "Grup", PRIVAT: "Privat" };

export default async function ToursPage() {
    const [dbTours, dbThemes, dbDestinations] = await Promise.all([
        prisma.tour.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                themes: { include: { theme: true } },
                destinations: { include: { destination: true } },
                highlights: { orderBy: { order: "asc" } },
            },
        }),
        prisma.theme.findMany({ orderBy: { name: "asc" } }),
        prisma.destination.findMany({ orderBy: { name: "asc" } }),
    ]);

    const allTours: Tour[] = dbTours.map((t) => ({
        id: t.id,
        title: t.title,
        type: typeMap[t.type] ?? "Grup",
        themes: t.themes.map((tt) => tt.theme.name),
        durationDays: t.durationDays,
        price: t.price,
        destinations: t.destinations.map((td) => td.destination.name),
        highlights: t.highlights.map((h) => h.text),
        image: t.image,
        rating: t.rating,
        reviews: t.reviewCount,
    }));

    const themes = dbThemes.map((t) => t.name);
    const destinations = dbDestinations.map((d) => d.name);

    return (
        <ToursComponent
            allTours={allTours}
            themes={themes}
            durations={DURATIONS}
            destinations={destinations}
            toursPerPage={TOURS_PER_PAGE}
        />
    );
}
