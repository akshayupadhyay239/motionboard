import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Contest } from '@/lib/types'
import { formatDeadline, daysUntil } from '@/lib/utils'
import { MOCK_RECENT } from '@/lib/mockData'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')

interface PageProps {
  params: Promise<{ id: string }>
}

async function getContest(id: string): Promise<Contest | null> {
  if (USE_MOCK) return MOCK_RECENT.find((c) => c.id === id) ?? null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('contests')
      .select('*')
      .eq('id', id)
      .eq('approved', true)
      .single()
    return data
  } catch {
    return MOCK_RECENT.find((c) => c.id === id) ?? null
  }
}

export default async function ContestDetailPage({ params }: PageProps) {
  const { id } = await params
  const contest = await getContest(id)

  if (!contest) notFound()

  const days = daysUntil(contest.deadline)
  const isClosed = contest.status === 'closed' || days < 0
  const isUrgent = !isClosed && days <= 3

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      <Link href="/contests" className="inline-flex items-center gap-1.5 text-sm text-[#78766E] hover:text-[#0D0D0D] transition-colors mb-10">
        ← Back to contests
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Brand row */}
          <div className="flex items-center gap-3 mb-6">
            {contest.thumbnail_url ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-[#ECEAE3]">
                <Image src={contest.thumbnail_url} alt={contest.brand} fill className="object-cover" sizes="40px" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ECEAE3] text-[11px] font-black text-[#78766E]">
                {contest.brand.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#B5B2A9]">{contest.brand}</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#B5B2A9]">{contest.source_platform} · {contest.category}</p>
            </div>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-black text-[#0D0D0D] leading-tight mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {contest.title}
          </h1>

          <div className="prose prose-zinc max-w-none">
            <p className="text-[#3A3935] leading-relaxed text-base whitespace-pre-line">{contest.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-[#0D0D0D] p-7 sticky top-20">
            {/* Prize */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Prize</p>
              <p
                className="text-3xl font-black text-white leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {contest.prize}
              </p>
            </div>

            {/* Deadline */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Deadline</p>
              <p className={`text-lg font-bold ${isUrgent ? 'text-red-400' : isClosed ? 'text-white/40' : 'text-white'}`}>
                {isClosed ? 'Contest closed' : formatDeadline(contest.deadline)}
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {new Date(contest.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Meta */}
            <div className="flex gap-6 mb-7 text-xs">
              <div>
                <p className="text-white/30 uppercase tracking-widest font-semibold mb-0.5">Category</p>
                <p className="text-white font-semibold">{contest.category}</p>
              </div>
              <div>
                <p className="text-white/30 uppercase tracking-widest font-semibold mb-0.5">Platform</p>
                <p className="text-white font-semibold">{contest.source_platform}</p>
              </div>
            </div>

            {/* CTA */}
            <a
              href={contest.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full rounded-2xl py-3.5 text-center font-bold text-sm transition-colors ${
                isClosed
                  ? 'bg-white/10 text-white/30 cursor-not-allowed pointer-events-none'
                  : 'bg-white text-[#0D0D0D] hover:bg-[#ECEAE3]'
              }`}
            >
              {isClosed ? 'Contest Closed' : 'Go Enter →'}
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
