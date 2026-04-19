'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Contest, Winner } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDeadline, CATEGORY_COLORS, PLATFORM_COLORS, CATEGORIES, PLATFORMS } from '@/lib/utils'

interface AdminDashboardProps {
  pending: Contest[]
  approved: Contest[]
  winners: Winner[]
}

export function AdminDashboard({ pending, approved, winners }: AdminDashboardProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'pending' | 'approved' | 'winners'>('pending')
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
        <button
          onClick={() => setTab('winners')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === 'winners'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Winners ({winners.length})
        </button>
      </div>

      {/* Winners tab */}
      {tab === 'winners' && (
        <WinnersTab winners={winners} approved={approved} onSuccess={() => router.refresh()} />
      )}

      {/* Add Contest shortcut */}
      {tab !== 'winners' && (
        <div className="mb-6">
          <AddContestInline onSuccess={() => router.refresh()} />
        </div>
      )}

      {/* Contest list */}
      {tab !== 'winners' && (contests.length === 0 ? (
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
                  <Badge className={contest.status === 'open' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 'bg-zinc-700/40 text-zinc-300 border-zinc-600/30'}>
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
      ))}
    </div>
  )
}

function WinnersTab({ winners, approved, onSuccess }: { winners: Winner[]; approved: Contest[]; onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement).value.trim()

    try {
      const res = await fetch('/api/admin/winners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_handle: get('creator_handle'),
          work_url: get('work_url'),
          prize: get('prize'),
          brand: get('brand'),
          contest_id: get('contest_id') || null,
          won_at: get('won_at'),
        }),
      })
      const body = await res.json()
      if (!res.ok) { setError(body.error || 'Failed'); return }
      setOpen(false)
      onSuccess()
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await fetch('/api/admin/winners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      onSuccess()
    } finally { setDeleting(null) }
  }

  const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"

  return (
    <div>
      <div className="mb-6">
        {!open ? (
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>+ Add Winner</Button>
        ) : (
          <form onSubmit={handleAdd} className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 space-y-4">
            <h3 className="font-semibold text-white text-sm">Add Winner</h3>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <input name="creator_handle" placeholder="@creatorhandle *" className={inputClass} required />
              <input name="brand" placeholder="Brand *" className={inputClass} required />
              <input name="prize" placeholder="Prize e.g. $5,000 *" className={inputClass} required />
              <input name="won_at" type="date" className={inputClass} required defaultValue={new Date().toISOString().split('T')[0]} />
              <select name="contest_id" className={inputClass} defaultValue="">
                <option value="">Contest (optional)</option>
                {approved.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input name="work_url" placeholder="Work URL (video/image) *" type="url" className={inputClass} required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={loading}>{loading ? 'Adding...' : 'Add Winner'}</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>

      {winners.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No winners yet — add the first one above.</div>
      ) : (
        <div className="space-y-3">
          {winners.map(w => (
            <div key={w.id} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">@{w.creator_handle}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{w.brand} · {w.prize} · {w.won_at}</p>
                <a href={w.work_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 truncate block mt-0.5">{w.work_url}</a>
              </div>
              <Button size="sm" variant="danger" disabled={deleting === w.id} onClick={() => handleDelete(w.id)}>
                {deleting === w.id ? '...' : 'Delete'}
              </Button>
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
