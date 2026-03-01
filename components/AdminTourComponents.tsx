"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { AdminTourListItem, AdminTourDetail, ThemeOption, DestinationOption, TourOption } from '@/types/AdminTourType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { tourBasicSchema, highlightSchema, gallerySchema, itinerarySchema, textItemSchema, dateSchema, reviewSchema, goodToKnowSchema, specialPackageSchema, privatePackageSchema } from '@/validation/tourAdminSchema'
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

const API = '/api/tours/admin'
const IMG_API = '/api/img'

// ─── Helpers ────────────────────────────────────────────────
async function api(path: string, opts?: RequestInit) {
    const res = await fetch(`${API}${path}`, opts)
    return res.json()
}
async function apiJson(path: string, method: string, body: unknown) {
    return api(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}
async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData(); fd.append('files', file)
    const res = await fetch(IMG_API, { method: 'POST', body: fd })
    const json = await res.json()
    if (json.status === 'success') return `${IMG_API}?_id=${json.data.id}`
    toast.error(json.message || 'Upload gagal'); return null
}
const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
const fmtDate = (s: string) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
const statusLabels: Record<string, string> = { AVAILABLE: 'Tersedia', ALMOST_FULL: 'Hampir Penuh', FULL: 'Penuh', CLOSED: 'Ditutup' }

function getPageNumbers(page: number, totalPages: number): (number | 'e')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const p: (number | 'e')[] = [1]
    if (page > 3) p.push('e')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) p.push(i)
    if (page < totalPages - 2) p.push('e')
    p.push(totalPages)
    return p
}

// ─── Image Upload Button Component ─────────────────────────
function ImageUploadField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
    const [uploading, setUploading] = useState(false)
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return
        setUploading(true)
        const url = await uploadImage(file)
        if (url) onChange(url)
        setUploading(false)
    }
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
                <Input value={value} onChange={e => onChange(e.target.value)} placeholder="URL gambar atau upload..." className="flex-1" />
                <Button type="button" variant="outline" size="sm" className="relative" disabled={uploading}>
                    {uploading ? <Spinner className="size-4" /> : <IconUpload className="size-4" />}
                    <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                </Button>
            </div>
            {value && <img src={value} alt="" className="h-16 rounded border object-cover" />}
        </div>
    )
}

