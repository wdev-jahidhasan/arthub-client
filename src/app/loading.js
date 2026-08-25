export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
        <div className="h-8 w-36 bg-neutral-800 rounded-lg"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-20 bg-neutral-800 rounded-lg"></div>
          <div className="h-8 w-8 bg-neutral-800 rounded-full"></div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="space-y-4 max-w-3xl">
        <div className="h-10 w-3/4 bg-neutral-800 rounded-xl"></div>
        <div className="h-4 w-full bg-neutral-900 rounded-lg"></div>
        <div className="h-4 w-5/6 bg-neutral-900 rounded-lg"></div>
      </div>

      {/* Content Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((item) => (
          <div 
            key={item} 
            className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-5 space-y-4 shadow-xl"
          >
            {/* Image Placeholder */}
            <div className="h-48 w-full bg-neutral-800 rounded-xl"></div>
            
            {/* Text Content Placeholder */}
            <div className="space-y-2">
              <div className="h-5 w-2/3 bg-neutral-800 rounded-lg"></div>
              <div className="h-3 w-full bg-neutral-800/60 rounded-md"></div>
              <div className="h-3 w-4/5 bg-neutral-800/60 rounded-md"></div>
            </div>

            {/* Footer/Button Placeholder */}
            <div className="pt-2 flex justify-between items-center">
              <div className="h-6 w-16 bg-neutral-800 rounded-md"></div>
              <div className="h-8 w-24 bg-neutral-800 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}