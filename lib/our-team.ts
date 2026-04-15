import { prisma } from "@/lib/prisma";
import type { TeamCategory } from "@/types/OurTeamType";

const CATEGORY_GRADIENT: Record<string, string> = {
  "tim pemandu wisata": "linear-gradient(135deg, #2D6A4F, #52B788)",
  "tim keamanan": "linear-gradient(135deg, #1E40AF, #60A5FA)",
  "tim kesehatan": "linear-gradient(135deg, #DC2626, #F87171)",
  "tim bantuan & layanan": "linear-gradient(135deg, #7C3AED, #A78BFA)",
};

const FALLBACK_META = [
  {
    emoji: "👥",
    description: "Tim profesional yang siap mendukung pengalaman wisata Anda.",
    gradient: "linear-gradient(135deg, #2D6A4F, #52B788)",
  },
  {
    emoji: "🌿",
    description: "Tim profesional yang siap mendukung pengalaman wisata Anda.",
    gradient: "linear-gradient(135deg, #1E40AF, #60A5FA)",
  },
  {
    emoji: "✨",
    description: "Tim profesional yang siap mendukung pengalaman wisata Anda.",
    gradient: "linear-gradient(135deg, #DC2626, #F87171)",
  },
  {
    emoji: "🤝",
    description: "Tim profesional yang siap mendukung pengalaman wisata Anda.",
    gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)",
  },
];

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function resolveCategoryMeta(name: string, index: number) {
  const key = normalizeName(name);
  const fallback = FALLBACK_META[index % FALLBACK_META.length];
  return {
    ...fallback,
    gradient: CATEGORY_GRADIENT[key] ?? fallback.gradient,
  };
}

export async function getOurTeamData(): Promise<TeamCategory[]> {
  const rows = await prisma.teamCategory.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: {
      members: {
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: {
          id: true,
          name: true,
          role: true,
          experience: true,
          avatar: true,
          bio: true,
          specialty: true,
          anggotaTimNegara: {
            select: {
              negara: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return rows.map((category, index) => {
    const meta = resolveCategoryMeta(category.title, index);
    return {
      title: category.title,
      emoji: category.emoji?.trim() || meta.emoji,
      description: category.description?.trim() || meta.description,
      gradient: category.gradient?.trim() || meta.gradient,
      members: category.members.map((member) => {
        const countries = Array.from(
          new Set(
            member.anggotaTimNegara
              .map((item) => item.negara?.nama?.trim() || "")
              .filter(Boolean),
          ),
        );

        return {
          name: member.name,
          role: member.role,
          avatar: member.avatar || "/assets/default-avatar-2020-25.jpg",
          experience:
            typeof member.experience === "string" && member.experience.trim()
              ? member.experience.trim()
              : "-",
          specialty:
            (typeof member.specialty === "string" && member.specialty.trim()) ||
            (typeof member.bio === "string" && member.bio.trim()) ||
            "-",
          bio:
            typeof member.bio === "string" && member.bio.trim()
              ? member.bio.trim()
              : "",
          countries,
        };
      }),
    };
  });
}
