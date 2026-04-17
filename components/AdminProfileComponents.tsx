"use client"

import React, { useState } from 'react'
import { SiteHeader } from './layouts/site-header'

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
                            Save
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
                            Save
                        </button>
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Simpan
                </button>

            </div>
        </>
    )
}