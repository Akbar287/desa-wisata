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

export interface SpecialPackage {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
    badge: string;
    badgeEmoji: string;
    gradient: string;
    durationDays: number;
    groupSize: string;
    rating: number;
    reviews: number;
    highlights: string[];
    season: string;
    dateRange: string;
    limitedSlots: number;
}

export interface PrivatePackage {
    id: number;
    title: string;
    tagline: string;
    image: string;
    duration: string;
    maxGuests: number;
    price: string;
    priceNote: string;
    highlights: string[];
    includes: string[];
    tier: 'gold' | 'platinum' | 'diamond';
}

export interface Testimonial {
    name: string;
    avatar: string;
    role: string;
    text: string;
    rating: number;
}