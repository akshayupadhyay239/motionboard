import Link from 'next/link'
import Image from 'next/image'
import { Contest } from '@/lib/types'
import { formatDeadline, daysUntil } from '@/lib/utils'

interface ContestCardProps {
  contest: Contest
  variant?: 'default' | 'dark' | 'accent'
  size?: 'default' | 'large'
  index?: number
}

const PLATFORM_ICONS: Record<string, string> = {
  Twitter: 'X',
  YouTube: 'YT',
  Instagram: 'IG',
  Reddit: 'R/',
  Website: '↗',
}

export function ContestCard({ contest, variant = 'default', size = 'default', index = 0 }: ContestCardProps) {
  const days = daysUntil(contest.deadline)
  const isClosed = contest.status === 'closed' || days < 0
  const isUrgent = !isClosed && days <= 3
  const staggerDelay = `${Math.min(index * 40, 400)}ms`

  const bgClass =
    variant === 'dark'
      ? 'bg-[#0D0D0D] text-white'
      : variant === 'accent'
      ? 'bg-[#1C1C8E] text-white'
      : 'bg-white text-[#0D0D0D]'

  const mutedClass =
    variant === 'dark' || variant === 'accent' ? 'text-white/50' : 'text-[#78766E]'

  const borderClass =
    variant === 'dark' || variant === 'accent' ? 'border-white/10' : 'border-[#E0DDD5]'

  return (
    <Link href={`/contests/${contest.id}`} className="group block h-full">
      <article
        className={`animate-card-enter relative flex flex-col h-full rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${bgClass} ${
          size === 'large' ? 'min-h-[340px]' : 'min-h-[260px]'
        }`}
        style={{ animationDelay: staggerDelay }}
      >
        {/* Top row: brand + platform */}
        <div className="flex items-start justify-between mb-auto">
          <div className="flex items-center gap-2.5">
            {contest.thumbnail_url ? (
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl bg-black/10">
                <Image src={contest.thumbnail_url} alt={contest.brand} fill className="object-cover" sizes="32px" />
              </div>
            ) : (
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-black ${
                  variant === 'default' ? 'bg-[#ECEAE3] text-[#0D0D0D]' : 'bg-white/15 text-white'
                }`}
              >
                {contest.brand.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-widest ${mutedClass}`}>
                {contest.brand}
              </p>
            </div>
          </div>

          {/* Platform tag */}
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
              variant === 'default' ? 'bg-[#F4F3EF] text-[#78766E]' : 'bg-white/10 text-white/60'
            }`}
          >
            {PLATFORM_ICONS[contest.source_platform] || contest.source_platform}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`mt-4 font-bold leading-snug ${
            size === 'large' ? 'text-2xl' : 'text-lg'
          } group-hover:opacity-80 transition-opacity`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {contest.title}
        </h3>

        {/* Description */}
        <p className={`mt-2 text-sm leading-relaxed line-clamp-2 ${mutedClass}`}>
          {contest.description}
        </p>

        {/* Bottom: prize + deadline */}
        <div className={`mt-6 pt-4 border-t ${borderClass}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${mutedClass}`}>Prize</p>
          <p className={`${size === 'large' ? 'text-4xl' : 'text-3xl'} font-black leading-none tracking-tight ${variant === 'default' ? 'text-[#0D0D0D]' : 'text-white'}`}>
            {contest.prize}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            {!isClosed && isUrgent ? (
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                variant === 'default' ? 'bg-red-600 text-white' : 'bg-red-400/90 text-white'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse-urgent shrink-0" />
                {days === 0 ? 'Closes today' : days === 1 ? '1 day left' : `${days} days left`}
              </span>
            ) : (
              <p className={`text-[11px] font-semibold ${isClosed ? mutedClass : mutedClass}`}>
                {isClosed ? 'Closed' : formatDeadline(contest.deadline)}
              </p>
            )}
            <p className={`text-[10px] uppercase tracking-wider shrink-0 ${mutedClass}`}>{contest.category}</p>
          </div>
        </div>

        {/* Arrow CTA */}
        <div
          className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 ${
            variant === 'default' ? 'bg-[#0D0D0D] text-white' : 'bg-white text-[#0D0D0D]'
          }`}
        >
          →
        </div>
      </article>
    </Link>
  )
}
