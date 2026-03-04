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
import { IconEdit, IconPlus, IconSearch, IconTrash, IconUpload, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { fmt } from '@/lib/utils'

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

type BookingItem = {
    id: number; firstName: string; lastName: string; email: string; status: string;
    startDate: string; totalPrice: number; adults: number; children: number; createdAt: string;
    tour: { title: string };
}

function BookingSelector({ value, onChange, error }: { value: number; onChange: (id: number) => void; error?: string }) {
    const [open, setOpen] = useState(false)
    const [bookings, setBookings] = useState<BookingItem[]>([])
    const [bkLoading, setBkLoading] = useState(false)
    const [bkSearch, setBkSearch] = useState('')
    const [bkSearchInput, setBkSearchInput] = useState('')
    const [bkPage, setBkPage] = useState(1)
    const [bkPagination, setBkPagination] = useState<PaginationMeta | null>(null)
    const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)

    const fetchBookings = useCallback(async () => {
        setBkLoading(true)
        try {
            const params = new URLSearchParams({ page: String(bkPage), limit: '5' })
            if (bkSearch) params.set('search', bkSearch)
            const res = await fetch(`/api/bookings?${params}`)
            const json = await res.json()
            if (json.status === 'success') { setBookings(json.data); setBkPagination(json.pagination) }
        } catch { /* ignore */ }
        finally { setBkLoading(false) }
    }, [bkPage, bkSearch])

    useEffect(() => { if (open) fetchBookings() }, [open, fetchBookings])
    useEffect(() => { const t = setTimeout(() => { if (bkSearchInput !== bkSearch) { setBkSearch(bkSearchInput); setBkPage(1) } }, 400); return () => clearTimeout(t) }, [bkSearchInput, bkSearch])

    // Fetch selected booking info when value is set but selectedBooking is not loaded
    useEffect(() => {
        if (value > 0 && (!selectedBooking || selectedBooking.id !== value)) {
            fetch(`/api/bookings?search=&page=1&limit=1`).then(() => {
                // try to find from current list
                const found = bookings.find(b => b.id === value)
                if (found) setSelectedBooking(found)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const statusLabel: Record<string, string> = { PENDING: 'Pending', CONFIRMED: 'Terkonfirmasi', CANCELLED: 'Dibatalkan', COMPLETED: 'Selesai' }
    const statusColor: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800', COMPLETED: 'bg-blue-100 text-blue-800' }
    const fmtD = (s: string) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
        <div className="space-y-2">
            <Label>Booking <span className="text-destructive">*</span></Label>
            {value > 0 && selectedBooking ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/40">
                    <div className="text-sm">
                        <span className="font-semibold">#{selectedBooking.id}</span>{' — '}
                        <span>{selectedBooking.firstName} {selectedBooking.lastName}</span>{' — '}
                        <span className="text-muted-foreground">{selectedBooking.tour.title}</span>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>Ganti</Button>
                </div>
            ) : value > 0 ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/40">
                    <span className="text-sm">Booking ID: <span className="font-semibold">#{value}</span></span>
                    <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>Ganti</Button>
                </div>
            ) : (
                <Button type="button" variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => setOpen(true)}>
                    <IconSearch className="mr-2 size-4" />Pilih Booking...
                </Button>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Pilih Booking</DialogTitle>
                        <DialogDescription>Cari dan pilih booking untuk testimoni ini.</DialogDescription>
                    </DialogHeader>
                    <div className="relative mb-3">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input placeholder="Cari nama atau email..." value={bkSearchInput} onChange={e => setBkSearchInput(e.target.value)} className="pl-9" />
                    </div>
                    <div className="flex-1 overflow-auto border rounded-lg">
                        {bkLoading ? (
                            <div className="flex items-center justify-center h-32 gap-2"><Spinner className="size-5" /><span className="text-muted-foreground text-sm">Memuat...</span></div>
                        ) : bookings.length === 0 ? (
                            <div className="flex items-center justify-center h-32"><p className="text-muted-foreground text-sm">Tidak ada booking ditemukan.</p></div>
                        ) : (
                            <div className="divide-y">
                                {bookings.map(b => (
                                    <button
                                        key={b.id}
                                        type="button"
                                        onClick={() => { onChange(b.id); setSelectedBooking(b); setOpen(false) }}
                                        className={`w-full text-left p-3 hover:bg-muted/50 transition-colors flex items-center justify-between gap-3 ${b.id === value ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-semibold">#{b.id}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[b.status] || 'bg-gray-100'}`}>{statusLabel[b.status] || b.status}</span>
                                            </div>
                                            <div className="text-sm">{b.firstName} {b.lastName} <span className="text-muted-foreground">• {b.email}</span></div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{b.tour.title} • {fmtD(b.startDate)} • {fmt(b.totalPrice)}</div>
                                        </div>
                                        {b.id === value && (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {bkPagination && bkPagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2 text-sm">
                            <span className="text-muted-foreground">Hal {bkPagination.page}/{bkPagination.totalPages} ({bkPagination.total} booking)</span>
                            <div className="flex gap-1">
                                <Button type="button" variant="outline" size="icon" className="size-8" disabled={!bkPagination.hasPrevPage} onClick={() => setBkPage(p => p - 1)}><IconChevronLeft className="size-4" /></Button>
                                <Button type="button" variant="outline" size="icon" className="size-8" disabled={!bkPagination.hasNextPage} onClick={() => setBkPage(p => p + 1)}><IconChevronRight className="size-4" /></Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
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
        defaultValues: { name: '', avatar: '', role: '', text: '', rating: 5, bookingId: 0 },
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

    const handleAdd = () => { setEditingTestimonial(null); reset({ name: '', avatar: '', role: '', text: '', rating: 5, bookingId: 0 }); setFormOpen(true) }
    const handleEdit = (t: TestimonialData) => { setEditingTestimonial(t); reset({ name: t.name, avatar: t.avatar || '', role: t.role, text: t.text, rating: t.rating, bookingId: t.bookingId || 0 }); setFormOpen(true) }
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
            <Dialog open={formOpen} onOpenChange={o => { if (!o) { setFormOpen(false); setEditingTestimonial(null); reset({ name: '', avatar: '', role: '', text: '', rating: 5, bookingId: 0 }) } }}>
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
                        <BookingSelector value={watch('bookingId') || 0} onChange={v => setValue('bookingId', v)} error={errors.bookingId?.message} />
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
