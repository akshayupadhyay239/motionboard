import { createClient } from '@/lib/supabase/server'
import { Winner } from '@/lib/types'
import { WinnerCard } from '@/components/winners/WinnerCard'
import Link from 'next/link'

async function getWinners(): Promise<Winner[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('winners')
      .select('*')
      .order('won_at', { ascending: false })
    return (data ?? []) as Winner[]
  } catch {
    return []
  }
}

function formatPrize(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`
  return `$${amount}`
}

function parsePrizeUsd(prize: string): number {
  const match = prize.replace(/,/g, '').match(/\$?([\d.]+)\s*([KkMm])?/)
  if (!match) return 0
  const num = parseFloat(match[1])
  const mult = match[2]?.toUpperCase()
  if (mult === 'M') return num * 1_000_000
  if (mult === 'K') return num * 1_000
  return num
}

export default async function WinnersPage() {
  const winners = await getWinners()

  const totalPaid = winners.reduce((sum, w) => sum + parsePrizeUsd(w.prize), 0)

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3A3935] hover:text-[#0D0D0D] transition-colors mb-8"
        >
          ← Back
        </Link>

        <h1
          className="text-[64px] sm:text-[80px] font-black leading-[0.92] tracking-tight text-[#0D0D0D] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Past<br />
          <span className="text-[#1C1C8E]">Winners.</span>
        </h1>
        <p className="text-base text-[#78766E] max-w-md leading-relaxed">
          Real creators. Real money. These are the people who entered and won.
        </p>

        {/* Stats bar */}
        {winners.length > 0 && (
          <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-[#E0DDD5]">
            {totalPaid > 0 && (
              <div>
                <p className="text-3xl font-black text-[#0D0D0D] leading-none tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                  {formatPrize(totalPaid)}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#B5B2A9] font-semibold mt-1">Paid out</p>
              </div>
            )}
            <div>
              <p className="text-3xl font-black text-[#0D0D0D] leading-none">{winners.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#B5B2A9] font-semibold mt-1">Winners</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {winners.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#E0DDD5] py-32 text-center">
          <p className="text-xl font-black text-[#0D0D0D]" style={{ fontFamily: 'var(--font-display)' }}>
            First winner dropping soon.
          </p>
          <p className="text-sm text-[#78766E] mt-2 mb-6">
            Contests are live — enter before they close.
          </p>
          <Link
            href="/contests"
            className="inline-flex rounded-full bg-[#0D0D0D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3A3935] transition-colors"
          >
            Browse open contests →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {winners.map((winner, i) => (
            <WinnerCard key={winner.id} winner={winner} size={i === 0 ? 'large' : 'default'} />
          ))}
        </div>
      )}
    </div>
  )
}
