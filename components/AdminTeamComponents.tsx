"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "./layouts/site-header";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PageSize,
  type PaginationMeta,
} from "@/types/PaginationData";
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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
  IconUsers,
  IconCategory,
  IconWorld,
} from "@tabler/icons-react";

const API = "/api/team/admin";
const IMG_API = "/api/img";

type ViewMode = "members" | "categories" | "countries";
type TeamMemberStatus = "AKTIF" | "TIDAK_AKTIF" | "CUTI";

type MemberCountryItem = {
  id: number;
  nama: string;
};

type MemberListItem = {
  id: number;
  teamCategoryId: number;
  teamCategory: {
    id: number;
    title: string;
  };
  name: string;
  role: string;
  bio: string;
  avatar: string | null;
  experience: string;
  specialty: string;
  order: number;
  activeAdmin: boolean;
  status: TeamMemberStatus;
  harga: string;
  createdAt: string;
  updatedAt: string;
  countries: MemberCountryItem[];
};

type CategoryListItem = {
  id: number;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
  };
};

type CountryListItem = {
  id: number;
  nama: string;
  _count?: {
    anggotaTimNegara: number;
  };
};

type RefCategoryItem = {
  id: number;
  title: string;
};

type RefCountryItem = {
  id: number;
  nama: string;
};

type ApiResponse<T> = {
  data: T;
  status: "success" | "error";
  message: string;
  pagination?: PaginationMeta | null;
};

type MemberFormState = {
  teamCategoryId: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  experience: string;
  specialty: string;
  order: string;
  activeAdmin: boolean;
  status: TeamMemberStatus;
  harga: string;
  countryIds: number[];
};

const DEFAULT_TEAM_MEMBER_STATUSES: TeamMemberStatus[] = [
  "AKTIF",
  "TIDAK_AKTIF",
  "CUTI",
];

function teamMemberStatusLabel(value: TeamMemberStatus): string {
  if (value === "AKTIF") return "Aktif";
  if (value === "TIDAK_AKTIF") return "Tidak Aktif";
  return "Cuti";
}

type CategoryFormState = {
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  order: string;
};

type CountryFormState = {
  nama: string;
};

function getPageNumbers(page: number, totalPages: number): (number | "e")[] {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | "e")[] = [1];
  if (page > 3) pages.push("e");

  for (
    let idx = Math.max(2, page - 1);
    idx <= Math.min(totalPages - 1, page + 1);
    idx++
  ) {
    pages.push(idx);
  }

  if (page < totalPages - 2) pages.push("e");
  pages.push(totalPages);
  return pages;
}

function createEmptyMemberForm(): MemberFormState {
  return {
    teamCategoryId: "",
    name: "",
    role: "",
    bio: "",
    avatar: "",
    experience: "",
    specialty: "",
    order: "0",
    activeAdmin: false,
    status: "TIDAK_AKTIF",
    harga: "",
    countryIds: [],
  };
}

function createEmptyCategoryForm(): CategoryFormState {
  return {
    title: "",
    emoji: "👥",
    description: "",
    gradient: "linear-gradient(135deg, #2D6A4F, #52B788)",
    order: "0",
  };
}

function createEmptyCountryForm(): CountryFormState {
  return {
    nama: "",
  };
}

async function api<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API}${path}`, options);
  return response.json() as Promise<ApiResponse<T>>;
}

async function apiJson<T>(
  path: string,
  method: "POST" | "PUT",
  body: unknown,
): Promise<ApiResponse<T>> {
  return api<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("files", file);

  const response = await fetch(IMG_API, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  if (json.status === "success" && json.data?.id) {
    return `${IMG_API}?_id=${json.data.id}`;
  }

  toast.error(json.message || "Upload gambar gagal");
  return null;
}

function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
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
          placeholder="URL avatar atau upload gambar"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative"
          disabled={uploading}
        >
          {uploading ? <Spinner className="size-4" /> : <IconUpload className="size-4" />}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
      </div>
      {value ? (
        <img src={value} alt="Preview avatar" className="h-12 w-12 rounded-full border object-cover" />
      ) : null}
    </div>
  );
}

function PaginationBar({
  pagination,
  page,
  setPage,
}: {
  pagination: PaginationMeta;
  page: number;
  setPage: (next: number) => void;
}) {
  const offset = (pagination.page - 1) * pagination.limit;

  if (pagination.totalPages <= 0) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Menampilkan {offset + 1}–
        {Math.min(offset + pagination.limit, pagination.total)} dari {pagination.total}
      </p>

      {pagination.totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={
                  pagination.hasPrevPage
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>

            {getPageNumbers(page, pagination.totalPages).map((p, idx) =>
              p === "e" ? (
                <PaginationItem key={`e-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={`p-${p}`}>
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
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                className={
                  pagination.hasNextPage
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}

