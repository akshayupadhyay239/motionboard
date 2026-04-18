'use client'

import Link from 'next/link'
import { Contest } from '@/lib/types'

interface ContestTickerProps {
  contests: Contest[]
}

export function ContestTicker({ contests }: ContestTickerProps) {
  if (contests.length === 0) return null

  // Duplicate to fill the ticker; triple if very few items
  const base = contests.length < 5 ? [...contests, ...contests, ...contests] : contests
  const items = [...base, ...base]

  return (
    <div className="h-full rounded-3xl bg-[#0D0D0D] flex flex-col overflow-hidden">
      {/* Pinned header */}
      <div className="shrink-0 flex items-center gap-2 px-6 py-4 border-b border-white/[0.07]">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-urgent shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live contests</span>
      </div>

      {/* Scrolling list */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <div className="animate-ticker-scroll">
          {items.map((contest, i) => (
            <Link
              key={`${contest.id}-${i}`}
              href={`/contests/${contest.id}`}
              className="block px-6 py-4 border-b border-white/[0.07] hover:bg-white/[0.04] transition-colors"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-0.5">
                {contest.brand}
              </p>
              <p className="text-sm font-medium text-white/70 leading-snug line-clamp-1">
                {contest.title}
              </p>
              <p
                className="text-2xl font-black text-white mt-1 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {contest.prize}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
