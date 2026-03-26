export default function TestLoading() {
  return (
    <div className="min-h-screen px-8 py-10 space-y-10 animate-in fade-in duration-500">
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <section className="space-y-3">
        <div className="h-12 w-32 bg-surface-container-highest rounded-full animate-pulse" />
        <div className="h-4 w-64 bg-surface-container-highest rounded-full animate-pulse" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-8 rounded-lg h-48 border border-[#464555]/10 animate-pulse bg-surface-container/50" />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <div className="h-14 w-48 bg-primary/20 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
