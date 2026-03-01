export interface ThemeFormData {
    name: string;
    description: string;
}

export interface ThemeData {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        tours: number;
    };
}
