import { motion } from 'framer-motion';
import Button from '../ui/Button';
import CountdownTiles from './CountdownTiles';
import ComingSoon from './ComingSoon';
import { formatFullDate, formatTime } from '../../utils/format';
import { venueMapUrl } from '../../utils/venue';
import { useActiveTeamMeta } from '../../store/useTeamStore';
import { scrollToSection } from '../../hooks/useScrollSpy';

/** The featured next-match panel: matchup + live countdown. */
export default function NextMatchHero({ match, loading }) {
  const meta = useActiveTeamMeta();

  if (loading) return <div className="card animate-pulse p-8 h-64" aria-hidden="true" />;
  if (!match) return <ComingSoon />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl card p-6 sm:p-8"
    >
      {/* top accent hairline + ambient glows */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`, opacity: 0.5 }}
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{ background: `radial-gradient(circle, ${meta.accent}, transparent 70%)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${meta.accent2}, transparent 70%)` }}
      />

      <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Match info */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {!match.finished && (
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
              Επόμενος αγώνας
            </span>
          )}

          <div className={`flex items-center gap-5 sm:gap-7 ${match.finished ? '' : 'mt-4'}`}>
            <LogoBadge logo={meta.logo} name="Spacers" glow={meta.accent} float />
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full glass font-[var(--font-display)] text-sm font-black text-[color:var(--text-faint)]"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(var(--accent-rgb) / 0.35)' }}
            >
              VS
            </span>
            <LogoBadge logo={match.opponentLogo} name={match.opponent} fallback={match.opponent.slice(0, 1)} />
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-accent">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <span className="font-semibold text-[color:var(--text)]">
              {formatFullDate(match.datetime)} · {formatTime(match.datetime)}
            </span>
          </div>
          {match.venue && (
            <a
              href={venueMapUrl(match.venue, match.mapUrl)}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-2 text-xs text-[color:var(--text-faint)] transition-colors hover:text-accent"
              title="Άνοιγμα στον χάρτη"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {match.venue}
            </a>
          )}
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center gap-4 lg:items-end">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-faint)]">
            Αντίστροφη μέτρηση
          </span>
          <CountdownTiles targetIso={match.datetime} />
          <Button as="button" onClick={() => scrollToSection('schedule')} variant="outline" size="sm">
            Όλο το πρόγραμμα
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function LogoBadge({ logo, name, glow, fallback, float = false }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative grid h-16 w-16 place-items-center sm:h-20 sm:w-20">
        {glow && (
          <span
            className="pointer-events-none absolute inset-[-22%] rounded-full blur-xl opacity-50"
            style={{ background: `radial-gradient(circle, ${glow}, transparent 70%)` }}
            aria-hidden="true"
          />
        )}
        {logo ? (
          <img
            src={logo}
            alt={name}
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
            className={`relative h-full w-full object-contain ${float ? 'animate-float' : ''}`}
          />
        ) : (
          <div className="relative grid h-full w-full place-items-center rounded-2xl glass text-2xl font-black text-[color:var(--text-dim)]">
            {fallback}
          </div>
        )}
      </div>
      <span className="max-w-[8rem] text-center text-sm font-semibold leading-tight">{name}</span>
    </div>
  );
}
