import { createServiceClient } from '@/lib/supabase/server'
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
    const supabase = await createServiceClient()
    const { error } = await supabase
      .from('subscribers')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe — try again' }, { status: 500 })
  }
}
