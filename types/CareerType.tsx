export interface JobRequirement {
    label: string;
}

export interface JobBenefit {
    emoji: string;
    label: string;
}

export interface JobListing {
    id: number;
    title: string;
    department: string;
    departmentEmoji: string;
    gradient: string;
    type: string;
    location: string;
    salary: string;
    deadline: string;
    postedDate: string;
    slots: number;
    summary: string;
    responsibilities: string[];
    requirements: JobRequirement[];
    benefits: JobBenefit[];
    qualifications: string[];
    workSchedule: string;
    contact: string;
}