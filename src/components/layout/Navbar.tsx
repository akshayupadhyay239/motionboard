import Link from 'next/link'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F4F3EF]/90 backdrop-blur-sm border-b border-[#E0DDD5]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-[15px] font-bold tracking-tight text-[#0D0D0D]">
          motion<span style={{ fontFamily: 'var(--font-display)' }} className="italic">Board</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/contests"
            className="rounded-full px-4 py-1.5 text-sm text-[#78766E] hover:text-[#0D0D0D] hover:bg-[#E0DDD5] transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/submit"
            className="rounded-full border border-[#0D0D0D] bg-[#0D0D0D] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#3A3935] transition-colors"
          >
            Submit Contest
          </Link>
        </nav>
      </div>
    </header>
  )
}
