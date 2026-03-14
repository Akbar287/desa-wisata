"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SiteHeader } from "./layouts/site-header";
import { WahanaData, WahanaFormData } from "@/types/WahanaType";
import {
  PaginationMeta,
  PAGE_SIZE_OPTIONS,
  PageSize,
  DEFAULT_PAGE_SIZE,
} from "@/types/PaginationData";
import { mapMasterSchema, wahanaSchema } from "@/validation/wahanaSchema";
import { toast } from "sonner";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";

const API_URL = "/api/wahanas";
const REF_API = "/api/wahanas/ref";
const MAP_MASTER_API = "/api/wahanas/map-master";
const IMG_API = "/api/img";
const GOOGLE_MAPS_LOADER_ID = "discover-desa-wisata-gmaps-loader";
const GOOGLE_MAPS_LIBRARIES: "marker"[] = ["marker"];
const DEFAULT_MAP_CENTER = { lat: -7.7956, lng: 110.3695 };

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

interface MapRefOption {
  id: number;
  title: string;
  content: string;
  image: string;
  icon: string;
  lat: number;
  lng: number;
  fasilitas: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MapMasterFormData {
  title: string;
  content: string;
  image: string;
  icon: string;
  lat: number;
  lng: number;
  fasilitas: boolean;
}

async function uploadImage(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("files", file);
  const res = await fetch(IMG_API, { method: "POST", body: fd });
  const json = await res.json();
  if (json.status === "success") return `${IMG_API}?_id=${json.data.id}`;
  toast.error(json.message || "Upload gagal");
  return null;
}

function ImageUploadField({
  value,
  onChange,
  label,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  error?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) onChange(url);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL atau upload..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative group overflow-hidden"
          disabled={uploading}
        >
          {uploading ? (
            <Spinner className="size-4" />
          ) : (
            <IconUpload className="size-4 group-hover:-translate-y-1 transition duration-300" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
      </div>
      {value && (
        <img
          src={value}
          alt=""
          className="h-24 rounded-lg border object-cover shadow-sm"
        />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function GalleryUploadField({
  values,
  onChange,
  label,
}: {
  values: { image: string }[];
  onChange: (v: { image: string }[]) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) onChange([...values, { image: url }]);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-3">
        {values.map((v, i) => (
          <div key={i} className="relative group">
            <img
              src={v.image}
              alt=""
              className="h-20 w-20 rounded-lg border object-cover shadow-sm transition group-hover:opacity-75"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"
            >
              <IconX className="size-3" />
            </button>
          </div>
        ))}
        <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center relative cursor-pointer hover:bg-muted/50 transition">
          {uploading ? (
            <Spinner className="size-5 text-muted-foreground" />
          ) : (
            <IconPlus className="size-6 text-muted-foreground" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
            title="Tambah Gambar Galeri"
            disabled={uploading}
          />
        </div>
      </div>
    </div>
  );
}

function MapPointPicker({
  apiKey,
  mapId,
  lat,
  lng,
  onPick,
}: {
  apiKey: string;
  mapId: string;
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<
    google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null
  >(null);
  const [authFailed, setAuthFailed] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const hasValidPoint =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;
  const center = hasValidPoint ? { lat, lng } : DEFAULT_MAP_CENTER;

  useEffect(() => {
    const previousHandler = window.gm_authFailure;
    window.gm_authFailure = () => {
      setAuthFailed(true);
      if (typeof previousHandler === "function") previousHandler();
    };
    return () => {
      window.gm_authFailure = previousHandler;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (typeof window === "undefined" || !window.google?.maps) return;

    if (markerRef.current) {
      if (markerRef.current instanceof google.maps.Marker) {
        markerRef.current.setMap(null);
      } else {
        markerRef.current.map = null;
      }
      markerRef.current = null;
    }

    if (!hasValidPoint) return;

    const hasAdvancedMarker =
      Boolean(window.google.maps.marker) &&
      Boolean(window.google.maps.marker.AdvancedMarkerElement) &&
      Boolean(mapId);

    if (hasAdvancedMarker) {
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat, lng },
        title: "Titik Map",
      });
    } else {
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: { lat, lng },
        title: "Titik Map",
      });
    }

    mapRef.current.panTo({ lat, lng });
  }, [hasValidPoint, isLoaded, lat, lng, mapId]);

  useEffect(() => {
    return () => {
      if (
        !markerRef.current ||
        typeof window === "undefined" ||
        !window.google?.maps
      )
        return;
      if (markerRef.current instanceof google.maps.Marker) {
        markerRef.current.setMap(null);
      } else {
        markerRef.current.map = null;
      }
      markerRef.current = null;
    };
  }, []);

  if (authFailed || loadError) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
        Peta gagal dimuat. Gunakan API key browser Google Maps yang valid,
        aktifkan
        <strong className="mx-1">Maps JavaScript API</strong>, aktifkan billing,
        dan pastikan domain (mis. `http://localhost:3000/*`) ada di HTTP
        referrer restriction.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-64 rounded-lg border flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        Memuat peta...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-64 rounded-lg border"
      center={center}
      zoom={hasValidPoint ? 16 : 12}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: mapId || undefined,
      }}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onUnmount={() => {
        mapRef.current = null;
      }}
      onClick={(event) => {
        if (!event.latLng) return;
        onPick(event.latLng.lat(), event.latLng.lng());
      }}
    />
  );
}

export default function AdminWahanaComponents({
  googleMapsApiKey = "",
  googleMapsMapId = "",
}: {
  googleMapsApiKey?: string;
  googleMapsMapId?: string;
}) {
  const [wahanas, setWahanas] = useState<WahanaData[]>([]);
  const [mapsRef, setMapsRef] = useState<MapRefOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pagination & search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingWahana, setEditingWahana] = useState<WahanaData | null>(null);
  const [deletingWahana, setDeletingWahana] = useState<WahanaData | null>(null);

