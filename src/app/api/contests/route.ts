import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { ContestInsert } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<ContestInsert>

    const required = ['title', 'brand', 'description', 'prize', 'deadline', 'category', 'source_platform', 'source_url']
    for (const field of required) {
      if (!body[field as keyof ContestInsert]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }

    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('contests')
      .insert({
        title: body.title,
        brand: body.brand,
        description: body.description,
        prize: body.prize,
        deadline: body.deadline,
        category: body.category,
        source_platform: body.source_platform,
        source_url: body.source_url,
        thumbnail_url: body.thumbnail_url || null,
        submitted_by: body.submitted_by || null,
        approved: false,
        featured: false,
        status: 'open',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, contest: data }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/contests]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
