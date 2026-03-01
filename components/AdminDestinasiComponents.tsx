"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { DestinationData, DestinationFormData } from '@/types/DestinationType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { destinationSchema } from '@/validation/destinationSchema'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react'

const API_URL = '/api/tours/destinations'

export default function AdminDestinasiComponents() {
    const [destinations, setDestinations] = useState<DestinationData[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Pagination & search state
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    // Dialog states
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editingDestination, setEditingDestination] = useState<DestinationData | null>(null)
    const [deletingDestination, setDeletingDestination] = useState<DestinationData | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DestinationFormData>({
        resolver: yupResolver(destinationSchema),
        defaultValues: { name: '' },
    })

    // Fetch destinations with pagination & search
    const fetchDestinations = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            })
            if (search) params.set('search', search)

            const res = await fetch(`${API_URL}?${params.toString()}`)
            const json = await res.json()
            if (json.status === 'success') {
                setDestinations(json.data)
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

    useEffect(() => {
        fetchDestinations()
    }, [fetchDestinations])

    // Search handler with debounce reset to page 1
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchInput !== search) {
                setSearch(searchInput)
                setPage(1)
            }
        }, 400)
        return () => clearTimeout(timeout)
    }, [searchInput, search])

    // Reset page on limit change
    const handleLimitChange = (value: string) => {
        setLimit(Number(value) as PageSize)
        setPage(1)
    }

    // Open add dialog
    const handleAdd = () => {
        setEditingDestination(null)
        reset({ name: '' })
        setFormOpen(true)
    }

    // Open edit dialog
    const handleEdit = (destination: DestinationData) => {
        setEditingDestination(destination)
        reset({ name: destination.name })
        setFormOpen(true)
    }

    // Open delete dialog
    const handleDeleteClick = (destination: DestinationData) => {
        setDeletingDestination(destination)
        setDeleteOpen(true)
    }

    // Submit form (create / update)
    const onSubmit = async (formData: DestinationFormData) => {
        setSubmitting(true)
        try {
            const isEdit = editingDestination !== null
            const url = isEdit ? `${API_URL}?_id=${editingDestination.id}` : API_URL
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
                reset({ name: '' })
                fetchDestinations()
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
        if (!deletingDestination) return
        setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}?_id=${deletingDestination.id}`, {
                method: 'DELETE',
            })
            const json = await res.json()

            if (json.status === 'success') {
                toast.success(json.message)
                setDeleteOpen(false)
                setDeletingDestination(null)
                if (destinations.length === 1 && page > 1) {
                    setPage(page - 1)
                } else {
                    fetchDestinations()
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
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    // Generate page numbers for pagination
    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (!pagination) return []
        const { totalPages } = pagination
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const pages: (number | 'ellipsis')[] = [1]

        if (page > 3) pages.push('ellipsis')

        const start = Math.max(2, page - 1)
        const end = Math.min(totalPages - 1, page + 1)
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (page < totalPages - 2) pages.push('ellipsis')

        pages.push(totalPages)
        return pages
    }

    const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0

    return (
        <React.Fragment>
            <SiteHeader title="Destinasi Wisata" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">Daftar Destinasi Wisata</h2>
                                <p className="text-muted-foreground text-sm">
                                    Kelola destinasi wisata seperti Bali, Yogyakarta, Labuan Bajo, dan lainnya.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={String(limit)} onValueChange={handleLimitChange}>
                                    <SelectTrigger size="sm" className="w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAGE_SIZE_OPTIONS.map((size) => (
                                            <SelectItem key={size} value={String(size)}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAdd} size="sm">
                                    <IconPlus className="mr-1 size-4" />
                                    Tambah Destinasi
                                </Button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative max-w-sm">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari destinasi wisata..."
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
                                        <TableHead>Nama Destinasi</TableHead>
                                        <TableHead className="text-center">Jumlah Tour</TableHead>
                                        <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Spinner className="size-5" />
                                                    <span className="text-muted-foreground">Memuat data...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : destinations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center">
                                                <p className="text-muted-foreground">
                                                    {search
                                                        ? `Tidak ada destinasi yang cocok dengan "${search}".`
                                                        : 'Belum ada data destinasi wisata.'
                                                    }
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        destinations.map((destination, index) => (
                                            <TableRow key={destination.id}>
                                                <TableCell className="font-medium">{rowOffset + index + 1}</TableCell>
                                                <TableCell className="font-medium">{destination.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        {destination._count?.tours ?? 0} tour
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                                                    {formatDate(destination.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(destination)}
                                                            title="Edit"
                                                        >
                                                            <IconEdit className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteClick(destination)}
                                                            title="Hapus"
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <IconTrash className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
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
                                                    <PaginationItem key={`ellipsis-${i}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                ) : (
                                                    <PaginationItem key={p}>
                                                        <PaginationLink
                                                            isActive={p === page}
                                                            onClick={() => setPage(p)}
                                                            className="cursor-pointer"
                                                        >
                                                            {p}
                                                        </PaginationLink>
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
                    setEditingDestination(null)
                    reset({ name: '' })
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingDestination ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Wisata'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingDestination
                                ? 'Perbarui informasi destinasi wisata di bawah ini.'
                                : 'Isi informasi destinasi wisata baru di bawah ini.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="destination-name">Nama Destinasi</Label>
                            <Input
                                id="destination-name"
                                placeholder="Contoh: Bali, Yogyakarta, Labuan Bajo"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormOpen(false)}
                                disabled={submitting}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Spinner className="mr-2 size-4" />}
                                {editingDestination ? 'Simpan Perubahan' : 'Tambah Destinasi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={(open) => {
                if (!open) {
                    setDeleteOpen(false)
                    setDeletingDestination(null)
                }
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Destinasi Wisata</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus destinasi <strong>&quot;{deletingDestination?.name}&quot;</strong>?
                            {(deletingDestination?._count?.tours ?? 0) > 0 && (
                                <span className="mt-2 block text-destructive font-medium">
                                    ⚠️ Destinasi ini terhubung dengan {deletingDestination?._count?.tours} tour. Menghapus destinasi akan memutuskan hubungan tersebut.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={submitting}
                        >
                            {submitting && <Spinner className="mr-2 size-4" />}
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    )
}