  // Map master dialog states
  const [mapMasterListOpen, setMapMasterListOpen] = useState(false);
  const [mapMasterFormOpen, setMapMasterFormOpen] = useState(false);
  const [editingMapMaster, setEditingMapMaster] = useState<MapRefOption | null>(
    null,
  );
  const [mapMasterDeleteDialog, setMapMasterDeleteDialog] =
    useState<MapRefOption | null>(null);

  const normalizedMapsApiKey = googleMapsApiKey.trim();
  const normalizedMapsMapId = googleMapsMapId.trim();
  const hasMapsApiKey = normalizedMapsApiKey.length > 0;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WahanaFormData>({
    resolver: yupResolver(wahanaSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      imageBanner: "",
      gallery: [],
      mapIds: [],
    },
  });

  const mapMasterForm = useForm<MapMasterFormData>({
    resolver: yupResolver(mapMasterSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
      icon: "",
      lat: DEFAULT_MAP_CENTER.lat,
      lng: DEFAULT_MAP_CENTER.lng,
      fasilitas: false,
    },
  });

  const fetchMapRef = useCallback(async () => {
    try {
      const res = await fetch(REF_API);
      const json = await res.json();
      if (json.status === "success") {
        setMapsRef(json.data?.maps ?? []);
      } else {
        toast.error(json.message || "Gagal mengambil data maps");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    }
  }, []);

  // Fetch wahanas with pagination & search
  const fetchWahanas = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);

