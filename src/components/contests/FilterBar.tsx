'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES, PLATFORMS } from '@/lib/utils'

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') || ''
  const platform = searchParams.get('platform') || ''
  const status = searchParams.get('status') || ''

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/contests?${params.toString()}`)
  }

  function clearAll() {
    router.push('/contests')
  }

  const hasFilters = category || platform || status

  const pillBase = 'rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer border'
  const pillActive = 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
  const pillInactive = 'bg-transparent text-[#78766E] border-[#E0DDD5] hover:border-[#0D0D0D] hover:text-[#0D0D0D]'

  return (
    <div className="space-y-3">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update('category', '')}
          className={`${pillBase} ${!category ? pillActive : pillInactive}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => update('category', category === c ? '' : c)}
            className={`${pillBase} ${category === c ? pillActive : pillInactive}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Platform + status */}
      <div className="flex flex-wrap gap-2 items-center">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => update('platform', platform === p ? '' : p)}
            className={`${pillBase} text-xs ${platform === p ? pillActive : pillInactive}`}
          >
            {p}
          </button>
        ))}
        <div className="h-4 w-px bg-[#E0DDD5] mx-1" />
        <button
          onClick={() => update('status', status === 'open' ? '' : 'open')}
          className={`${pillBase} text-xs ${status === 'open' ? pillActive : pillInactive}`}
        >
          Open only
        </button>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#B5B2A9] hover:text-[#0D0D0D] transition-colors underline-offset-2 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
