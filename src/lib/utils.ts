import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function daysUntil(deadline: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const [year, month, day] = deadline.split('T')[0].split('-').map(Number)
  const end = new Date(year, month - 1, day) // local midnight, no UTC shift
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDeadline(deadline: string): string {
  const days = daysUntil(deadline)
  if (days < 0) return 'Closed'
  if (days === 0) return 'Today!'
  if (days === 1) return '1 day left'
  if (days <= 7) return `${days} days left`
  return new Date(deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isExpired(deadline: string): boolean {
  return daysUntil(deadline) < 0
}

export const CATEGORIES = ['Ad', 'AI Ad', 'Social', 'Cinematic', 'Music Video', 'Short Film', 'Other'] as const
export const PLATFORMS = ['Twitter', 'YouTube', 'Instagram', 'Reddit', 'Website'] as const

export const PLATFORM_COLORS: Record<string, string> = {
  Twitter: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  YouTube: 'bg-red-500/20 text-red-300 border-red-500/30',
  Instagram: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Reddit: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Website: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}

export const CATEGORY_COLORS: Record<string, string> = {
  Ad: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'AI Ad': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Social: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Cinematic: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Music Video': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'Short Film': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Other: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}
