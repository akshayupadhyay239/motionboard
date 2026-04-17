'use client'

import { useState, FormEvent } from 'react'
import { CATEGORIES, PLATFORMS } from '@/lib/utils'

type FieldErrors = Record<string, string>

const inputClass = 'w-full rounded-2xl bg-white border border-[#E0DDD5] px-4 py-3 text-sm text-[#0D0D0D] placeholder:text-[#B5B2A9] focus:outline-none focus:ring-2 focus:ring-[#0D0D0D] focus:border-transparent transition'
const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[#78766E] mb-1.5'

export function SubmitForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value.trim(),
      brand: (form.elements.namedItem('brand') as HTMLInputElement).value.trim(),
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value.trim(),
      prize: (form.elements.namedItem('prize') as HTMLInputElement).value.trim(),
      deadline: (form.elements.namedItem('deadline') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      source_platform: (form.elements.namedItem('source_platform') as HTMLSelectElement).value,
      source_url: (form.elements.namedItem('source_url') as HTMLInputElement).value.trim(),
      thumbnail_url: (form.elements.namedItem('thumbnail_url') as HTMLInputElement).value.trim() || null,
      submitted_by: (form.elements.namedItem('submitted_by') as HTMLInputElement).value.trim() || null,
    }

    const newErrors: FieldErrors = {}
    if (!data.title) newErrors.title = 'Required'
    if (!data.brand) newErrors.brand = 'Required'
    if (!data.description) newErrors.description = 'Required'
    if (!data.prize) newErrors.prize = 'Required'
    if (!data.deadline) newErrors.deadline = 'Required'
    if (!data.category) newErrors.category = 'Required'
    if (!data.source_platform) newErrors.source_platform = 'Required'
    if (!data.source_url) newErrors.source_url = 'Required'
    else if (!data.source_url.startsWith('http')) newErrors.source_url = 'Must be a valid URL'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json()
        setErrors({ form: body.error || 'Submission failed.' })
      } else {
        setSuccess(true)
      }
    } catch {
      setErrors({ form: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl bg-[#0D0D0D] p-10 text-center">
        <p className="text-5xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>✓</p>
        <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Submitted!</h2>
        <p className="text-white/50 text-sm">Your contest will appear after review. Thanks for contributing.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Contest Title {errors.title && <span className="text-red-500 normal-case tracking-normal">— {errors.title}</span>}</label>
          <input name="title" placeholder="Nike Shorts Film Challenge" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Brand / Organizer {errors.brand && <span className="text-red-500 normal-case tracking-normal">— {errors.brand}</span>}</label>
          <input name="brand" placeholder="Nike" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description {errors.description && <span className="text-red-500 normal-case tracking-normal">— {errors.description}</span>}</label>
        <textarea name="description" placeholder="What is the contest about? Who can enter? Rules?" rows={4} className={`${inputClass} resize-none`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prize {errors.prize && <span className="text-red-500 normal-case tracking-normal">— {errors.prize}</span>}</label>
          <input name="prize" placeholder="$500 cash" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Deadline {errors.deadline && <span className="text-red-500 normal-case tracking-normal">— {errors.deadline}</span>}</label>
          <input name="deadline" type="date" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category {errors.category && <span className="text-red-500 normal-case tracking-normal">— {errors.category}</span>}</label>
          <select name="category" defaultValue="" className={inputClass}>
            <option value="" disabled>Select...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Platform {errors.source_platform && <span className="text-red-500 normal-case tracking-normal">— {errors.source_platform}</span>}</label>
          <select name="source_platform" defaultValue="" className={inputClass}>
            <option value="" disabled>Select...</option>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Link to original post {errors.source_url && <span className="text-red-500 normal-case tracking-normal">— {errors.source_url}</span>}</label>
        <input name="source_url" placeholder="https://..." type="url" className={inputClass} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Thumbnail URL <span className="normal-case tracking-normal font-normal text-[#B5B2A9]">(optional)</span></label>
          <input name="thumbnail_url" placeholder="https://..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Your name / handle <span className="normal-case tracking-normal font-normal text-[#B5B2A9]">(optional)</span></label>
          <input name="submitted_by" placeholder="@handle" className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#0D0D0D] py-4 text-sm font-bold text-white hover:bg-[#3A3935] disabled:opacity-50 transition-colors mt-2"
      >
        {loading ? 'Submitting...' : 'Submit Contest'}
      </button>
    </form>
  )
}
