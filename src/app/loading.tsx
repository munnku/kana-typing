import { SkeletonCard, SkeletonProgressCard, SkeletonUnitSection } from '@/components/shared/Skeleton';

export default function RootLoading() {
  return (
    <div className="min-h-screen px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-20 -z-10 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero skeleton */}
      <section className="space-y-2">
        <div className="h-2 w-12 rounded-full bg-surface-container-highest animate-pulse" />
        <div className="h-10 w-64 rounded-full bg-surface-container-highest animate-pulse" />
      </section>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Progress body skeleton */}
      <SkeletonProgressCard />

      {/* Heavy content loader */}
      <div className="glass-card rounded-lg border border-[#464555]/10 p-10 text-center animate-pulse">
        <div className="h-20 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">システムをロードしています...</p>
        </div>
      </div>

      <div className="space-y-6">
        <SkeletonUnitSection />
      </div>
    </div>
  );
}
