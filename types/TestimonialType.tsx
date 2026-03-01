export interface TestimonialData {
    id: number;
    name: string;
    avatar: string | null;
    role: string;
    text: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface TestimonialFormData {
    name: string;
    avatar: string;
    role: string;
    text: string;
    rating: number;
}
