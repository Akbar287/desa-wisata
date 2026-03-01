'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const dummyResponses: Record<string, string> = {
    'halo': 'Halo! 🌿 Selamat datang di Discover Desa Wisata. Ada yang bisa saya bantu?',
    'paket': 'Kami memiliki berbagai paket wisata mulai dari Rp 1.200.000. Anda bisa melihat selengkapnya di halaman Paket Wisata kami! 🏕️',
    'harga': 'Harga paket wisata kami mulai dari Rp 1.200.000 untuk 2 hari hingga Rp 4.200.000 untuk 5 hari. Semua sudah termasuk akomodasi dan pemandu lokal! 💰',
    'lokasi': 'Kami berlokasi di Desa Manud Jaya, Kabupaten Bandung Barat, Jawa Barat. Anda bisa mengunjungi halaman Kontak untuk melihat peta lokasi kami. 📍',
    'booking': 'Untuk melakukan booking, silakan kunjungi halaman Booking kami atau hubungi kami via WhatsApp di 0818-1234-567890. Kami siap membantu Anda! 📋',
    'wisata': 'Kami menawarkan wisata privat dan wisata grup. Wisata privat cocok untuk keluarga, sedangkan wisata grup lebih hemat dan bisa bertemu teman baru! 🌄',
    'kontak': 'Anda bisa menghubungi kami melalui:\n📞 Telepon: (022) 1234-5678\n📱 WhatsApp: 0818-1234-567890\n📧 Email: info@discoverdesa.id',
    'jam': 'Kantor kami buka setiap hari Senin-Sabtu, pukul 08:00 - 17:00 WIB. Untuk tur, jadwal bisa disesuaikan! ⏰',
};

const defaultResponse = 'Terima kasih atas pertanyaannya! 🌿 Untuk informasi lebih lanjut, silakan hubungi kami via WhatsApp atau kunjungi halaman Kontak. Tim kami siap membantu Anda!';

const quickReplies = [
    '👋 Halo',
    '📦 Paket Wisata',
    '💰 Harga',
    '📍 Lokasi',
    '📋 Booking',
];

function getBotResponse(userMsg: string): string {
    const lower = userMsg.toLowerCase();
    for (const [key, response] of Object.entries(dummyResponses)) {
        if (lower.includes(key)) return response;
    }
    return defaultResponse;
}

