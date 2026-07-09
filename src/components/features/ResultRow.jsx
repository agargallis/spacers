import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/motion';
import { formatShortDate } from '../../utils/format';
import { useActiveTeamMeta } from '../../store/useTeamStore';

export default function ResultRow({ result }) {
  const meta = useActiveTeamMeta();
  const won = result.scoreFor > result.scoreAgainst;
  const ring = won ? '52, 211, 153' : '251, 113, 133'; // emerald / rose

  return (
    <motion.article
      variants={fadeUp}
      className="group grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(180deg, var(--surface), var(--surface-2))',
        border: `1.5px solid rgba(${ring}, 0.55)`,
        boxShadow: `0 0 26px -16px rgba(${ring}, 0.9), inset 0 0 0 1px rgba(${ring}, 0.06)`,
      }}
    >
      <div className="min-w-0">
        <div className="text-xs text-[color:var(--text-faint)]">
          {formatShortDate(result.datetime)} · {result.home ? 'Εντός' : 'Εκτός'}
          {result.category ? ` · ${result.category}` : ''}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <img src={meta.logo} alt="Spacers" className="h-12 w-12 shrink-0 object-contain" />
          <span className="text-xs font-semibold text-[color:var(--text-faint)]">vs</span>
          {result.opponentLogo ? (
            <img
              src={result.opponentLogo}
              alt={result.opponent}
              loading="lazy"
              onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              className="h-12 w-12 shrink-0 object-contain"
            />
          ) : (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl glass text-sm font-bold text-[color:var(--text-dim)]">
              {result.opponent.slice(0, 1)}
            </span>
          )}
        </div>
      </div>

      <div className="text-right">
        <div className="font-[var(--font-display)] text-2xl font-bold tabular-nums sm:text-3xl">
          <span style={{ color: won ? meta.accent : 'var(--text)' }}>{result.scoreFor}</span>
          <span className="mx-1 text-[color:var(--text-faint)]">–</span>
          <span className="text-[color:var(--text-dim)]">{result.scoreAgainst}</span>
        </div>
      </div>
    </motion.article>
  );
}
