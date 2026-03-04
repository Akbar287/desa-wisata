"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { LandingPageStatisticData, LandingPageWithUsData } from '@/types/LandingPageType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { landingPageStatisticSchema, landingPageWithUsSchema } from '@/validation/landingPageSchema'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { IconEdit, IconPlus, IconSearch, IconTrash, IconUpload } from '@tabler/icons-react'

const STAT_API = '/api/landing-page-statistics'
const WITHUS_API = '/api/landing-page-with-us'
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
            {value && <img src={value} alt="" className="h-16 rounded border object-cover" />}
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

const fmtDate = (s: string) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

/* ─────────────────────── Statistik Tab ─────────────────────── */

function StatistikTab() {
    const [items, setItems] = useState<LandingPageStatisticData[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editing, setEditing] = useState<LandingPageStatisticData | null>(null)
    const [deleting, setDeleting] = useState<LandingPageStatisticData | null>(null)

    const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
        resolver: yupResolver(landingPageStatisticSchema),
        defaultValues: { title: '', count: 0, image: '', order: 0 },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set('search', search)
            const res = await fetch(`${STAT_API}?${params}`)
            const json = await res.json()
            if (json.status === 'success') { setItems(json.data); setPagination(json.pagination) }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung ke server') }
        finally { setLoading(false) }
    }, [page, limit, search])

    useEffect(() => { fetchData() }, [fetchData])
    useEffect(() => { const t = setTimeout(() => { if (searchInput !== search) { setSearch(searchInput); setPage(1) } }, 400); return () => clearTimeout(t) }, [searchInput, search])

    const handleAdd = () => { setEditing(null); reset({ title: '', count: 0, image: '', order: 0 }); setFormOpen(true) }
    const handleEdit = (t: LandingPageStatisticData) => { setEditing(t); reset({ title: t.title, count: t.count, image: t.image || '', order: t.order }); setFormOpen(true) }
    const handleDeleteClick = (t: LandingPageStatisticData) => { setDeleting(t); setDeleteOpen(true) }

    const onSubmit = async (formData: Record<string, unknown>) => {
        setSubmitting(true)
        try {
            const isEdit = editing !== null
            const url = isEdit ? `${STAT_API}?_id=${editing.id}` : STAT_API
            const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
            const json = await res.json()
            if (json.status === 'success') { toast.success(json.message); setFormOpen(false); fetchData() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const handleDeleteConfirm = async () => {
        if (!deleting) return; setSubmitting(true)
        try {
            const res = await fetch(`${STAT_API}?_id=${deleting.id}`, { method: 'DELETE' })
            const json = await res.json()
            if (json.status === 'success') { toast.success(json.message); setDeleteOpen(false); setDeleting(null); if (items.length === 1 && page > 1) setPage(page - 1); else fetchData() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0

    return (
        <React.Fragment>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-xl font-semibold tracking-tight">Daftar Statistik</h2><p className="text-muted-foreground text-sm">Kelola statistik yang ditampilkan di landing page.</p></div>
                <div className="flex items-center gap-2">
                    <Select value={String(limit)} onValueChange={v => { setLimit(Number(v) as PageSize); setPage(1) }}><SelectTrigger size="sm" className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent></Select>
                    <Button onClick={handleAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah Statistik</Button>
                </div>
            </div>

            <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari statistik..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-9" /></div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader><TableRow>
                        <TableHead className="w-12">No</TableHead>
                        <TableHead>Gambar</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Urutan</TableHead>
                        <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat data...</span></div></TableCell></TableRow>
                        ) : items.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="h-32 text-center"><p className="text-muted-foreground">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data statistik.'}</p></TableCell></TableRow>
                        ) : (
                            items.map((t, i) => (
                                <TableRow key={t.id}>
                                    <TableCell>{rowOffset + i + 1}</TableCell>
                                    <TableCell>{t.image ? <img src={t.image} alt="" className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold">—</div>}</TableCell>
                                    <TableCell className="font-medium">{t.title}</TableCell>
                                    <TableCell>{t.count.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{t.order}</TableCell>
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

            {/* Add / Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={o => { if (!o) { setFormOpen(false); setEditing(null); reset({ title: '', count: 0, image: '', order: 0 }) } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Statistik' : 'Tambah Statistik'}</DialogTitle>
                        <DialogDescription>{editing ? 'Perbarui informasi statistik.' : 'Isi informasi statistik baru.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2"><Label>Judul</Label><Input {...register('title')} placeholder="e.g. Desa Wisata" />{errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Jumlah</Label><Input type="number" {...register('count')} />{errors.count && <p className="text-sm text-destructive">{errors.count.message}</p>}</div>
                            <div className="space-y-2"><Label>Urutan</Label><Input type="number" {...register('order')} />{errors.order && <p className="text-sm text-destructive">{errors.order.message}</p>}</div>
                        </div>
                        <ImageUploadField value={watch('image')} onChange={v => setValue('image', v)} label="Gambar" />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Batal</Button>
                            <Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{editing ? 'Simpan Perubahan' : 'Tambah Statistik'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={o => { if (!o) { setDeleteOpen(false); setDeleting(null) } }}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Hapus Statistik</AlertDialogTitle><AlertDialogDescription>Apakah Anda yakin ingin menghapus statistik <strong>&quot;{deleting?.title}&quot;</strong>?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={handleDeleteConfirm} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    )
}

/* ─────────────────────── With Us Tab ─────────────────────── */

function WithUsTab() {
    const [items, setItems] = useState<LandingPageWithUsData[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editing, setEditing] = useState<LandingPageWithUsData | null>(null)
    const [deleting, setDeleting] = useState<LandingPageWithUsData | null>(null)

    const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
        resolver: yupResolver(landingPageWithUsSchema),
        defaultValues: { title: '', subtitle: '', image: '', order: 0 },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set('search', search)
            const res = await fetch(`${WITHUS_API}?${params}`)
            const json = await res.json()
            if (json.status === 'success') { setItems(json.data); setPagination(json.pagination) }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung ke server') }
        finally { setLoading(false) }
    }, [page, limit, search])

    useEffect(() => { fetchData() }, [fetchData])
    useEffect(() => { const t = setTimeout(() => { if (searchInput !== search) { setSearch(searchInput); setPage(1) } }, 400); return () => clearTimeout(t) }, [searchInput, search])

    const handleAdd = () => { setEditing(null); reset({ title: '', subtitle: '', image: '', order: 0 }); setFormOpen(true) }
    const handleEdit = (t: LandingPageWithUsData) => { setEditing(t); reset({ title: t.title, subtitle: t.subtitle, image: t.image || '', order: t.order }); setFormOpen(true) }
    const handleDeleteClick = (t: LandingPageWithUsData) => { setDeleting(t); setDeleteOpen(true) }

    const onSubmit = async (formData: Record<string, unknown>) => {
        setSubmitting(true)
        try {
            const isEdit = editing !== null
            const url = isEdit ? `${WITHUS_API}?_id=${editing.id}` : WITHUS_API
            const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
            const json = await res.json()
            if (json.status === 'success') { toast.success(json.message); setFormOpen(false); fetchData() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const handleDeleteConfirm = async () => {
        if (!deleting) return; setSubmitting(true)
        try {
            const res = await fetch(`${WITHUS_API}?_id=${deleting.id}`, { method: 'DELETE' })
            const json = await res.json()
            if (json.status === 'success') { toast.success(json.message); setDeleteOpen(false); setDeleting(null); if (items.length === 1 && page > 1) setPage(page - 1); else fetchData() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0

    return (
        <React.Fragment>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-xl font-semibold tracking-tight">Daftar With Us</h2><p className="text-muted-foreground text-sm">Kelola konten &ldquo;With Us&rdquo; yang ditampilkan di landing page.</p></div>
                <div className="flex items-center gap-2">
                    <Select value={String(limit)} onValueChange={v => { setLimit(Number(v) as PageSize); setPage(1) }}><SelectTrigger size="sm" className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent></Select>
                    <Button onClick={handleAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah With Us</Button>
                </div>
            </div>

            <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari with us..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-9" /></div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader><TableRow>
                        <TableHead className="w-12">No</TableHead>
                        <TableHead>Gambar</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Subtitle</TableHead>
                        <TableHead>Urutan</TableHead>
                        <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat data...</span></div></TableCell></TableRow>
                        ) : items.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="h-32 text-center"><p className="text-muted-foreground">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data with us.'}</p></TableCell></TableRow>
                        ) : (
                            items.map((t, i) => (
                                <TableRow key={t.id}>
                                    <TableCell>{rowOffset + i + 1}</TableCell>
                                    <TableCell>{t.image ? <img src={t.image} alt="" className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold">—</div>}</TableCell>
                                    <TableCell className="font-medium">{t.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{t.subtitle}</TableCell>
                                    <TableCell>{t.order}</TableCell>
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

            {/* Add / Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={o => { if (!o) { setFormOpen(false); setEditing(null); reset({ title: '', subtitle: '', image: '', order: 0 }) } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit With Us' : 'Tambah With Us'}</DialogTitle>
                        <DialogDescription>{editing ? 'Perbarui informasi with us.' : 'Isi informasi with us baru.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2"><Label>Judul</Label><Input {...register('title')} placeholder="e.g. Pengalaman Unik" />{errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}</div>
                        <div className="space-y-2"><Label>Subtitle</Label><Input {...register('subtitle')} placeholder="e.g. Temukan petualangan baru" />{errors.subtitle && <p className="text-sm text-destructive">{errors.subtitle.message}</p>}</div>
                        <div className="space-y-2"><Label>Urutan</Label><Input type="number" {...register('order')} />{errors.order && <p className="text-sm text-destructive">{errors.order.message}</p>}</div>
                        <ImageUploadField value={watch('image')} onChange={v => setValue('image', v)} label="Gambar" />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Batal</Button>
                            <Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{editing ? 'Simpan Perubahan' : 'Tambah With Us'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={o => { if (!o) { setDeleteOpen(false); setDeleting(null) } }}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Hapus With Us</AlertDialogTitle><AlertDialogDescription>Apakah Anda yakin ingin menghapus data <strong>&quot;{deleting?.title}&quot;</strong>?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={handleDeleteConfirm} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    )
}

/* ─────────────────────── Main Component ─────────────────────── */

export default function AdminLandingPageComponents() {
    return (
        <React.Fragment>
            <SiteHeader title="Landing Page" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <Tabs defaultValue="statistik">
                            <TabsList>
                                <TabsTrigger value="statistik">Statistik</TabsTrigger>
                                <TabsTrigger value="withus">With Us</TabsTrigger>
                            </TabsList>
                            <TabsContent value="statistik" className="flex flex-col gap-4">
                                <StatistikTab />
                            </TabsContent>
                            <TabsContent value="withus" className="flex flex-col gap-4">
                                <WithUsTab />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
