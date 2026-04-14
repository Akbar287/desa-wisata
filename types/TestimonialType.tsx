export interface TestimonialData {
    id: number;
    isPublished?: boolean;
    name: string;
    avatar: string | null;
    role: string;
    text: string;
    rating: number;
    bookingId: number;
    images?: TestimonialImageData[];
    createdAt: string;
    updatedAt: string;
}

export interface TestimonialFormData {
    name: string;
    avatar: string;
    role: string;
    text: string;
    rating: number;
    bookingId: number;
}

export interface TestimonialImageData {
    id: number;
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
}

export interface TestimonialUserSubmittedData {
    id: number;
    isPublished: boolean;
    name: string;
    role: string;
    text: string;
    rating: number;
    createdAt: string;
    images: TestimonialImageData[];
}

export interface TestimonialUserPageData {
    bookingCode: string;
    bookingId: number;
    customerName: string;
    customerEmail: string;
    itemName: string;
    visitDate: string;
    existingTestimonial: TestimonialUserSubmittedData | null;
}
