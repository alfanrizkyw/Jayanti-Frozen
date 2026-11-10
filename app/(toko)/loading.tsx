export default function LoadingToko() {
  return (
    <div className="container-page py-6" aria-busy="true" aria-label="Memuat halaman">
      <div className="h-[300px] animate-pulse rounded-[24px] bg-white/70 md:h-[360px]" />
      <div className="mt-6 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 w-24 flex-none animate-pulse rounded-full bg-white/70"
          />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="h-[250px] animate-pulse rounded-2xl bg-white/70"
          />
        ))}
      </div>
    </div>
  );
}
