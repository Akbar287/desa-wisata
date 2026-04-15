export interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    experience: string;
    specialty: string;
    bio?: string;
    countries?: string[];
}

export interface TeamCategory {
    title: string;
    emoji: string;
    description: string;
    gradient: string;
    members: TeamMember[];
}