export default function LeafChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 0,
            text: 'Halo! 🌿 Saya asisten virtual Discover Desa Wisata. Ada yang bisa saya bantu hari ini?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botMsg: Message = {
                id: Date.now() + 1,
                text: getBotResponse(text),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="leaf-chat-btn"
                style={{
                    position: 'fixed',
                    bottom: 36,
                    right: 24,
                    zIndex: 9998,
                    width: 64,
                    height: 64,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    background: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #52B788 100%)',
                    borderRadius: '50% 50% 50% 12%',
                    boxShadow: '0 6px 24px rgba(45, 106, 79, 0.4), 0 0 0 3px rgba(82, 183, 136, 0.2)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
            >
                {isOpen ? '✕' : '🍃'}
            </motion.button>

            {!isOpen && (
                <span
                    style={{
                        position: 'fixed',
                        bottom: 36,
                        right: 20,
                        width: 72,
                        height: 72,
                        borderRadius: '50% 50% 50% 12%',
                        border: '2px solid rgba(82, 183, 136, 0.4)',
                        zIndex: 9997,
                        pointerEvents: 'none',
                        animation: 'leafPulse 2s ease-in-out infinite',
                    }}
                />
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            bottom: 100,
                            right: 24,
                            zIndex: 9999,
                            width: 380,
                            maxWidth: 'calc(100vw - 48px)',
                            height: 520,
                            maxHeight: 'calc(100vh - 140px)',
                            borderRadius: '24px 24px 24px 8px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                        }}
                    >
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
                                padding: '18px 20px',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0.08,
                                background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)',
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <span style={{ fontSize: 24 }}>🌿</span>
                                    <div>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: 16,
                                            fontWeight: 700,
                                            fontFamily: 'var(--font-heading)',
                                            letterSpacing: '0.01em',
                                        }}>
                                            Asisten Desa Wisata
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            marginTop: 2,
                                        }}>
                                            <span style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                background: '#52B788',
                                                display: 'inline-block',
                                                boxShadow: '0 0 6px rgba(82,183,136,0.6)',
                                            }} />
                                            <span style={{ fontSize: 12, opacity: 0.85, fontFamily: 'var(--font-body)' }}>
                                                Online • Siap membantu
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span style={{ position: 'absolute', top: 8, right: 14, fontSize: 20, opacity: 0.15 }}>🍃</span>
                            <span style={{ position: 'absolute', bottom: 6, right: 40, fontSize: 16, opacity: 0.1, transform: 'rotate(45deg)' }}>🌿</span>
                        </div>

                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px 14px',
                                background: 'linear-gradient(180deg, #F0F7F4 0%, #FAFFF8 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                            }}
                            className="hide-scrollbar"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: '80%',
                                            padding: '10px 14px',
                                            borderRadius: msg.sender === 'user'
                                                ? '16px 16px 4px 16px'
                                                : '16px 16px 16px 4px',
                                            background: msg.sender === 'user'
                                                ? 'linear-gradient(135deg, #2D6A4F, #40916C)'
                                                : 'white',
                                            color: msg.sender === 'user' ? 'white' : '#1A1A2E',
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            fontFamily: 'var(--font-body)',
                                            boxShadow: msg.sender === 'user'
                                                ? '0 2px 8px rgba(45,106,79,0.2)'
                                                : '0 1px 4px rgba(0,0,0,0.06)',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {msg.text}
                                        <div style={{
                                            fontSize: 10,
                                            opacity: 0.6,
                                            marginTop: 4,
                                            textAlign: msg.sender === 'user' ? 'right' : 'left',
                                        }}>
                                            {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        display: 'flex',
                                        gap: 4,
                                        padding: '10px 16px',
                                        background: 'white',
                                        borderRadius: '16px 16px 16px 4px',
                                        width: 'fit-content',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            style={{
                                                width: 7,
                                                height: 7,
                                                borderRadius: '50%',
                                                background: '#52B788',
                                                display: 'inline-block',
                                                animation: `typingDot 1.4s ease-in-out ${i * 0.2}s infinite`,
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length <= 2 && (
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 6,
                                    padding: '8px 14px',
                                    overflowX: 'auto',
                                    background: '#F0F7F4',
                                    borderTop: '1px solid rgba(45,106,79,0.08)',
                                }}
                                className="hide-scrollbar"
                            >
                                {quickReplies.map((qr) => (
                                    <button
                                        key={qr}
                                        onClick={() => sendMessage(qr.replace(/^[^\s]+ /, ''))}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: 20,
                                            border: '1px solid rgba(45,106,79,0.2)',
                                            background: 'rgba(45,106,79,0.06)',
                                            color: '#2D6A4F',
                                            fontSize: 12,
                                            fontWeight: 600,
                                            fontFamily: 'var(--font-body)',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {qr}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 14px',
                                background: 'white',
                                borderTop: '1px solid rgba(0,0,0,0.06)',
                            }}
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(input);
                                    }
                                }}
                                placeholder="Ketik pesan..."
                                style={{
                                    flex: 1,
                                    border: '1px solid rgba(45,106,79,0.15)',
                                    borderRadius: 20,
                                    padding: '10px 16px',
                                    fontSize: 14,
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                    background: '#F8FBF9',
                                    color: '#1A1A2E',
                                    transition: 'border-color 0.2s',
                                }}
                            />
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim()}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: input.trim()
                                        ? 'linear-gradient(135deg, #2D6A4F, #40916C)'
                                        : '#E8F5E9',
                                    color: input.trim() ? 'white' : '#A5D6A7',
                                    cursor: input.trim() ? 'pointer' : 'default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </button>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            padding: '6px 0',
                            fontSize: 10,
                            color: '#A0AFA8',
                            background: 'white',
                            fontFamily: 'var(--font-body)',
                        }}>
                            🍃 Powered by Discover Desa Wisata
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes leafPulse {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.15); opacity: 0; }
                }
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-4px); opacity: 1; }
                }
                .leaf-chat-btn:hover {
                    box-shadow: 0 8px 32px rgba(45, 106, 79, 0.5), 0 0 0 4px rgba(82, 183, 136, 0.25) !important;
                }
                @media (max-width: 480px) {
                    .leaf-chat-btn {
                        width: 56px !important;
                        height: 56px !important;
                        bottom: 16px !important;
                        right: 16px !important;
                    }
                }
            `}</style>
        </>
    );
}
