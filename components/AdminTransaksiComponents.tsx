"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "./layouts/site-header";
import {
  getAdminTransaksiDetail,
  getAdminTransaksiFilterOptions,
  getAdminTransaksiList,
} from "@/services/AdminTransaksiServices";
import type {
  AdminTransaksiDetailItem,
  AdminTransaksiEntityType,
  AdminTransaksiFilterOptionsResponse,
  AdminTransaksiListItem,
  AdminTransaksiStatusDisplay,
  AdminTransaksiStatusFilter,
} from "@/types/AdminTransaksiTypes";
import {
  PaginationMeta,
  PAGE_SIZE_OPTIONS,
  PageSize,
  DEFAULT_PAGE_SIZE,
} from "@/types/PaginationData";
import { fmt, fmtDate, fmtDateShort, getPageNumbers } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconEye, IconSearch, IconX } from "@tabler/icons-react";

const STATUS_OPTIONS: Array<{
  value: AdminTransaksiStatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "Semua Status" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Lunas" },
  { value: "CANCELLED", label: "Batal" },
  { value: "COMPLETED", label: "Selesai" },
];

const ENTITY_TYPE_OPTIONS: Array<{
  value: AdminTransaksiEntityType;
  label: string;
}> = [
  { value: "all", label: "Semua Jenis" },
  { value: "tour", label: "Tours" },
  { value: "destination", label: "Destinasi" },
  { value: "wahana", label: "Wahana" },
];

const STATUS_BADGE: Record<
  AdminTransaksiStatusDisplay,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
  },
  PAID: {
    label: "Lunas",
    className: "bg-emerald-100 text-emerald-700",
  },
  CANCELLED: {
    label: "Batal",
    className: "bg-rose-100 text-rose-700",
  },
  COMPLETED: {
    label: "Selesai",
    className: "bg-blue-100 text-blue-700",
  },
  REFUND: {
    label: "Refund",
    className: "bg-violet-100 text-violet-700",
  },
};

const PAYMENT_BADGE: Record<
  "PENDING" | "PAID" | "FAILED" | "CANCELLED",
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  PAID: { label: "Lunas", className: "bg-emerald-100 text-emerald-700" },
  FAILED: { label: "Gagal", className: "bg-rose-100 text-rose-700" },
  CANCELLED: { label: "Batal", className: "bg-rose-100 text-rose-700" },
};

function itemTypeLabel(itemType: AdminTransaksiListItem["itemType"]): string {
  if (itemType === "TOUR") return "Tours";
  if (itemType === "DESTINATION") return "Destinasi";
  if (itemType === "WAHANA") return "Wahana";
  return "Tidak diketahui";
}

function formatVisitDateRange(startDate: string, endDate: string): string {
  const start = fmtDateShort(startDate);
  const end = fmtDateShort(endDate);
  if (start === end) return start;
  return `${start} - ${end}`;
}

