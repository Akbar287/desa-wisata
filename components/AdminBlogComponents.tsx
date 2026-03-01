"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { AdminBlogListItem, AdminBlogDetail, BlogAuthorItem, BlogPostOption } from '@/types/AdminBlogType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { blogPostSchema, blogTagSchema, blogAuthorSchema } from '@/validation/blogSchema'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'
import { IconArrowLeft, IconEdit, IconTrash, IconPlus, IconSearch, IconSettings, IconUpload, IconX } from '@tabler/icons-react'

const API = '/api/blog/admin'
const IMG_API = '/api/img'

async function api(path: string, opts?: RequestInit) { const res = await fetch(`${API}${path}`, opts); return res.json() }
async function apiJson(path: string, method: string, body: unknown) { return api(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) }
async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData(); fd.append('files', file)
    const res = await fetch(IMG_API, { method: 'POST', body: fd })
    const json = await res.json()
    if (json.status === 'success') return `${IMG_API}?_id=${json.data.id}`
    toast.error(json.message || 'Upload gagal'); return null
}
const fmtDate = (s: string) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
function getPageNumbers(page: number, totalPages: number): (number | 'e')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const p: (number | 'e')[] = [1]
    if (page > 3) p.push('e')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) p.push(i)
    if (page < totalPages - 2) p.push('e')
    p.push(totalPages)
    return p
}

function ImageUploadField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
    const [uploading, setUploading] = useState(false)
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return
        setUploading(true); const url = await uploadImage(file); if (url) onChange(url); setUploading(false)
    }
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
                <Input value={value} onChange={e => onChange(e.target.value)} placeholder="URL atau upload..." className="flex-1" />
                <Button type="button" variant="outline" size="sm" className="relative" disabled={uploading}>
                    {uploading ? <Spinner className="size-4" /> : <IconUpload className="size-4" />}
                    <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                </Button>
            </div>
            {value && <img src={value} alt="" className="h-16 rounded border object-cover" />}
        </div>
    )
}

