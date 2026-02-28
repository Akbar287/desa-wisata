'use client';

import { ReactNode } from 'react';

const leafEmojis = ['🍃', '🌿', '🍂', '🍃', '🌿', '🍂', '🍃', '🌿', '🍂', '🍃', '🌿', '🍂'];

export default function NatureOverlay({ children }: { children: ReactNode }) {
    return (
        <div className="relative">
            {/* Fixed falling leaves layer */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
                {leafEmojis.map((leaf, i) => (
                    <span key={i} className={`nature-leaf leaf-${i + 1}`}>
                        {leaf}
                    </span>
                ))}
            </div>

            {/* Content */}
            {children}
        </div>
    );
}

/* Reusable SVG Wave Dividers */
export function WaveDividerTop({ fill = '#F0F7F4' }: { fill?: string }) {
    return (
        <div className="nature-wave-divider top">
            <svg viewBox="0 0 1200 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0,40 C200,10 400,35 600,20 C800,5 1000,30 1200,15 L1200,40 Z"
                    fill={fill}
                />
            </svg>
        </div>
    );
}

export function WaveDividerBottom({ fill = '#F0F7F4' }: { fill?: string }) {
    return (
        <div className="nature-wave-divider bottom">
            <svg viewBox="0 0 1200 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0,0 C200,30 400,5 600,20 C800,35 1000,10 1200,25 L1200,0 Z"
                    fill={fill}
                />
            </svg>
        </div>
    );
}

/* Vine Corner Decorations */
export function VineDecoration({ position = 'left' }: { position?: 'left' | 'right' }) {
    const isLeft = position === 'left';
    return (
        <svg
            className="nature-vine"
            style={{
                [isLeft ? 'left' : 'right']: 0,
                top: '10%',
                width: 120,
                height: '80%',
                transform: isLeft ? 'none' : 'scaleX(-1)',
            }}
            viewBox="0 0 120 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10,0 C30,80 5,160 25,240 C45,320 10,400 30,480 C50,560 15,600 15,600" stroke="#2D6A4F" strokeWidth="3" fill="none" />
            <path d="M25,60 C50,50 60,70 45,85" stroke="#52B788" strokeWidth="2" fill="none" />
            <ellipse cx="55" cy="70" rx="12" ry="8" fill="#52B788" opacity="0.3" transform="rotate(-20 55 70)" />
            <path d="M20,180 C45,170 55,190 40,205" stroke="#52B788" strokeWidth="2" fill="none" />
            <ellipse cx="50" cy="190" rx="14" ry="9" fill="#40916C" opacity="0.25" transform="rotate(15 50 190)" />
            <path d="M30,300 C55,290 65,310 50,325" stroke="#52B788" strokeWidth="2" fill="none" />
            <ellipse cx="60" cy="310" rx="11" ry="7" fill="#52B788" opacity="0.3" transform="rotate(-10 60 310)" />
            <path d="M15,420 C40,410 50,430 35,445" stroke="#40916C" strokeWidth="2" fill="none" />
            <ellipse cx="45" cy="430" rx="13" ry="8" fill="#2D6A4F" opacity="0.2" transform="rotate(25 45 430)" />
            <circle cx="25" cy="120" r="3" fill="#81C784" opacity="0.4" />
            <circle cx="20" cy="360" r="4" fill="#A5D6A7" opacity="0.3" />
            <circle cx="35" cy="520" r="3" fill="#81C784" opacity="0.35" />
        </svg>
    );
}

/* Firefly particles for dark sections */
export function FireflyParticles({ count = 8 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="nature-firefly"
                    style={{
                        left: `${10 + (i * 80 / count)}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${5 + (i % 4)}s`,
                    }}
                />
            ))}
        </>
    );
}
