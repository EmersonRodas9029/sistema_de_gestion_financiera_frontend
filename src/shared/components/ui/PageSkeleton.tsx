export const PageSkeleton = () => (
  <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#08080B' }}>
    <div className="animate-pulse space-y-6">
      <div className="flex justify-between">
        <div className="h-8 w-48 bg-white/10 rounded-lg" />
        <div className="h-10 w-32 bg-white/10 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white/10 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 bg-white/10 rounded-xl" />
        <div className="h-64 bg-white/10 rounded-xl" />
      </div>
      <div className="h-96 bg-white/10 rounded-xl" />
    </div>
  </div>
);
