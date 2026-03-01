"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiteHeader } from './layouts/site-header'
import { AdminUserListItem, RoleItem, UserLoginItem } from '@/types/AdminUserType'
import { PaginationMeta, PAGE_SIZE_OPTIONS, PageSize, DEFAULT_PAGE_SIZE } from '@/types/PaginationData'
import { userSchema, userLoginSchema, roleSchema } from '@/validation/userSchema'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'
import { IconArrowLeft, IconEdit, IconTrash, IconPlus, IconSearch, IconSettings, IconUpload, IconKey, IconShieldCheck } from '@tabler/icons-react'

const API = '/api/users/admin'
const IMG_API = '/api/img'

async function api(path: string, opts?: RequestInit) { const res = await fetch(`${API}${path}`, opts); return res.json() }
async function apiJson(path: string, method: string, body: unknown) { return api(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) }
async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData(); fd.append('files', file)
    const res = await fetch(IMG_API, { method: 'POST', body: fd })
    const json = await res.json()
    if (json.status === 'success') return `${IMG_API}?_id=${json.data.id}`
    toast.error(json.message || 'Upload gagal'); return null
}
const fmtDate = (s: string) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
function getPageNumbers(page: number, totalPages: number): (number | 'e')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const p: (number | 'e')[] = [1]; if (page > 3) p.push('e')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) p.push(i)
    if (page < totalPages - 2) p.push('e'); p.push(totalPages); return p
}
function ImageUploadField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
    const [uploading, setUploading] = useState(false)
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setUploading(true); const url = await uploadImage(f); if (url) onChange(url); setUploading(false) }
    return (<div className="space-y-2"><Label>{label}</Label><div className="flex items-center gap-2"><Input value={value} onChange={e => onChange(e.target.value)} placeholder="URL atau upload..." className="flex-1" /><Button type="button" variant="outline" size="sm" className="relative" disabled={uploading}>{uploading ? <Spinner className="size-4" /> : <IconUpload className="size-4" />}<input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" /></Button></div>{value && <img src={value} alt="" className="h-12 rounded-full border object-cover" />}</div>)
}
function PaginationBar({ pagination, page, setPage }: { pagination: PaginationMeta; page: number; setPage: (p: number) => void }) {
    const offset = (pagination.page - 1) * pagination.limit; if (pagination.totalPages <= 0) return null
    return (<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4"><p className="text-sm text-muted-foreground">Menampilkan {offset + 1}–{Math.min(offset + pagination.limit, pagination.total)} dari {pagination.total}</p>{pagination.totalPages > 1 && (<Pagination><PaginationContent><PaginationItem><PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'} /></PaginationItem>{getPageNumbers(page, pagination.totalPages).map((p, i) => p === 'e' ? <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem> : <PaginationItem key={p}><PaginationLink isActive={p === page} onClick={() => setPage(p)} className="cursor-pointer">{p}</PaginationLink></PaginationItem>)}<PaginationItem><PaginationNext onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'} /></PaginationItem></PaginationContent></Pagination>)}</div>)
}

// ═══════════════════════════════════════════════════════════
export default function AdminUserComponents() {
    // List State
    const [users, setUsers] = useState<AdminUserListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<PageSize>(DEFAULT_PAGE_SIZE)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    // View mode
    const [viewMode, setViewMode] = useState<'list' | 'manage' | 'roles'>('list')
    const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null)
    const [refRoles, setRefRoles] = useState<RoleItem[]>([])
    const [userLogins, setUserLogins] = useState<UserLoginItem[]>([])

    // Dialogs
    const [userFormOpen, setUserFormOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingUser, setDeletingUser] = useState<AdminUserListItem | null>(null)

    const [loginFormOpen, setLoginFormOpen] = useState(false)
    const [editingLogin, setEditingLogin] = useState<UserLoginItem | null>(null)
    const [loginDeleteOpen, setLoginDeleteOpen] = useState(false)
    const [deletingLogin, setDeletingLogin] = useState<UserLoginItem | null>(null)

    // Role management
    const [roles, setRoles] = useState<(RoleItem & { _count?: { UserRole: number } })[]>([])
    const [rolePage, setRolePage] = useState(1)
    const [rolePagination, setRolePagination] = useState<PaginationMeta | null>(null)
    const [roleSearchInput, setRoleSearchInput] = useState('')
    const [roleSearch, setRoleSearch] = useState('')
    const [roleFormOpen, setRoleFormOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null)
    const [roleDeleteOpen, setRoleDeleteOpen] = useState(false)
    const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null)

    // ─── Fetch Users ────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) }); if (search) params.set('search', search)
            const json = await api(`/?${params}`)
            if (json.status === 'success') { setUsers(json.data); setPagination(json.pagination) } else toast.error(json.message)
        } catch { toast.error('Gagal terhubung') } finally { setLoading(false) }
    }, [page, limit, search])
    useEffect(() => { fetchUsers() }, [fetchUsers])
    useEffect(() => { const t = setTimeout(() => { if (searchInput !== search) { setSearch(searchInput); setPage(1) } }, 400); return () => clearTimeout(t) }, [searchInput, search])
    useEffect(() => { api('/ref').then(json => { if (json.status === 'success') setRefRoles(json.data.roles) }) }, [])

    // ─── Manage User ────────────────────────────────────────
    const openManage = async (u: AdminUserListItem) => {
        setSelectedUser(u); setViewMode('manage')
        try { const json = await api(`/logins?userId=${u.id}`); if (json.status === 'success') setUserLogins(json.data) } catch { /* */ }
    }
    const refreshManage = async () => {
        if (!selectedUser) return
        try {
            const [usersJson, loginsJson] = await Promise.all([api(`/?page=1&limit=1&search=${encodeURIComponent(selectedUser.email)}`), api(`/logins?userId=${selectedUser.id}`)])
            if (usersJson.status === 'success' && usersJson.data.length) setSelectedUser(usersJson.data[0])
            if (loginsJson.status === 'success') setUserLogins(loginsJson.data)
        } catch { /* */ }
    }

    // ─── User Form ──────────────────────────────────────────
    const userForm = useForm({ resolver: yupResolver(userSchema), defaultValues: { name: '', email: '', age: 25, gender: 'MALE' as const, nationality: 'Indonesia', phoneCode: '+62', phoneNumber: '', address: '', avatar: '' } })
    const openUserAdd = () => { setEditingUser(null); userForm.reset({ name: '', email: '', age: 25, gender: 'MALE', nationality: 'Indonesia', phoneCode: '+62', phoneNumber: '', address: '', avatar: '' }); setUserFormOpen(true) }
    const openUserEdit = (u: AdminUserListItem) => { setEditingUser(u); userForm.reset({ name: u.name, email: u.email, age: u.age, gender: u.gender, nationality: u.nationality, phoneCode: u.phoneCode, phoneNumber: u.phoneNumber, address: u.address, avatar: u.avatar }); setUserFormOpen(true) }

    const onUserSubmit = async (data: Record<string, unknown>) => {
        setSubmitting(true)
        try {
            const json = editingUser ? await apiJson(`/?_id=${editingUser.id}`, 'PUT', data) : await apiJson('/', 'POST', data)
            if (json.status === 'success') { toast.success(json.message); setUserFormOpen(false); fetchUsers(); if (editingUser && selectedUser && editingUser.id === selectedUser.id) setSelectedUser(json.data) } else toast.error(json.message)
        } catch { toast.error('Gagal') } finally { setSubmitting(false) }
    }

    const confirmDeleteUser = async () => {
        if (!deletingUser) return; setSubmitting(true)
        try {
            const json = await api(`/?_id=${deletingUser.id}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setDeleteOpen(false); setDeletingUser(null); if (viewMode === 'manage') { setViewMode('list'); setSelectedUser(null) }; fetchUsers() } else toast.error(json.message)
        } catch { toast.error('Gagal') } finally { setSubmitting(false) }
    }

    // ─── Role Assignment ────────────────────────────────────
    const [savingRoles, setSavingRoles] = useState(false)
    const saveUserRoles = async (roleIds: number[]) => {
        if (!selectedUser) return; setSavingRoles(true)
        try {
            const json = await apiJson('/roles', 'POST', { userId: selectedUser.id, roleIds })
            if (json.status === 'success') { toast.success(json.message); refreshManage() } else toast.error(json.message)
        } catch { toast.error('Gagal') } finally { setSavingRoles(false) }
    }

    // ─── Login CRUD ─────────────────────────────────────────
    const loginForm = useForm({ resolver: yupResolver(userLoginSchema), defaultValues: { Username: '', Password: '' } })
    const openLoginAdd = () => { setEditingLogin(null); loginForm.reset({ Username: '', Password: '' }); setLoginFormOpen(true) }
    const openLoginEdit = (l: UserLoginItem) => { setEditingLogin(l); loginForm.reset({ Username: l.Username, Password: '' }); setLoginFormOpen(true) }

    const onLoginSubmit = async (data: { Username: string; Password: string }) => {
        if (!selectedUser) return; setSubmitting(true)
        try {
            const json = editingLogin ? await apiJson(`/logins?_id=${editingLogin.id}`, 'PUT', data) : await apiJson('/logins', 'POST', { ...data, userId: selectedUser.id })
            if (json.status === 'success') { toast.success(json.message); setLoginFormOpen(false); refreshManage() } else toast.error(json.message)
        } catch { toast.error('Gagal') } finally { setSubmitting(false) }
    }
    const confirmDeleteLogin = async () => {
        if (!deletingLogin) return; setSubmitting(true)
        try {
            const json = await api(`/logins?_id=${deletingLogin.id}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setLoginDeleteOpen(false); setDeletingLogin(null); refreshManage() } else toast.error(json.message)
        } catch { toast.error('Gagal') } finally { setSubmitting(false) }
    }

    // ─── Fetch Roles ────────────────────────────────────────
    const fetchRoles = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(rolePage), limit: String(limit) }); if (roleSearch) params.set('search', roleSearch)
            const json = await api(`/manage-roles?${params}`)
            if (json.status === 'success') { setRoles(json.data); setRolePagination(json.pagination) } else toast.error(json.message)
        } catch { toast.error('Gagal terhubung') } finally { setLoading(false) }
    }, [rolePage, limit, roleSearch])
    useEffect(() => { if (viewMode === 'roles') fetchRoles() }, [viewMode, fetchRoles])
    useEffect(() => { const t = setTimeout(() => { if (roleSearchInput !== roleSearch) { setRoleSearch(roleSearchInput); setRolePage(1) } }, 400); return () => clearTimeout(t) }, [roleSearchInput, roleSearch])

    // ─── Role Form ──────────────────────────────────────────
    const roleForm = useForm({ resolver: yupResolver(roleSchema), defaultValues: { name: '', description: '' } })
    const openRoleAdd = () => { setEditingRole(null); roleForm.reset({ name: '', description: '' }); setRoleFormOpen(true) }
    const openRoleEdit = (r: RoleItem) => { setEditingRole(r); roleForm.reset({ name: r.name, description: r.description || '' }); setRoleFormOpen(true) }

    const onRoleSubmit = async (data: { name: string; description: string }) => {
        setSubmitting(true)
        try {
            const json = editingRole ? await apiJson(`/manage-roles?_id=${editingRole.id}`, 'PUT', data) : await apiJson('/manage-roles', 'POST', data)
            if (json.status === 'success') { toast.success(json.message); setRoleFormOpen(false); fetchRoles(); api('/ref').then(j => { if (j.status === 'success') setRefRoles(j.data.roles) }) } else toast.error(json.message)
        } catch { toast.error('Gagal') } finally { setSubmitting(false) }
    }
    const confirmDeleteRole = async () => {
        if (!deletingRole) return; setSubmitting(true)
        try {
            const json = await api(`/manage-roles?_id=${deletingRole.id}`, { method: 'DELETE' })
            if (json.status === 'success') { toast.success(json.message); setRoleDeleteOpen(false); setDeletingRole(null); fetchRoles() } else toast.error(json.message)
        } catch { toast.error('Gagal') } finally { setSubmitting(false) }
    }

    const genderLabel = (g: string) => g === 'MALE' ? 'Laki-laki' : 'Perempuan'

    // ═══════════════════════════════════════════════════════
    // RENDER DIALOGS
    // ═══════════════════════════════════════════════════════
    function renderDialogs() {
        return (<>
            {/* User Form */}
            <Dialog open={userFormOpen} onOpenChange={o => { if (!o) { setUserFormOpen(false); setEditingUser(null) } }}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader><DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle><DialogDescription>Isi informasi pengguna.</DialogDescription></DialogHeader>
                    <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 space-y-2"><Label>Nama</Label><Input {...userForm.register('name')} />{userForm.formState.errors.name && <p className="text-sm text-destructive">{userForm.formState.errors.name.message}</p>}</div>
                        <div className="space-y-2"><Label>Email</Label><Input type="email" {...userForm.register('email')} />{userForm.formState.errors.email && <p className="text-sm text-destructive">{userForm.formState.errors.email.message}</p>}</div>
                        <div className="space-y-2"><Label>Umur</Label><Input type="number" {...userForm.register('age')} />{userForm.formState.errors.age && <p className="text-sm text-destructive">{userForm.formState.errors.age.message}</p>}</div>
                        <div className="space-y-2"><Label>Gender</Label><select {...userForm.register('gender')} className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"><option value="MALE">Laki-laki</option><option value="FEMALE">Perempuan</option></select></div>
                        <div className="space-y-2"><Label>Kewarganegaraan</Label><Input {...userForm.register('nationality')} /></div>
                        <div className="space-y-2"><Label>Kode Telepon</Label><Input {...userForm.register('phoneCode')} placeholder="+62" /></div>
                        <div className="space-y-2"><Label>Nomor Telepon</Label><Input {...userForm.register('phoneNumber')} /></div>
                        <div className="sm:col-span-2 space-y-2"><Label>Alamat</Label><Input {...userForm.register('address')} /></div>
                        <div className="sm:col-span-2"><ImageUploadField value={userForm.watch('avatar')} onChange={v => userForm.setValue('avatar', v)} label="Avatar" /></div>
                        <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setUserFormOpen(false)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}{editingUser ? 'Simpan' : 'Tambah'}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Delete User */}
            <AlertDialog open={deleteOpen} onOpenChange={o => { if (!o) { setDeleteOpen(false); setDeletingUser(null) } }}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Pengguna</AlertDialogTitle><AlertDialogDescription>Semua role dan login terkait juga akan dihapus. Lanjutkan?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeleteUser} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Login Form */}
            <Dialog open={loginFormOpen} onOpenChange={o => { if (!o) { setLoginFormOpen(false); setEditingLogin(null) } }}>
                <DialogContent><DialogHeader><DialogTitle>{editingLogin ? 'Edit Login' : 'Tambah Login'}</DialogTitle><DialogDescription>{editingLogin ? 'Kosongkan password jika tidak ingin mengubah.' : 'Buat kredensial login baru.'}</DialogDescription></DialogHeader>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <div className="space-y-2"><Label>Username</Label><Input {...loginForm.register('Username')} />{loginForm.formState.errors.Username && <p className="text-sm text-destructive">{loginForm.formState.errors.Username.message}</p>}</div>
                        <div className="space-y-2"><Label>Password {editingLogin && <span className="text-muted-foreground text-xs">(kosongkan jika tidak ganti)</span>}</Label><Input type="password" {...loginForm.register('Password')} />{loginForm.formState.errors.Password && <p className="text-sm text-destructive">{loginForm.formState.errors.Password.message}</p>}</div>
                        <DialogFooter><Button type="button" variant="outline" onClick={() => setLoginFormOpen(false)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Delete Login */}
            <AlertDialog open={loginDeleteOpen} onOpenChange={o => { if (!o) { setLoginDeleteOpen(false); setDeletingLogin(null) } }}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Login</AlertDialogTitle><AlertDialogDescription>Hapus login &quot;{deletingLogin?.Username}&quot;?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeleteLogin} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Role Form */}
            <Dialog open={roleFormOpen} onOpenChange={o => { if (!o) { setRoleFormOpen(false); setEditingRole(null) } }}>
                <DialogContent><DialogHeader><DialogTitle>{editingRole ? 'Edit Role' : 'Tambah Role'}</DialogTitle></DialogHeader>
                    <form onSubmit={roleForm.handleSubmit(onRoleSubmit)} className="space-y-4">
                        <div className="space-y-2"><Label>Nama Role</Label><Input {...roleForm.register('name')} />{roleForm.formState.errors.name && <p className="text-sm text-destructive">{roleForm.formState.errors.name.message}</p>}</div>
                        <div className="space-y-2"><Label>Deskripsi</Label><Input {...roleForm.register('description')} /></div>
                        <DialogFooter><Button type="button" variant="outline" onClick={() => setRoleFormOpen(false)}>Batal</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Simpan</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Delete Role */}
            <AlertDialog open={roleDeleteOpen} onOpenChange={o => { if (!o) { setRoleDeleteOpen(false); setDeletingRole(null) } }}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Role</AlertDialogTitle><AlertDialogDescription>Hapus role &quot;{deletingRole?.name}&quot;? Semua user yang memiliki role ini akan kehilangan akses.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDeleteRole} disabled={submitting}>{submitting && <Spinner className="mr-2 size-4" />}Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>)
    }

    // ═══════════════════════════════════════════════════════
    // ROLES MANAGEMENT VIEW
    // ═══════════════════════════════════════════════════════
    if (viewMode === 'roles') {
        return (<React.Fragment><SiteHeader title="Kelola Role" /><div className="flex flex-1 flex-col"><div className="@container/main flex flex-1 flex-col gap-2"><div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={() => setViewMode('list')}><IconArrowLeft className="size-5" /></Button><div className="flex-1"><h2 className="text-xl font-semibold">Kelola Role</h2><p className="text-sm text-muted-foreground">Tambah, edit, atau hapus role sistem.</p></div><Button onClick={openRoleAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah Role</Button></div>
            <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari role..." value={roleSearchInput} onChange={e => setRoleSearchInput(e.target.value)} className="pl-9" /></div>
            <div className="rounded-lg border"><Table><TableHeader><TableRow><TableHead className="w-12">No</TableHead><TableHead>Nama</TableHead><TableHead>Deskripsi</TableHead><TableHead className="text-center">Pengguna</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                <TableBody>{loading ? <TableRow><TableCell colSpan={5} className="h-32 text-center"><Spinner className="size-5 mx-auto" /></TableCell></TableRow> : roles.length === 0 ? <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">{roleSearch ? 'Tidak ada hasil' : 'Belum ada role.'}</TableCell></TableRow>
                    : roles.map((r, i) => { const offset = rolePagination ? (rolePagination.page - 1) * rolePagination.limit : 0; return (<TableRow key={r.id}><TableCell>{offset + i + 1}</TableCell><TableCell className="font-medium">{r.name}</TableCell><TableCell className="text-sm text-muted-foreground">{r.description || '-'}</TableCell><TableCell className="text-center"><span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r._count?.UserRole ?? 0}</span></TableCell><TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openRoleEdit(r)}><IconEdit className="size-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingRole(r); setRoleDeleteOpen(true) }}><IconTrash className="size-4" /></Button></div></TableCell></TableRow>) })}</TableBody></Table></div>
            {rolePagination && <PaginationBar pagination={rolePagination} page={rolePage} setPage={setRolePage} />}
        </div></div></div>{renderDialogs()}</React.Fragment>)
    }

    // ═══════════════════════════════════════════════════════
    // USER MANAGE VIEW
    // ═══════════════════════════════════════════════════════
    if (viewMode === 'manage' && selectedUser) {
        const u = selectedUser
        return (<React.Fragment><SiteHeader title="Kelola Pengguna" /><div className="flex flex-1 flex-col"><div className="@container/main flex flex-1 flex-col gap-2"><div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => { setViewMode('list'); setSelectedUser(null) }}><IconArrowLeft className="size-5" /></Button>
                <div className="flex items-center gap-3 flex-1">{u.avatar ? <img src={u.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">{u.name[0]}</div>}<div><h2 className="text-xl font-semibold">{u.name}</h2><p className="text-sm text-muted-foreground">{u.email}</p></div></div>
                <Button size="sm" variant="outline" onClick={() => openUserEdit(u)}><IconEdit className="size-4 mr-1" />Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => { setDeletingUser(u); setDeleteOpen(true) }}><IconTrash className="size-4 mr-1" />Hapus</Button>
            </div>

            <div className="grid gap-4">
                {/* User info */}
                <div className="rounded-lg border p-4 grid sm:grid-cols-3 gap-4">
                    <div><Label className="text-xs text-muted-foreground">Gender</Label><p className="text-sm font-medium">{genderLabel(u.gender)}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Umur</Label><p className="text-sm font-medium">{u.age} tahun</p></div>
                    <div><Label className="text-xs text-muted-foreground">Kewarganegaraan</Label><p className="text-sm font-medium">{u.nationality}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Telepon</Label><p className="text-sm font-medium">{u.phoneCode} {u.phoneNumber}</p></div>
                    <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground">Alamat</Label><p className="text-sm font-medium">{u.address}</p></div>
                </div>

                {/* Roles */}
                <div className="rounded-lg border p-4 space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-1.5"><IconShieldCheck className="size-4" />Role ({u.UserRole.length})</h4>
                    <div className="flex flex-wrap gap-2">{refRoles.map(r => {
                        const checked = u.UserRole.some(ur => ur.roleId === r.id)
                        return <label key={r.id} className="flex items-center gap-1.5 text-sm cursor-pointer"><Checkbox checked={checked} disabled={savingRoles} onCheckedChange={() => {
                            const ids = checked ? u.UserRole.filter(ur => ur.roleId !== r.id).map(ur => ur.roleId) : [...u.UserRole.map(ur => ur.roleId), r.id]
                            saveUserRoles(ids)
                        }} />{r.name}</label>
                    })}</div>
                </div>

                {/* User Logins */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between"><h4 className="font-semibold text-sm flex items-center gap-1.5"><IconKey className="size-4" />Akun Login ({userLogins.length})</h4><Button size="sm" variant="outline" onClick={openLoginAdd}><IconPlus className="size-3 mr-1" />Tambah</Button></div>
                    {userLogins.length > 0 && (<Table><TableHeader><TableRow><TableHead>Username</TableHead><TableHead>Dibuat</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                        <TableBody>{userLogins.map(l => (<TableRow key={l.id}><TableCell className="font-medium">{l.Username}</TableCell><TableCell className="text-sm text-muted-foreground">{fmtDate(l.createdAt)}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openLoginEdit(l)}><IconEdit className="size-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingLogin(l); setLoginDeleteOpen(true) }}><IconTrash className="size-4" /></Button></div></TableCell></TableRow>))}</TableBody>
                    </Table>)}
                </div>
            </div>
        </div></div></div>{renderDialogs()}</React.Fragment>)
    }

    // ═══════════════════════════════════════════════════════
    // USER LIST VIEW (default)
    // ═══════════════════════════════════════════════════════
    return (<React.Fragment><SiteHeader title="Pengguna" /><div className="flex flex-1 flex-col"><div className="@container/main flex flex-1 flex-col gap-2"><div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-xl font-semibold tracking-tight">Daftar Pengguna</h2><p className="text-muted-foreground text-sm">Kelola pengguna, role, dan akun login.</p></div>
            <div className="flex items-center gap-2">
                <Select value={String(limit)} onValueChange={v => { setLimit(Number(v) as PageSize); setPage(1) }}><SelectTrigger size="sm" className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}</SelectContent></Select>
                <Button onClick={() => setViewMode('roles')} size="sm" variant="outline"><IconShieldCheck className="mr-1 size-4" />Role</Button>
                <Button onClick={openUserAdd} size="sm"><IconPlus className="mr-1 size-4" />Tambah User</Button>
            </div>
        </div>
        <div className="relative max-w-sm"><IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Cari nama/email..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-9" /></div>
        <div className="rounded-lg border"><Table><TableHeader><TableRow>
            <TableHead className="w-12">No</TableHead><TableHead>Avatar</TableHead><TableHead>Nama</TableHead><TableHead className="hidden sm:table-cell">Email</TableHead><TableHead className="hidden md:table-cell">Gender</TableHead><TableHead className="hidden lg:table-cell">Role</TableHead><TableHead className="text-right">Aksi</TableHead>
        </TableRow></TableHeader>
            <TableBody>{loading ? <TableRow><TableCell colSpan={7} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Spinner className="size-5" /><span className="text-muted-foreground">Memuat...</span></div></TableCell></TableRow>
                : users.length === 0 ? <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">{search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada pengguna.'}</TableCell></TableRow>
                    : users.map((u, i) => {
                        const offset = pagination ? (pagination.page - 1) * pagination.limit : 0; return (<TableRow key={u.id}>
                            <TableCell>{offset + i + 1}</TableCell>
                            <TableCell>{u.avatar ? <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{u.name[0]}</div>}</TableCell>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell className="hidden sm:table-cell text-sm">{u.email}</TableCell>
                            <TableCell className="hidden md:table-cell"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{genderLabel(u.gender)}</span></TableCell>
                            <TableCell className="hidden lg:table-cell"><div className="flex flex-wrap gap-1">{u.UserRole.length > 0 ? u.UserRole.map(ur => <span key={ur.id} className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{ur.role.name}</span>) : <span className="text-xs text-muted-foreground">—</span>}</div></TableCell>
                            <TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openManage(u)} title="Kelola"><IconSettings className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => openUserEdit(u)} title="Edit"><IconEdit className="size-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingUser(u); setDeleteOpen(true) }} title="Hapus"><IconTrash className="size-4" /></Button></div></TableCell>
                        </TableRow>)
                    })}</TableBody></Table></div>
        {pagination && <PaginationBar pagination={pagination} page={page} setPage={setPage} />}
    </div></div></div>{renderDialogs()}</React.Fragment>)
}
