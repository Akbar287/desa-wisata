import BlogComponents from "@/components/BlogComponents";
import { BlogPost } from "@/types/BlogType";
import { prisma } from "@/lib/prisma";

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
    "travel-tips": { label: "Tips Perjalanan", icon: "ℹ" },
    news: { label: "Berita", icon: "📰" },
    destinations: { label: "Tempat Wisata", icon: "🗺" },
    "important-info": { label: "Info Penting", icon: "⚙" },
};

const fmtDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default async function BlogPage() {
    const dbPosts = await prisma.blogPost.findMany({
        orderBy: { date: "desc" },
        select: {
            id: true,
            title: true,
            excerpt: true,
            image: true,
            date: true,
            category: true,
            readTime: true,
        },
    });

    const allPosts: BlogPost[] = dbPosts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        image: p.image,
        date: fmtDate(p.date),
        category: p.category,
        readTime: p.readTime,
    }));

    // Build categories from DB data
    const uniqueCats = [...new Set(dbPosts.map((p) => p.category))];
    const categories = [
        { id: "all", label: "Semua", icon: "🌐" },
        ...uniqueCats.map((cat) => ({
            id: cat,
            label: CATEGORY_META[cat]?.label ?? cat,
            icon: CATEGORY_META[cat]?.icon ?? "📄",
        })),
    ];

    const POSTS_PER_PAGE = 6;

    return <BlogComponents categories={categories} allPosts={allPosts} postsPerPage={POSTS_PER_PAGE} />;
}