export default function AdminTransaksiComponents() {
  const [items, setItems] = useState<AdminTransaksiListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [entityType, setEntityType] = useState<AdminTransaksiEntityType>("all");
  const [entityId, setEntityId] = useState("all");
  const [status, setStatus] = useState<AdminTransaksiStatusFilter>("ALL");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [filterOptions, setFilterOptions] =
    useState<AdminTransaksiFilterOptionsResponse>({
      tours: [],
      destinations: [],
      wahanas: [],
    });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailItem, setDetailItem] = useState<AdminTransaksiDetailItem | null>(
    null,
  );

  const selectedEntityId = Number(entityId) || null;
  const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0;

  const currentEntityOptions = useMemo(() => {
    if (entityType === "tour") {
      return filterOptions.tours.map((item) => ({
        value: String(item.id),
        label: item.title,
      }));
    }

    if (entityType === "destination") {
      return filterOptions.destinations.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
    }

    if (entityType === "wahana") {
      return filterOptions.wahanas.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
    }

    return [];
  }, [entityType, filterOptions]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const json = await getAdminTransaksiFilterOptions();
      if (json.status === "success") {
        setFilterOptions(json.data);
      } else {
        toast.error(json.message || "Gagal memuat opsi filter");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const json = await getAdminTransaksiList({
        page,
        limit,
        search,
        visitDate: visitDate || undefined,
        entityType,
        entityId: entityType === "all" ? null : selectedEntityId,
        status,
      });

      if (json.status === "success") {
        setItems(json.data);
        setPagination(json.pagination || null);
      } else {
        toast.error(json.message || "Gagal memuat daftar transaksi");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, [entityType, limit, page, search, selectedEntityId, status, visitDate]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== searchInput) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, searchInput]);

  const handleLimitChange = (value: string) => {
    setLimit(Number(value) as PageSize);
    setPage(1);
  };

  const handleEntityTypeChange = (value: string) => {
    setEntityType(value as AdminTransaksiEntityType);
    setEntityId("all");
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setVisitDate("");
    setEntityType("all");
    setEntityId("all");
    setStatus("ALL");
    setPage(1);
  };

  const handleOpenDetail = async (bookingId: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailItem(null);

    try {
      const json = await getAdminTransaksiDetail(bookingId);
      if (json.status === "success") {
        setDetailItem(json.data);
      } else {
        toast.error(json.message || "Gagal memuat detail pesanan");
        setDetailOpen(false);
      }
    } catch {
      toast.error("Gagal terhubung ke server");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <React.Fragment>
      <SiteHeader title="Transaksi Pesanan" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Daftar Pesanan
                </h2>
                <p className="text-muted-foreground text-sm">
                  Pantau status pembayaran Midtrans dan detail pemesan.
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  <IconX className="mr-1 size-4" />
                  Reset Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="space-y-1">
                <Label htmlFor="search-booking">Cari Pemesan</Label>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="search-booking"
                    placeholder="Nama, email, atau telepon..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="visit-date">Tanggal Kunjungan</Label>
                <Input
                  id="visit-date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => {
                    setVisitDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="space-y-1">
                <Label>Jenis Produk</Label>
                <Select
                  value={entityType}
                  onValueChange={handleEntityTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTITY_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Produk</Label>
                <Select
                  value={entityId}
                  onValueChange={(value) => {
                    setEntityId(value);
                    setPage(1);
                  }}
                  disabled={entityType === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua produk</SelectItem>
                    {currentEntityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Status Midtrans</Label>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value as AdminTransaksiStatusFilter);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead className="min-w-[240px]">
                      Destinasi | Wahana | Tours
                    </TableHead>
                    <TableHead>Tanggal Kunjungan</TableHead>
                    <TableHead className="text-right">Jumlah Orang</TableHead>
                    <TableHead className="text-right">Total Harga</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Spinner className="size-5" />
                          <span className="text-muted-foreground">
                            Memuat daftar pesanan...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <p className="text-muted-foreground">
                          Tidak ada pesanan yang sesuai filter.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => {
                      const statusMeta = STATUS_BADGE[item.status];
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {rowOffset + index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            #{item.id}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.itemName}</div>
                            <div className="text-xs text-muted-foreground">
                              {itemTypeLabel(item.itemType)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatVisitDateRange(
                              item.visitDate,
                              item.visitEndDate,
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalPeople}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {fmt(item.totalPrice)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusMeta.className}`}
                            >
                              {statusMeta.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetail(item.id)}
                            >
                              <IconEye className="mr-1 size-4" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination && pagination.totalPages > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {rowOffset + 1}-
                  {Math.min(rowOffset + limit, pagination.total)} dari{" "}
                  {pagination.total} pesanan
                </p>
                {pagination.totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setPage((prev) => Math.max(1, prev - 1))
                          }
                          aria-disabled={!pagination.hasPrevPage}
                          className={
                            !pagination.hasPrevPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {getPageNumbers(page, pagination.totalPages).map(
                        (p, idx) =>
                          p === "e" ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
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
                          ),
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPage((prev) =>
                              Math.min(pagination.totalPages, prev + 1),
                            )
                          }
                          aria-disabled={!pagination.hasNextPage}
                          className={
                            !pagination.hasNextPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
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

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailItem(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detail Pemesan {detailItem ? `#${detailItem.id}` : ""}
            </DialogTitle>
            <DialogDescription>
              Informasi pemesan, kunjungan, dan riwayat pembayaran.
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="h-40 flex items-center justify-center gap-2">
              <Spinner className="size-5" />
              <span className="text-muted-foreground">Memuat detail...</span>
            </div>
          ) : !detailItem ? (
            <p className="text-sm text-muted-foreground">
              Detail transaksi tidak tersedia.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Dibuat pada {fmtDate(detailItem.createdAt)}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[detailItem.status].className}`}
                >
                  {STATUS_BADGE[detailItem.status].label}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Nama</p>
                  <p className="font-medium">
                    {detailItem.firstName} {detailItem.lastName}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Produk</p>
                  <p className="font-medium">{detailItem.itemName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {itemTypeLabel(detailItem.itemType)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Kontak</p>
                  <p className="font-medium">{detailItem.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {detailItem.phoneCode}
                    {detailItem.phoneNumber}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Tanggal Kunjungan
                  </p>
                  <p className="font-medium">
                    {formatVisitDateRange(
                      detailItem.startDate,
                      detailItem.endDate,
                    )}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Jumlah Orang
                  </p>
                  <p className="font-medium">
                    {detailItem.totalPeople} ({detailItem.adults} dewasa,{" "}
                    {detailItem.children} anak)
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Harga
                  </p>
                  <p className="font-medium">{fmt(detailItem.totalPrice)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Kewarganegaraan
                  </p>
                  <p className="font-medium">{detailItem.nationality}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Tanggal Lahir
                  </p>
                  <p className="font-medium">{fmtDate(detailItem.birthDate)}</p>
                </div>
                <div className="rounded-lg border p-3 md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Catatan</p>
                  <p className="text-sm">
                    {detailItem.comments?.trim() || "Tidak ada catatan."}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Riwayat Pembayaran</h4>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referensi</TableHead>
                        <TableHead>Metode</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Tanggal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailItem.payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-20 text-center">
                            <span className="text-sm text-muted-foreground">
                              Belum ada data pembayaran.
                            </span>
                          </TableCell>
                        </TableRow>
                      ) : (
                        detailItem.payments.map((payment) => {
                          const paymentMeta = PAYMENT_BADGE[payment.status];
                          return (
                            <TableRow key={payment.id}>
                              <TableCell className="font-mono text-xs">
                                {payment.referenceCode}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {payment.paymentAvailable.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {payment.paymentAvailable.type}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {fmt(payment.amount)}
                              </TableCell>
                              <TableCell className="text-center">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${paymentMeta.className}`}
                                >
                                  {paymentMeta.label}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {fmtDateShort(payment.createdAt)}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
