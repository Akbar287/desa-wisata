"use client"

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { PaymentAvailableData, PaymentAvailableFormData } from '@/types/PaymentAvailableType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { paymentAvailableSchema } from '@/validation/paymentAvailableSchema'
import { toast } from 'sonner'
import Image from 'next/image'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { IconEdit, IconPlus, IconSearch, IconTrash, IconUpload } from '@tabler/icons-react'

const API_URL = '/api/payment-available'
const IMG_API = '/api/img'

const TYPE_OPTIONS = [
    { value: 'BANK', label: 'Transfer Bank' },
    { value: 'WALLET', label: 'E-Wallet' },
    { value: 'QRIS', label: 'QRIS' },
] as const

const TYPE_BADGES: Record<string, { label: string; class: string }> = {
    BANK: { label: 'Bank', class: 'bg-blue-100 text-blue-700' },
    WALLET: { label: 'E-Wallet', class: 'bg-purple-100 text-purple-700' },
    QRIS: { label: 'QRIS', class: 'bg-green-100 text-green-700' },
}

export default function AdminPaymentAvailableComponents() {
    const [items, setItems] = useState<PaymentAvailableData[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // Pagination & search
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    // Dialog states
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<PaymentAvailableData | null>(null)
    const [deletingItem, setDeletingItem] = useState<PaymentAvailableData | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PaymentAvailableFormData>({
        resolver: yupResolver(paymentAvailableSchema) as never,
        defaultValues: { name: '', accountNumber: '', accountName: '', image: '', description: '', type: 'BANK', isActive: true },
    })

    const imageValue = watch('image')

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set('search', search)

            const res = await fetch(`${API_URL}?${params.toString()}`)
            const json = await res.json()
            if (json.status === 'success') {
                setItems(json.data)
                setPagination(json.pagination)
            } else {
                toast.error(json.message || 'Gagal mengambil data')
            }
        } catch {
            toast.error('Gagal terhubung ke server')
        } finally {
            setLoading(false)
        }
    }, [page, limit, search])

    useEffect(() => { fetchData() }, [fetchData])

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchInput !== search) {
                setSearch(searchInput)
                setPage(1)
            }
        }, 400)
        return () => clearTimeout(timeout)
    }, [searchInput, search])

    const handleLimitChange = (value: string) => {
        setLimit(Number(value) as PageSize)
        setPage(1)
    }

    // Open add dialog
    const handleAdd = () => {
        setEditingItem(null)
        reset({ name: '', accountNumber: '', accountName: '', image: '', description: '', type: 'BANK', isActive: true })
        setFormOpen(true)
    }

    // Open edit dialog
    const handleEdit = (item: PaymentAvailableData) => {
        setEditingItem(item)
        reset({
            name: item.name,
            accountNumber: item.accountNumber,
            accountName: item.accountName,
            image: item.image,
            description: item.description,
            type: item.type,
            isActive: item.isActive,
        })
        setFormOpen(true)
    }

    // Open delete dialog
    const handleDeleteClick = (item: PaymentAvailableData) => {
        setDeletingItem(item)
        setDeleteOpen(true)
    }

    // Upload image
    const handleImageUpload = async (file: File) => {
        setUploadingImage(true)
        try {
            const fd = new FormData()
            fd.append('files', file)
            const res = await fetch(IMG_API, { method: 'POST', body: fd })
            const json = await res.json()
            if (json.status === 'success') {
                const url = `${IMG_API}?_id=${json.data.id}`
                setValue('image', url)
                toast.success('Gambar berhasil diupload')
            } else {
                toast.error('Gagal upload gambar')
            }
        } catch {
            toast.error('Gagal upload gambar')
        } finally {
            setUploadingImage(false)
        }
    }

    // Submit form
    const onSubmit = async (formData: PaymentAvailableFormData) => {
        setSubmitting(true)
        try {
            const isEdit = editingItem !== null
            const url = isEdit ? `${API_URL}?_id=${editingItem.id}` : API_URL
            const method = isEdit ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const json = await res.json()

            if (json.status === 'success') {
                toast.success(json.message)
                setFormOpen(false)
                reset()
                fetchData()
            } else {
                toast.error(json.message || 'Terjadi kesalahan')
            }
        } catch {
            toast.error('Gagal terhubung ke server')
        } finally {
            setSubmitting(false)
        }
    }

    // Confirm delete
    const handleDeleteConfirm = async () => {
        if (!deletingItem) return
        setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}?_id=${deletingItem.id}`, { method: 'DELETE' })
            const json = await res.json()

            if (json.status === 'success') {
                toast.success(json.message)
                setDeleteOpen(false)
                setDeletingItem(null)
                if (items.length === 1 && page > 1) {
                    setPage(page - 1)
                } else {
                    fetchData()
                }
            } else {
                toast.error(json.message || 'Gagal menghapus')
            }
        } catch {
            toast.error('Gagal terhubung ke server')
        } finally {
            setSubmitting(false)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (!pagination) return []
        const { totalPages } = pagination
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

        const pages: (number | 'ellipsis')[] = [1]
        if (page > 3) pages.push('ellipsis')
        const start = Math.max(2, page - 1)
        const end = Math.min(totalPages - 1, page + 1)
        for (let i = start; i <= end; i++) pages.push(i)
        if (page < totalPages - 2) pages.push('ellipsis')
        pages.push(totalPages)
        return pages
    }

    const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0

    return (
        <React.Fragment>
            <SiteHeader title="Metode Pembayaran" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">Daftar Metode Pembayaran</h2>
                                <p className="text-muted-foreground text-sm">
                                    Kelola metode pembayaran seperti Transfer Bank, E-Wallet, dan QRIS.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={String(limit)} onValueChange={handleLimitChange}>
                                    <SelectTrigger size="sm" className="w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAGE_SIZE_OPTIONS.map((size) => (
                                            <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAdd} size="sm">
                                    <IconPlus className="mr-1 size-4" />
                                    Tambah Metode
                                </Button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative max-w-sm">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari metode pembayaran..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Table */}
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">No</TableHead>
                                        <TableHead className="w-16">Logo</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead className="hidden md:table-cell">No. Rekening</TableHead>
                                        <TableHead className="hidden md:table-cell">Atas Nama</TableHead>
                                        <TableHead className="text-center">Tipe</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-center hidden sm:table-cell">Transaksi</TableHead>
                                        <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="h-32 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Spinner className="size-5" />
                                                    <span className="text-muted-foreground">Memuat data...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="h-32 text-center">
                                                <p className="text-muted-foreground">
                                                    {search
                                                        ? `Tidak ada metode yang cocok dengan "${search}".`
                                                        : 'Belum ada data metode pembayaran.'}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item, index) => {
                                            const badge = TYPE_BADGES[item.type] ?? { label: item.type, class: 'bg-gray-100 text-gray-700' }
                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{rowOffset + index + 1}</TableCell>
                                                    <TableCell>
                                                        <div className="relative w-10 h-7 rounded border overflow-hidden bg-gray-50">
                                                            <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground font-mono text-sm">{item.accountNumber}</TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">{item.accountName}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge.class}`}>
                                                            {badge.label}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {item.isActive ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center hidden sm:table-cell">
                                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                            {item._count?.payments ?? 0}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                                                        {formatDate(item.createdAt)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} title="Edit">
                                                                <IconEdit className="size-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)} title="Hapus" className="text-destructive hover:text-destructive">
                                                                <IconTrash className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Footer */}
                        {pagination && pagination.totalPages > 0 && (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {rowOffset + 1}–{Math.min(rowOffset + limit, pagination.total)} dari {pagination.total} data
                                </p>
                                {pagination.totalPages > 1 && (
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                    aria-disabled={!pagination.hasPrevPage}
                                                    className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                            {getPageNumbers().map((p, i) =>
                                                p === 'ellipsis' ? (
                                                    <PaginationItem key={`ellipsis-${i}`}><PaginationEllipsis /></PaginationItem>
                                                ) : (
                                                    <PaginationItem key={p}>
                                                        <PaginationLink isActive={p === page} onClick={() => setPage(p)} className="cursor-pointer">{p}</PaginationLink>
                                                    </PaginationItem>
                                                )
                                            )}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                                    aria-disabled={!pagination.hasNextPage}
                                                    className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={(open) => {
                if (!open) {
                    setFormOpen(false)
                    setEditingItem(null)
                    reset()
                }
            }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingItem
                                ? 'Perbarui informasi metode pembayaran di bawah ini.'
                                : 'Isi informasi metode pembayaran baru di bawah ini.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Image upload */}
                        <div className="space-y-2">
                            <Label>Logo / Gambar</Label>
                            <div className="flex items-center gap-4">
                                {imageValue ? (
                                    <div className="relative w-20 h-14 rounded-lg border overflow-hidden bg-gray-50">
                                        <Image src={imageValue} alt="Preview" fill className="object-contain p-1" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-14 rounded-lg border-2 border-dashed flex items-center justify-center bg-gray-50">
                                        <IconUpload className="size-5 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Button type="button" variant="outline" size="sm" disabled={uploadingImage}
                                        onClick={() => fileInputRef.current?.click()}>
                                        {uploadingImage ? <><Spinner className="mr-2 size-4" /> Mengupload...</> : 'Upload Gambar'}
                                    </Button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
                                </div>
                            </div>
                            {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="pm-name">Nama Metode</Label>
                            <Input id="pm-name" placeholder="Contoh: BCA, GoPay, DANA" {...register('name')} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>

                        {/* Account Number & Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pm-accno">Nomor Rekening</Label>
                                <Input id="pm-accno" placeholder="1234567890" {...register('accountNumber')} />
                                {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pm-accname">Atas Nama</Label>
                                <Input id="pm-accname" placeholder="PT Desa Wisata" {...register('accountName')} />
                                {errors.accountName && <p className="text-sm text-destructive">{errors.accountName.message}</p>}
                            </div>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label>Tipe Pembayaran</Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TYPE_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="pm-desc">Deskripsi</Label>
                            <Textarea id="pm-desc" placeholder="Deskripsi singkat metode pembayaran" rows={3} {...register('description')} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                        </div>

                        {/* Is Active */}
                        <div className="flex items-center gap-3">
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`relative w-10 h-5 rounded-full transition-colors ${field.value ? 'bg-primary' : 'bg-gray-300'}`}
                                            onClick={() => field.onChange(!field.value)}>
                                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </div>
                                        <span className="text-sm font-medium">{field.value ? 'Aktif' : 'Nonaktif'}</span>
                                    </label>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>Batal</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Spinner className="mr-2 size-4" />}
                                {editingItem ? 'Simpan Perubahan' : 'Tambah Metode'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={(open) => {
                if (!open) { setDeleteOpen(false); setDeletingItem(null) }
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Metode Pembayaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus metode <strong>&quot;{deletingItem?.name}&quot;</strong>?
                            {(deletingItem?._count?.payments ?? 0) > 0 && (
                                <span className="mt-2 block text-destructive font-medium">
                                    ⚠️ Metode ini memiliki {deletingItem?._count?.payments} transaksi pembayaran terkait. Menghapus metode akan menghapus semua transaksi tersebut.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm} disabled={submitting}>
                            {submitting && <Spinner className="mr-2 size-4" />}
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    )
}
