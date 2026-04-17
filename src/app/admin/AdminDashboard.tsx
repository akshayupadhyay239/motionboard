'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Contest } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDeadline, CATEGORY_COLORS, PLATFORM_COLORS, CATEGORIES, PLATFORMS } from '@/lib/utils'

interface AdminDashboardProps {
  pending: Contest[]
  approved: Contest[]
}

export function AdminDashboard({ pending, approved }: AdminDashboardProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')
  const [loading, setLoading] = useState<string | null>(null)

  async function update(id: string, updates: Record<string, unknown>) {
    setLoading(id)
    try {
      await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const contests = tab === 'pending' ? pending : approved

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-zinc-800">
        <button
          onClick={() => setTab('pending')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === 'pending'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === 'approved'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Approved ({approved.length})
        </button>
      </div>

      {/* Add Contest shortcut */}
      <div className="mb-6">
        <AddContestInline onSuccess={() => router.refresh()} />
      </div>

      {/* Contest list */}
      {contests.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          {tab === 'pending' ? 'No pending submissions.' : 'No approved contests yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {contests.map((contest) => (
            <div key={contest.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{contest.title}</h3>
                  {contest.featured && (
                    <Badge className="bg-indigo-600/30 text-indigo-300 border-indigo-500/30 text-[10px]">Featured</Badge>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mb-2">
                  {contest.brand} · {contest.source_platform} · {formatDeadline(contest.deadline)}
                  {contest.submitted_by && ` · by ${contest.submitted_by}`}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={CATEGORY_COLORS[contest.category]}>{contest.category}</Badge>
                  <Badge className={PLATFORM_COLORS[contest.source_platform]}>{contest.source_platform}</Badge>
                  <Badge className={contest.status === 'open' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30'}>
                    {contest.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                {!contest.approved ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={loading === contest.id}
                      onClick={() => update(contest.id, { approved: true })}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={loading === contest.id}
                      onClick={() => update(contest.id, { status: 'closed' })}
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant={contest.featured ? 'secondary' : 'ghost'}
                      disabled={loading === contest.id}
                      onClick={() => update(contest.id, { featured: !contest.featured })}
                    >
                      {contest.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={loading === contest.id}
                      onClick={() => update(contest.id, { status: contest.status === 'open' ? 'closed' : 'open' })}
                    >
                      Mark {contest.status === 'open' ? 'Closed' : 'Open'}
                    </Button>
                  </>
                )}
                <a
                  href={contest.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddContestInline({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value.trim()

    const data = {
      title: getValue('title'),
      brand: getValue('brand'),
      description: getValue('description'),
      prize: getValue('prize'),
      deadline: getValue('deadline'),
      category: getValue('category'),
      source_platform: getValue('source_platform'),
      source_url: getValue('source_url'),
      thumbnail_url: getValue('thumbnail_url') || null,
    }

    try {
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error || 'Failed')
        return
      }
      // Auto-approve admin submissions
      await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: body.contest.id, approved: true }),
      })
      setOpen(false)
      onSuccess()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        + Add Contest Manually
      </Button>
    )
  }

  const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  const CATS = CATEGORIES
  const PLATS = PLATFORMS

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 space-y-4">
      <h3 className="font-semibold text-white text-sm">Add Contest</h3>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <input name="title" placeholder="Title *" className={inputClass} required />
        <input name="brand" placeholder="Brand *" className={inputClass} required />
        <input name="prize" placeholder="Prize *" className={inputClass} required />
        <input name="deadline" type="date" className={inputClass} required />
        <select name="category" className={inputClass} required defaultValue="">
          <option value="" disabled>Category *</option>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select name="source_platform" className={inputClass} required defaultValue="">
          <option value="" disabled>Platform *</option>
          {PLATS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <textarea name="description" placeholder="Description *" rows={3} className={`${inputClass} resize-none`} required />
      <input name="source_url" placeholder="Source URL *" type="url" className={inputClass} required />
      <input name="thumbnail_url" placeholder="Thumbnail URL (optional)" className={inputClass} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>{loading ? 'Adding...' : 'Add & Approve'}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  )
}
