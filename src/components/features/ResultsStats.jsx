import { motion } from 'framer-motion';

/**
 * "Team stats" panel mirroring the basketaki profile: total points scored /
 * conceded, plus a Games-History bar chart (Νίκες vs Ήττες).
 */
export default function ResultsStats({ summary }) {
  if (!summary) {
    return <div className="card h-40 animate-pulse" aria-hidden="true" />;
  }

  const maxWL = Math.max(summary.wins, summary.losses, 1);

  return (
    <div className="card p-6">
      {/* Point totals */}
      <div className="grid grid-cols-3 gap-4">
        <Metric label="Αγώνες" value={summary.played} />
        <Metric label="Πόντοι υπέρ" value={summary.pointsFor} accent />
        <Metric label="Πόντοι κατά" value={summary.pointsAgainst} />
      </div>

      {/* Games history bar chart */}
      <div className="mt-6 border-t border-[color:var(--border)] pt-6">
        <div className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--text-faint)]">
          Ιστορικό αγώνων
        </div>
        <div className="flex items-end justify-center gap-10">
          <ChartBar label="Νίκες" value={summary.wins} max={maxWL} color="#34d399" />
          <ChartBar label="Ήττες" value={summary.losses} max={maxWL} color="#fb7185" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div className="text-center">
      <div className={`font-[var(--font-display)] text-2xl font-black tabular-nums ${accent ? 'accent-gradient-text' : 'text-[color:var(--text)]'}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[color:var(--text-faint)]">{label}</div>
    </div>
  );
}

function ChartBar({ label, value, max, color }) {
  const h = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="font-[var(--font-display)] text-xl font-black tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="flex h-32 w-14 items-end overflow-hidden rounded-lg bg-[color:var(--surface-2)]">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-t-lg"
          style={{ background: color }}
        />
      </div>
      <div className="text-xs font-semibold text-[color:var(--text-dim)]">{label}</div>
    </div>
  );
}
