#!/usr/bin/env node
/**
 * Add a contest directly to Supabase.
 * Usage: node scripts/add-contest.mjs
 *
 * Edit the CONTEST object below, then run the script.
 * I (Claude) can run this for you — just give me the contest details.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load env vars from .env.local
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [k, ...v] = line.split('=')
    if (k && v.length) acc[k.trim()] = v.join('=').trim()
    return acc
  }, {})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

// ─── EDIT THIS ───────────────────────────────────────────────────────────────
const CONTEST = {
  title: 'DreamCloud Bundle Contest on Anthum.ai',
  brand: 'DreamCloud',
  description: "Dreamcloud's Bundle contest — create an AI-generated ad for their product line.",
  prize: '$5000',
  deadline: '2026-04-23',
  category: 'AI Ad',           // Ad | AI Ad | Social | Cinematic | Music Video | Short Film | Other
  source_platform: 'Website',  // Twitter | YouTube | Instagram | Reddit | Website
  source_url: 'https://anthum.ai/creator/contest/2da7feae-895f-48ec-8a77-856a1b',
  thumbnail_url: null,
  featured: false,
  approved: true,              // true = live immediately, false = goes to pending queue
}
// ─────────────────────────────────────────────────────────────────────────────

const { data, error } = await supabase.from('contests').insert(CONTEST).select().single()

if (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}

console.log('✅ Contest added!')
console.log(`   ID: ${data.id}`)
console.log(`   Title: ${data.title}`)
console.log(`   Status: ${data.approved ? 'Live' : 'Pending approval'}`)
