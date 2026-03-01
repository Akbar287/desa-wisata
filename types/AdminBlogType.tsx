export interface AdminBlogListItem {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
    readTime: string;
    authorId: number | null;
    author: { id: number; name: string; avatar: string | null; role: string } | null;
    createdAt: string;
    updatedAt: string;
    _count?: { tags: number; relatedFrom: number };
}

export interface AdminBlogDetail {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
    readTime: string;
    authorId: number | null;
    content: string[];
    createdAt: string;
    updatedAt: string;
    author: { id: number; name: string; avatar: string | null; role: string } | null;
    tags: BlogTagItem[];
    relatedFrom: { fromPostId: number; toPostId: number; toPost: { id: number; title: string; image: string } }[];
}

export interface BlogTagItem {
    id: number;
    postId: number;
    tag: string;
}

export interface BlogAuthorItem {
    id: number;
    name: string;
    avatar: string | null;
    role: string;
}

// Form data
export interface BlogPostFormData {
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
    readTime: string;
    authorId: number | null;
    content: string[];
}

export interface BlogTagFormData { tag: string; }
export interface BlogAuthorFormData { name: string; avatar: string; role: string; }
export interface BlogPostOption { id: number; title: string; image: string; }
