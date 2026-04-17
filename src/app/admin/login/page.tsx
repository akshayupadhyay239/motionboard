import { AdminLoginForm } from './AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-1">motionBoard dashboard</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
