export interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    experience: string;
    specialty: string;
}

export interface TeamCategory {
    title: string;
    emoji: string;
    description: string;
    gradient: string;
    members: TeamMember[];
}