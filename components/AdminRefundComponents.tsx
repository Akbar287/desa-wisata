"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "./layouts/site-header";
import {
  getAdminRefundDetail,
  getAdminRefundList,
  REFUND_STATUS_OPTIONS,
  updateAdminRefundStatus,
} from "@/services/RefundServices";
import type {
  AdminRefundDetailItem,
  AdminRefundListItem,
  RefundStatus,
} from "@/types/RefundTypes";
import type { PaginationMeta } from "@/types/PaginationData";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PageSize,
} from "@/types/PaginationData";
import { fmt, fmtDateShort, getPageNumbers } from "@/lib/utils";
import { toast } from "sonner";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { IconEye, IconSearch } from "@tabler/icons-react";

const STATUS_BADGES: Record<
  RefundStatus,
  { label: string; className: string }
> = {
  REQUESTED: { label: "Diajukan", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Disetujui", className: "bg-blue-100 text-blue-700" },
  REJECTED: { label: "Ditolak", className: "bg-rose-100 text-rose-700" },
  PAID: {
    label: "Sudah Dibayar",
    className: "bg-emerald-100 text-emerald-700",
  },
  CANCELLED: { label: "Dibatalkan", className: "bg-zinc-100 text-zinc-700" },
};

export default function AdminRefundComponents() {
  const [items, setItems] = useState<AdminRefundListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<"ALL" | RefundStatus>("ALL");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailItem, setDetailItem] = useState<AdminRefundDetailItem | null>(
    null,
  );
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const json = await getAdminRefundList({
        page,
        limit,
        search: search || undefined,
        status,
      });
      if (json.status === "success") {
        setItems(json.data ?? []);
        setPagination(json.pagination || null);
      } else {
        toast.error(json.message || "Gagal memuat data refund.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [limit, page, search, status]);

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

  const pages = useMemo(() => {
    if (!pagination) return [];
    return getPageNumbers(pagination.page, pagination.totalPages);
  }, [pagination]);

  const handleOpenDetail = async (id: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailItem(null);
    try {
      const json = await getAdminRefundDetail(id);
      if (json.status === "success" && json.data) {
        setDetailItem(json.data);
      } else {
        toast.error(json.message || "Gagal memuat detail refund.");
        setDetailOpen(false);
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (nextStatus: RefundStatus) => {
    if (!detailItem) return;
    if (detailItem.status === nextStatus) return;

    setUpdatingStatus(true);
    try {
      const json = await updateAdminRefundStatus(detailItem.id, {
        status: nextStatus,
      });
      if (json.status === "success" && json.data) {
        setDetailItem(json.data);
        toast.success("Status refund berhasil diperbarui.");
        fetchData();
      } else {
        toast.error(json.message || "Gagal memperbarui status refund.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      <SiteHeader title="Refund" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="rounded-xl border bg-card p-4 md:p-5 space-y-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="relative max-w-sm w-full">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kode booking atau email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="w-full sm:w-[220px]">
                  <Label className="mb-1.5 block">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value as "ALL" | RefundStatus);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REFUND_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[96px]">
                  <Label className="mb-1.5 block">Show</Label>
                  <Select
                    value={String(limit)}
                    onValueChange={handleLimitChange}
                  >
                    <SelectTrigger>
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
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-14">No</TableHead>
                      <TableHead>Kode Booking</TableHead>
                      <TableHead>Nama / Email</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Tgl Kunjungan</TableHead>
                      <TableHead>Total Bayar</TableHead>
                      <TableHead>Refund</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Diajukan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <div className="py-10 flex justify-center">
                            <Spinner />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center py-10 text-muted-foreground"
                        >
                          Belum ada data refund.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, idx) => {
                        const badge = STATUS_BADGES[item.status];
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{rowOffset + idx + 1}</TableCell>
                            <TableCell className="font-medium">
                              {item.bookingCode}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {item.customerName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.customerEmail}
                              </div>
                            </TableCell>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>
                              {fmtDateShort(item.visitDate)}
                            </TableCell>
                            <TableCell>{fmt(item.paidAmount)}</TableCell>
                            <TableCell>
                              {fmt(item.refundAmount)}
                              <div className="text-xs text-muted-foreground">
                                {item.refundPercent}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            </TableCell>
                            <TableCell>
                              {fmtDateShort(item.requestedAt)}
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

              {pagination && pagination.totalPages > 1 ? (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.hasPrevPage) setPage((p) => p - 1);
                        }}
                        className={
                          pagination.hasPrevPage
                            ? ""
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>

                    {pages.map((p, idx) =>
                      p === "e" ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={`p-${p}`}>
                          <PaginationLink
                            href="#"
                            isActive={p === pagination.page}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(p);
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.hasNextPage) setPage((p) => p + 1);
                        }}
                        className={
                          pagination.hasNextPage
                            ? ""
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setDetailItem(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Refund</DialogTitle>
            <DialogDescription>
              Konfirmasi pengajuan refund dan ubah status refund.
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="py-10 flex items-center justify-center gap-2">
              <Spinner />
              <span className="text-sm text-muted-foreground">
                Memuat detail refund...
              </span>
            </div>
          ) : !detailItem ? (
            <p className="text-sm text-muted-foreground">
              Detail refund tidak tersedia.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Kode Booking
                  </p>
                  <p className="font-medium">{detailItem.bookingCode}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                  <p className="font-medium">{detailItem.orderId}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Nama</p>
                  <p className="font-medium">{detailItem.customerName}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{detailItem.customerEmail}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Item</p>
                  <p className="font-medium">{detailItem.itemName}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Tanggal Kunjungan
                  </p>
                  <p className="font-medium">
                    {fmtDateShort(detailItem.visitDate)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Dibayar
                  </p>
                  <p className="font-medium">{fmt(detailItem.paidAmount)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Refund ({detailItem.refundPercent}%)
                  </p>
                  <p className="font-medium">{fmt(detailItem.refundAmount)}</p>
                </div>
                <div className="rounded-lg border p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Alasan User
                  </p>
                  <p className="text-sm">{detailItem.reason || "-"}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Nama Bank
                  </p>
                  <p className="font-medium">{detailItem.namaBank || "-"}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Nomor Rekening
                  </p>
                  <p className="font-medium">
                    {detailItem.nomorRekening || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border rounded-lg p-4">
                <h4 className="text-sm font-semibold">
                  Form Konfirmasi Refund
                </h4>
                {detailItem.status === "REQUESTED" ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus("REJECTED")}
                    >
                      {updatingStatus ? "Menyimpan..." : "Ditolak"}
                    </Button>
                    <Button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus("APPROVED")}
                    >
                      {updatingStatus ? "Menyimpan..." : "Disetujui"}
                    </Button>
                  </div>
                ) : detailItem.status === "APPROVED" ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus("CANCELLED")}
                    >
                      {updatingStatus ? "Menyimpan..." : "Dibatalkan"}
                    </Button>
                    <Button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus("PAID")}
                    >
                      {updatingStatus ? "Menyimpan..." : "Sudah Dibayar"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Refund sudah di status akhir (
                    {STATUS_BADGES[detailItem.status].label}).
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
