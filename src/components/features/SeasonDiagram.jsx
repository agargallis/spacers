import { useActiveTeamMeta } from '../../store/useTeamStore';

/**
 * One combined "season snapshot" diagram replacing the separate stat tiles:
 *  - radial ring = win rate (record in the center)
 *  - position pill
 *  - two bars = attack (avg scored) vs defence (avg conceded)
 * Pure SVG/CSS, colored from the active team accent.
 */
export default function SeasonDiagram({ stats, standing }) {
  const meta = useActiveTeamMeta();

  if (!stats) {
    return <div className="card h-full min-h-[16rem] animate-pulse" aria-hidden="true" />;
  }

  const played = stats.played || 0;
  const winRate = played ? stats.wins / played : 0;
  const pct = Math.round(winRate * 100);

  const R = 54;
  const C = 2 * Math.PI * R;

  const maxAvg = Math.max(stats.avgFor, stats.avgAgainst, 1);
  const atkW = Math.round((stats.avgFor / maxAvg) * 100);
  const defW = Math.round((stats.avgAgainst / maxAvg) * 100);

  return (
    <div className="card h-full p-6" aria-label={`Ρεκόρ ${stats.wins}-${stats.losses}, θέση ${standing?.pos ?? '-'}`}>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        {/* Radial win-rate ring */}
        <div className="relative grid shrink-0 place-items-center">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={meta.accent}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(C * winRate).toFixed(1)} ${C.toFixed(1)}`}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dasharray 700ms cubic-bezier(0.22,1,0.36,1)' }}
            />
          </svg>
          <div className="absolute text-center">
            <div className="font-[var(--font-display)] text-2xl font-black tabular-nums">
              {stats.wins}<span className="text-[color:var(--text-faint)]">–</span>{stats.losses}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--text-faint)]">
              {pct}% νίκες
            </div>
          </div>
        </div>

        {/* Position + attack/defence bars */}
        <div className="w-full flex-1 space-y-4">
          <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-faint)]">
              Θεση
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-[var(--font-display)] text-2xl font-black accent-gradient-text">
                #{standing?.pos ?? '-'}
              </span>
              {standing?.points != null && (
                <span className="text-xs text-[color:var(--text-dim)]">{standing.points} βαθ.</span>
              )}
            </span>
          </div>

          <Bar label="Επίθεση" sub="μ.ο. πόντων" value={stats.avgFor} width={atkW} color={meta.accent} />
          <Bar label="Άμυνα" sub="δέχεται / αγώνα" value={stats.avgAgainst} width={defW} color="#fb7185" />
        </div>
      </div>
    </div>
  );
}

function Bar({ label, sub, value, width, color }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-[color:var(--text-dim)]">
          {label} <span className="text-[color:var(--text-faint)]">· {sub}</span>
        </span>
        <span className="font-[var(--font-display)] font-bold tabular-nums">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${width}%`, background: color, transition: 'width 700ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </div>
    </div>
  );
}
