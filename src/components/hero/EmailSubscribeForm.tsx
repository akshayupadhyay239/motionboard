'use client'

import { useState } from 'react'

interface EmailSubscribeFormProps {
  label?: string
  placeholder?: string
  variant?: 'light' | 'dark'
  successMessage?: string
}

export function EmailSubscribeForm({
  label = 'Notify me',
  placeholder = 'your@email.com',
  variant = 'light',
  successMessage = "✓ You're in — we'll send deadline alerts.",
}: EmailSubscribeFormProps) {
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
      <p className={`text-sm font-semibold ${variant === 'dark' ? 'text-white/70' : 'text-[#1C1C8E]'}`}>
        {successMessage}
      </p>
    )
  }

  const inputClass = variant === 'dark'
    ? 'flex-1 min-w-0 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors'
    : 'flex-1 min-w-0 rounded-full border border-[#E0DDD5] bg-white px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#B5B2A9] focus:outline-none focus:border-[#0D0D0D] transition-colors'

  const buttonClass = variant === 'dark'
    ? 'rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0D0D0D] hover:bg-[#ECEAE3] active:scale-[0.98] transition-all duration-200 shrink-0 disabled:opacity-60'
    : 'rounded-full bg-[#1C1C8E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15157A] active:scale-[0.98] transition-all duration-200 shrink-0 disabled:opacity-60'

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className={inputClass}
        />
        <button type="submit" disabled={state === 'loading'} className={buttonClass}>
          {state === 'loading' ? '…' : label}
        </button>
      </form>
      {state === 'error' && (
        <p className={`mt-1.5 text-xs ${variant === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {errorMsg}
        </p>
      )}
    </div>
  )
}
