import Link from 'next/link'
import Image from 'next/image'
import { Winner } from '@/lib/types'

interface WinnerCardProps {
  winner: Winner
  size?: 'default' | 'large'
}

function getWorkMeta(url: string): { thumbnail: string | null; isVideo: boolean } {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return { thumbnail: `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`, isVideo: true }

  if (/\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i.test(url)) return { thumbnail: url, isVideo: false }

  return { thumbnail: null, isVideo: false }
}

function formatWonAt(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const FALLBACK_COLORS = [
  'bg-[#1C1C8E]',
  'bg-[#0D0D0D]',
  'bg-[#3A3935]',
  'bg-[#78766E]',
]

export function WinnerCard({ winner, size = 'default' }: WinnerCardProps) {
  const { thumbnail, isVideo } = getWorkMeta(winner.work_url)
  const fallbackColor = FALLBACK_COLORS[winner.id.charCodeAt(0) % FALLBACK_COLORS.length]
  const handle = winner.creator_handle.startsWith('@')
    ? winner.creator_handle
    : `@${winner.creator_handle}`

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${size === 'large' ? 'min-h-[380px]' : 'min-h-[300px]'}`}>

      {/* Work preview */}
      <a
        href={winner.work_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block shrink-0 overflow-hidden ${size === 'large' ? 'h-52' : 'h-40'}`}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`${handle}'s winning entry`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`h-full w-full ${fallbackColor} flex items-center justify-center`}>
            <span className="text-3xl font-black text-white/20" style={{ fontFamily: 'var(--font-display)' }}>
              {winner.prize}
            </span>
          </div>
        )}

        {/* Video play badge */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
              <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        )}

        {/* Winner ribbon */}
        <div className="absolute left-3 top-3 rounded-full bg-[#1C1C8E] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
          Winner
        </div>
      </a>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p
          className={`font-black text-[#0D0D0D] leading-none mb-2 ${size === 'large' ? 'text-4xl' : 'text-3xl'}`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {winner.prize}
        </p>

        <p className="text-sm font-bold text-[#0D0D0D] mb-0.5">{handle}</p>

        <p className="text-[11px] font-semibold text-[#78766E] uppercase tracking-wider line-clamp-1">
          {winner.brand}
        </p>

        <p className="mt-auto pt-3 text-[10px] text-[#B5B2A9] font-semibold">
          {formatWonAt(winner.won_at)}
        </p>
      </div>

      {/* Arrow */}
      <a
        href={winner.work_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#0D0D0D] text-sm font-bold text-white opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
      >
        →
      </a>
    </article>
  )
}
