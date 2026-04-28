'use client'

import { useEffect, useState, useCallback } from 'react'
import { EmailSubscribeForm } from './EmailSubscribeForm'

const STORAGE_KEY = 'mb_popup_dismissed'
const DELAY_MS = 30_000

export function EmailPopup() {
  const [visible, setVisible] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return

    const t = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }, [])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, dismiss])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Get deadline alerts"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0D0D0D]/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#F4F3EF] p-8 shadow-2xl animate-fade-up">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#E0DDD5] text-[#78766E] hover:bg-[#0D0D0D] hover:text-white transition-all text-sm font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B5B2A9] mb-3">
          From the founder
        </p>
        <h2
          className="text-3xl font-black text-[#0D0D0D] leading-tight mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          👋 Hey — Akshay here.
        </h2>
        <p className="text-sm text-[#78766E] leading-relaxed mb-6">
          I&apos;m a motion guy, just like you. Built this so we stop missing contests. Join the newsletter and get <span className="text-[#0D0D0D] font-semibold">deadlines, curated picks, and winner interviews</span>. That&apos;s it.
        </p>

        {subscribed ? (
          <p className="text-sm font-semibold text-[#1C1C8E]">
            ✓ You're in — we'll send alerts 48hrs before deadlines.
          </p>
        ) : (
          <EmailSubscribeForm
            label="Get alerts"
            placeholder="your@email.com"
            successMessage="✓ You're in — alerts 48hrs before deadlines."
            onSuccess={() => {
              setSubscribed(true)
              setTimeout(dismiss, 2000)
            }}
          />
        )}
      </div>
    </div>
  )
}
