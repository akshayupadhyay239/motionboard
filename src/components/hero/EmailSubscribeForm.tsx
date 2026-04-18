'use client'

import { useState } from 'react'

export function EmailSubscribeForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setState('success')
        setEmail('')
      } else {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error || 'Something went wrong')
        setState('error')
      }
    } catch {
      setErrorMsg('Network error — try again')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <p className="text-sm font-semibold text-[#1C1C8E]">
        ✓ You&apos;re in — new contests straight to your inbox.
      </p>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 rounded-full border border-[#E0DDD5] bg-white px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#B5B2A9] focus:outline-none focus:border-[#0D0D0D] transition-colors"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="rounded-full bg-[#1C1C8E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15157A] active:scale-[0.98] transition-all duration-200 shrink-0 disabled:opacity-60"
        >
          {state === 'loading' ? '…' : 'Notify me'}
        </button>
      </form>
      {state === 'error' && (
        <p className="mt-1.5 text-xs text-red-600">{errorMsg}</p>
      )}
    </div>
  )
}
