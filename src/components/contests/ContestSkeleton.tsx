export function ContestSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 min-h-[260px] flex flex-col animate-pulse">
      <div className="flex items-start justify-between mb-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E0DDD5]" />
          <div className="w-20 h-3 rounded-full bg-[#E0DDD5]" />
        </div>
        <div className="w-8 h-5 rounded-full bg-[#E0DDD5]" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="w-3/4 h-5 rounded-full bg-[#E0DDD5]" />
        <div className="w-1/2 h-5 rounded-full bg-[#E0DDD5]" />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="w-full h-3.5 rounded-full bg-[#ECEAE3]" />
        <div className="w-2/3 h-3.5 rounded-full bg-[#ECEAE3]" />
      </div>
      <div className="mt-6 pt-4 border-t border-[#E0DDD5]">
        <div className="w-12 h-2.5 rounded-full bg-[#ECEAE3] mb-2" />
        <div className="w-24 h-8 rounded-lg bg-[#E0DDD5]" />
        <div className="mt-3 w-20 h-5 rounded-full bg-[#ECEAE3]" />
      </div>
    </div>
  )
}

export function ContestGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ContestSkeleton key={i} />
      ))}
    </div>
  )
}
