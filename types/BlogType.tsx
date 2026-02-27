export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
    readTime: string;
}

export interface BlogDetailPost extends BlogPost {
    author: { name: string; avatar: string; role: string };
    content: string[];
    tags: string[];
    relatedPosts: { id: number; title: string; image: string; category: string }[];
}