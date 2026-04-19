import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Contest, Winner } from '@/lib/types'
import { AdminDashboard } from './AdminDashboard'

async function getAdminData() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')

    const [pendingRes, approvedRes, winnersRes] = await Promise.all([
      supabase.from('contests').select('*').eq('approved', false).order('created_at', { ascending: false }),
      supabase.from('contests').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(50),
      supabase.from('winners').select('*').order('won_at', { ascending: false }),
    ])

    return {
      pending: (pendingRes.data ?? []) as Contest[],
      approved: (approvedRes.data ?? []) as Contest[],
      winners: (winnersRes.data ?? []) as Winner[],
    }
  } catch {
    redirect('/admin/login')
  }
}

export default async function AdminPage() {
  const { pending, approved, winners } = await getAdminData()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage contests and submissions</p>
        </div>
      </div>
      <AdminDashboard pending={pending} approved={approved} winners={winners} />
    </div>
  )
}
