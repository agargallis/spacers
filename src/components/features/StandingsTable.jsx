import { motion } from 'framer-motion';
import { useActiveTeamMeta } from '../../store/useTeamStore';
import { useEditMode } from '../../store/useEditMode';
import ItemControls from '../admin/ItemControls';

const cols = [
  { key: 'pos', label: '#', className: 'w-10 text-center' },
  { key: 'team', label: 'Ομάδα', className: 'text-left' },
  { key: 'played', label: 'Αγ', className: 'w-12 text-center' },
  { key: 'wins', label: 'Ν', className: 'w-10 text-center' },
  { key: 'losses', label: 'Η', className: 'w-10 text-center' },
  { key: 'pf', label: 'Υπ', className: 'w-14 text-center' },
  { key: 'pa', label: 'Κτ', className: 'w-14 text-center' },
  { key: 'diff', label: '±', className: 'w-14 text-center' },
  { key: 'points', label: 'Βαθ', className: 'w-14 text-center' },
];

export default function StandingsTable({ rows = [], collection = null }) {
  const meta = useActiveTeamMeta();
  const editMode = useEditMode((s) => s.editMode);
  // Controls only for editable tables (current or admin-added season), not
  // read-only scraped past seasons.
  const editable = editMode && !!collection;

  return (
    <div className="overflow-x-auto rounded-2xl card">
      <table className="w-full min-w-[600px] border-collapse whitespace-nowrap text-sm">
        <thead>
          <tr className="sticky top-0 z-10 bg-[color:var(--surface-2)]/90 backdrop-blur">
            {cols.map((c) => (
              <th
                key={c.key}
                className={`px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--text-faint)] ${c.className}`}
              >
                {c.label}
              </th>
            ))}
            {editable && <th className="w-28 px-3 py-3.5" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const diff = row.pointsFor - row.pointsAgainst;
            return (
              <motion.tr
                key={`${row.team}-${row.pos}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i, 12) * 0.03, duration: 0.4 }}
                className={`group border-t border-[color:var(--border)] transition-colors ${
                  row.isOurs ? 'relative' : 'hover:bg-[color:var(--surface-2)]/60'
                } ${row._hidden ? 'opacity-40' : ''}`}
                style={
                  row.isOurs
                    ? { background: `linear-gradient(90deg, rgb(var(--accent-rgb)/0.16), transparent 70%)` }
                    : undefined
                }
              >
                <td className="px-3 py-3.5 text-center">
                  <span
                    className={`inline-grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${
                      row.pos <= 3 ? 'text-accent' : 'text-[color:var(--text-dim)]'
                    }`}
                    style={row.isOurs ? { color: meta.accent } : undefined}
                  >
                    {row.pos}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={row.isOurs ? meta.logo : row.logo}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden';
                      }}
                      className="h-6 w-6 shrink-0 object-contain"
                    />
                    <span
                      className={`font-semibold ${row.isOurs ? 'text-[color:var(--text)]' : 'text-[color:var(--text-dim)]'}`}
                    >
                      {row.team}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-center tabular-nums text-[color:var(--text-dim)]">
                  {row.played}
                </td>
                <td className="px-3 py-3.5 text-center tabular-nums font-semibold text-emerald-300">
                  {row.wins}
                </td>
                <td className="px-3 py-3.5 text-center tabular-nums font-semibold text-rose-300/90">
                  {row.losses}
                </td>
                <td className="px-3 py-3.5 text-center tabular-nums text-[color:var(--text-dim)]">
                  {row.pointsFor}
                </td>
                <td className="px-3 py-3.5 text-center tabular-nums text-[color:var(--text-dim)]">
                  {row.pointsAgainst}
                </td>
                <td className="px-3 py-3.5 text-center tabular-nums text-[color:var(--text-dim)]">
                  {diff > 0 ? `+${diff}` : diff}
                </td>
                <td className="px-3 py-3.5 text-center">
                  <span className="font-[var(--font-display)] text-base font-bold tabular-nums">
                    {row.points}
                  </span>
                </td>
                {editable && (
                  <td className="px-3 py-3.5 text-right">
                    <ItemControls collection={collection} schema="standings" item={row} />
                  </td>
                )}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
