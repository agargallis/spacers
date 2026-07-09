export default function Badge({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral:
      'bg-[color:var(--surface-2)] text-[color:var(--text-dim)] border border-[color:var(--border)]',
    accent:
      'bg-[color:rgb(var(--accent-rgb)/0.14)] text-accent border border-accent/40',
    win: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
    loss: 'bg-rose-500/15 text-rose-300 border border-rose-500/40',
    live: 'bg-red-500/20 text-red-300 border border-red-500/50',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
