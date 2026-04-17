import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Contest } from '@/lib/types'
import { AdminDashboard } from './AdminDashboard'

async function getAdminData() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')

    const { data: pending } = await supabase
      .from('contests')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false })

    const { data: approved } = await supabase
      .from('contests')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50)

    return {
      pending: (pending ?? []) as Contest[],
      approved: (approved ?? []) as Contest[],
    }
  } catch {
    redirect('/admin/login')
  }
}

export default async function AdminPage() {
  const { pending, approved } = await getAdminData()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage contests and submissions</p>
        </div>
      </div>
      <AdminDashboard pending={pending} approved={approved} />
    </div>
  )
}
