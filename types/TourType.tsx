export type Tour = {
    id: number;
    title: string;
    type: "Grup" | "Privat";
    themes: string[];
    durationDays: number;
    price: number;
    destinations: string[];
    highlights: string[];
    image: string;
    rating: number;
    reviews: number;
};

export type DayItinerary = {
    day: number;
    title: string;
    description: string;
    meals: ("B" | "L" | "D")[];
    distance?: string;
};

export type TourDetail = {
    id: number;
    title: string;
    type: "Grup" | "Privat";
    themes: string[];
    durationDays: number;
    groupSize: string;
    price: number;
    destinations: string[];
    overview: string;
    heroImage: string;
    gallery: string[];
    itinerary: DayItinerary[];
    included: string[];
    excluded: string[];
    dates: { start: string; end: string; status: string; price: number }[];
    reviews: { name: string; avatar: string; rating: number; date: string; text: string; location: string }[];
    relatedTourIds: number[];
    highlights: string[];
    goodToKnow: { title: string; text: string }[];
};