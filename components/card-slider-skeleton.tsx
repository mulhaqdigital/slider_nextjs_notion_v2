export function CardSliderSkeleton() {
  return (
    <div className="w-full max-w-[72rem] mx-auto px-4 py-4">
      <div className="flex gap-5 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="px-3 pb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
