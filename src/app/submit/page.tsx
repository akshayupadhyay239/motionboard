import { SubmitForm } from './SubmitForm'

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: editorial copy */}
        <div className="lg:sticky lg:top-24">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#B5B2A9] mb-4">Submit a contest</p>
          <h1
            className="text-5xl sm:text-6xl font-black text-[#0D0D0D] leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Know about<br />
            <span className="italic font-bold text-[#78766E]">a contest?</span>
          </h1>
          <p className="text-[#78766E] text-base leading-relaxed max-w-sm">
            Help creatives find opportunities. Add a contest to the directory — takes 2 minutes. All submissions are reviewed before going live.
          </p>
          <div className="mt-10 pt-8 border-t border-[#E0DDD5] space-y-3 text-sm text-[#78766E]">
            <p>✓ Completely free to list</p>
            <p>✓ Reviewed within 24 hours</p>
            <p>✓ Seen by thousands of creators</p>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <SubmitForm />
        </div>
      </div>
    </div>
  )
}
