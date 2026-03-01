import BlogIdComponents from "@/components/BlogIdComponents";
import { BlogDetailPost } from "@/types/BlogType";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const fmtDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) return notFound();

    const dbPost = await prisma.blogPost.findUnique({
        where: { id: postId },
        include: {
            author: true,
            tags: { select: { tag: true } },
            relatedFrom: {
                include: {
                    toPost: {
                        select: { id: true, title: true, image: true, category: true },
                    },
                },
            },
        },
    });

    if (!dbPost) return notFound();

    const post: BlogDetailPost = {
        id: dbPost.id,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        image: dbPost.image,
        date: fmtDate(dbPost.date),
        category: dbPost.category,
        readTime: dbPost.readTime,
        author: {
            name: dbPost.author?.name ?? "Tim Redaksi",
            avatar: dbPost.author?.avatar ?? "/assets/default-avatar-2020-3.jpg",
            role: dbPost.author?.role ?? "Penulis",
        },
        content: dbPost.content,
        tags: dbPost.tags.map((t) => t.tag),
        relatedPosts: dbPost.relatedFrom.map((r) => ({
            id: r.toPost.id,
            title: r.toPost.title,
            image: r.toPost.image,
            category: r.toPost.category,
        })),
    };

    return <BlogIdComponents post={post} />;
}
