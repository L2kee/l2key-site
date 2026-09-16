const PILLS = [
  { label: "Based in", value: "Orlando, FL, remote friendly" },
  { label: "First step", value: "Free site audit, no pitch" },
  { label: "Approach", value: "Real software, not just slides" },
];

export function StatPills() {
  return (
    <div className="glass mt-10 grid w-full max-w-2xl grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-2xl sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {PILLS.map((p) => (
        <div key={p.label} className="px-6 py-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">{p.label}</p>
          <p className="mt-1 text-sm font-semibold text-white">{p.value}</p>
        </div>
      ))}
    </div>
  );
}
