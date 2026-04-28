import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let email: string
  try {
    const body = await req.json()
    email = (body.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('subscribers')
      .insert({ email })

    // 23505 = unique_violation — email already subscribed, still a success
    if (error && error.code !== '23505') {
      console.error('[subscribe]', error.message)
      return NextResponse.json({ error: 'Failed to subscribe — try again' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Failed to subscribe — try again' }, { status: 500 })
  }
}
