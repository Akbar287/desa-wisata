export interface DestinationFormData {
    name: string;
}

export interface DestinationData {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        tours: number;
    };
}
