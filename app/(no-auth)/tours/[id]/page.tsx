import ToursDetailComponent from "@/components/ToursDetailComponent";
import { TourDetail } from "@/types/TourType";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const typeMap: Record<string, "Grup" | "Privat"> = { GRUP: "Grup", PRIVAT: "Privat" };
const statusMap: Record<string, string> = {
    AVAILABLE: "Tersedia",
    ALMOST_FULL: "Hampir Penuh",
    FULL: "Penuh",
    CLOSED: "Ditutup",
};
const fmtDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const NAV_ITEMS = [
    { id: "overview", label: "Ringkasan" },
    { id: "gallery", label: "Galeri" },
    { id: "itinerary", label: "Itinerari" },
    { id: "price_and_date", label: "Harga & Jadwal" },
    { id: "included", label: "Termasuk" },
    { id: "good_to_know", label: "Info Penting" },
    { id: "reviews", label: "Ulasan" },
];

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tourId = Number(id);
    if (!tourId || isNaN(tourId)) notFound();

    const dbTour = await prisma.tour.findUnique({
        where: { id: tourId },
        include: {
            themes: { include: { theme: true } },
            destinations: { include: { destination: true } },
            highlights: { orderBy: { order: "asc" } },
            gallery: { orderBy: { order: "asc" } },
            itinerary: {
                orderBy: { day: "asc" },
                include: { meals: true },
            },
            included: { orderBy: { order: "asc" } },
            excluded: { orderBy: { order: "asc" } },
            dates: { orderBy: { startDate: "asc" } },
            reviews: { orderBy: { createdAt: "desc" } },
            goodToKnow: { orderBy: { order: "asc" } },
            relatedFrom: {
                include: {
                    toTour: { select: { id: true, title: true, image: true, durationDays: true, price: true } },
                },
            },
        },
    });

    if (!dbTour) notFound();

    const tour: TourDetail = {
        id: dbTour.id,
        title: dbTour.title,
        type: typeMap[dbTour.type] ?? "Grup",
        themes: dbTour.themes.map((tt) => tt.theme.name),
        durationDays: dbTour.durationDays,
        groupSize: dbTour.groupSize ?? "",
        price: dbTour.price,
        destinations: dbTour.destinations.map((td) => td.destination.name),
        overview: dbTour.overview ?? "",
        heroImage: dbTour.heroImage ?? dbTour.image,
        gallery: dbTour.gallery.map((g) => g.image),
        itinerary: dbTour.itinerary.map((it) => ({
            day: it.day,
            title: it.title,
            description: it.description,
            meals: it.meals.map((m) => m.meal as "B" | "L" | "D"),
            distance: it.distance ?? undefined,
        })),
        included: dbTour.included.map((i) => i.text),
        excluded: dbTour.excluded.map((e) => e.text),
        dates: dbTour.dates.map((d) => ({
            start: fmtDate(d.startDate),
            end: fmtDate(d.endDate),
            status: statusMap[d.status] ?? d.status,
            price: d.price,
        })),
        reviews: dbTour.reviews.map((r) => ({
            name: r.name,
            avatar: r.avatar ?? "/assets/default-avatar-2020-13.jpg",
            rating: r.rating,
            date: r.date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
            text: r.text,
            location: r.location ?? "",
        })),
        relatedTourIds: dbTour.relatedFrom.map((r) => r.toTourId),
        highlights: dbTour.highlights.map((h) => h.text),
        goodToKnow: dbTour.goodToKnow.map((g) => ({ title: g.title, text: g.text })),
    };

    const relatedTours: Record<number, { id: number; title: string; image: string; duration: string; price: string }> =
        {};
    for (const rel of dbTour.relatedFrom) {
        const rt = rel.toTour;
        relatedTours[rt.id] = {
            id: rt.id,
            title: rt.title,
            image: rt.image,
            duration: `${rt.durationDays} hari`,
            price: `Rp ${rt.price.toLocaleString("id-ID")}`,
        };
    }

    return <ToursDetailComponent tour={tour} navItems={NAV_ITEMS} relatedTours={relatedTours} />;
}