// ─── Reusable PaginationBar Component ───────────────────────
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
export default function AdminTourComponents() {
    // ─── List State ─────────────────────────────────────────
    const [tours, setTours] = useState<AdminTourListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    // ─── Management State ───────────────────────────────────
    const [selectedTour, setSelectedTour] = useState<AdminTourDetail | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'manage'>('list')
    const [refData, setRefData] = useState<{ themes: ThemeOption[]; destinations: DestinationOption[]; tours: TourOption[] }>({ themes: [], destinations: [], tours: [] })

    // ─── Dialog States ──────────────────────────────────────
    const [tourFormOpen, setTourFormOpen] = useState(false)
    const [editingTourId, setEditingTourId] = useState<number | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Sub-resource dialog states
    const [subDialog, setSubDialog] = useState<{ type: string; mode: 'add' | 'edit'; data?: Record<string, unknown> } | null>(null)
    const [subDeleteDialog, setSubDeleteDialog] = useState<{ type: string; id: number; label: string } | null>(null)

    // ─── Fetch Tour List ────────────────────────────────────
    const fetchTours = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set('search', search)
            const json = await api(`/?${params}`)
            if (json.status === 'success') { setTours(json.data); setPagination(json.pagination) }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung ke server') }
        finally { setLoading(false) }
    }, [page, limit, search])

    useEffect(() => { fetchTours() }, [fetchTours])
    useEffect(() => {
        const t = setTimeout(() => { if (searchInput !== search) { setSearch(searchInput); setPage(1) } }, 400)
        return () => clearTimeout(t)
    }, [searchInput, search])

    // ─── Fetch Tour Detail ──────────────────────────────────
    const fetchDetail = useCallback(async (id: number) => {
        setLoading(true)
        try {
            const json = await api(`/detail?_id=${id}`)
            if (json.status === 'success') { setSelectedTour(json.data); setViewMode('manage') }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung') }
        finally { setLoading(false) }
    }, [])

    const refreshDetail = () => { if (selectedTour) fetchDetail(selectedTour.id) }

    // ─── Fetch Ref Data ─────────────────────────────────────
    useEffect(() => {
        api('/ref').then(json => { if (json.status === 'success') setRefData(json.data) })
    }, [])

    // ─── Tour Form ──────────────────────────────────────────
    const tourForm = useForm({ resolver: yupResolver(tourBasicSchema), defaultValues: { title: '', type: 'GRUP' as const, durationDays: 1, price: 0, image: '', heroImage: '', overview: '', groupSize: '', rating: 0, reviewCount: 0 } })

    const openTourAdd = () => { setEditingTourId(null); tourForm.reset({ title: '', type: 'GRUP', durationDays: 1, price: 0, image: '', heroImage: '', overview: '', groupSize: '', rating: 0, reviewCount: 0 }); setTourFormOpen(true) }
    const openTourEdit = (t: AdminTourDetail) => { setEditingTourId(t.id); tourForm.reset({ title: t.title, type: t.type, durationDays: t.durationDays, price: t.price, image: t.image, heroImage: t.heroImage || '', overview: t.overview || '', groupSize: t.groupSize || '', rating: t.rating, reviewCount: t.reviewCount }); setTourFormOpen(true) }

    const onTourSubmit = async (data: Record<string, unknown>) => {
        setSubmitting(true)
        try {
            const json = editingTourId ? await apiJson(`/?_id=${editingTourId}`, 'PUT', data) : await apiJson('/', 'POST', data)
            if (json.status === 'success') { toast.success(json.message); setTourFormOpen(false); fetchTours(); if (editingTourId && selectedTour) refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Delete Tour ────────────────────────────────────────
    const confirmDeleteTour = async () => {
        if (!deletingId) return; setSubmitting(true)
        try {
            const json = await api(`/?_id=${deletingId}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setDeleteOpen(false); setDeletingId(null); if (viewMode === 'manage') { setViewMode('list'); setSelectedTour(null) }; fetchTours() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Sub-resource CRUD ──────────────────────────────────
    const highlightForm = useForm({ resolver: yupResolver(highlightSchema), defaultValues: { text: '', order: 0 } })
    const galleryForm = useForm({ resolver: yupResolver(gallerySchema), defaultValues: { image: '', order: 0 } })
    const itineraryForm = useForm({ resolver: yupResolver(itinerarySchema), defaultValues: { day: 1, title: '', description: '', distance: '', meals: [] as string[] } })
    const textItemForm = useForm({ resolver: yupResolver(textItemSchema), defaultValues: { text: '', order: 0 } })
    const dateForm = useForm({ resolver: yupResolver(dateSchema), defaultValues: { startDate: '', endDate: '', status: 'AVAILABLE' as const, price: 0 } })
    const reviewForm = useForm({ resolver: yupResolver(reviewSchema), defaultValues: { name: '', avatar: '', rating: 5, date: '', text: '', location: '' } })
    const goodToKnowForm = useForm({ resolver: yupResolver(goodToKnowSchema), defaultValues: { title: '', text: '', order: 0 } })
    const specialPkgForm = useForm({ resolver: yupResolver(specialPackageSchema), defaultValues: { subtitle: '', originalPrice: 0, discount: 0, badge: '', badgeEmoji: '', gradient: '', groupSize: '', season: '', dateRange: '', limitedSlots: 1 } })
    const privatePkgForm = useForm({ resolver: yupResolver(privatePackageSchema), defaultValues: { tagline: '', maxGuests: 1, priceNote: '', tier: 'GOLD' as const, includes: [] as string[] } })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formMap: Record<string, any> = { highlights: highlightForm, gallery: galleryForm, itinerary: itineraryForm, inclusions: textItemForm, exclusions: textItemForm, dates: dateForm, reviews: reviewForm, 'good-to-know': goodToKnowForm, 'special-package': specialPkgForm, 'private-package': privatePkgForm }

    const openSubAdd = (type: string) => {
        const f = formMap[type]; if (f) f.reset()
        setSubDialog({ type, mode: 'add' })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openSubEdit = (type: string, data: any) => {
        const f = formMap[type]
        if (f) {
            if (type === 'itinerary') f.reset({ ...data, meals: data.meals?.map((m: { meal: string }) => m.meal) || [], distance: data.distance || '' })
            else if (type === 'dates') f.reset({ ...data, startDate: data.startDate?.slice(0, 10), endDate: data.endDate?.slice(0, 10) })
            else if (type === 'reviews') f.reset({ ...data, date: data.date?.slice(0, 10), avatar: data.avatar || '', location: data.location || '' })
            else if (type === 'private-package') f.reset({ ...data, includes: data.includes?.map((i: { text: string }) => i.text) || [] })
            else f.reset(data)
        }
        setSubDialog({ type, mode: 'edit', data })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubSubmit = async (type: string, formData: any) => {
        if (!selectedTour) return; setSubmitting(true)
        try {
            const isEdit = subDialog?.mode === 'edit'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const editId = (subDialog?.data as any)?.id
            const body = { ...formData, tourId: selectedTour.id }
            const json = isEdit ? await apiJson(`/${type}?_id=${editId}`, 'PUT', body) : await apiJson(`/${type}`, 'POST', body)
            if (json.status === 'success') { toast.success(json.message); setSubDialog(null); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const confirmSubDelete = async () => {
        if (!subDeleteDialog) return; setSubmitting(true)
        try {
            const { type, id } = subDeleteDialog
            const param = (type === 'special-package' || type === 'private-package') ? `tourId=${selectedTour?.id}` : `_id=${id}`
            const json = await api(`/${type}?${param}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setSubDeleteDialog(null); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Themes & Destinations ──────────────────────────────
    const [savingJunction, setSavingJunction] = useState(false)
    const saveThemes = async (themeIds: number[]) => {
        setSavingJunction(true)
        try {
            const json = await apiJson('/themes', 'POST', { tourId: selectedTour?.id, themeIds })
            if (json.status === 'success') { toast.success(json.message); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSavingJunction(false) }
    }
    const saveDestinations = async (destinationIds: number[]) => {
        setSavingJunction(true)
        try {
            const json = await apiJson('/destinations', 'POST', { tourId: selectedTour?.id, destinationIds })
            if (json.status === 'success') { toast.success(json.message); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSavingJunction(false) }
    }
    const saveRelated = async (ids: number[]) => {
        setSavingJunction(true)
        try {
            const json = await apiJson('/related', 'POST', { tourId: selectedTour?.id, relatedTourIds: ids })
            if (json.status === 'success') { toast.success(json.message); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSavingJunction(false) }
    }

    // ─── Private Package includes state ─────────────────────
    const [ppIncludes, setPpIncludes] = useState<string[]>([])
    const [ppNewInclude, setPpNewInclude] = useState('')

    // ═════════════════════════════════════════════════════════
    // RENDER
    // ═════════════════════════════════════════════════════════

    // ─── RENDER: Sub-resource section helper ────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderSection = (title: string, type: string, items: any[], columns: { key: string; label: string; render?: (v: any, item: any) => React.ReactNode }[]) => (
        <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{title} ({items.length})</h4>
                <Button size="sm" variant="outline" onClick={() => openSubAdd(type)}><IconPlus className="size-3 mr-1" />Tambah</Button>
            </div>
            {items.length > 0 && (
                <Table><TableHeader><TableRow>{columns.map(c => <TableHead key={c.key}>{c.label}</TableHead>)}<TableHead className="text-right w-20">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>{items.map((item, idx) => (
                        <TableRow key={item.id || idx}>{columns.map(c => <TableCell key={c.key}>{c.render ? c.render(item[c.key], item) : String(item[c.key] ?? '')}</TableCell>)}
                            <TableCell className="text-right"><div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openSubEdit(type, item)}><IconEdit className="size-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setSubDeleteDialog({ type, id: item.id, label: item.text || item.title || item.name || `#${item.id}` })}><IconTrash className="size-4" /></Button>
                            </div></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table>
            )}
        </div>
    )

    if (viewMode === 'manage' && selectedTour) {
        // ═══════════════════════════════════════════════════════
        // MANAGEMENT VIEW
        // ═══════════════════════════════════════════════════════
        const t = selectedTour
        return (
            <React.Fragment>
                <SiteHeader title="Kelola Paket Wisata" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Back + Header */}
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" onClick={() => { setViewMode('list'); setSelectedTour(null) }}><IconArrowLeft className="size-5" /></Button>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">{t.title}</h2>
                                    <p className="text-sm text-muted-foreground">{t.type} · {t.durationDays} hari · {fmt(t.price)}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => openTourEdit(t)}><IconEdit className="size-4 mr-1" />Edit Info</Button>
                                <Button size="sm" variant="destructive" onClick={() => { setDeletingId(t.id); setDeleteOpen(true) }}><IconTrash className="size-4 mr-1" />Hapus</Button>
                            </div>

                            {loading ? <div className="flex justify-center py-8"><Spinner className="size-6" /></div> : (
                                <div className="grid gap-4">
                                    {/* Themes */}
                                    <div className="rounded-lg border p-4 space-y-3">
                                        <h4 className="font-semibold text-sm">Tema ({t.themes.length})</h4>
                                        <div className="flex flex-wrap gap-2">{refData.themes.map(th => {
                                            const checked = t.themes.some(x => x.themeId === th.id)
                                            return <label key={th.id} className="flex items-center gap-1.5 text-sm cursor-pointer"><Checkbox checked={checked} disabled={savingJunction} onCheckedChange={() => {
                                                const ids = checked ? t.themes.filter(x => x.themeId !== th.id).map(x => x.themeId) : [...t.themes.map(x => x.themeId), th.id]
                                                saveThemes(ids)
                                            }} />{th.name}</label>
                                        })}</div>
                                    </div>

                                    {/* Destinations */}
                                    <div className="rounded-lg border p-4 space-y-3">
                                        <h4 className="font-semibold text-sm">Destinasi ({t.destinations.length})</h4>
                                        <div className="flex flex-wrap gap-2">{refData.destinations.map(d => {
                                            const checked = t.destinations.some(x => x.destinationId === d.id)
                                            return <label key={d.id} className="flex items-center gap-1.5 text-sm cursor-pointer"><Checkbox checked={checked} disabled={savingJunction} onCheckedChange={() => {
                                                const ids = checked ? t.destinations.filter(x => x.destinationId !== d.id).map(x => x.destinationId) : [...t.destinations.map(x => x.destinationId), d.id]
                                                saveDestinations(ids)
                                            }} />{d.name}</label>
                                        })}</div>
                                    </div>

                                    {/* Highlights */}
                                    {renderSection('Sorotan', 'highlights', t.highlights, [{ key: 'text', label: 'Teks' }, { key: 'order', label: 'Urutan' }])}

                                    {/* Gallery */}
                                    {renderSection('Galeri', 'gallery', t.gallery, [
                                        { key: 'image', label: 'Gambar', render: (v: string) => v ? <img src={v} alt="" className="h-10 rounded object-cover" /> : '-' },
                                        { key: 'order', label: 'Urutan' },
                                    ])}

                                    {/* Itinerary */}
                                    {renderSection('Itinerari', 'itinerary', t.itinerary, [
                                        { key: 'day', label: 'Hari' }, { key: 'title', label: 'Judul' },
                                        { key: 'meals', label: 'Makan', render: (_: unknown, item: { meals: { meal: string }[] }) => item.meals?.map(m => m.meal).join(', ') || '-' },
                                    ])}

                                    {/* Inclusions */}
                                    {renderSection('Yang Termasuk', 'inclusions', t.included, [{ key: 'text', label: 'Teks' }, { key: 'order', label: 'Urutan' }])}

                                    {/* Exclusions */}
                                    {renderSection('Yang Tidak Termasuk', 'exclusions', t.excluded, [{ key: 'text', label: 'Teks' }, { key: 'order', label: 'Urutan' }])}

                                    {/* Dates */}
                                    {renderSection('Jadwal & Harga', 'dates', t.dates, [
                                        { key: 'startDate', label: 'Mulai', render: (v: string) => fmtDate(v) },
                                        { key: 'endDate', label: 'Selesai', render: (v: string) => fmtDate(v) },
                                        { key: 'status', label: 'Status', render: (v: string) => statusLabels[v] || v },
                                        { key: 'price', label: 'Harga', render: (v: number) => fmt(v) },
                                    ])}

                                    {/* Reviews */}
                                    {renderSection('Ulasan', 'reviews', t.reviews, [
                                        { key: 'name', label: 'Nama' }, { key: 'rating', label: 'Rating' },
                                        { key: 'date', label: 'Tanggal', render: (v: string) => fmtDate(v) },
                                    ])}

                                    {/* Good To Know */}
                                    {renderSection('Info Penting', 'good-to-know', t.goodToKnow, [{ key: 'title', label: 'Judul' }, { key: 'order', label: 'Urutan' }])}

                                    {/* Related Tours */}
                                    <div className="rounded-lg border p-4 space-y-3">
                                        <h4 className="font-semibold text-sm">Tour Terkait ({t.relatedFrom.length})</h4>
                                        <div className="flex flex-wrap gap-2">{refData.tours.filter(x => x.id !== t.id).map(rt => {
                                            const checked = t.relatedFrom.some(x => x.toTourId === rt.id)
                                            return <label key={rt.id} className="flex items-center gap-1.5 text-sm cursor-pointer"><Checkbox checked={checked} disabled={savingJunction} onCheckedChange={() => {
                                                const ids = checked ? t.relatedFrom.filter(x => x.toTourId !== rt.id).map(x => x.toTourId) : [...t.relatedFrom.map(x => x.toTourId), rt.id]
                                                saveRelated(ids)
                                            }} />{rt.title}</label>
                                        })}</div>
                                    </div>

                                    {/* Special Package */}
                                    <div className="rounded-lg border p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm">Paket Spesial</h4>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="outline" onClick={() => { if (t.specialPkg) openSubEdit('special-package', t.specialPkg); else openSubAdd('special-package') }}>
                                                    <IconSettings className="size-3 mr-1" />{t.specialPkg ? 'Edit' : 'Tambah'}
                                                </Button>
                                                {t.specialPkg && <Button size="sm" variant="destructive" onClick={() => setSubDeleteDialog({ type: 'special-package', id: t.specialPkg!.id, label: 'Paket Spesial' })}><IconTrash className="size-3" /></Button>}
                                            </div>
                                        </div>
                                        {t.specialPkg && <p className="text-sm text-muted-foreground">{t.specialPkg.subtitle} · Diskon {t.specialPkg.discount}% · {t.specialPkg.limitedSlots} slot</p>}
                                    </div>

                                    {/* Private Package */}
                                    <div className="rounded-lg border p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm">Paket Privat</h4>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="outline" onClick={() => {
                                                    if (t.privatePkg) { openSubEdit('private-package', t.privatePkg); setPpIncludes(t.privatePkg.includes.map(i => i.text)) }
                                                    else { openSubAdd('private-package'); setPpIncludes([]) }
                                                }}><IconSettings className="size-3 mr-1" />{t.privatePkg ? 'Edit' : 'Tambah'}</Button>
                                                {t.privatePkg && <Button size="sm" variant="destructive" onClick={() => setSubDeleteDialog({ type: 'private-package', id: t.privatePkg!.id, label: 'Paket Privat' })}><IconTrash className="size-3" /></Button>}
                                            </div>
                                        </div>
                                        {t.privatePkg && <p className="text-sm text-muted-foreground">{t.privatePkg.tagline} · {t.privatePkg.tier} · Max {t.privatePkg.maxGuests} tamu · {t.privatePkg.includes.length} inklusi</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── All Dialogs follow below (shared with list view) ─── */}
                {renderDialogs()}
            </React.Fragment>
        )
    }

    // ═════════════════════════════════════════════════════════
    // LIST VIEW
    // ═════════════════════════════════════════════════════════
    function renderDialogs() {
        return (
            <>
                {/* Tour Basic Info Dialog */}
                <Dialog open={tourFormOpen} onOpenChange={o => { if (!o) { setTourFormOpen(false); setEditingTourId(null) } }}>
                    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader><DialogTitle>{editingTourId ? 'Edit Paket Wisata' : 'Tambah Paket Wisata'}</DialogTitle><DialogDescription>Isi informasi dasar paket wisata.</DialogDescription></DialogHeader>
                        <form onSubmit={tourForm.handleSubmit(onTourSubmit)} className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2 space-y-2"><Label>Judul</Label><Input {...tourForm.register('title')} />{tourForm.formState.errors.title && <p className="text-sm text-destructive">{tourForm.formState.errors.title.message}</p>}</div>
                            <div className="space-y-2"><Label>Tipe</Label><select {...tourForm.register('type')} className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"><option value="GRUP">Grup</option><option value="PRIVAT">Privat</option></select></div>
                            <div className="space-y-2"><Label>Durasi (hari)</Label><Input type="number" {...tourForm.register('durationDays')} />{tourForm.formState.errors.durationDays && <p className="text-sm text-destructive">{tourForm.formState.errors.durationDays.message}</p>}</div>
                            <div className="space-y-2"><Label>Harga</Label><Input type="number" {...tourForm.register('price')} /></div>
                            <div className="space-y-2"><Label>Ukuran Grup</Label><Input {...tourForm.register('groupSize')} placeholder="e.g. 8-15 orang" /></div>
                            <div className="space-y-2"><Label>Rating</Label><Input type="number" step="0.1" {...tourForm.register('rating')} /></div>
                            <div className="space-y-2"><Label>Jumlah Review</Label><Input type="number" {...tourForm.register('reviewCount')} /></div>
                            <div className="sm:col-span-2"><ImageUploadField value={tourForm.watch('image')} onChange={v => tourForm.setValue('image', v)} label="Gambar Utama" />{tourForm.formState.errors.image && <p className="text-sm text-destructive">{tourForm.formState.errors.image.message}</p>}</div>
                            <div className="sm:col-span-2"><ImageUploadField value={tourForm.watch('heroImage')} onChange={v => tourForm.setValue('heroImage', v)} label="Gambar Hero" /></div>
                            <div className="sm:col-span-2 space-y-2"><Label>Overview</Label><Textarea rows={3} {...tourForm.register('overview')} /></div>
                            <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setTourFormOpen(false)} disabled={submitting}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{editingTourId ? 'Simpan' : 'Tambah'}</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Tour AlertDialog */}
                <AlertDialog open={deleteOpen} onOpenChange={o => { if (!o) { setDeleteOpen(false); setDeletingId(null) } }}>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Paket Wisata</AlertDialogTitle><AlertDialogDescription>Semua data terkait (galeri, itinerari, jadwal, dll) juga akan dihapus. Lanjutkan?</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeleteTour} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Sub-resource Delete AlertDialog */}
                <AlertDialog open={!!subDeleteDialog} onOpenChange={o => { if (!o) setSubDeleteDialog(null) }}>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Data</AlertDialogTitle><AlertDialogDescription>Hapus &quot;{subDeleteDialog?.label}&quot;?</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmSubDelete} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Sub-resource Form Dialog */}
                <Dialog open={!!subDialog} onOpenChange={o => { if (!o) setSubDialog(null) }}>
                    <DialogContent className="max-h-[85vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>{subDialog?.mode === 'edit' ? 'Edit' : 'Tambah'} {subDialog?.type === 'highlights' ? 'Sorotan' : subDialog?.type === 'gallery' ? 'Galeri' : subDialog?.type === 'itinerary' ? 'Itinerari' : subDialog?.type === 'inclusions' ? 'Yang Termasuk' : subDialog?.type === 'exclusions' ? 'Yang Tidak Termasuk' : subDialog?.type === 'dates' ? 'Jadwal' : subDialog?.type === 'reviews' ? 'Ulasan' : subDialog?.type === 'good-to-know' ? 'Info Penting' : subDialog?.type === 'special-package' ? 'Paket Spesial' : subDialog?.type === 'private-package' ? 'Paket Privat' : ''}</DialogTitle></DialogHeader>
                        {subDialog?.type && renderSubForm(subDialog.type)}
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    function renderSubForm(type: string) {
        const f = formMap[type]
        if (!f) return null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onSub = (data: any) => {
            if (type === 'private-package') data.includes = ppIncludes
            onSubSubmit(type, data)
        }

        if (type === 'highlights' || type === 'inclusions' || type === 'exclusions') {
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <div className="space-y-2"><Label>Teks</Label><Input {...f.register('text')} />{f.formState.errors.text && <p className="text-sm text-destructive">{f.formState.errors.text.message}</p>}</div>
                <div className="space-y-2"><Label>Urutan</Label><Input type="number" {...f.register('order')} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        if (type === 'gallery') {
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <ImageUploadField value={f.watch('image')} onChange={(v: string) => f.setValue('image', v)} label="Gambar" />
                {f.formState.errors.image && <p className="text-sm text-destructive">{f.formState.errors.image.message}</p>}
                <div className="space-y-2"><Label>Urutan</Label><Input type="number" {...f.register('order')} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        if (type === 'itinerary') {
            const meals = f.watch('meals') || []
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Hari ke-</Label><Input type="number" {...f.register('day')} />{f.formState.errors.day && <p className="text-sm text-destructive">{f.formState.errors.day.message}</p>}</div>
                    <div className="space-y-2"><Label>Jarak</Label><Input {...f.register('distance')} placeholder="e.g. 120 km" /></div>
                </div>
                <div className="space-y-2"><Label>Judul</Label><Input {...f.register('title')} />{f.formState.errors.title && <p className="text-sm text-destructive">{f.formState.errors.title.message}</p>}</div>
                <div className="space-y-2"><Label>Deskripsi</Label><Textarea rows={3} {...f.register('description')} />{f.formState.errors.description && <p className="text-sm text-destructive">{f.formState.errors.description.message}</p>}</div>
                <div className="space-y-2"><Label>Makan</Label><div className="flex gap-4">
                    {[{ v: 'B', l: 'Sarapan' }, { v: 'L', l: 'Makan Siang' }, { v: 'D', l: 'Makan Malam' }].map(m => (
                        <label key={m.v} className="flex items-center gap-1.5 text-sm"><Checkbox checked={meals.includes(m.v)} onCheckedChange={c => { f.setValue('meals', c ? [...meals, m.v] : meals.filter((x: string) => x !== m.v)) }} />{m.l}</label>
                    ))}
                </div></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        if (type === 'dates') {
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Tanggal Mulai</Label><Input type="date" {...f.register('startDate')} /></div>
                    <div className="space-y-2"><Label>Tanggal Selesai</Label><Input type="date" {...f.register('endDate')} /></div>
                </div>
                <div className="space-y-2"><Label>Status</Label><select {...f.register('status')} className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"><option value="AVAILABLE">Tersedia</option><option value="ALMOST_FULL">Hampir Penuh</option><option value="FULL">Penuh</option><option value="CLOSED">Ditutup</option></select></div>
                <div className="space-y-2"><Label>Harga</Label><Input type="number" {...f.register('price')} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        if (type === 'reviews') {
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nama</Label><Input {...f.register('name')} /></div>
                    <div className="space-y-2"><Label>Lokasi</Label><Input {...f.register('location')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Rating (1-5)</Label><Input type="number" step="0.1" {...f.register('rating')} /></div>
                    <div className="space-y-2"><Label>Tanggal</Label><Input type="date" {...f.register('date')} /></div>
                </div>
                <ImageUploadField value={f.watch('avatar')} onChange={(v: string) => f.setValue('avatar', v)} label="Avatar" />
                <div className="space-y-2"><Label>Teks Ulasan</Label><Textarea rows={3} {...f.register('text')} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        if (type === 'good-to-know') {
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <div className="space-y-2"><Label>Judul</Label><Input {...f.register('title')} /></div>
                <div className="space-y-2"><Label>Teks</Label><Textarea rows={3} {...f.register('text')} /></div>
                <div className="space-y-2"><Label>Urutan</Label><Input type="number" {...f.register('order')} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        if (type === 'special-package') {
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <div className="space-y-2"><Label>Subtitle</Label><Input {...f.register('subtitle')} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Harga Asli</Label><Input type="number" {...f.register('originalPrice')} /></div>
                    <div className="space-y-2"><Label>Diskon (%)</Label><Input type="number" {...f.register('discount')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Badge</Label><Input {...f.register('badge')} /></div>
                    <div className="space-y-2"><Label>Badge Emoji</Label><Input {...f.register('badgeEmoji')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Gradient CSS</Label><Input {...f.register('gradient')} /></div>
                    <div className="space-y-2"><Label>Ukuran Grup</Label><Input {...f.register('groupSize')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Musim</Label><Input {...f.register('season')} /></div>
                    <div className="space-y-2"><Label>Rentang Tanggal</Label><Input {...f.register('dateRange')} /></div>
                </div>
                <div className="space-y-2"><Label>Slot Terbatas</Label><Input type="number" {...f.register('limitedSlots')} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        if (type === 'private-package') {
            return (<form onSubmit={f.handleSubmit(onSub)} className="space-y-4">
                <div className="space-y-2"><Label>Tagline</Label><Input {...f.register('tagline')} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Maks Tamu</Label><Input type="number" {...f.register('maxGuests')} /></div>
                    <div className="space-y-2"><Label>Tier</Label><select {...f.register('tier')} className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"><option value="GOLD">Gold</option><option value="PLATINUM">Platinum</option><option value="DIAMOND">Diamond</option></select></div>
                </div>
                <div className="space-y-2"><Label>Catatan Harga</Label><Input {...f.register('priceNote')} /></div>
                <div className="space-y-2"><Label>Inklusi Paket</Label>
                    <div className="flex flex-col gap-2">{ppIncludes.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2"><Input value={inc} onChange={e => { const n = [...ppIncludes]; n[i] = e.target.value; setPpIncludes(n) }} className="flex-1" /><Button type="button" variant="ghost" size="icon" onClick={() => setPpIncludes(ppIncludes.filter((_, j) => j !== i))}><IconX className="size-4" /></Button></div>
                    ))}</div>
                    <div className="flex gap-2 mt-1"><Input value={ppNewInclude} onChange={e => setPpNewInclude(e.target.value)} placeholder="Tambah inklusi..." className="flex-1" /><Button type="button" variant="outline" size="sm" onClick={() => { if (ppNewInclude.trim()) { setPpIncludes([...ppIncludes, ppNewInclude.trim()]); setPpNewInclude('') } }}>Tambah</Button></div>
                </div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
            </form>)
        }
        return null
    }

    return (
        <React.Fragment>
            <SiteHeader title="Paket Wisata" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div><h2 className="text-xl font-semibold tracking-tight">Daftar Paket Wisata</h2><p className="text-muted-foreground text-sm">Kelola semua paket wisata beserta detailnya.</p></div>
                            <div className="flex items-center gap-2">
                                <Select value={String(limit)} onValueChange={v => { setLimit(Number(v) as PageSize); setPage(1) }}><SelectTrigger size="sm" className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent></Select>
                                <Button onClick={openTourAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah Tour</Button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari paket wisata..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-9" /></div>

                        {/* Table */}
                        <div className="rounded-lg border">
                            <Table><TableHeader><TableRow>
                                <TableHead className="w-12">No</TableHead><TableHead>Gambar</TableHead><TableHead>Judul</TableHead><TableHead>Tipe</TableHead><TableHead>Durasi</TableHead><TableHead>Harga</TableHead><TableHead className="hidden sm:table-cell">Rating</TableHead><TableHead className="text-right">Aksi</TableHead>
                            </TableRow></TableHeader>
                                <TableBody>
                                    {loading ? <TableRow><TableCell colSpan={8} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat...</span></div></TableCell></TableRow>
                                        : tours.length === 0 ? <TableRow><TableCell colSpan={8} className="h-32 text-center"><p className="text-muted-foreground">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada paket wisata.'}</p></TableCell></TableRow>
                                            : tours.map((t, i) => {
                                                const offset = pagination ? (pagination.page - 1) * pagination.limit : 0
                                                return (<TableRow key={t.id}>
                                                    <TableCell>{offset + i + 1}</TableCell>
                                                    <TableCell>{t.image ? <img src={t.image} alt="" className="h-10 w-16 rounded object-cover" /> : '-'}</TableCell>
                                                    <TableCell className="font-medium max-w-[200px] truncate">{t.title}</TableCell>
                                                    <TableCell><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.type === 'GRUP' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{t.type}</span></TableCell>
                                                    <TableCell>{t.durationDays} hari</TableCell>
                                                    <TableCell>{fmt(t.price)}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">⭐ {t.rating}</TableCell>
                                                    <TableCell className="text-right"><div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" onClick={() => fetchDetail(t.id)} title="Kelola"><IconSettings className="size-4" /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => { setEditingTourId(t.id); tourForm.reset({ title: t.title, type: t.type, durationDays: t.durationDays, price: t.price, image: t.image, heroImage: '', overview: '', groupSize: '', rating: t.rating, reviewCount: t.reviewCount }); setTourFormOpen(true) }} title="Edit"><IconEdit className="size-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingId(t.id); setDeleteOpen(true) }} title="Hapus"><IconTrash className="size-4" /></Button>
                                                    </div></TableCell>
                                                </TableRow>)
                                            })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {pagination && <PaginationBar pagination={pagination} page={page} limit={limit} setPage={setPage} />}
                    </div>
                </div>
            </div>
            {renderDialogs()}
        </React.Fragment>
    )
}
