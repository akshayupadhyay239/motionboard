import { Contest } from '@/lib/types'
import { ContestCard } from './ContestCard'

interface ContestGridProps {
  contests: Contest[]
  featured?: boolean
  emptyMessage?: string
}

// Bento variant cycling for visual rhythm
const VARIANTS: Array<'default' | 'dark' | 'accent'> = ['default', 'dark', 'default', 'default', 'accent', 'default']

export function ContestGrid({ contests, featured = false, emptyMessage = 'No contests found.' }: ContestGridProps) {
  if (contests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#B5B2A9]">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    )
  }

  if (featured && contests.length >= 3) {
    // Bento layout: 1 large left + 2 stacked right + 1 wide bottom
    const [first, second, third, ...rest] = contests
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Large featured card */}
          <div className="md:col-span-3">
            <ContestCard contest={first} variant="dark" size="large" index={0} />
          </div>
          {/* Two stacked */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <ContestCard contest={second} variant="accent" index={1} />
            {third && <ContestCard contest={third} variant="default" index={2} />}
          </div>
        </div>
        {/* Remaining featured as row */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((c, i) => (
              <ContestCard key={c.id} contest={c} variant={VARIANTS[(i + 3) % VARIANTS.length]} index={i + 3} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contests.map((contest, i) => (
        <ContestCard key={contest.id} contest={contest} variant={VARIANTS[i % VARIANTS.length]} index={i} />
      ))}
    </div>
  )
}
