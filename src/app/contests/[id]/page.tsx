import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Contest } from '@/lib/types'
import { formatDeadline, daysUntil } from '@/lib/utils'
import { ContestCard } from '@/components/contests/ContestCard'
import { MOCK_RECENT } from '@/lib/mockData'
import { EmailSubscribeForm } from '@/components/hero/EmailSubscribeForm'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')

interface PageProps {
  params: Promise<{ id: string }>
}

async function getContest(id: string): Promise<{ contest: Contest | null; related: Contest[] }> {
  if (USE_MOCK) {
    const contest = MOCK_RECENT.find((c) => c.id === id) ?? null
    const related = contest
      ? MOCK_RECENT.filter((c) => c.id !== id && c.category === contest.category).slice(0, 3)
      : []
    return { contest, related }
  }

  try {
    const supabase = await createClient()
    const { data: contest } = await supabase
      .from('contests')
      .select('*')
      .eq('id', id)
      .eq('approved', true)
      .single()

    const related: Contest[] = []
    if (contest) {
      const { data } = await supabase
        .from('contests')
        .select('*')
        .eq('approved', true)
        .eq('status', 'open')
        .eq('category', contest.category)
        .neq('id', id)
        .order('deadline', { ascending: true })
        .limit(3)
      if (data) related.push(...(data as Contest[]))
    }

    return { contest: contest ?? null, related }
  } catch {
    const contest = MOCK_RECENT.find((c) => c.id === id) ?? null
    return { contest, related: [] }
  }
}

export default async function ContestDetailPage({ params }: PageProps) {
  const { id } = await params
  const { contest, related } = await getContest(id)

  if (!contest) notFound()

  const days = daysUntil(contest.deadline)
  const isClosed = contest.status === 'closed' || days < 0
  const isUrgent = !isClosed && days <= 3

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      <Link href="/contests" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3A3935] hover:text-[#0D0D0D] transition-colors mb-10">
        ← Back to contests
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Sidebar — rendered first on mobile so CTA is above the fold */}
        <div className="lg:col-span-1 lg:order-last">
          <div className="rounded-3xl bg-[#0D0D0D] p-7 lg:sticky lg:top-20">
            {/* Prize */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Prize</p>
              <p
                className="text-4xl font-black text-white leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {contest.prize}
              </p>
            </div>

            {/* Deadline */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Deadline</p>
              {isUrgent ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse-urgent shrink-0" />
                  {days === 0 ? 'Closes today' : days === 1 ? '1 day left' : `${days} days left`}
                </span>
              ) : (
                <p className={`text-lg font-bold ${isClosed ? 'text-white/40' : 'text-white'}`}>
                  {isClosed ? 'Contest closed' : formatDeadline(contest.deadline)}
                </p>
              )}
              <p className="text-xs text-white/30 mt-2">
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
              className={`block w-full rounded-2xl py-3.5 text-center font-bold text-sm transition-all ${
                isClosed
                  ? 'bg-white/10 text-white/30 cursor-not-allowed pointer-events-none'
                  : 'bg-white text-[#0D0D0D] hover:bg-[#ECEAE3] hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isClosed ? 'Contest Closed' : 'Go Enter →'}
            </a>

            {/* Email capture — high intent moment */}
            {!isClosed && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">48hr deadline alerts</p>
                <p className="text-xs text-white/50 mb-3">Get pinged before contests like this one close.</p>
                <EmailSubscribeForm
                  variant="dark"
                  label="Get alerts"
                  placeholder="your@email.com"
                  successMessage="✓ You'll get alerts before deadlines close."
                />
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 lg:order-first">
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

      </div>

      {/* Related contests — don't let users dead-end */}
      {related.length > 0 && (
        <section className="mt-20 pt-16 border-t border-[#E0DDD5]">
          <div className="flex items-baseline justify-between mb-8">
            <h2
              className="text-2xl font-black text-[#0D0D0D]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              More {contest.category} contests
            </h2>
            <Link
              href={`/contests?category=${encodeURIComponent(contest.category)}`}
              className="text-sm text-[#78766E] hover:text-[#0D0D0D] transition-colors"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((c, i) => (
              <ContestCard key={c.id} contest={c} index={i} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
