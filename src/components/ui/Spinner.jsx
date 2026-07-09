export default function Spinner({ label = 'Φόρτωση…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-16 text-[color:var(--text-dim)] ${className}`}>
      <span className="relative flex h-6 w-6">
        <span className="absolute inline-flex h-full w-full rounded-full border-2 border-[color:var(--border)]" />
        <span className="absolute inline-flex h-full w-full rounded-full border-2 border-transparent border-t-[color:var(--accent)] animate-spin" />
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Skeleton bar for content placeholders. */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[color:var(--surface-2)] ${className}`}
      aria-hidden="true"
    />
  );
}
