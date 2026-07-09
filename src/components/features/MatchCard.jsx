import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { fadeUp } from '../../utils/motion';
import { formatShortDate, formatTime } from '../../utils/format';
import { venueMapUrl } from '../../utils/venue';
import { useActiveTeamMeta } from '../../store/useTeamStore';

export default function MatchCard({ match }) {
  const meta = useActiveTeamMeta();
  return (
    <motion.article
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl card p-5 transition-all duration-300 hover:-translate-y-1 hover:accent-ring"
    >
      {/* accent edge */}
      <span
        className="absolute inset-y-0 left-0 w-1 opacity-70 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(${meta.accent}, ${meta.accent2})` }}
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-[color:var(--text-dim)]">
          <span className="font-semibold text-[color:var(--text)]">{formatShortDate(match.datetime)}</span>
          <span className="mx-2 text-[color:var(--text-faint)]">·</span>
          {formatTime(match.datetime)}
        </div>
        <Badge tone={match.home ? 'accent' : 'neutral'}>
          {match.home ? 'Εντός' : 'Εκτός'}
        </Badge>
      </div>

      <div className="mt-4 flex items-start justify-center gap-4">
        <div className="flex w-20 flex-col items-center gap-2">
          <img src={meta.logo} alt="Spacers" className="h-12 w-12 shrink-0 object-contain" />
          <span className="text-center text-xs font-semibold leading-tight">Spacers</span>
        </div>
        <span className="mt-3 font-[var(--font-display)] text-sm font-black text-[color:var(--text-faint)]">
          VS
        </span>
        <div className="flex w-20 flex-col items-center gap-2">
          {match.opponentLogo ? (
            <img
              src={match.opponentLogo}
              alt={match.opponent}
              onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              className="h-12 w-12 shrink-0 object-contain"
            />
          ) : (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl glass text-sm font-bold text-[color:var(--text-dim)]">
              {match.opponent.slice(0, 1)}
            </span>
          )}
          <span className="text-center text-xs font-semibold leading-tight text-[color:var(--text-dim)]">
            {match.opponent}
          </span>
        </div>
      </div>

      {match.venue && (
        <div className="mt-4 flex justify-center">
          <a
            href={venueMapUrl(match.venue, match.mapUrl)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-center text-xs text-[color:var(--text-dim)] transition-colors hover:text-accent"
            title="Άνοιγμα στον χάρτη"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-accent">
              <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {match.venue}
          </a>
        </div>
      )}
    </motion.article>
  );
}
