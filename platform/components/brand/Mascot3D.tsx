'use client'

import { motion } from 'framer-motion'

const uid = 'wb'

function Gradients() {
  return (
    <defs>
      <linearGradient id={`${uid}-body`} x1="60" y1="90" x2="140" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4d8bff" /><stop offset="0.5" stopColor="#1a6bff" /><stop offset="1" stopColor="#0a4fd6" />
      </linearGradient>
      <linearGradient id={`${uid}-head`} x1="50" y1="20" x2="150" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" /><stop offset="0.4" stopColor="#f8fbff" /><stop offset="1" stopColor="#e8f2ff" />
      </linearGradient>
      <linearGradient id={`${uid}-visor`} x1="70" y1="55" x2="130" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0a1628" /><stop offset="1" stopColor="#152238" />
      </linearGradient>
      <radialGradient id={`${uid}-eye`} cx="0.5" cy="0.5" r="0.5">
        <stop stopColor="#7ee8ff" /><stop offset="1" stopColor="#1a6bff" />
      </radialGradient>
      <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1a6bff" floodOpacity="0.18" />
      </filter>
    </defs>
  )
}

export function MascotBody({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative w-52 sm:w-60 md:w-64 ${className}`}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <svg viewBox="0 0 200 200" className="relative w-full h-auto overflow-visible" fill="none">
        <Gradients />
        <rect x="72" y="118" width="56" height="58" rx="26" fill={`url(#${uid}-body)`} />
        <text x="100" y="158" textAnchor="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">W</text>
        <circle cx="100" cy="68" r="44" fill={`url(#${uid}-head)`} filter={`url(#${uid}-shadow)`} />
        <ellipse cx="100" cy="70" rx="32" ry="22" fill={`url(#${uid}-visor)`} />
        <motion.g
          animate={{ scaleY: [1, 1, 0.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.88, 0.92, 1] }}
          style={{ transformOrigin: '100px 70px' }}
        >
          <ellipse cx="88" cy="70" rx="7" ry="9" fill={`url(#${uid}-eye)`} />
          <ellipse cx="112" cy="70" rx="7" ry="9" fill={`url(#${uid}-eye)`} />
          <ellipse cx="88" cy="67" rx="2" ry="2.5" fill="#fff" opacity="0.7" />
          <ellipse cx="112" cy="67" rx="2" ry="2.5" fill="#fff" opacity="0.7" />
        </motion.g>
        <motion.g animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ transformOrigin: '78px 28px' }}>
          <line x1="78" y1="32" x2="70" y2="10" stroke="#1a6bff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="70" cy="10" r="4.5" fill="#1a6bff" />
        </motion.g>
        <motion.g animate={{ rotate: [4, -4, 4] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }} style={{ transformOrigin: '122px 28px' }}>
          <line x1="122" y1="32" x2="130" y2="10" stroke="#1a6bff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="130" cy="10" r="4.5" fill="#1a6bff" />
        </motion.g>
      </svg>
    </motion.div>
  )
}

export function MascotHandLeft({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`w-9 sm:w-10 -rotate-6 ${className}`}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <svg viewBox="0 0 36 32" className="w-full h-auto" fill="none">
        <path d="M6 28 C6 14 14 6 18 6 C22 6 30 14 30 28 Z" fill="#f8fbff" stroke="#1a6bff" strokeWidth="1.75" strokeLinejoin="round" />
        <ellipse cx="13" cy="16" rx="2.5" ry="3.5" fill="#d8ebff" />
        <ellipse cx="18" cy="13" rx="2.5" ry="3.5" fill="#d8ebff" />
        <ellipse cx="23" cy="16" rx="2.5" ry="3.5" fill="#d8ebff" />
      </svg>
    </motion.div>
  )
}

export function MascotHandRight({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`w-9 sm:w-10 rotate-12 origin-bottom ${className}`}
      animate={{ rotate: [12, 26, 12, 26, 12] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <svg viewBox="0 0 36 32" className="w-full h-auto" fill="none">
        <path d="M6 28 C6 14 14 6 18 6 C22 6 30 14 30 28 Z" fill="#f8fbff" stroke="#1a6bff" strokeWidth="1.75" strokeLinejoin="round" />
        <ellipse cx="14" cy="15" rx="2.5" ry="3.5" fill="#d8ebff" />
        <ellipse cx="19" cy="12" rx="2.5" ry="3.5" fill="#d8ebff" />
        <ellipse cx="24" cy="15" rx="2.5" ry="3.5" fill="#d8ebff" />
      </svg>
    </motion.div>
  )
}
