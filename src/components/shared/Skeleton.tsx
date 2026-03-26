'use client';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card rounded-lg border border-[#464555]/10 animate-pulse ${className}`}>
      <div className="p-5 space-y-3">
        <div className="w-10 h-10 rounded-xl bg-surface-container-highest" />
        <div className="h-2 w-16 rounded-full bg-surface-container-highest" />
        <div className="h-6 w-20 rounded-full bg-surface-container-highest" />
        <div className="h-2 w-24 rounded-full bg-surface-container-highest/60" />
      </div>
    </div>
  );
}

export function SkeletonUnitSection() {
  return (
    <section className="bg-surface-container-low border border-[#464555]/10 rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-surface-container-highest" />
        <div className="h-4 w-40 rounded-full bg-surface-container-highest" />
      </div>
      <div className="h-1 w-full bg-surface-container-highest rounded-full mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-surface-container-highest" />
        ))}
      </div>
    </section>
  );
}

export function SkeletonProgressCard() {
  return (
    <div className="glass-card rounded-lg border border-[#464555]/10 p-6 animate-pulse space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-2 w-20 rounded-full bg-surface-container-highest" />
          <div className="h-2 w-16 rounded-full bg-surface-container-highest" />
        </div>
        <div className="h-2 w-full rounded-full bg-surface-container-highest" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-2 w-20 rounded-full bg-surface-container-highest" />
          <div className="h-2 w-16 rounded-full bg-surface-container-highest" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface-container-highest" />
      </div>
    </div>
  );
}
