"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { DestinationListItem, DestinationDetail, RefOption } from '@/types/DestinationType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { destinationFullSchema, galleryDestinationSchema, masterItemSchema } from '@/validation/destinationSchema'
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
import { IconArrowLeft, IconEdit, IconTrash, IconPlus, IconSearch, IconSettings, IconUpload } from '@tabler/icons-react'

const API = '/api/destinations/admin'
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

function getPageNumbers(page: number, totalPages: number): (number | 'e')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const p: (number | 'e')[] = [1]
    if (page > 3) p.push('e')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) p.push(i)
    if (page < totalPages - 2) p.push('e')
    p.push(totalPages)
    return p
}

// Extended ref option with description and icon
interface RefOptionFull extends RefOption {
    description: string;
    icon: string;
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
export default function AdminDestinasiComponents() {
    // ─── List State ─────────────────────────────────────────
    const [destinations, setDestinations] = useState<DestinationListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    // ─── Management State ───────────────────────────────────
    const [selectedDest, setSelectedDest] = useState<DestinationDetail | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'manage'>('list')
    const [refData, setRefData] = useState<{ labels: RefOptionFull[]; accessibilities: RefOptionFull[]; facilities: RefOptionFull[] }>({ labels: [], accessibilities: [], facilities: [] })

    // ─── Dialog States ──────────────────────────────────────
    const [destFormOpen, setDestFormOpen] = useState(false)
    const [editingDestId, setEditingDestId] = useState<number | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Sub-resource dialog states
    const [subDialog, setSubDialog] = useState<{ type: string; mode: 'add' | 'edit'; data?: Record<string, unknown> } | null>(null)
    const [subDeleteDialog, setSubDeleteDialog] = useState<{ type: string; id: number; label: string } | null>(null)

    // Master data dialog states (for Label, Accessibility, Facility CRUD)
    const [masterDialog, setMasterDialog] = useState<{ kind: 'label' | 'accessibility' | 'facility'; mode: 'add' | 'edit'; data?: RefOptionFull } | null>(null)
    const [masterDeleteDialog, setMasterDeleteDialog] = useState<{ kind: 'label' | 'accessibility' | 'facility'; id: number; name: string } | null>(null)

    // ─── Fetch List ─────────────────────────────────────────
    const fetchList = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set('search', search)
            const json = await api(`/?${params}`)
            if (json.status === 'success') { setDestinations(json.data); setPagination(json.pagination) }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung ke server') }
        finally { setLoading(false) }
    }, [page, limit, search])

    useEffect(() => { fetchList() }, [fetchList])
    useEffect(() => {
        const t = setTimeout(() => { if (searchInput !== search) { setSearch(searchInput); setPage(1) } }, 400)
        return () => clearTimeout(t)
    }, [searchInput, search])

    // ─── Fetch Detail ───────────────────────────────────────
    const fetchDetail = useCallback(async (id: number) => {
        setLoading(true)
        try {
            const json = await api(`/detail?_id=${id}`)
            if (json.status === 'success') { setSelectedDest(json.data); setViewMode('manage') }
            else toast.error(json.message)
        } catch { toast.error('Gagal terhubung') }
        finally { setLoading(false) }
    }, [])

    const refreshDetail = () => { if (selectedDest) fetchDetail(selectedDest.id) }

    // ─── Fetch Ref Data ─────────────────────────────────────
    const fetchRefData = useCallback(async () => {
        const json = await api('/ref')
        if (json.status === 'success') setRefData(json.data)
    }, [])

    useEffect(() => { fetchRefData() }, [fetchRefData])

    // ─── Destination Form ───────────────────────────────────
    const destForm = useForm({
        resolver: yupResolver(destinationFullSchema),
        defaultValues: {
            name: '', priceWeekend: 0, priceWeekday: 0, priceGroup: 0, minimalGroup: 1,
            jamBuka: '08:00', jamTutup: '17:00', durasiRekomendasi: '2-3 jam',
            isAktif: true, imageBanner: '', description: '', KuotaHarian: 100, rating: 0, reviewCount: 0,
        },
    })

    const openDestAdd = () => {
        setEditingDestId(null)
        destForm.reset({
            name: '', priceWeekend: 0, priceWeekday: 0, priceGroup: 0, minimalGroup: 1,
            jamBuka: '08:00', jamTutup: '17:00', durasiRekomendasi: '2-3 jam',
            isAktif: true, imageBanner: '', description: '', KuotaHarian: 100, rating: 0, reviewCount: 0,
        })
        setDestFormOpen(true)
    }

    const openDestEdit = (d: DestinationDetail) => {
        setEditingDestId(d.id)
        destForm.reset({
            name: d.name, priceWeekend: d.priceWeekend, priceWeekday: d.priceWeekday,
            priceGroup: d.priceGroup, minimalGroup: d.minimalGroup,
            jamBuka: d.jamBuka, jamTutup: d.jamTutup, durasiRekomendasi: d.durasiRekomendasi,
            isAktif: d.isAktif, imageBanner: d.imageBanner, description: d.description,
            KuotaHarian: d.KuotaHarian, rating: d.rating, reviewCount: d.reviewCount,
        })
        setDestFormOpen(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDestSubmit = async (data: any) => {
        setSubmitting(true)
        try {
            const json = editingDestId ? await apiJson(`/?_id=${editingDestId}`, 'PUT', data) : await apiJson('/', 'POST', data)
            if (json.status === 'success') { toast.success(json.message); setDestFormOpen(false); fetchList(); if (editingDestId && selectedDest) refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Delete Destination ─────────────────────────────────
    const confirmDeleteDest = async () => {
        if (!deletingId) return; setSubmitting(true)
        try {
            const json = await api(`/?_id=${deletingId}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setDeleteOpen(false); setDeletingId(null); if (viewMode === 'manage') { setViewMode('list'); setSelectedDest(null) }; fetchList() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Sub-resource CRUD (Gallery) ────────────────────────
    const galleryForm = useForm({ resolver: yupResolver(galleryDestinationSchema), defaultValues: { image: '' } })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formMap: Record<string, any> = { gallery: galleryForm }

    const openSubAdd = (type: string) => {
        const f = formMap[type]; if (f) f.reset()
        setSubDialog({ type, mode: 'add' })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openSubEdit = (type: string, data: any) => {
        const f = formMap[type]; if (f) f.reset(data)
        setSubDialog({ type, mode: 'edit', data })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubSubmit = async (type: string, formData: any) => {
        if (!selectedDest) return; setSubmitting(true)
        try {
            const isEdit = subDialog?.mode === 'edit'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const editId = (subDialog?.data as any)?.id
            const body = { ...formData, destinationId: selectedDest.id }
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
            const json = await api(`/${type}?_id=${id}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setSubDeleteDialog(null); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── Junction Sync ──────────────────────────────────────
    const [savingJunction, setSavingJunction] = useState(false)
    const saveLabels = async (labelIds: number[]) => {
        setSavingJunction(true)
        try {
            const json = await apiJson('/labels', 'POST', { destinationId: selectedDest?.id, labelIds })
            if (json.status === 'success') { toast.success(json.message); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSavingJunction(false) }
    }
    const saveAccessibilities = async (accessibilityIds: number[]) => {
        setSavingJunction(true)
        try {
            const json = await apiJson('/accessibilities', 'POST', { destinationId: selectedDest?.id, accessibilityIds })
            if (json.status === 'success') { toast.success(json.message); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSavingJunction(false) }
    }
    const saveFacilities = async (facilityIds: number[]) => {
        setSavingJunction(true)
        try {
            const json = await apiJson('/facilities', 'POST', { destinationId: selectedDest?.id, facilityIds })
            if (json.status === 'success') { toast.success(json.message); refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSavingJunction(false) }
    }

    // ─── Master Data CRUD (Label, Accessibility, Facility) ──
    const masterForm = useForm({ resolver: yupResolver(masterItemSchema), defaultValues: { name: '', description: '', icon: '' } })

    const masterEndpoints: Record<string, string> = { label: '/label-master', accessibility: '/accessibility-master', facility: '/facility-master' }
    const masterLabels: Record<string, string> = { label: 'Label', accessibility: 'Aksesibilitas', facility: 'Fasilitas' }

    const openMasterAdd = (kind: 'label' | 'accessibility' | 'facility') => {
        masterForm.reset({ name: '', description: '', icon: '' })
        setMasterDialog({ kind, mode: 'add' })
    }
    const openMasterEdit = (kind: 'label' | 'accessibility' | 'facility', data: RefOptionFull) => {
        masterForm.reset({ name: data.name, description: data.description, icon: data.icon })
        setMasterDialog({ kind, mode: 'edit', data })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMasterSubmit = async (formData: any) => {
        if (!masterDialog) return; setSubmitting(true)
        try {
            const endpoint = masterEndpoints[masterDialog.kind]
            const isEdit = masterDialog.mode === 'edit'
            const editId = masterDialog.data?.id
            const json = isEdit ? await apiJson(`${endpoint}?_id=${editId}`, 'PUT', formData) : await apiJson(endpoint, 'POST', formData)
            if (json.status === 'success') { toast.success(json.message); setMasterDialog(null); fetchRefData(); if (selectedDest) refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    const confirmMasterDelete = async () => {
        if (!masterDeleteDialog) return; setSubmitting(true)
        try {
            const endpoint = masterEndpoints[masterDeleteDialog.kind]
            const json = await api(`${endpoint}?_id=${masterDeleteDialog.id}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setMasterDeleteDialog(null); fetchRefData(); if (selectedDest) refreshDetail() }
            else toast.error(json.message)
        } catch { toast.error('Gagal') }
        finally { setSubmitting(false) }
    }

    // ─── RENDER: Gallery section helper ─────────────────────
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
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setSubDeleteDialog({ type, id: item.id, label: `Gambar #${item.id}` })}><IconTrash className="size-4" /></Button>
                            </div></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table>
            )}
        </div>
    )

    // ─── RENDER: Master Data Checkbox Section with CRUD ─────
    const renderMasterSection = (
        title: string,
        kind: 'label' | 'accessibility' | 'facility',
        refItems: RefOptionFull[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        linkedItems: any[],
        linkedKey: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSave: (ids: number[]) => void,
    ) => (
        <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{title} ({linkedItems.length})</h4>
                <Button size="sm" variant="outline" onClick={() => openMasterAdd(kind)}><IconPlus className="size-3 mr-1" />Tambah {masterLabels[kind]}</Button>
            </div>
            {refItems.length > 0 ? (
                <div className="space-y-2">
                    {refItems.map(item => {
                        const checked = linkedItems.some((x: Record<string, number>) => x[linkedKey] === item.id)
                        return (
                            <div key={item.id} className="flex items-center justify-between gap-2 group">
                                <label className="flex items-center gap-2 text-sm cursor-pointer flex-1 min-w-0">
                                    <Checkbox checked={checked} disabled={savingJunction} onCheckedChange={() => {
                                        const ids = checked
                                            ? linkedItems.filter((x: Record<string, number>) => x[linkedKey] !== item.id).map((x: Record<string, number>) => x[linkedKey])
                                            : [...linkedItems.map((x: Record<string, number>) => x[linkedKey]), item.id]
                                        onSave(ids)
                                    }} />
                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                    {item.description && <span className="text-xs text-muted-foreground truncate hidden sm:inline">— {item.description}</span>}
                                </label>
                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="size-7" onClick={() => openMasterEdit(kind, item)}><IconEdit className="size-3" /></Button>
                                    <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => setMasterDeleteDialog({ kind, id: item.id, name: item.name })}><IconTrash className="size-3" /></Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : <p className="text-sm text-muted-foreground">Belum ada data. Klik tombol &quot;Tambah&quot; untuk menambahkan.</p>}
        </div>
    )

    // ═══════════════════════════════════════════════════════════
    // MANAGE VIEW
    // ═══════════════════════════════════════════════════════════
    if (viewMode === 'manage' && selectedDest) {
        const d = selectedDest
        return (
            <React.Fragment>
                <SiteHeader title="Kelola Destinasi" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Back + Header */}
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" onClick={() => { setViewMode('list'); setSelectedDest(null) }}><IconArrowLeft className="size-5" /></Button>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">{d.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {d.isAktif ? '🟢 Aktif' : '🔴 Nonaktif'} · {d.jamBuka}–{d.jamTutup} · {fmt(d.priceWeekday)}/weekday
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => openDestEdit(d)}><IconEdit className="size-4 mr-1" />Edit Info</Button>
                                <Button size="sm" variant="destructive" onClick={() => { setDeletingId(d.id); setDeleteOpen(true) }}><IconTrash className="size-4 mr-1" />Hapus</Button>
                            </div>

                            {loading ? <div className="flex justify-center py-8"><Spinner className="size-6" /></div> : (
                                <div className="grid gap-4">
                                    {/* Labels */}
                                    {renderMasterSection('Label', 'label', refData.labels, d.destinationLabels, 'labelId', saveLabels)}

                                    {/* Accessibility */}
                                    {renderMasterSection('Aksesibilitas', 'accessibility', refData.accessibilities, d.destinationAccessibilities, 'accessibilityId', saveAccessibilities)}

                                    {/* Facilities */}
                                    {renderMasterSection('Fasilitas', 'facility', refData.facilities, d.destinationFacilities, 'facilityId', saveFacilities)}

                                    {/* Gallery */}
                                    {renderSection('Galeri', 'gallery', d.destinationGalleries, [
                                        { key: 'image', label: 'Gambar', render: (v: string) => v ? <img src={v} alt="" className="h-10 rounded object-cover" /> : '-' },
                                        { key: 'createdAt', label: 'Tanggal', render: (v: string) => fmtDate(v) },
                                    ])}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {renderDialogs()}
            </React.Fragment>
        )
    }

    // ═══════════════════════════════════════════════════════════
    // DIALOGS
    // ═══════════════════════════════════════════════════════════
    function renderDialogs() {
        return (
            <>
                {/* Destination Full Form Dialog */}
                <Dialog open={destFormOpen} onOpenChange={o => { if (!o) { setDestFormOpen(false); setEditingDestId(null) } }}>
                    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingDestId ? 'Edit Destinasi' : 'Tambah Destinasi'}</DialogTitle>
                            <DialogDescription>Isi informasi lengkap destinasi wisata.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={destForm.handleSubmit(onDestSubmit)} className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2 space-y-2"><Label>Nama Destinasi</Label><Input {...destForm.register('name')} />{destForm.formState.errors.name && <p className="text-sm text-destructive">{destForm.formState.errors.name.message}</p>}</div>
                            <div className="space-y-2"><Label>Harga Weekday</Label><Input type="number" {...destForm.register('priceWeekday')} />{destForm.formState.errors.priceWeekday && <p className="text-sm text-destructive">{destForm.formState.errors.priceWeekday.message}</p>}</div>
                            <div className="space-y-2"><Label>Harga Weekend</Label><Input type="number" {...destForm.register('priceWeekend')} />{destForm.formState.errors.priceWeekend && <p className="text-sm text-destructive">{destForm.formState.errors.priceWeekend.message}</p>}</div>
                            <div className="space-y-2"><Label>Harga Grup</Label><Input type="number" {...destForm.register('priceGroup')} /></div>
                            <div className="space-y-2"><Label>Minimal Grup</Label><Input type="number" {...destForm.register('minimalGroup')} /></div>
                            <div className="space-y-2"><Label>Jam Buka</Label><Input {...destForm.register('jamBuka')} placeholder="08:00" /></div>
                            <div className="space-y-2"><Label>Jam Tutup</Label><Input {...destForm.register('jamTutup')} placeholder="17:00" /></div>
                            <div className="space-y-2"><Label>Durasi Rekomendasi</Label><Input {...destForm.register('durasiRekomendasi')} placeholder="2-3 jam" /></div>
                            <div className="space-y-2"><Label>Kuota Harian</Label><Input type="number" {...destForm.register('KuotaHarian')} /></div>
                            <div className="space-y-2"><Label>Rating</Label><Input type="number" step="0.1" {...destForm.register('rating')} /></div>
                            <div className="space-y-2"><Label>Jumlah Review</Label><Input type="number" {...destForm.register('reviewCount')} /></div>
                            <div className="sm:col-span-2 flex items-center gap-2">
                                <Checkbox checked={destForm.watch('isAktif')} onCheckedChange={(c) => destForm.setValue('isAktif', !!c)} />
                                <Label>Aktif</Label>
                            </div>
                            <div className="sm:col-span-2"><ImageUploadField value={destForm.watch('imageBanner')} onChange={v => destForm.setValue('imageBanner', v)} label="Gambar Banner" />{destForm.formState.errors.imageBanner && <p className="text-sm text-destructive">{destForm.formState.errors.imageBanner.message}</p>}</div>
                            <div className="sm:col-span-2 space-y-2"><Label>Deskripsi</Label><Textarea rows={4} {...destForm.register('description')} />{destForm.formState.errors.description && <p className="text-sm text-destructive">{destForm.formState.errors.description.message}</p>}</div>
                            <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setDestFormOpen(false)} disabled={submitting}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{editingDestId ? 'Simpan' : 'Tambah'}</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Destination AlertDialog */}
                <AlertDialog open={deleteOpen} onOpenChange={o => { if (!o) { setDeleteOpen(false); setDeletingId(null) } }}>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Destinasi</AlertDialogTitle><AlertDialogDescription>Semua data terkait (galeri, label, fasilitas, aksesibilitas) juga akan dihapus. Lanjutkan?</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeleteDest} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Sub-resource Delete AlertDialog (Gallery) */}
                <AlertDialog open={!!subDeleteDialog} onOpenChange={o => { if (!o) setSubDeleteDialog(null) }}>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Data</AlertDialogTitle><AlertDialogDescription>Hapus &quot;{subDeleteDialog?.label}&quot;?</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmSubDelete} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Sub-resource Form Dialog (Gallery) */}
                <Dialog open={!!subDialog} onOpenChange={o => { if (!o) setSubDialog(null) }}>
                    <DialogContent className="max-h-[85vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>{subDialog?.mode === 'edit' ? 'Edit' : 'Tambah'} Gambar Galeri</DialogTitle></DialogHeader>
                        {subDialog?.type === 'gallery' && (
                            <form onSubmit={galleryForm.handleSubmit((data) => onSubSubmit('gallery', data))} className="space-y-4">
                                <ImageUploadField value={galleryForm.watch('image')} onChange={(v: string) => galleryForm.setValue('image', v)} label="Gambar" />
                                {galleryForm.formState.errors.image && <p className="text-sm text-destructive">{galleryForm.formState.errors.image.message}</p>}
                                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubDialog(null)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Master Data Form Dialog (Label / Accessibility / Facility) */}
                <Dialog open={!!masterDialog} onOpenChange={o => { if (!o) setMasterDialog(null) }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{masterDialog?.mode === 'edit' ? 'Edit' : 'Tambah'} {masterDialog ? masterLabels[masterDialog.kind] : ''}</DialogTitle>
                            <DialogDescription>Isi informasi {masterDialog ? masterLabels[masterDialog.kind].toLowerCase() : ''} destinasi.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={masterForm.handleSubmit(onMasterSubmit)} className="space-y-4">
                            <div className="space-y-2"><Label>Nama</Label><Input {...masterForm.register('name')} />{masterForm.formState.errors.name && <p className="text-sm text-destructive">{masterForm.formState.errors.name.message}</p>}</div>
                            <div className="space-y-2"><Label>Deskripsi</Label><Textarea rows={2} {...masterForm.register('description')} /></div>
                            <div className="space-y-2"><Label>Icon (emoji / class)</Label><Input {...masterForm.register('icon')} placeholder="🏖️ atau icon-class" /></div>
                            <DialogFooter><Button type="button" variant="outline" onClick={() => setMasterDialog(null)} disabled={submitting}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{masterDialog?.mode === 'edit' ? 'Simpan' : 'Tambah'}</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Master Data Delete AlertDialog */}
                <AlertDialog open={!!masterDeleteDialog} onOpenChange={o => { if (!o) setMasterDeleteDialog(null) }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus {masterDeleteDialog ? masterLabels[masterDeleteDialog.kind] : ''}</AlertDialogTitle>
                            <AlertDialogDescription>Hapus &quot;{masterDeleteDialog?.name}&quot;? Data ini juga akan dihapus dari semua destinasi yang terhubung.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmMasterDelete} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        )
    }

    // ═══════════════════════════════════════════════════════════
    // LIST VIEW
    // ═══════════════════════════════════════════════════════════
    return (
        <React.Fragment>
            <SiteHeader title="Destinasi Wisata" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div><h2 className="text-xl font-semibold tracking-tight">Daftar Destinasi Wisata</h2><p className="text-muted-foreground text-sm">Kelola destinasi wisata beserta relasi label, aksesibilitas, fasilitas, dan galeri.</p></div>
                            <div className="flex items-center gap-2">
                                <Select value={String(limit)} onValueChange={v => { setLimit(Number(v) as PageSize); setPage(1) }}><SelectTrigger size="sm" className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent></Select>
                                <Button onClick={openDestAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah Destinasi</Button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari destinasi..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-9" /></div>

                        {/* Table */}
                        <div className="rounded-lg border">
                            <Table><TableHeader><TableRow>
                                <TableHead className="w-12">No</TableHead><TableHead>Gambar</TableHead><TableHead>Nama</TableHead><TableHead>Status</TableHead><TableHead>Harga Weekday</TableHead><TableHead className="hidden sm:table-cell">Rating</TableHead><TableHead className="text-right">Aksi</TableHead>
                            </TableRow></TableHeader>
                                <TableBody>
                                    {loading ? <TableRow><TableCell colSpan={7} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat...</span></div></TableCell></TableRow>
                                        : destinations.length === 0 ? <TableRow><TableCell colSpan={7} className="h-32 text-center"><p className="text-muted-foreground">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada destinasi.'}</p></TableCell></TableRow>
                                            : destinations.map((d, i) => {
                                                const offset = pagination ? (pagination.page - 1) * pagination.limit : 0
                                                return (<TableRow key={d.id}>
                                                    <TableCell>{offset + i + 1}</TableCell>
                                                    <TableCell>{d.imageBanner ? <img src={d.imageBanner} alt="" className="h-10 w-16 rounded object-cover" /> : '-'}</TableCell>
                                                    <TableCell className="font-medium max-w-[200px] truncate">{d.name}</TableCell>
                                                    <TableCell><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.isAktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.isAktif ? 'Aktif' : 'Nonaktif'}</span></TableCell>
                                                    <TableCell>{fmt(d.priceWeekday)}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">⭐ {d.rating}</TableCell>
                                                    <TableCell className="text-right"><div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" onClick={() => fetchDetail(d.id)} title="Kelola"><IconSettings className="size-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingId(d.id); setDeleteOpen(true) }} title="Hapus"><IconTrash className="size-4" /></Button>
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
