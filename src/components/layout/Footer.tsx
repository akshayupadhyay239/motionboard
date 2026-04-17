import Link from 'next/link'
import { CATEGORIES } from '@/lib/utils'

export function Footer() {
  return (
    <footer className="border-t border-[#E0DDD5] bg-[#F4F3EF] mt-8">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="text-[15px] font-bold text-[#0D0D0D]">
              motion<span style={{ fontFamily: 'var(--font-display)' }} className="italic">Board</span>
            </div>
            <p className="mt-2 text-xs text-[#B5B2A9] leading-relaxed">Every video contest.<br />One place.</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#B5B2A9] mb-3">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/contests?category=${encodeURIComponent(cat)}`} className="text-sm text-[#78766E] hover:text-[#0D0D0D] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#B5B2A9] mb-3">Site</h3>
            <ul className="space-y-2">
              <li><Link href="/contests" className="text-sm text-[#78766E] hover:text-[#0D0D0D] transition-colors">Browse All</Link></li>
              <li><Link href="/submit" className="text-sm text-[#78766E] hover:text-[#0D0D0D] transition-colors">Submit a Contest</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#E0DDD5] pt-6 text-[11px] text-[#B5B2A9]">
          © {new Date().getFullYear()} motionBoard. Built for creators.
        </div>
      </div>
    </footer>
  )
}
