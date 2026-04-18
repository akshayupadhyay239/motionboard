import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ContestGrid } from '@/components/contests/ContestGrid'
import { ContestGridSkeleton } from '@/components/contests/ContestSkeleton'
import { FilterBar } from '@/components/contests/FilterBar'
import { Contest } from '@/lib/types'
import { MOCK_RECENT } from '@/lib/mockData'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')

interface PageProps {
  searchParams: Promise<{
    category?: string
    platform?: string
    status?: string
  }>
}

async function getContests(category?: string, platform?: string, status?: string) {
  if (USE_MOCK) {
    let results = MOCK_RECENT
    if (category) results = results.filter((c) => c.category === category)
    if (platform) results = results.filter((c) => c.source_platform === platform)
    if (status) results = results.filter((c) => c.status === status)
    return results
  }

  try {
    const supabase = await createClient()

    let query = supabase
      .from('contests')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (platform) query = query.eq('source_platform', platform)
    if (status) query = query.eq('status', status)

    const { data } = await query
    return (data ?? []) as Contest[]
  } catch {
    return MOCK_RECENT
  }
}

export default async function ContestsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const contests = await getContests(params.category, params.platform, params.status)

  const hasFilter = params.category || params.platform || params.status

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">

      {/* Page header */}
      <div className="mb-10 border-b border-[#E0DDD5] pb-10">
        <h1
          className="animate-hero-enter text-5xl font-black text-[#0D0D0D] mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {params.category ? params.category : 'All Contests'}
        </h1>
        <p className="animate-fade-up text-sm text-[#B5B2A9] font-medium" style={{ animationDelay: '80ms' }}>
          {contests.length} contest{contests.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10">
        <Suspense fallback={<div className="h-[72px]" />}>
          <FilterBar />
        </Suspense>
      </div>

      <Suspense fallback={<ContestGridSkeleton count={6} />}>
        <ContestGrid
          contests={contests}
          emptyType={hasFilter ? 'filtered' : 'default'}
        />
      </Suspense>
    </div>
  )
}
