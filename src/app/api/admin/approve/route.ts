import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, approved, featured, status } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing contest id' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    if (typeof approved === 'boolean') updates.approved = approved
    if (typeof featured === 'boolean') updates.featured = featured
    if (status) updates.status = status

    const { data, error } = await supabase
      .from('contests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, contest: data })
  } catch (err) {
    console.error('[PATCH /api/admin/approve]', err)
    return NextResponse.json({ error: 'Failed to update contest' }, { status: 500 })
  }
}
