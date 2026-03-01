"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { TestimonialData } from '@/types/TestimonialType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { testimonialSchema } from '@/validation/testimonialSchema'
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
import { IconEdit, IconPlus, IconSearch, IconTrash, IconUpload } from '@tabler/icons-react'

const API_URL = '/api/testimonials'
const IMG_API = '/api/img'

async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData(); fd.append('files', file)
    const res = await fetch(IMG_API, { method: 'POST', body: fd })
    const json = await res.json()
    if (json.status === 'success') return `${IMG_API}?_id=${json.data.id}`
    toast.error(json.message || 'Upload gagal'); return null
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
            {value && <img src={value} alt="" className="h-16 rounded-full border object-cover" />}
        </div>
    )
}

function getPageNumbers(page: number, totalPages: number): (number | 'e')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const p: (number | 'e')[] = [1]
    if (page > 3) p.push('e')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) p.push(i)
    if (page < totalPages - 2) p.push('e')
    p.push(totalPages)
    return p
}

export default function AdminTestimoniComponents() {
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null)
    const [deletingTestimonial, setDeletingTestimonial] = useState<TestimonialData | null>(null)

    const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
        resolver: yupResolver(testimonialSchema),
        defaultValues: { name: '', avatar: '', role: '', text: '', rating: 5 },
    })

    const fetchTestimonials = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set('search', search)
            const res = await fetch(`${API_URL}?${params}`)
            const json = await res.json()
            if (json.status === 'success') { setTestimonials(json.data); setPagination(json.pagination) }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung ke server') }
        finally { setLoading(false) }
    }, [page, limit, search])

    useEffect(() => { fetchTestimonials() }, [fetchTestimonials])
    useEffect(() => { const t = setTimeout(() => { if (searchInput !== search) { setSearch(searchInput); setPage(1) } }, 400); return () => clearTimeout(t) }, [searchInput, search])

    const handleAdd = () => { setEditingTestimonial(null); reset({ name: '', avatar: '', role: '', text: '', rating: 5 }); setFormOpen(true) }
    const handleEdit = (t: TestimonialData) => { setEditingTestimonial(t); reset({ name: t.name, avatar: t.avatar || '', role: t.role, text: t.text, rating: t.rating }); setFormOpen(true) }
    const handleDeleteClick = (t: TestimonialData) => { setDeletingTestimonial(t); setDeleteOpen(true) }

    const onSubmit = async (formData: Record<string, unknown>) => {
        setSubmitting(true)
        try {
            const isEdit = editingTestimonial !== null
            const url = isEdit ? `${API_URL}?_id=${editingTestimonial.id}` : API_URL
            const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
            const json = await res.json()
            if (json.status === 'success') { toast.success(json.message); setFormOpen(false); fetchTestimonials() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const handleDeleteConfirm = async () => {
        if (!deletingTestimonial) return; setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}?_id=${deletingTestimonial.id}`, { method: 'DELETE' })
            const json = await res.json()
            if (json.status === 'success') { toast.success(json.message); setDeleteOpen(false); setDeletingTestimonial(null); if (testimonials.length === 1 && page > 1) setPage(page - 1); else fetchTestimonials() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const fmtDate = (s: string) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0

    const renderStars = (rating: number) => (
        <span className="inline-flex gap-0.5">{[1, 2, 3, 4, 5].map(s => (
            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#D4A843' : '#E5E7EB'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        ))}</span>
    )

    return (
        <React.Fragment>
            <SiteHeader title="Testimoni Pengunjung" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div><h2 className="text-xl font-semibold tracking-tight">Daftar Testimoni</h2><p className="text-muted-foreground text-sm">Kelola testimoni pengunjung yang ditampilkan di halaman utama dan detail tour.</p></div>
                            <div className="flex items-center gap-2">
                                <Select value={String(limit)} onValueChange={v => { setLimit(Number(v) as PageSize); setPage(1) }}><SelectTrigger size="sm" className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent></Select>
                                <Button onClick={handleAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah Testimoni</Button>
                            </div>
                        </div>

                        <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari testimoni..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-9" /></div>

                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader><TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>Avatar</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="hidden md:table-cell">Testimoni</TableHead>
                                    <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow></TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={8} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat data...</span></div></TableCell></TableRow>
                                    ) : testimonials.length === 0 ? (
                                        <TableRow><TableCell colSpan={8} className="h-32 text-center"><p className="text-muted-foreground">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada testimoni.'}</p></TableCell></TableRow>
                                    ) : (
                                        testimonials.map((t, i) => (
                                            <TableRow key={t.id}>
                                                <TableCell>{rowOffset + i + 1}</TableCell>
                                                <TableCell>{t.avatar ? <img src={t.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{t.name[0]}</div>}</TableCell>
                                                <TableCell className="font-medium">{t.name}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{t.role}</TableCell>
                                                <TableCell>{renderStars(t.rating)}</TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[200px] truncate text-sm text-muted-foreground">{t.text}</TableCell>
                                                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{fmtDate(t.createdAt)}</TableCell>
                                                <TableCell className="text-right"><div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(t)} title="Edit"><IconEdit className="size-4" /></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(t)} title="Hapus" className="text-destructive hover:text-destructive"><IconTrash className="size-4" /></Button>
                                                </div></TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {pagination && pagination.totalPages > 0 && (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">Menampilkan {rowOffset + 1}–{Math.min(rowOffset + limit, pagination.total)} dari {pagination.total} data</p>
                                {pagination.totalPages > 1 && (
                                    <Pagination><PaginationContent>
                                        <PaginationItem><PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'} /></PaginationItem>
                                        {getPageNumbers(page, pagination.totalPages).map((p, i) => p === 'e' ? <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem> : <PaginationItem key={p}><PaginationLink isActive={p === page} onClick={() => setPage(p)} className="cursor-pointer">{p}</PaginationLink></PaginationItem>)}
                                        <PaginationItem><PaginationNext onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'} /></PaginationItem>
                                    </PaginationContent></Pagination>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={o => { if (!o) { setFormOpen(false); setEditingTestimonial(null); reset({ name: '', avatar: '', role: '', text: '', rating: 5 }) } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni'}</DialogTitle>
                        <DialogDescription>{editingTestimonial ? 'Perbarui informasi testimoni.' : 'Isi informasi testimoni baru.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Nama</Label><Input {...register('name')} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
                            <div className="space-y-2"><Label>Role / Jabatan</Label><Input {...register('role')} placeholder="e.g. Wisatawan, Fotografer" />{errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}</div>
                        </div>
                        <div className="space-y-2">
                            <Label>Rating (1-5)</Label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} type="button" onClick={() => setValue('rating', s)} className="bg-transparent border-none cursor-pointer p-0.5">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill={s <= (watch('rating') || 0) ? '#D4A843' : '#E5E7EB'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">{watch('rating')} / 5</span>
                            </div>
                            {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
                        </div>
                        <ImageUploadField value={watch('avatar')} onChange={v => setValue('avatar', v)} label="Avatar" />
                        <div className="space-y-2"><Label>Teks Testimoni</Label><Textarea rows={4} {...register('text')} placeholder="Pengalaman wisata yang menyenangkan..." />{errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}</div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Batal</Button>
                            <Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{editingTestimonial ? 'Simpan Perubahan' : 'Tambah Testimoni'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={o => { if (!o) { setDeleteOpen(false); setDeletingTestimonial(null) } }}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Hapus Testimoni</AlertDialogTitle><AlertDialogDescription>Apakah Anda yakin ingin menghapus testimoni dari <strong>&quot;{deletingTestimonial?.name}&quot;</strong>?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={handleDeleteConfirm} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    )
}
