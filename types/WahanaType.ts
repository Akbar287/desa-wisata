export interface WahanaFormData {
    name: string;
    price: number;
    description: string;
    imageBanner: string;
    gallery: { image: string }[];
}

export interface WahanaData {
    id: number;
    name: string;
    price: number;
    description: string;
    imageBanner: string;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    WahanaGallery: {
        id: number;
        image: string;
    }[];
}