      const res = await fetch(`${API_URL}?${params.toString()}`);
      const json = await res.json();
      if (json.status === "success") {
        setWahanas(json.data);
        setPagination(json.pagination);
      } else {
        toast.error(json.message || "Gagal mengambil data");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchWahanas();
  }, [fetchWahanas]);

  useEffect(() => {
    fetchMapRef();
  }, [fetchMapRef]);

  // Search handler with debounce reset to page 1
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput, search]);

  // Reset page on limit change
  const handleLimitChange = (value: string) => {
    setLimit(Number(value) as PageSize);
    setPage(1);
  };

  // Open add dialog
  const handleAdd = () => {
    setEditingWahana(null);
    reset({
      name: "",
      price: 0,
      description: "",
      imageBanner: "",
      gallery: [],
      mapIds: [],
    });
    setFormOpen(true);
  };

  // Open edit dialog
  const handleEdit = (wahana: WahanaData) => {
    setEditingWahana(wahana);
    const mapIds = [
      ...new Set(
        (wahana.maps ?? [])
          .map((m) => Number(m.mapId ?? m.id))
          .filter((id) => Number.isFinite(id) && id > 0),
      ),
    ];
    reset({
      name: wahana.name,
      price: wahana.price,
      description: wahana.description,
      imageBanner: wahana.imageBanner,
      gallery: wahana.WahanaGallery.map((g) => ({ image: g.image })),
      mapIds,
    });
    setFormOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (wahana: WahanaData) => {
    setDeletingWahana(wahana);
    setDeleteOpen(true);
  };

  const toggleMapId = (mapId: number, checked: boolean) => {
    const current = watch("mapIds") || [];
    const next = checked
      ? [...new Set([...current, mapId])]
      : current.filter((id) => id !== mapId);
    setValue("mapIds", next, { shouldValidate: true, shouldDirty: true });
  };

  // Submit form (create / update)
  const onSubmit = async (formData: WahanaFormData) => {
    setSubmitting(true);
    try {
      const isEdit = editingWahana !== null;
      const url = isEdit ? `${API_URL}?_id=${editingWahana.id}` : API_URL;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.status === "success") {
        toast.success(json.message);
        setFormOpen(false);
        reset({
          name: "",
          price: 0,
          description: "",
          imageBanner: "",
          gallery: [],
          mapIds: [],
        });
        fetchWahanas();
      } else {
        toast.error(json.message || "Terjadi kesalahan");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingWahana) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}?_id=${deletingWahana.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.status === "success") {
        toast.success(json.message);
        setDeleteOpen(false);
        setDeletingWahana(null);
        if (wahanas.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchWahanas();
        }
      } else {
        toast.error(json.message || "Gagal menghapus");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  const openMapMasterAdd = () => {
    setEditingMapMaster(null);
    mapMasterForm.reset({
      title: "",
      content: "",
      image: "",
      icon: "",
      lat: DEFAULT_MAP_CENTER.lat,
      lng: DEFAULT_MAP_CENTER.lng,
      fasilitas: false,
    });
    setMapMasterFormOpen(true);
  };

  const openMapMasterEdit = (mapItem: MapRefOption) => {
    setEditingMapMaster(mapItem);
    mapMasterForm.reset({
      title: mapItem.title,
      content: mapItem.content || "",
      image: mapItem.image || "",
      icon: mapItem.icon || "",
      lat: Number(mapItem.lat),
      lng: Number(mapItem.lng),
      fasilitas: Boolean(mapItem.fasilitas),
    });
    setMapMasterFormOpen(true);
  };

  const onMapMasterSubmit = async (formData: MapMasterFormData) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean(editingMapMaster);
      const url = isEdit
        ? `${MAP_MASTER_API}?_id=${editingMapMaster?.id}`
        : MAP_MASTER_API;
      const method = isEdit ? "PUT" : "POST";
      const payload = {
        ...formData,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        fasilitas: Boolean(formData.fasilitas),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.status === "success") {
        toast.success(json.message);
        setMapMasterFormOpen(false);
        setEditingMapMaster(null);
        fetchMapRef();
      } else {
        toast.error(json.message || "Gagal menyimpan map");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMapMaster = async () => {
    if (!mapMasterDeleteDialog) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `${MAP_MASTER_API}?_id=${mapMasterDeleteDialog.id}`,
        {
          method: "DELETE",
        },
      );
      const json = await res.json();
      if (json.status === "success") {
        toast.success(json.message);
        setMapMasterDeleteDialog(null);
        const current = watch("mapIds") || [];
        setValue(
          "mapIds",
          current.filter((id) => id !== mapMasterDeleteDialog.id),
          { shouldValidate: true, shouldDirty: true },
        );
        fetchMapRef();
        fetchWahanas();
      } else {
        toast.error(json.message || "Gagal menghapus map");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (!pagination) return [];
    const { totalPages } = pagination;
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (page > 3) pages.push("ellipsis");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);
    return pages;
  };

  const rowOffset = pagination ? (pagination.page - 1) * pagination.limit : 0;
  const selectedMapIds = watch("mapIds") || [];
  const mapLat = Number(mapMasterForm.watch("lat"));
  const mapLng = Number(mapMasterForm.watch("lng"));

  return (
    <React.Fragment>
      <SiteHeader title="Wahana Wisata" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Daftar Wahana Wisata
                </h2>
                <p className="text-muted-foreground text-sm">
                  Kelola wahana wisata beserta relasi peta (`MapsWahana`) dan
                  master lokasi.
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
                  onClick={() => setMapMasterListOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <IconPlus className="mr-1 size-4" />
                  Kelola Maps
                </Button>
                <Button onClick={handleAdd} size="sm">
                  <IconPlus className="mr-1 size-4" />
                  Tambah Wahana
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari wahana wisata..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Nama Wahana</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead className="text-center">Galeri</TableHead>
                    <TableHead className="text-center">Peta</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Dibuat
                    </TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Spinner className="size-5" />
                          <span className="text-muted-foreground">
                            Memuat data...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : wahanas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <p className="text-muted-foreground">
                          {search
                            ? `Tidak ada wahana yang cocok dengan "${search}".`
                            : "Belum ada data wahana wisata."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    wahanas.map((wahana, index) => (
                      <TableRow key={wahana.id} className="group/row">
                        <TableCell className="font-medium text-muted-foreground">
                          {rowOffset + index + 1}
                        </TableCell>
                        <TableCell>
                          <img
                            src={wahana.imageBanner}
                            alt={wahana.name}
                            className="h-10 w-16 rounded object-cover shadow-sm bg-muted"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {wahana.name}
                        </TableCell>
                        <TableCell className="font-medium text-primary">
                          {formatRupiah(wahana.price)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {wahana.WahanaGallery?.length || 0} foto
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            {wahana.maps?.length || 0} titik
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                          {formatDate(wahana.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(wahana)}
                              title="Edit"
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <IconEdit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(wahana)}
                              title="Hapus"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                  Menampilkan {rowOffset + 1}–
                  {Math.min(rowOffset + limit, pagination.total)} dari{" "}
                  {pagination.total} data
                </p>
                {pagination.totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={
                            !pagination.hasPrevPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {getPageNumbers().map((p, i) =>
                        p === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={p}>
                            <PaginationLink
                              isActive={p === page}
                              onClick={() => setPage(p as number)}
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
                            setPage((p) =>
                              Math.min(pagination.totalPages, p + 1),
                            )
                          }
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

      {/* Add / Edit Dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingWahana(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWahana ? "Edit Wahana Wisata" : "Tambah Wahana Wisata"}
            </DialogTitle>
            <DialogDescription>
              {editingWahana
                ? "Perbarui informasi wahana wisata di bawah ini."
                : "Isi informasi wahana wisata baru di bawah ini."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="wahana-name">Nama Wahana</Label>
                <Input
                  id="wahana-name"
                  placeholder="Contoh: Flying Fox"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="wahana-price">Harga (Rp)</Label>
                <Input
                  id="wahana-price"
                  type="number"
                  min="0"
                  placeholder="Contoh: 50000"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wahana-desc">Deskripsi</Label>
              <Textarea
                id="wahana-desc"
                placeholder="Jelaskan tentang wahana ini..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-6">
              <ImageUploadField
                label="Gambar Banner (Utama)"
                value={watch("imageBanner")}
                onChange={(val) =>
                  setValue("imageBanner", val, { shouldValidate: true })
                }
                error={errors.imageBanner?.message}
              />

              <GalleryUploadField
                label="Galeri Gambar (Opsional)"
                values={watch("gallery") || []}
                onChange={(val) =>
                  setValue("gallery", val, { shouldValidate: true })
                }
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label>Relasi Peta (MapsWahana)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setMapMasterListOpen(true)}
                  >
                    <IconPlus className="size-3 mr-1" />
                    Kelola Map Master
                  </Button>
                </div>
                <div className="rounded-lg border p-3 max-h-56 overflow-y-auto space-y-2">
                  {mapsRef.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Belum ada map master. Klik &quot;Kelola Map Master&quot;
                      untuk menambahkan.
                    </p>
                  ) : (
                    mapsRef.map((mapItem) => {
                      const checked = selectedMapIds.includes(mapItem.id);
                      return (
                        <label
                          key={mapItem.id}
                          className="flex items-start gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) =>
                              toggleMapId(mapItem.id, Boolean(value))
                            }
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {mapItem.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {mapItem.fasilitas
                                ? "Fasilitas"
                                : "Non-fasilitas"}{" "}
                              · {Number(mapItem.lat).toFixed(6)},{" "}
                              {Number(mapItem.lng).toFixed(6)}
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pilih satu atau lebih titik peta untuk ditampilkan pada detail
                  wahana.
                </p>
                {typeof errors.mapIds?.message === "string" && (
                  <p className="text-sm text-destructive">
                    {errors.mapIds.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4 mt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="min-w-[120px]"
              >
                {submitting ? <Spinner className="mr-2 size-4" /> : null}
                {editingWahana ? "Simpan Perubahan" : "Tambah Wahana"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOpen(false);
            setDeletingWahana(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Wahana Wisata</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus wahana{" "}
              <strong>&quot;{deletingWahana?.name}&quot;</strong>? Semua gambar
              galeri dan relasi peta yang terkait dengan wahana ini juga akan
              dihapus. Tindakan ini tidak dapat dibatalkan.
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

      {/* Map Master List Dialog */}
      <Dialog open={mapMasterListOpen} onOpenChange={setMapMasterListOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Map Master</DialogTitle>
            <DialogDescription>
              Data map master dapat dipakai ulang oleh banyak
              wahana/destinasi/tour.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={openMapMasterAdd}>
                <IconPlus className="size-4 mr-1" />
                Tambah Map Master
              </Button>
            </div>

            {mapsRef.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Belum ada map master.
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Koordinat</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mapsRef.map((mapItem) => (
                      <TableRow key={mapItem.id}>
                        <TableCell className="font-medium">
                          <div>{mapItem.title}</div>
                          {mapItem.content ? (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {mapItem.content}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${mapItem.fasilitas ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}
                          >
                            {mapItem.fasilitas ? "Fasilitas" : "Non-fasilitas"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {Number(mapItem.lat).toFixed(6)},{" "}
                          {Number(mapItem.lng).toFixed(6)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openMapMasterEdit(mapItem)}
                            >
                              <IconEdit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setMapMasterDeleteDialog(mapItem)}
                            >
                              <IconTrash className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Master Add/Edit Dialog */}
      <Dialog
        open={mapMasterFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setMapMasterFormOpen(false);
            setEditingMapMaster(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMapMaster ? "Edit Map Master" : "Tambah Map Master"}
            </DialogTitle>
            <DialogDescription>
              Anda bisa mengisi latitude/longitude manual atau klik langsung
              titik pada peta.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={mapMasterForm.handleSubmit(onMapMasterSubmit)}
            className="space-y-4 pt-2"
          >
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input
                {...mapMasterForm.register("title")}
                placeholder="Contoh: Area Parkir Utama"
              />
              {mapMasterForm.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {mapMasterForm.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                rows={3}
                {...mapMasterForm.register("content")}
                placeholder="Deskripsi titik lokasi..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  {...mapMasterForm.register("lat", { valueAsNumber: true })}
                />
                {mapMasterForm.formState.errors.lat && (
                  <p className="text-sm text-destructive">
                    {mapMasterForm.formState.errors.lat.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  {...mapMasterForm.register("lng", { valueAsNumber: true })}
                />
                {mapMasterForm.formState.errors.lng && (
                  <p className="text-sm text-destructive">
                    {mapMasterForm.formState.errors.lng.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Titik di Peta</Label>
              {hasMapsApiKey ? (
                <MapPointPicker
                  apiKey={normalizedMapsApiKey}
                  mapId={normalizedMapsMapId}
                  lat={mapLat}
                  lng={mapLng}
                  onPick={(lat, lng) => {
                    mapMasterForm.setValue("lat", Number(lat.toFixed(6)), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    mapMasterForm.setValue("lng", Number(lng.toFixed(6)), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  API key Google Maps tidak ditemukan. Isi `NEXT_GMAPS_API`
                  (atau `NEXT_PUBLIC_GMAPS_API`) untuk memilih titik langsung
                  dari peta.
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Klik di peta untuk mengisi lat/lng otomatis, atau ketik manual
                di field angka.
              </p>
            </div>

            <div className="grid gap-6">
              <ImageUploadField
                label="Gambar Lokasi (Opsional)"
                value={mapMasterForm.watch("image") || ""}
                onChange={(value) =>
                  mapMasterForm.setValue("image", value, {
                    shouldValidate: true,
                  })
                }
              />
              <ImageUploadField
                label="Icon Marker (Opsional)"
                value={mapMasterForm.watch("icon") || ""}
                onChange={(value) =>
                  mapMasterForm.setValue("icon", value, {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(mapMasterForm.watch("fasilitas"))}
                onCheckedChange={(checked) =>
                  mapMasterForm.setValue("fasilitas", Boolean(checked), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
              <Label>Jenis Fasilitas</Label>
            </div>

            <DialogFooter className="pt-4 mt-2 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMapMasterFormOpen(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Spinner className="mr-2 size-4" />}
                {editingMapMaster ? "Simpan Perubahan" : "Tambah Map"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Map Master Delete Dialog */}
      <AlertDialog
        open={Boolean(mapMasterDeleteDialog)}
        onOpenChange={(open) => {
          if (!open) setMapMasterDeleteDialog(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Map Master</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus map &quot;{mapMasterDeleteDialog?.title}&quot;? Relasi map
              pada destinasi/wahana/tour yang terhubung juga akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteMapMaster}
              disabled={submitting}
            >
              {submitting && <Spinner className="mr-2 size-4" />}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
