"use client"

import React, { useState } from 'react'
import { SiteHeader } from './layouts/site-header'
import { useEffect } from 'react'
import { useRef } from "react"

export default function AdminProfileComponents() {
    const [history, setHistory] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [visions, setVisions] = useState<{ text: string }[]>([])
    const [newVision, setNewVision] = useState('')
    const [missions, setMissions] = useState<{ text: string }[]>([])
    const [newMission, setNewMission] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [galleries, setGalleries] = useState<{ id: number }[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    setLoading(false)
                    return
                }

                setHistory(data.history || '')
                setVideoUrl(data.videoUrl || '')
                setAddress(data.address || '')
                setPhone(data.phone || '')
                setEmail(data.email || '')

                setVisions(data.visions || [])
                setMissions(data.missions || [])
                setGalleries(data.galleries || [])
            }).
            finally(() => setLoading(false))
    }, [])

    return (
        <>
            <SiteHeader title="Profil Desa Wisata" />

            <div className="p-6 space-y-6">

                {/* Sejarah */}
                <div>
                    <label className="font-semibold">Sejarah Desa</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={5}
                        value={history}
                        onChange={(e) => setHistory(e.target.value)}
                    />
                </div>

                {/* Video */}
                <div>
                    <label className="font-semibold">Video URL (YouTube)</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />
                </div>

                {/* Kontak */}
                <div>
                    <label className="font-semibold">Alamat</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div>
                    <label className="font-semibold">Telepon</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div>
                    <label className="font-semibold">Email</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* VISI */}
                <div>
                    <label className="font-semibold">Visi</label>

                    {/* LIST */}
                    <div className="space-y-2 mt-2">
                        {visions.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-2 rounded">

                                <span>• {item.text}</span>

                                <button
                                    onClick={() => {
                                        const updated = [...visions]
                                        updated.splice(index, 1)
                                        setVisions(updated)
                                    }}
                                    className="text-red-500 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* INPUT PERSISTENT */}
                    <div className="flex gap-2 mt-3">
                        <input
                            className="flex-1 border p-2 rounded"
                            placeholder="Tambahkan visi..."
                            value={newVision}
                            onChange={(e) => setNewVision(e.target.value)}
                        />

                        <button
                            disabled={!newVision.trim()}
                            className="bg-green-600 text-white px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                                if (!newVision.trim()) return

                                setVisions([...visions, { text: newVision.trim() }])
                                setNewVision('')
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* MISI */}
                <div>
                    <label className="font-semibold">Misi</label>

                    {/* LIST */}
                    <div className="space-y-2 mt-2">
                        {missions.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-2 rounded">

                                <span>• {item.text}</span>

                                <button
                                    onClick={() => {
                                        const updated = [...missions]
                                        updated.splice(index, 1)
                                        setMissions(updated)
                                    }}
                                    className="text-red-500 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* INPUT PERSISTENT */}
                    <div className="flex gap-2 mt-3">
                        <input
                            className="flex-1 border p-2 rounded"
                            placeholder="Tambahkan misi..."
                            value={newMission}
                            onChange={(e) => setNewMission(e.target.value)}
                        />

                        <button
                            disabled={!newMission.trim()}
                            className="bg-green-600 text-white px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                                if (!newMission.trim()) return

                                setMissions([...missions, { text: newMission.trim() }])
                                setNewMission('')
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* GALLERY */}
                <div>
                    <label className="font-semibold">Galeri</label>

                    {/* GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">

                        {/* EXISTING IMAGES */}
                        {galleries.map((g, i) => (
                            <div key={i} className="relative border rounded aspect-square overflow-hidden">
                                <img
                                    src={`/api/profile/images/${g.id}`}
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded text-xs"
                                    onClick={() => {
                                        const newData = galleries.filter((_, idx) => idx !== i)
                                        setGalleries(newData)
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {newImages.map((file, i) => (
                            <div key={i} className="relative border rounded aspect-square overflow-hidden">
                                <img
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded text-xs"
                                    onClick={() => {
                                        const updated = newImages.filter((_, idx) => idx !== i)
                                        setNewImages(updated)
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* ADD PHOTO TILE */}
                        <div
                            className="border rounded aspect-square flex items-center justify-center"
                            onClick={() => {
                                if (saving) return
                                fileInputRef.current?.click()
                            }}
                        >
                            <span className="text-gray-500 text-sm">
                                Tambahkan Foto
                            </span>
                        </div>

                    </div>

                    {/* INPUT AREA */}
                    <div className="flex gap-2 mt-4">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setNewImages((prev) => {
                                    const isDuplicate = prev.some(
                                        (img) =>
                                            img.name === file.name &&
                                            img.size === file.size
                                    )

                                    if (isDuplicate) {
                                        alert("Foto sudah ada")
                                        return prev
                                    }

                                    return [...prev, file]
                                })
                            }}
                        />
                        {/* 
                        <button
                            disabled={!newImage}
                            className={`px-3 rounded text-white ${newImage ? 'bg-green-600' : 'bg-gray-400'
                                }`}
                            onClick={handleUpload}
                        >
                            Tambah
                        </button> */}
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                    disabled={saving}
                    className={`px-4 py-2 rounded text-white ${saving ? 'bg-gray-400' : 'bg-green-600'
                        }`}
                    onClick={async () => {
                        setSaving(true)

                        try {
                            // 1. upload semua image baru
                            const uploadedIds = []

                            for (const file of newImages) {
                                const formData = new FormData()
                                formData.append("file", file)

                                const res = await fetch("/api/profile/images", {
                                    method: "POST",
                                    body: formData,
                                })

                                const data = await res.json()
                                uploadedIds.push({ id: data.id })
                            }

                            // 2. gabungkan dengan existing
                            const finalGalleries = [...galleries, ...uploadedIds]

                            // 3. save profile
                            await fetch('/api/profile', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    history,
                                    videoUrl,
                                    address,
                                    phone,
                                    email,
                                    visions,
                                    missions,
                                    galleries: finalGalleries,
                                }),
                            })

                            setGalleries(finalGalleries)
                            setNewImages([])

                            alert('Berhasil disimpan')
                        } catch (err) {
                            alert('Gagal menyimpan')
                        } finally {
                            setSaving(false)
                        }
                    }}
                >
                    {saving ? 'Menyimpan...' : 'Simpan'}
                </button>

            </div>
        </>
    )
}