export default function AdminTeamComponents() {
  const [viewMode, setViewMode] = useState<ViewMode>("members");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSearchInput, setMemberSearchInput] = useState("");
  const [memberPagination, setMemberPagination] = useState<PaginationMeta | null>(
    null,
  );

  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySearchInput, setCategorySearchInput] = useState("");
  const [categoryPagination, setCategoryPagination] =
    useState<PaginationMeta | null>(null);

  const [countries, setCountries] = useState<CountryListItem[]>([]);
  const [countryPage, setCountryPage] = useState(1);
  const [countrySearch, setCountrySearch] = useState("");
  const [countrySearchInput, setCountrySearchInput] = useState("");
  const [countryPagination, setCountryPagination] =
    useState<PaginationMeta | null>(null);

  const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE);

  const [refCategories, setRefCategories] = useState<RefCategoryItem[]>([]);
  const [refCountries, setRefCountries] = useState<RefCountryItem[]>([]);
  const [refStatuses, setRefStatuses] = useState<TeamMemberStatus[]>(
    DEFAULT_TEAM_MEMBER_STATUSES,
  );

  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberListItem | null>(null);
  const [memberForm, setMemberForm] = useState<MemberFormState>(
    createEmptyMemberForm(),
  );
  const [memberDeleteOpen, setMemberDeleteOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<MemberListItem | null>(null);

  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryListItem | null>(
    null,
  );
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(
    createEmptyCategoryForm(),
  );
  const [categoryDeleteOpen, setCategoryDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] =
    useState<CategoryListItem | null>(null);

  const [countryFormOpen, setCountryFormOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryListItem | null>(null);
  const [countryForm, setCountryForm] = useState<CountryFormState>(
    createEmptyCountryForm(),
  );
  const [countryDeleteOpen, setCountryDeleteOpen] = useState(false);
  const [deletingCountry, setDeletingCountry] = useState<CountryListItem | null>(
    null,
  );

  const fetchRefs = useCallback(async () => {
    try {
      const json = await api<{
        categories: RefCategoryItem[];
        countries: RefCountryItem[];
        statuses?: TeamMemberStatus[];
      }>("/ref");
      if (json.status === "success" && json.data) {
        setRefCategories(json.data.categories || []);
        setRefCountries(json.data.countries || []);
        setRefStatuses(
          json.data.statuses && json.data.statuses.length > 0
            ? json.data.statuses
            : DEFAULT_TEAM_MEMBER_STATUSES,
        );
      }
    } catch {
      // No-op. refs can be refreshed later by any CRUD success.
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(memberPage),
        limit: String(limit),
      });
      if (memberSearch) params.set("search", memberSearch);

      const json = await api<MemberListItem[]>(`/?${params.toString()}`);
      if (json.status === "success") {
        setMembers(json.data || []);
        setMemberPagination(json.pagination || null);
      } else {
        toast.error(json.message || "Gagal memuat data anggota tim.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [memberPage, memberSearch, limit]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(categoryPage),
        limit: String(limit),
      });
      if (categorySearch) params.set("search", categorySearch);

      const json = await api<CategoryListItem[]>(
        `/categories?${params.toString()}`,
      );
      if (json.status === "success") {
        setCategories(json.data || []);
        setCategoryPagination(json.pagination || null);
      } else {
        toast.error(json.message || "Gagal memuat data kategori tim.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [categoryPage, categorySearch, limit]);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(countryPage),
        limit: String(limit),
      });
      if (countrySearch) params.set("search", countrySearch);

      const json = await api<CountryListItem[]>(
        `/countries?${params.toString()}`,
      );
      if (json.status === "success") {
        setCountries(json.data || []);
        setCountryPagination(json.pagination || null);
      } else {
        toast.error(json.message || "Gagal memuat data negara.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [countryPage, countrySearch, limit]);

  useEffect(() => {
    fetchRefs();
  }, [fetchRefs]);

  useEffect(() => {
    if (viewMode === "members") fetchMembers();
  }, [viewMode, fetchMembers]);

  useEffect(() => {
    if (viewMode === "categories") fetchCategories();
  }, [viewMode, fetchCategories]);

  useEffect(() => {
    if (viewMode === "countries") fetchCountries();
  }, [viewMode, fetchCountries]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (memberSearchInput !== memberSearch) {
        setMemberSearch(memberSearchInput);
        setMemberPage(1);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [memberSearch, memberSearchInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (categorySearchInput !== categorySearch) {
        setCategorySearch(categorySearchInput);
        setCategoryPage(1);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [categorySearch, categorySearchInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (countrySearchInput !== countrySearch) {
        setCountrySearch(countrySearchInput);
        setCountryPage(1);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [countrySearch, countrySearchInput]);

  const openMemberAdd = () => {
    setEditingMember(null);
    setMemberForm(createEmptyMemberForm());
    setMemberFormOpen(true);
  };

  const openMemberEdit = (item: MemberListItem) => {
    setEditingMember(item);
    setMemberForm({
      teamCategoryId: String(item.teamCategoryId),
      name: item.name,
      role: item.role,
      bio: item.bio,
      avatar: item.avatar || "",
      experience: item.experience,
      specialty: item.specialty,
      order: String(item.order),
      activeAdmin: item.activeAdmin,
      status: item.status || "TIDAK_AKTIF",
      harga: item.harga || "",
      countryIds: item.countries.map((country) => country.id),
    });
    setMemberFormOpen(true);
  };

  const selectedCategoryTitle = useMemo(() => {
    const selectedId = Number(memberForm.teamCategoryId);
    if (!selectedId) return "";
    const matched = refCategories.find((category) => category.id === selectedId);
    return matched?.title?.trim().toLowerCase() || "";
  }, [memberForm.teamCategoryId, refCategories]);

  const isGuideCategory = selectedCategoryTitle === "tim pemandu wisata";

  const onMemberCountryToggle = (countryId: number, checked: boolean) => {
    setMemberForm((prev) => {
      if (checked) {
        return {
          ...prev,
          countryIds: Array.from(new Set([...prev.countryIds, countryId])),
        };
      }
      return {
        ...prev,
        countryIds: prev.countryIds.filter((id) => id !== countryId),
      };
    });
  };

  const submitMemberForm = async () => {
    const teamCategoryId = Number(memberForm.teamCategoryId);
    const payload = {
      teamCategoryId,
      name: memberForm.name.trim(),
      role: memberForm.role.trim(),
      bio: memberForm.bio.trim(),
      avatar: memberForm.avatar.trim(),
      experience: memberForm.experience.trim(),
      specialty: memberForm.specialty.trim(),
      order: Number(memberForm.order || 0),
      activeAdmin: memberForm.activeAdmin,
      status: memberForm.status,
      harga: memberForm.harga.trim(),
      countryIds: memberForm.countryIds,
    };

    if (!payload.teamCategoryId) {
      toast.error("Kategori tim wajib dipilih.");
      return;
    }
    if (!payload.name || !payload.role || !payload.experience || !payload.specialty) {
      toast.error("Nama, role, pengalaman, dan keahlian wajib diisi.");
      return;
    }
    if (isGuideCategory && !payload.harga) {
      toast.error("Harga wajib diisi untuk kategori Tim Pemandu Wisata.");
      return;
    }

    setSubmitting(true);
    try {
      const json = editingMember
        ? await apiJson<MemberListItem>(`/?_id=${editingMember.id}`, "PUT", payload)
        : await apiJson<MemberListItem>("/", "POST", payload);

      if (json.status === "success") {
        toast.success(json.message || "Data anggota tim berhasil disimpan.");
        setMemberFormOpen(false);
        setEditingMember(null);
        setMemberForm(createEmptyMemberForm());
        fetchMembers();
      } else {
        toast.error(json.message || "Gagal menyimpan anggota tim.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteMember = async () => {
    if (!deletingMember) return;

    setSubmitting(true);
    try {
      const json = await api<null>(`/?_id=${deletingMember.id}`, {
        method: "DELETE",
      });
      if (json.status === "success") {
        toast.success(json.message || "Anggota tim berhasil dihapus.");
        setMemberDeleteOpen(false);
        setDeletingMember(null);
        fetchMembers();
      } else {
        toast.error(json.message || "Gagal menghapus anggota tim.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const openCategoryAdd = () => {
    setEditingCategory(null);
    setCategoryForm(createEmptyCategoryForm());
    setCategoryFormOpen(true);
  };

  const openCategoryEdit = (item: CategoryListItem) => {
    setEditingCategory(item);
    setCategoryForm({
      title: item.title,
      emoji: item.emoji,
      description: item.description,
      gradient: item.gradient,
      order: String(item.order),
    });
    setCategoryFormOpen(true);
  };

  const submitCategoryForm = async () => {
    const payload = {
      title: categoryForm.title.trim(),
      emoji: categoryForm.emoji.trim(),
      description: categoryForm.description.trim(),
      gradient: categoryForm.gradient.trim(),
      order: Number(categoryForm.order || 0),
    };

    if (!payload.title) {
      toast.error("Judul kategori wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const json = editingCategory
        ? await apiJson<CategoryListItem>(
            `/categories?_id=${editingCategory.id}`,
            "PUT",
            payload,
          )
        : await apiJson<CategoryListItem>("/categories", "POST", payload);

      if (json.status === "success") {
        toast.success(json.message || "Kategori tim berhasil disimpan.");
        setCategoryFormOpen(false);
        setEditingCategory(null);
        setCategoryForm(createEmptyCategoryForm());
        fetchCategories();
        fetchRefs();
      } else {
        toast.error(json.message || "Gagal menyimpan kategori tim.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;

    setSubmitting(true);
    try {
      const json = await api<null>(`/categories?_id=${deletingCategory.id}`, {
        method: "DELETE",
      });

      if (json.status === "success") {
        toast.success(json.message || "Kategori tim berhasil dihapus.");
        setCategoryDeleteOpen(false);
        setDeletingCategory(null);
        fetchCategories();
        fetchRefs();
      } else {
        toast.error(json.message || "Gagal menghapus kategori tim.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const openCountryAdd = () => {
    setEditingCountry(null);
    setCountryForm(createEmptyCountryForm());
    setCountryFormOpen(true);
  };

  const openCountryEdit = (item: CountryListItem) => {
    setEditingCountry(item);
    setCountryForm({ nama: item.nama });
    setCountryFormOpen(true);
  };

  const submitCountryForm = async () => {
    const payload = {
      nama: countryForm.nama.trim(),
    };

    if (!payload.nama) {
      toast.error("Nama negara wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const json = editingCountry
        ? await apiJson<CountryListItem>(
            `/countries?_id=${editingCountry.id}`,
            "PUT",
            payload,
          )
        : await apiJson<CountryListItem>("/countries", "POST", payload);

      if (json.status === "success") {
        toast.success(json.message || "Data negara berhasil disimpan.");
        setCountryFormOpen(false);
        setEditingCountry(null);
        setCountryForm(createEmptyCountryForm());
        fetchCountries();
        fetchRefs();
      } else {
        toast.error(json.message || "Gagal menyimpan negara.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteCountry = async () => {
    if (!deletingCountry) return;

    setSubmitting(true);
    try {
      const json = await api<null>(`/countries?_id=${deletingCountry.id}`, {
        method: "DELETE",
      });

      if (json.status === "success") {
        toast.success(json.message || "Negara berhasil dihapus.");
        setCountryDeleteOpen(false);
        setDeletingCountry(null);
        fetchCountries();
        fetchRefs();
      } else {
        toast.error(json.message || "Gagal menghapus negara.");
      }
    } catch {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const activePagination = useMemo(() => {
    if (viewMode === "members") return memberPagination;
    if (viewMode === "categories") return categoryPagination;
    return countryPagination;
  }, [viewMode, memberPagination, categoryPagination, countryPagination]);

  const handleLimitChange = (value: string) => {
    const nextLimit = Number(value) as PageSize;
    setLimit(nextLimit);

    if (viewMode === "members") setMemberPage(1);
    if (viewMode === "categories") setCategoryPage(1);
    if (viewMode === "countries") setCountryPage(1);
  };

  return (
    <React.Fragment>
      <SiteHeader title="Tim Pengelola" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Admin Tim</h2>
                <p className="text-muted-foreground text-sm">
                  CRUD data anggota tim, kategori tim, dan negara/bahasa.
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

                {viewMode === "members" ? (
                  <Button size="sm" onClick={openMemberAdd}>
                    <IconPlus className="mr-1 size-4" />
                    Tambah Anggota
                  </Button>
                ) : null}

                {viewMode === "categories" ? (
                  <Button size="sm" onClick={openCategoryAdd}>
                    <IconPlus className="mr-1 size-4" />
                    Tambah Kategori
                  </Button>
                ) : null}

                {viewMode === "countries" ? (
                  <Button size="sm" onClick={openCountryAdd}>
                    <IconPlus className="mr-1 size-4" />
                    Tambah Negara
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={viewMode === "members" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("members")}
              >
                <IconUsers className="mr-1 size-4" />
                Anggota Tim
              </Button>
              <Button
                variant={viewMode === "categories" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("categories")}
              >
                <IconCategory className="mr-1 size-4" />
                Kategori Tim
              </Button>
              <Button
                variant={viewMode === "countries" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("countries")}
              >
                <IconWorld className="mr-1 size-4" />
                Negara
              </Button>
            </div>

            <div className="relative max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              {viewMode === "members" ? (
                <Input
                  placeholder="Cari nama/role/kategori/negara..."
                  value={memberSearchInput}
                  onChange={(e) => setMemberSearchInput(e.target.value)}
                  className="pl-9"
                />
              ) : null}

              {viewMode === "categories" ? (
                <Input
                  placeholder="Cari judul/deskripsi kategori..."
                  value={categorySearchInput}
                  onChange={(e) => setCategorySearchInput(e.target.value)}
                  className="pl-9"
                />
              ) : null}

              {viewMode === "countries" ? (
                <Input
                  placeholder="Cari nama negara..."
                  value={countrySearchInput}
                  onChange={(e) => setCountrySearchInput(e.target.value)}
                  className="pl-9"
                />
              ) : null}
            </div>

            {viewMode === "members" ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Avatar</TableHead>
                      <TableHead>Nama / Role</TableHead>
                      <TableHead className="hidden md:table-cell">Kategori</TableHead>
                      <TableHead className="hidden lg:table-cell">Negara/Bahasa</TableHead>
                      <TableHead className="hidden lg:table-cell">Pengalaman</TableHead>
                      <TableHead className="text-center">Urutan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Spinner className="size-5" />
                            <span className="text-muted-foreground">Memuat...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : members.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                          {memberSearch
                            ? `Tidak ada hasil untuk "${memberSearch}"`
                            : "Belum ada anggota tim."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      members.map((item, idx) => {
                        const offset = memberPagination
                          ? (memberPagination.page - 1) * memberPagination.limit
                          : 0;

                        return (
                          <TableRow key={item.id}>
                            <TableCell>{offset + idx + 1}</TableCell>
                            <TableCell>
                              {item.avatar ? (
                                <img
                                  src={item.avatar}
                                  alt={item.name}
                                  className="h-9 w-9 rounded-full object-cover border"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                  {item.name.charAt(0)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.role}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                                {item.teamCategory.title}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {item.countries.length > 0 ? (
                                  item.countries.map((country) => (
                                    <span
                                      key={`${item.id}-${country.id}`}
                                      className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium"
                                    >
                                      {country.nama}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {item.experience}
                            </TableCell>
                            <TableCell className="text-center">{item.order}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openMemberEdit(item)}
                                >
                                  <IconEdit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => {
                                    setDeletingMember(item);
                                    setMemberDeleteOpen(true);
                                  }}
                                >
                                  <IconTrash className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : null}

            {viewMode === "categories" ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Emoji</TableHead>
                      <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                      <TableHead className="text-center">Jumlah Anggota</TableHead>
                      <TableHead className="text-center">Urutan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Spinner className="size-5" />
                            <span className="text-muted-foreground">Memuat...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          {categorySearch
                            ? `Tidak ada hasil untuk "${categorySearch}"`
                            : "Belum ada kategori tim."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((item, idx) => {
                        const offset = categoryPagination
                          ? (categoryPagination.page - 1) * categoryPagination.limit
                          : 0;

                        return (
                          <TableRow key={item.id}>
                            <TableCell>{offset + idx + 1}</TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.emoji}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[320px] truncate">
                              {item.description}
                            </TableCell>
                            <TableCell className="text-center">{item._count?.members ?? 0}</TableCell>
                            <TableCell className="text-center">{item.order}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openCategoryEdit(item)}
                                >
                                  <IconEdit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => {
                                    setDeletingCategory(item);
                                    setCategoryDeleteOpen(true);
                                  }}
                                >
                                  <IconTrash className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : null}

            {viewMode === "countries" ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Nama Negara</TableHead>
                      <TableHead className="text-center">Dipakai Anggota</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Spinner className="size-5" />
                            <span className="text-muted-foreground">Memuat...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : countries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                          {countrySearch
                            ? `Tidak ada hasil untuk "${countrySearch}"`
                            : "Belum ada negara."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      countries.map((item, idx) => {
                        const offset = countryPagination
                          ? (countryPagination.page - 1) * countryPagination.limit
                          : 0;

                        return (
                          <TableRow key={item.id}>
                            <TableCell>{offset + idx + 1}</TableCell>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell className="text-center">
                              {item._count?.anggotaTimNegara ?? 0}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openCountryEdit(item)}
                                >
                                  <IconEdit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => {
                                    setDeletingCountry(item);
                                    setCountryDeleteOpen(true);
                                  }}
                                >
                                  <IconTrash className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : null}

            {activePagination ? (
              <PaginationBar
                pagination={activePagination}
                page={
                  viewMode === "members"
                    ? memberPage
                    : viewMode === "categories"
                      ? categoryPage
                      : countryPage
                }
                setPage={(nextPage) => {
                  if (viewMode === "members") setMemberPage(nextPage);
                  if (viewMode === "categories") setCategoryPage(nextPage);
                  if (viewMode === "countries") setCountryPage(nextPage);
                }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <Dialog
        open={memberFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setMemberFormOpen(false);
            setEditingMember(null);
            setMemberForm(createEmptyMemberForm());
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
            </DialogTitle>
            <DialogDescription>
              Isi data profil anggota tim dan pilih negara/bahasa yang dikuasai.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Kategori Tim</Label>
              <Select
                value={memberForm.teamCategoryId}
                onValueChange={(value) =>
                  setMemberForm((prev) => ({ ...prev, teamCategoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {refCategories.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input
                type="number"
                value={memberForm.order}
                onChange={(e) =>
                  setMemberForm((prev) => ({ ...prev, order: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Status Admin</Label>
              <div className="h-9 rounded-md border px-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {memberForm.activeAdmin ? "Aktif" : "Nonaktif"}
                </span>
                <Switch
                  checked={memberForm.activeAdmin}
                  onCheckedChange={(checked) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      activeAdmin: Boolean(checked),
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status Member</Label>
              <Select
                value={memberForm.status}
                onValueChange={(value) =>
                  setMemberForm((prev) => ({
                    ...prev,
                    status: value as TeamMemberStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status member" />
                </SelectTrigger>
                <SelectContent>
                  {refStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {teamMemberStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isGuideCategory ? (
              <div className="space-y-2">
                <Label>Harga</Label>
                <Input
                  value={memberForm.harga}
                  onChange={(e) =>
                    setMemberForm((prev) => ({ ...prev, harga: e.target.value }))
                  }
                  placeholder="Contoh: 250000 atau Rp 250.000"
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={memberForm.name}
                onChange={(e) =>
                  setMemberForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={memberForm.role}
                onChange={(e) =>
                  setMemberForm((prev) => ({ ...prev, role: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Pengalaman</Label>
              <Input
                value={memberForm.experience}
                onChange={(e) =>
                  setMemberForm((prev) => ({ ...prev, experience: e.target.value }))
                }
                placeholder="Contoh: 5 tahun"
              />
            </div>

            <div className="space-y-2">
              <Label>Keahlian</Label>
              <Input
                value={memberForm.specialty}
                onChange={(e) =>
                  setMemberForm((prev) => ({ ...prev, specialty: e.target.value }))
                }
                placeholder="Contoh: Trekking, budaya, bahasa"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Avatar"
                value={memberForm.avatar}
                onChange={(next) =>
                  setMemberForm((prev) => ({ ...prev, avatar: next }))
                }
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>Bio</Label>
              <textarea
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                value={memberForm.bio}
                onChange={(e) =>
                  setMemberForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Ringkasan profil anggota tim"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>Negara / Bahasa yang Dikuasai</Label>
              <div className="rounded-md border p-3 max-h-48 overflow-y-auto space-y-2">
                {refCountries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada data negara. Tambahkan data negara terlebih dahulu.
                  </p>
                ) : (
                  refCountries.map((country) => {
                    const checked = memberForm.countryIds.includes(country.id);
                    return (
                      <label
                        key={country.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            onMemberCountryToggle(country.id, Boolean(value))
                          }
                        />
                        <span>{country.nama}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setMemberFormOpen(false)}
            >
              Batal
            </Button>
            <Button type="button" disabled={submitting} onClick={submitMemberForm}>
              {submitting ? <Spinner className="mr-2 size-4" /> : null}
              {editingMember ? "Simpan Perubahan" : "Tambah Anggota"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={memberDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setMemberDeleteOpen(false);
            setDeletingMember(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota Tim</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin menghapus anggota tim "{deletingMember?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteMember}
              disabled={submitting}
            >
              {submitting ? <Spinner className="mr-2 size-4" /> : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={categoryFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryFormOpen(false);
            setEditingCategory(null);
            setCategoryForm(createEmptyCategoryForm());
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Kategori Tim" : "Tambah Kategori Tim"}
            </DialogTitle>
            <DialogDescription>
              Kategori ini akan digunakan untuk mengelompokkan anggota tim.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Judul</Label>
              <Input
                value={categoryForm.title}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Contoh: Tim Pemandu Wisata"
              />
            </div>

            <div className="space-y-2">
              <Label>Emoji</Label>
              <Input
                value={categoryForm.emoji}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, emoji: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input
                type="number"
                value={categoryForm.order}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, order: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Deskripsi</Label>
              <textarea
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Gradient</Label>
              <Input
                value={categoryForm.gradient}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, gradient: e.target.value }))
                }
                placeholder="linear-gradient(135deg, #2D6A4F, #52B788)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCategoryFormOpen(false)}
            >
              Batal
            </Button>
            <Button type="button" disabled={submitting} onClick={submitCategoryForm}>
              {submitting ? <Spinner className="mr-2 size-4" /> : null}
              {editingCategory ? "Simpan Perubahan" : "Tambah Kategori"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={categoryDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryDeleteOpen(false);
            setDeletingCategory(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori Tim</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin menghapus kategori "{deletingCategory?.title}"?
              Semua anggota tim di kategori ini juga akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteCategory}
              disabled={submitting}
            >
              {submitting ? <Spinner className="mr-2 size-4" /> : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={countryFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCountryFormOpen(false);
            setEditingCountry(null);
            setCountryForm(createEmptyCountryForm());
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? "Edit Negara" : "Tambah Negara"}
            </DialogTitle>
            <DialogDescription>
              Negara digunakan untuk relasi kemampuan bahasa anggota tim.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Nama Negara</Label>
            <Input
              value={countryForm.nama}
              onChange={(e) =>
                setCountryForm((prev) => ({ ...prev, nama: e.target.value }))
              }
              placeholder="Contoh: Indonesia"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCountryFormOpen(false)}
            >
              Batal
            </Button>
            <Button type="button" disabled={submitting} onClick={submitCountryForm}>
              {submitting ? <Spinner className="mr-2 size-4" /> : null}
              {editingCountry ? "Simpan Perubahan" : "Tambah Negara"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={countryDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCountryDeleteOpen(false);
            setDeletingCountry(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Negara</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin menghapus negara "{deletingCountry?.nama}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteCountry}
              disabled={submitting}
            >
              {submitting ? <Spinner className="mr-2 size-4" /> : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
