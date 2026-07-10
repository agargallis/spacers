import { formatShortDate } from '../../utils/format';
import { useActiveTeamMeta } from '../../store/useTeamStore';

/** A game result with its YouTube recap: score on top, thumbnail below. */
export default function VideoCard({ video, onPlay }) {
  const meta = useActiveTeamMeta();
  const thumb = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <button
      onClick={() => onPlay?.(video)}
      className="group block w-full overflow-hidden rounded-2xl card text-left transition-all duration-300 hover:accent-ring"
    >
      {/* Score header (on top) */}
      <div className="border-b border-[color:var(--border)] p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[color:var(--text-faint)]">{formatShortDate(video.date)}</span>
          {/* pulsing result indicator: green = win, red = loss */}
          <span className="relative flex h-3 w-3" title={video.won ? 'Νίκη' : 'Ήττα'}>
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: video.won ? '#22c55e' : '#ef4444' }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{ background: video.won ? '#22c55e' : '#ef4444' }}
            />
          </span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <img src={meta.logo} alt="Spacers" className="h-10 w-10 shrink-0 object-contain" />
          <div className="font-[var(--font-display)] text-2xl font-black tabular-nums">
            <span style={{ color: meta.accent }}>{video.scoreFor}</span>
            <span className="mx-1.5 text-[color:var(--text-faint)]">–</span>
            <span className="text-[color:var(--text-dim)]">{video.scoreAgainst}</span>
          </div>
          {video.opponentLogo ? (
            <img
              src={video.opponentLogo}
              alt={video.opponent}
              onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              className="h-10 w-10 shrink-0 object-contain"
            />
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg glass text-sm font-bold text-[color:var(--text-dim)]">
              {video.opponent.slice(0, 1)}
            </span>
          )}
        </div>
      </div>

      {/* YouTube thumbnail (below) */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumb}
          alt={`Spacers vs ${video.opponent}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/90 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
      </div>
    </button>
  );
}
