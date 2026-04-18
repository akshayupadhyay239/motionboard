import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ContestGrid } from '@/components/contests/ContestGrid'
import { Contest } from '@/lib/types'
import { MOCK_FEATURED, MOCK_RECENT } from '@/lib/mockData'
import { daysUntil } from '@/lib/utils'
import { ContestTicker } from '@/components/hero/ContestTicker'
import { EmailSubscribeForm } from '@/components/hero/EmailSubscribeForm'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')

async function getContests() {
  if (USE_MOCK) return { featured: MOCK_FEATURED, recent: MOCK_RECENT, totalPrizeUsd: 0 }

  try {
    const supabase = await createClient()

    const { data: featured } = await supabase
      .from('contests')
      .select('*')
      .eq('approved', true)
      .eq('featured', true)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(4)

    const { data: recent } = await supabase
      .from('contests')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(12)

    const { data: stats } = await supabase
      .from('site_stats')
      .select('total_prize_usd')
      .eq('id', 1)
      .single()

    return {
      featured: (featured ?? []) as Contest[],
      recent: (recent ?? []) as Contest[],
      totalPrizeUsd: stats?.total_prize_usd ?? 0,
    }
  } catch {
    return { featured: MOCK_FEATURED, recent: MOCK_RECENT, totalPrizeUsd: 0 }
  }
}

function formatPrize(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`
  return `$${amount}`
}

export default async function HomePage() {
  const { featured, recent, totalPrizeUsd } = await getContests()
  const closingSoon = recent.filter(c => {
    const d = daysUntil(c.deadline)
    return c.status === 'open' && d >= 0 && d <= 7
  })

  return (
    <div className="mx-auto max-w-7xl px-6">

      {/* Hero — asymmetric: left content + right live ticker */}
      <section className="pt-16 pb-20 border-b border-[#E0DDD5]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8 items-start">

          {/* Left: content */}
          <div className="lg:col-span-3 flex flex-col">

            <p className="animate-fade-up text-[10px] font-bold uppercase tracking-widest text-[#B5B2A9] mb-5">
              motionBoard — contest directory
            </p>

            <h1
              className="animate-hero-enter text-[68px] sm:text-[84px] lg:text-[92px] xl:text-[108px] leading-[0.92] font-black tracking-tight text-[#0D0D0D] mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every video<br />
              contest.<br />
              <span className="text-[#1C1C8E]">One place.</span>
            </h1>

            <p
              className="animate-fade-up text-base text-[#78766E] leading-relaxed max-w-md mb-8"
              style={{ animationDelay: '120ms' }}
            >
              Discover motion design, ad, and film competitions from across the internet — Twitter, YouTube, brands, Reddit — all in one feed.
            </p>

            <div
              className="animate-fade-up flex items-center gap-3 mb-8"
              style={{ animationDelay: '200ms' }}
            >
              <Link
                href="/contests"
                className="rounded-full bg-[#0D0D0D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3A3935] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Browse contests
              </Link>
              <Link
                href="/submit"
                className="rounded-full border border-[#E0DDD5] px-6 py-3 text-sm font-medium text-[#78766E] hover:border-[#0D0D0D] hover:text-[#0D0D0D] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Submit one →
              </Link>
            </div>

            {/* Newsletter */}
            <div
              className="animate-fade-up mb-10"
              style={{ animationDelay: '280ms' }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#B5B2A9] mb-2">
                New contests in your inbox
              </p>
              <EmailSubscribeForm />
            </div>

            {/* Stats strip */}
            <div
              className="animate-fade-up flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-[#E0DDD5]"
              style={{ animationDelay: '360ms' }}
            >
              {totalPrizeUsd > 0 && (
                <div>
                  <p
                    className="text-3xl font-black text-[#0D0D0D] tabular-nums leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {formatPrize(totalPrizeUsd)}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-[#B5B2A9] font-semibold mt-1">In prizes</p>
                </div>
              )}
              <div>
                <p className="text-3xl font-black text-[#0D0D0D] leading-none">{recent.filter(c => c.status === 'open').length}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#B5B2A9] font-semibold mt-1">Open now</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#0D0D0D] leading-none">5</p>
                <p className="text-[10px] uppercase tracking-widest text-[#B5B2A9] font-semibold mt-1">Platforms</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#0D0D0D] leading-none">Free</p>
                <p className="text-[10px] uppercase tracking-widest text-[#B5B2A9] font-semibold mt-1">To enter</p>
              </div>
            </div>
          </div>

          {/* Right: live contest ticker — desktop only */}
          <div className="hidden lg:block lg:col-span-2" style={{ height: '520px' }}>
            <ContestTicker contests={recent.filter(c => c.status === 'open')} />
          </div>

        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 border-b border-[#E0DDD5]">
          <div className="flex items-baseline justify-between mb-8">
            <h2
              className="text-3xl font-black text-[#0D0D0D]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Featured
            </h2>
            <Link href="/contests" className="text-sm text-[#78766E] hover:text-[#0D0D0D] transition-colors">
              See all →
            </Link>
          </div>
          <ContestGrid contests={featured} featured />
        </section>
      )}

      {/* Closing This Week */}
      {closingSoon.length > 0 && (
        <section className="py-16 border-b border-[#E0DDD5]">
          <div className="flex items-baseline justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse-urgent shrink-0" />
              <h2
                className="text-3xl font-black text-[#0D0D0D]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Closing this week
              </h2>
            </div>
            <p className="text-sm text-[#78766E] hidden sm:block">
              {closingSoon.length} contest{closingSoon.length !== 1 ? 's' : ''} — enter before it&apos;s gone
            </p>
          </div>
          <ContestGrid contests={closingSoon} />
        </section>
      )}

      {/* Recent */}
      <section className="py-16 border-b border-[#E0DDD5]">
        <div className="flex items-baseline justify-between mb-8">
          <h2
            className="text-3xl font-black text-[#0D0D0D]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Recent listings
          </h2>
          <Link href="/contests" className="text-sm text-[#78766E] hover:text-[#0D0D0D] transition-colors">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-[#E0DDD5] py-24 text-center text-[#B5B2A9]">
            <p className="text-lg font-medium">Contests loading soon.</p>
            <p className="text-sm mt-1">
              Know of one?{' '}
              <Link href="/submit" className="text-[#0D0D0D] underline underline-offset-2 hover:no-underline">
                Submit it.
              </Link>
            </p>
          </div>
        ) : (
          <ContestGrid contests={recent} />
        )}
      </section>

      {/* Submit CTA — editorial block */}
      <section className="py-16">
        <div className="rounded-3xl bg-[#0D0D0D] px-10 py-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
          <h2
            className="text-4xl sm:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Know about<br />
            <span className="italic font-bold text-white/60">a contest?</span>
          </h2>
          <div className="flex flex-col items-start gap-3">
            <p className="text-white/50 text-sm max-w-xs">Help the community. Add it to the directory — takes 2 minutes.</p>
            <Link
              href="/submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0D0D0D] hover:bg-[#ECEAE3] transition-colors"
            >
              Add a contest →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