function PaginationBar({ pagination, page, limit, setPage }: { pagination: PaginationMeta; page: number; limit: number; setPage: (p: number) => void }) {
    const offset = (pagination.page - 1) * pagination.limit
    if (pagination.totalPages <= 0) return null
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
            <p className="text-sm text-muted-foreground">Menampilkan {offset + 1}–{Math.min(offset + limit, pagination.total)} dari {pagination.total}</p>
            {pagination.totalPages > 1 && (
                <Pagination><PaginationContent>
                    <PaginationItem><PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'} /></PaginationItem>
                    {getPageNumbers(page, pagination.totalPages).map((p, i) => p === 'e' ? <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem> : <PaginationItem key={p}><PaginationLink isActive={p === page} onClick={() => setPage(p)} className="cursor-pointer">{p}</PaginationLink></PaginationItem>)}
                    <PaginationItem><PaginationNext onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'} /></PaginationItem>
                </PaginationContent></Pagination>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function AdminBlogComponents() {
    // List State
    const [posts, setPosts] = useState<AdminBlogListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    // Management State
    const [selectedPost, setSelectedPost] = useState<AdminBlogDetail | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'manage' | 'authors'>('list')
    const [refData, setRefData] = useState<{ authors: BlogAuthorItem[]; posts: BlogPostOption[] }>({ authors: [], posts: [] })

    // Dialog States
    const [postFormOpen, setPostFormOpen] = useState(false)
    const [editingPostId, setEditingPostId] = useState<number | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Sub-resource dialogs
    const [tagDialogOpen, setTagDialogOpen] = useState(false)
    const [editingTag, setEditingTag] = useState<{ id: number; tag: string } | null>(null)
    const [tagDeleteOpen, setTagDeleteOpen] = useState(false)
    const [deletingTag, setDeletingTag] = useState<{ id: number; tag: string } | null>(null)

    // Authors state
    const [authors, setAuthors] = useState<(BlogAuthorItem & { _count?: { posts: number } })[]>([])
    const [authorPage, setAuthorPage] = useState(1)
    const [authorPagination, setAuthorPagination] = useState<PaginationMeta | null>(null)
    const [authorSearchInput, setAuthorSearchInput] = useState('')
    const [authorSearch, setAuthorSearch] = useState('')
    const [authorDialogOpen, setAuthorDialogOpen] = useState(false)
    const [editingAuthor, setEditingAuthor] = useState<BlogAuthorItem | null>(null)
    const [authorDeleteOpen, setAuthorDeleteOpen] = useState(false)
    const [deletingAuthor, setDeletingAuthor] = useState<BlogAuthorItem | null>(null)

    // Content paragraphs state
    const [contentParagraphs, setContentParagraphs] = useState<string[]>([])
    const [newParagraph, setNewParagraph] = useState('')

    // ─── Fetch Posts ────────────────────────────────────────
    const fetchPosts = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set('search', search)
            const json = await api(`/?${params}`)
            if (json.status === 'success') { setPosts(json.data); setPagination(json.pagination) }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung') }
        finally { setLoading(false) }
    }, [page, limit, search])

    useEffect(() => { fetchPosts() }, [fetchPosts])
    useEffect(() => { const t = setTimeout(() => { if (searchInput !== search) { setSearch(searchInput); setPage(1) } }, 400); return () => clearTimeout(t) }, [searchInput, search])
    useEffect(() => { api('/ref').then(json => { if (json.status === 'success') setRefData(json.data) }) }, [])

    // ─── Fetch Post Detail ──────────────────────────────────
    const fetchDetail = useCallback(async (id: number) => {
        setLoading(true)
        try {
            const json = await api(`/detail?_id=${id}`)
            if (json.status === 'success') { setSelectedPost(json.data); setViewMode('manage') }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung') }
        finally { setLoading(false) }
    }, [])
    const refreshDetail = () => { if (selectedPost) fetchDetail(selectedPost.id) }

    // ─── Fetch Authors ──────────────────────────────────────
    const fetchAuthors = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(authorPage), limit: String(limit) })
            if (authorSearch) params.set('search', authorSearch)
            const json = await api(`/authors?${params}`)
            if (json.status === 'success') { setAuthors(json.data); setAuthorPagination(json.pagination) }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung') }
        finally { setLoading(false) }
    }, [authorPage, limit, authorSearch])

    useEffect(() => { if (viewMode === 'authors') fetchAuthors() }, [viewMode, fetchAuthors])
    useEffect(() => { const t = setTimeout(() => { if (authorSearchInput !== authorSearch) { setAuthorSearch(authorSearchInput); setAuthorPage(1) } }, 400); return () => clearTimeout(t) }, [authorSearchInput, authorSearch])

    // ─── Post Form ──────────────────────────────────────────
    const postForm = useForm({ resolver: yupResolver(blogPostSchema), defaultValues: { title: '', excerpt: '', image: '', date: '', category: '', readTime: '', authorId: null as number | null, content: [] as string[] } })

    const openPostAdd = () => { setEditingPostId(null); setContentParagraphs([]); postForm.reset({ title: '', excerpt: '', image: '', date: new Date().toISOString().slice(0, 10), category: '', readTime: '', authorId: null, content: [] }); setPostFormOpen(true) }
    const openPostEdit = (p: AdminBlogDetail) => { setEditingPostId(p.id); setContentParagraphs(p.content || []); postForm.reset({ title: p.title, excerpt: p.excerpt, image: p.image, date: p.date?.slice(0, 10), category: p.category, readTime: p.readTime, authorId: p.authorId, content: p.content || [] }); setPostFormOpen(true) }

    const onPostSubmit = async (data: Record<string, unknown>) => {
        setSubmitting(true)
        try {
            const payload = { ...data, content: contentParagraphs }
            const json = editingPostId ? await apiJson(`/?_id=${editingPostId}`, 'PUT', payload) : await apiJson('/', 'POST', payload)
            if (json.status === 'success') { toast.success(json.message); setPostFormOpen(false); fetchPosts(); if (editingPostId && selectedPost) refreshDetail(); api('/ref').then(j => { if (j.status === 'success') setRefData(j.data) }) }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Delete Post ────────────────────────────────────────
    const confirmDeletePost = async () => {
        if (!deletingId) return; setSubmitting(true)
        try {
            const json = await api(`/?_id=${deletingId}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setDeleteOpen(false); setDeletingId(null); if (viewMode === 'manage') { setViewMode('list'); setSelectedPost(null) }; fetchPosts() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Tag CRUD ───────────────────────────────────────────
    const tagForm = useForm({ resolver: yupResolver(blogTagSchema), defaultValues: { tag: '' } })
    const openTagAdd = () => { setEditingTag(null); tagForm.reset({ tag: '' }); setTagDialogOpen(true) }
    const openTagEdit = (t: { id: number; tag: string }) => { setEditingTag(t); tagForm.reset({ tag: t.tag }); setTagDialogOpen(true) }

    const onTagSubmit = async (data: { tag: string }) => {
        if (!selectedPost) return; setSubmitting(true)
        try {
            const json = editingTag ? await apiJson(`/tags?_id=${editingTag.id}`, 'PUT', data) : await apiJson('/tags', 'POST', { ...data, postId: selectedPost.id })
            if (json.status === 'success') { toast.success(json.message); setTagDialogOpen(false); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }
    const confirmDeleteTag = async () => {
        if (!deletingTag) return; setSubmitting(true)
        try {
            const json = await api(`/tags?_id=${deletingTag.id}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setTagDeleteOpen(false); setDeletingTag(null); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Related Posts ──────────────────────────────────────
    const [savingRelated, setSavingRelated] = useState(false)
    const saveRelated = async (ids: number[]) => {
        if (!selectedPost) return; setSavingRelated(true)
        try {
            const json = await apiJson('/related', 'POST', { postId: selectedPost.id, relatedPostIds: ids })
            if (json.status === 'success') { toast.success(json.message); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSavingRelated(false) }
    }

    // ─── Author CRUD ────────────────────────────────────────
    const authorForm = useForm({ resolver: yupResolver(blogAuthorSchema), defaultValues: { name: '', avatar: '', role: '' } })
    const openAuthorAdd = () => { setEditingAuthor(null); authorForm.reset({ name: '', avatar: '', role: '' }); setAuthorDialogOpen(true) }
    const openAuthorEdit = (a: BlogAuthorItem) => { setEditingAuthor(a); authorForm.reset({ name: a.name, avatar: a.avatar || '', role: a.role }); setAuthorDialogOpen(true) }

    const onAuthorSubmit = async (data: { name: string; avatar: string; role: string }) => {
        setSubmitting(true)
        try {
            const json = editingAuthor ? await apiJson(`/authors?_id=${editingAuthor.id}`, 'PUT', data) : await apiJson('/authors', 'POST', data)
            if (json.status === 'success') { toast.success(json.message); setAuthorDialogOpen(false); fetchAuthors(); api('/ref').then(j => { if (j.status === 'success') setRefData(j.data) }) }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }
    const confirmDeleteAuthor = async () => {
        if (!deletingAuthor) return; setSubmitting(true)
        try {
            const json = await api(`/authors?_id=${deletingAuthor.id}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setAuthorDeleteOpen(false); setDeletingAuthor(null); if (authors.length === 1 && authorPage > 1) setAuthorPage(authorPage - 1); else fetchAuthors() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ═════════════════════════════════════════════════════════
    // RENDER: AUTHORS VIEW
    // ═════════════════════════════════════════════════════════
    if (viewMode === 'authors') {
        return (
            <React.Fragment>
                <SiteHeader title="Blog — Penulis" />
                <div className="flex flex-1 flex-col"><div className="@container/main flex flex-1 flex-col gap-2"><div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}><IconArrowLeft className="size-5" /></Button>
                        <div className="flex-1"><h2 className="text-xl font-semibold">Kelola Penulis</h2><p className="text-sm text-muted-foreground">Tambah, edit, atau hapus penulis blog.</p></div>
                        <Button onClick={openAuthorAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah Penulis</Button>
                    </div>
                    <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari penulis..." value={authorSearchInput} onChange={e => setAuthorSearchInput(e.target.value)} className="pl-9" /></div>
                    <div className="rounded-lg border">
                        <Table><TableHeader><TableRow><TableHead className="w-12">No</TableHead><TableHead>Avatar</TableHead><TableHead>Nama</TableHead><TableHead>Role</TableHead><TableHead className="text-center">Jumlah Post</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {loading ? <TableRow><TableCell colSpan={6} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat...</span></div></TableCell></TableRow>
                                    : authors.length === 0 ? <TableRow><TableCell colSpan={6} className="h-32 text-center"><p className="text-muted-foreground">{authorSearch ? `Tidak ada hasil` : 'Belum ada penulis.'}</p></TableCell></TableRow>
                                        : authors.map((a, i) => {
                                            const offset = authorPagination ? (authorPagination.page - 1) * authorPagination.limit : 0
                                            return (<TableRow key={a.id}>
                                                <TableCell>{offset + i + 1}</TableCell>
                                                <TableCell>{a.avatar ? <img src={a.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{a.name[0]}</div>}</TableCell>
                                                <TableCell className="font-medium">{a.name}</TableCell>
                                                <TableCell>{a.role}</TableCell>
                                                <TableCell className="text-center"><span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{a._count?.posts ?? 0}</span></TableCell>
                                                <TableCell className="text-right"><div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => openAuthorEdit(a)}><IconEdit className="size-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingAuthor(a); setAuthorDeleteOpen(true) }}><IconTrash className="size-4" /></Button>
                                                </div></TableCell>
                                            </TableRow>)
                                        })}
                            </TableBody>
                        </Table>
                    </div>
                    {authorPagination && <PaginationBar pagination={authorPagination} page={authorPage} limit={limit} setPage={setAuthorPage} />}
                </div></div></div>
                {renderAuthorDialogs()}
            </React.Fragment>
        )
    }

    // ═════════════════════════════════════════════════════════
    // RENDER: MANAGEMENT VIEW
    // ═════════════════════════════════════════════════════════
    if (viewMode === 'manage' && selectedPost) {
        const p = selectedPost
        return (
            <React.Fragment>
                <SiteHeader title="Kelola Blog Post" />
                <div className="flex flex-1 flex-col"><div className="@container/main flex flex-1 flex-col gap-2"><div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => { setViewMode('list'); setSelectedPost(null) }}><IconArrowLeft className="size-5" /></Button>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">{p.title}</h2>
                            <p className="text-sm text-muted-foreground">{p.category} · {p.readTime} · {fmtDate(p.date)}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => openPostEdit(p)}><IconEdit className="size-4 mr-1" />Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => { setDeletingId(p.id); setDeleteOpen(true) }}><IconTrash className="size-4 mr-1" />Hapus</Button>
                    </div>

                    {loading ? <div className="flex justify-center py-8"><Spinner className="size-6" /></div> : (
                        <div className="grid gap-4">
                            {/* Info card */}
                            <div className="rounded-lg border p-4 grid sm:grid-cols-3 gap-4">
                                <div><Label className="text-xs text-muted-foreground">Penulis</Label><p className="text-sm font-medium">{p.author?.name || 'Tidak ada'}</p></div>
                                <div><Label className="text-xs text-muted-foreground">Kategori</Label><p className="text-sm font-medium">{p.category}</p></div>
                                <div><Label className="text-xs text-muted-foreground">Gambar</Label>{p.image && <img src={p.image} alt="" className="h-12 rounded object-cover mt-1" />}</div>
                            </div>

                            {/* Content preview */}
                            <div className="rounded-lg border p-4 space-y-2">
                                <h4 className="font-semibold text-sm">Konten ({p.content.length} paragraf)</h4>
                                {p.content.length > 0 ? p.content.map((c, i) => <p key={i} className="text-sm text-muted-foreground line-clamp-2">{c}</p>) : <p className="text-sm text-muted-foreground">Belum ada konten.</p>}
                            </div>

                            {/* Tags */}
                            <div className="rounded-lg border p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">Tag ({p.tags.length})</h4>
                                    <Button size="sm" variant="outline" onClick={openTagAdd}><IconPlus className="size-3 mr-1" />Tambah</Button>
                                </div>
                                {p.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">{p.tags.map(t => (
                                        <span key={t.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                                            {t.tag}
                                            <button onClick={() => openTagEdit(t)} className="hover:text-primary/70 bg-transparent border-none cursor-pointer p-0"><IconEdit className="size-3" /></button>
                                            <button onClick={() => { setDeletingTag(t); setTagDeleteOpen(true) }} className="hover:text-destructive bg-transparent border-none cursor-pointer p-0"><IconX className="size-3" /></button>
                                        </span>
                                    ))}</div>
                                )}
                            </div>

                            {/* Related Posts */}
                            <div className="rounded-lg border p-4 space-y-3">
                                <h4 className="font-semibold text-sm">Post Terkait ({p.relatedFrom.length})</h4>
                                <div className="flex flex-wrap gap-2">{refData.posts.filter(x => x.id !== p.id).map(rp => {
                                    const checked = p.relatedFrom.some(x => x.toPostId === rp.id)
                                    return <label key={rp.id} className="flex items-center gap-1.5 text-sm cursor-pointer"><Checkbox checked={checked} disabled={savingRelated} onCheckedChange={() => {
                                        const ids = checked ? p.relatedFrom.filter(x => x.toPostId !== rp.id).map(x => x.toPostId) : [...p.relatedFrom.map(x => x.toPostId), rp.id]
                                        saveRelated(ids)
                                    }} />{rp.title}</label>
                                })}</div>
                            </div>
                        </div>
                    )}
                </div></div></div>
                {renderAllDialogs()}
            </React.Fragment>
        )
    }

    // ═════════════════════════════════════════════════════════
    // DIALOGS
    // ═════════════════════════════════════════════════════════
    function renderAuthorDialogs() {
        return (<>
            <Dialog open={authorDialogOpen} onOpenChange={o => { if (!o) { setAuthorDialogOpen(false); setEditingAuthor(null) } }}>
                <DialogContent><DialogHeader><DialogTitle>{editingAuthor ? 'Edit Penulis' : 'Tambah Penulis'}</DialogTitle><DialogDescription>Isi data penulis blog.</DialogDescription></DialogHeader>
                    <form onSubmit={authorForm.handleSubmit(onAuthorSubmit)} className="space-y-4">
                        <div className="space-y-2"><Label>Nama</Label><Input {...authorForm.register('name')} />{authorForm.formState.errors.name && <p className="text-sm text-destructive">{authorForm.formState.errors.name.message}</p>}</div>
                        <div className="space-y-2"><Label>Role</Label><Input {...authorForm.register('role')} placeholder="e.g. Editor, Kontributor" />{authorForm.formState.errors.role && <p className="text-sm text-destructive">{authorForm.formState.errors.role.message}</p>}</div>
                        <ImageUploadField value={authorForm.watch('avatar')} onChange={v => authorForm.setValue('avatar', v)} label="Avatar" />
                        <DialogFooter><Button type="button" variant="outline" onClick={() => setAuthorDialogOpen(false)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={authorDeleteOpen} onOpenChange={o => { if (!o) { setAuthorDeleteOpen(false); setDeletingAuthor(null) } }}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Penulis</AlertDialogTitle><AlertDialogDescription>Hapus penulis &quot;{deletingAuthor?.name}&quot;? Post terkait akan kehilangan penulis.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeleteAuthor} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>)
    }

    function renderAllDialogs() {
        return (<>
            {/* Post Form Dialog */}
            <Dialog open={postFormOpen} onOpenChange={o => { if (!o) { setPostFormOpen(false); setEditingPostId(null) } }}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader><DialogTitle>{editingPostId ? 'Edit Blog Post' : 'Tambah Blog Post'}</DialogTitle><DialogDescription>Isi informasi blog post.</DialogDescription></DialogHeader>
                    <form onSubmit={postForm.handleSubmit(onPostSubmit)} className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 space-y-2"><Label>Judul</Label><Input {...postForm.register('title')} />{postForm.formState.errors.title && <p className="text-sm text-destructive">{postForm.formState.errors.title.message}</p>}</div>
                        <div className="space-y-2"><Label>Kategori</Label><Input {...postForm.register('category')} placeholder="e.g. tips, panduan, destinasi" /></div>
                        <div className="space-y-2"><Label>Waktu Baca</Label><Input {...postForm.register('readTime')} placeholder="e.g. 5 menit" /></div>
                        <div className="space-y-2"><Label>Tanggal</Label><Input type="date" {...postForm.register('date')} /></div>
                        <div className="space-y-2"><Label>Penulis</Label>
                            <select {...postForm.register('authorId')} className="flex h-9 w-full rounded-md border px-3 py-1 text-sm">
                                <option value="">Tidak ada</option>
                                {refData.authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2"><ImageUploadField value={postForm.watch('image')} onChange={v => postForm.setValue('image', v)} label="Gambar" />{postForm.formState.errors.image && <p className="text-sm text-destructive">{postForm.formState.errors.image.message}</p>}</div>
                        <div className="sm:col-span-2 space-y-2"><Label>Ringkasan</Label><Textarea rows={2} {...postForm.register('excerpt')} />{postForm.formState.errors.excerpt && <p className="text-sm text-destructive">{postForm.formState.errors.excerpt.message}</p>}</div>
                        <div className="sm:col-span-2 space-y-2"><Label>Konten (paragraf)</Label>
                            <div className="flex flex-col gap-2">{contentParagraphs.map((p, i) => (
                                <div key={i} className="flex gap-2"><Textarea rows={2} value={p} onChange={e => { const n = [...contentParagraphs]; n[i] = e.target.value; setContentParagraphs(n) }} className="flex-1" /><Button type="button" variant="ghost" size="icon" onClick={() => setContentParagraphs(contentParagraphs.filter((_, j) => j !== i))}><IconX className="size-4" /></Button></div>
                            ))}</div>
                            <div className="flex gap-2"><Textarea rows={2} value={newParagraph} onChange={e => setNewParagraph(e.target.value)} placeholder="Tulis paragraf baru..." className="flex-1" /><Button type="button" variant="outline" size="sm" className="self-end" onClick={() => { if (newParagraph.trim()) { setContentParagraphs([...contentParagraphs, newParagraph.trim()]); setNewParagraph('') } }}>Tambah</Button></div>
                        </div>
                        <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setPostFormOpen(false)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{editingPostId ? 'Simpan' : 'Tambah'}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Post */}
            <AlertDialog open={deleteOpen} onOpenChange={o => { if (!o) { setDeleteOpen(false); setDeletingId(null) } }}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Blog Post</AlertDialogTitle><AlertDialogDescription>Semua tag dan relasi juga akan dihapus. Lanjutkan?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeletePost} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Tag Dialog */}
            <Dialog open={tagDialogOpen} onOpenChange={o => { if (!o) { setTagDialogOpen(false); setEditingTag(null) } }}>
                <DialogContent><DialogHeader><DialogTitle>{editingTag ? 'Edit Tag' : 'Tambah Tag'}</DialogTitle></DialogHeader>
                    <form onSubmit={tagForm.handleSubmit(onTagSubmit)} className="space-y-4">
                        <div className="space-y-2"><Label>Tag</Label><Input {...tagForm.register('tag')} />{tagForm.formState.errors.tag && <p className="text-sm text-destructive">{tagForm.formState.errors.tag.message}</p>}</div>
                        <DialogFooter><Button type="button" variant="outline" onClick={() => setTagDialogOpen(false)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Tag */}
            <AlertDialog open={tagDeleteOpen} onOpenChange={o => { if (!o) { setTagDeleteOpen(false); setDeletingTag(null) } }}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Tag</AlertDialogTitle><AlertDialogDescription>Hapus tag &quot;{deletingTag?.tag}&quot;?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeleteTag} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {renderAuthorDialogs()}
        </>)
    }

    // ═════════════════════════════════════════════════════════
    // LIST VIEW (default)
    // ═════════════════════════════════════════════════════════
    return (
        <React.Fragment>
            <SiteHeader title="Blog dan Artikel" />
            <div className="flex flex-1 flex-col"><div className="@container/main flex flex-1 flex-col gap-2"><div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><h2 className="text-xl font-semibold tracking-tight">Daftar Blog Post</h2><p className="text-muted-foreground text-sm">Kelola artikel blog beserta tag, penulis, dan post terkait.</p></div>
                    <div className="flex items-center gap-2">
                        <Select value={String(limit)} onValueChange={v => { setLimit(Number(v) as PageSize); setPage(1) }}><SelectTrigger size="sm" className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent></Select>
                        <Button onClick={() => setViewMode('authors')} size="sm" variant="outline"><IconSettings className="mr-1 size-4" />Penulis</Button>
                        <Button onClick={openPostAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah Post</Button>
                    </div>
                </div>
                <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari blog post..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-9" /></div>
                <div className="rounded-lg border">
                    <Table><TableHeader><TableRow>
                        <TableHead className="w-12">No</TableHead><TableHead>Gambar</TableHead><TableHead>Judul</TableHead><TableHead>Kategori</TableHead><TableHead className="hidden sm:table-cell">Penulis</TableHead><TableHead className="hidden sm:table-cell">Tanggal</TableHead><TableHead className="text-right">Aksi</TableHead>
                    </TableRow></TableHeader>
                        <TableBody>
                            {loading ? <TableRow><TableCell colSpan={7} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat...</span></div></TableCell></TableRow>
                                : posts.length === 0 ? <TableRow><TableCell colSpan={7} className="h-32 text-center"><p className="text-muted-foreground">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada blog post.'}</p></TableCell></TableRow>
                                    : posts.map((p, i) => {
                                        const offset = pagination ? (pagination.page - 1) * pagination.limit : 0
                                        return (<TableRow key={p.id}>
                                            <TableCell>{offset + i + 1}</TableCell>
                                            <TableCell>{p.image ? <img src={p.image} alt="" className="h-10 w-16 rounded object-cover" /> : '-'}</TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                                            <TableCell><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{p.category}</span></TableCell>
                                            <TableCell className="hidden sm:table-cell text-sm">{p.author?.name || '-'}</TableCell>
                                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{fmtDate(p.date)}</TableCell>
                                            <TableCell className="text-right"><div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => fetchDetail(p.id)} title="Kelola"><IconSettings className="size-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingPostId(p.id); setContentParagraphs([]); postForm.reset({ title: p.title, excerpt: p.excerpt, image: p.image, date: p.date?.slice(0, 10), category: p.category, readTime: p.readTime, authorId: p.authorId, content: [] }); setPostFormOpen(true) }} title="Edit"><IconEdit className="size-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingId(p.id); setDeleteOpen(true) }} title="Hapus"><IconTrash className="size-4" /></Button>
                                            </div></TableCell>
                                        </TableRow>)
                                    })}
                        </TableBody>
                    </Table>
                </div>
                {pagination && <PaginationBar pagination={pagination} page={page} limit={limit} setPage={setPage} />}
            </div></div></div>
            {renderAllDialogs()}
        </React.Fragment>
    )
}
