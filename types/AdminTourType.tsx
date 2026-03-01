export interface AdminTourListItem {
    id: number;
    title: string;
    type: 'GRUP' | 'PRIVAT';
    durationDays: number;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    _count?: {
        themes: number;
        destinations: number;
        highlights: number;
        gallery: number;
        itinerary: number;
        included: number;
        excluded: number;
        dates: number;
        reviews: number;
        goodToKnow: number;
    };
}

export interface TourBasicFormData {
    title: string;
    type: 'GRUP' | 'PRIVAT';
    durationDays: number;
    price: number;
    image: string;
    heroImage: string;
    overview: string;
    groupSize: string;
    rating: number;
    reviewCount: number;
}

export interface AdminTourDetail {
    id: number;
    title: string;
    type: 'GRUP' | 'PRIVAT';
    durationDays: number;
    price: number;
    image: string;
    heroImage: string | null;
    overview: string | null;
    groupSize: string | null;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    themes: { tourId: number; themeId: number; theme: { id: number; name: string } }[];
    destinations: { tourId: number; destinationId: number; destination: { id: number; name: string } }[];
    highlights: TourHighlightItem[];
    gallery: TourGalleryItem[];
    itinerary: DayItineraryItem[];
    included: TourTextItem[];
    excluded: TourTextItem[];
    dates: TourDateItem[];
    reviews: TourReviewItem[];
    goodToKnow: TourGoodToKnowItem[];
    relatedFrom: { fromTourId: number; toTourId: number; toTour: { id: number; title: string; image: string } }[];
    specialPkg: SpecialPackageItem | null;
    privatePkg: PrivatePackageItem | null;
}

// Sub-resource items
export interface TourHighlightItem {
    id: number;
    tourId: number;
    text: string;
    order: number;
}

export interface TourGalleryItem {
    id: number;
    tourId: number;
    image: string;
    order: number;
}

export interface DayItineraryItem {
    id: number;
    tourId: number;
    day: number;
    title: string;
    description: string;
    distance: string | null;
    meals: { id: number; dayItineraryId: number; meal: 'B' | 'L' | 'D' }[];
}

export interface TourTextItem {
    id: number;
    tourId: number;
    text: string;
    order: number;
}

export interface TourDateItem {
    id: number;
    tourId: number;
    startDate: string;
    endDate: string;
    status: 'AVAILABLE' | 'ALMOST_FULL' | 'FULL' | 'CLOSED';
    price: number;
}

export interface TourReviewItem {
    id: number;
    tourId: number;
    name: string;
    avatar: string | null;
    rating: number;
    date: string;
    text: string;
    location: string | null;
    createdAt: string;
}

export interface TourGoodToKnowItem {
    id: number;
    tourId: number;
    title: string;
    text: string;
    order: number;
}

export interface SpecialPackageItem {
    id: number;
    tourId: number;
    subtitle: string;
    originalPrice: number;
    discount: number;
    badge: string;
    badgeEmoji: string;
    gradient: string;
    groupSize: string;
    season: string;
    dateRange: string;
    limitedSlots: number;
}

export interface PrivatePackageItem {
    id: number;
    tourId: number;
    tagline: string;
    maxGuests: number;
    priceNote: string;
    tier: 'GOLD' | 'PLATINUM' | 'DIAMOND';
    includes: { id: number; privatePackageId: number; text: string; order: number }[];
}

// Form data types
export interface HighlightFormData { text: string; order: number; }
export interface GalleryFormData { image: string; order: number; }
export interface ItineraryFormData { day: number; title: string; description: string; distance: string; meals: ('B' | 'L' | 'D')[]; }
export interface TextItemFormData { text: string; order: number; }
export interface DateFormData { startDate: string; endDate: string; status: 'AVAILABLE' | 'ALMOST_FULL' | 'FULL' | 'CLOSED'; price: number; }
export interface ReviewFormData { name: string; avatar: string; rating: number; date: string; text: string; location: string; }
export interface GoodToKnowFormData { title: string; text: string; order: number; }
export interface SpecialPackageFormData { subtitle: string; originalPrice: number; discount: number; badge: string; badgeEmoji: string; gradient: string; groupSize: string; season: string; dateRange: string; limitedSlots: number; }
export interface PrivatePackageFormData { tagline: string; maxGuests: number; priceNote: string; tier: 'GOLD' | 'PLATINUM' | 'DIAMOND'; includes: string[]; }
export interface RelatedTourFormData { toTourId: number; }

// Ref data for selects
export interface ThemeOption { id: number; name: string; }
export interface DestinationOption { id: number; name: string; }
export interface TourOption { id: number; title: string; image: string; }
